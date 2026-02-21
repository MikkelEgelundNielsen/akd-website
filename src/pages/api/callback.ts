import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';

export const prerender = false;

interface CallbackReasonEntry {
  label: string;
  email: string;
}

const sanity = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

async function getRecipientEmail(reason: string): Promise<string> {
  const settings = await sanity.fetch<{
    callbackReasons?: CallbackReasonEntry[];
    callbackFallbackEmail?: string;
  }>(`*[_type == "siteSettings"][0] {
    callbackReasons[] { label, email },
    callbackFallbackEmail
  }`);

  const match = settings?.callbackReasons?.find(
    (r) => r.label === reason
  );

  return match?.email || settings?.callbackFallbackEmail || 'info@akd.dk';
}

export const POST: APIRoute = async ({ request, locals }) => {
  const json = (type: string) =>
    new Response(JSON.stringify(type === 'ok'
      ? { success: true, message: 'Tak! Vi ringer dig op hurtigst muligt.' }
      : { success: false, message: type }),
      { status: type === 'ok' ? 200 : type === 'validation' ? 400 : 500,
        headers: { 'Content-Type': 'application/json' } });

  try {
    const { reason, name, phone } = await request.json();

    if (!name || !phone) {
      return json('Navn og telefonnummer er påkrævet.');
    }

    // Resolve recipient from Sanity reason → email mapping
    const toEmail = await getRecipientEmail(reason || 'Generel henvendelse');

    // Read Mailgun credentials from Cloudflare env
    const env = (locals as any)?.runtime?.env || {};
    const mailgunKey = env.MAILGUN_API_KEY || import.meta.env.MAILGUN_API_KEY;
    const mailgunDomain = env.MAILGUN_DOMAIN || import.meta.env.MAILGUN_DOMAIN;
    const mailgunFrom = env.MAILGUN_FROM || import.meta.env.MAILGUN_FROM || `AKD Danmark <noreply@${mailgunDomain}>`;

    if (!mailgunKey || !mailgunDomain) {
      console.error('[Callback] Missing MAILGUN_API_KEY or MAILGUN_DOMAIN');
      return json('Der opstod en fejl. Prøv venligst igen.');
    }

    const formData = new FormData();
    formData.append('from', mailgunFrom);
    formData.append('to', toEmail);
    formData.append('subject', `Opkald ønsket: ${reason || 'Generel henvendelse'}`);
    formData.append('html', `
      <h2>Ny anmodning om opkald</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:15px;">
        <tr><td style="padding:6px 12px 6px 0;font-weight:bold;">Emne:</td><td>${escapeHtml(reason || 'Generel henvendelse')}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:bold;">Navn:</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:bold;">Telefon:</td><td><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:bold;">Tidspunkt:</td><td>${new Date().toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' })}</td></tr>
      </table>
    `);

    const mgResponse = await fetch(
      `https://api.eu.mailgun.net/v3/${mailgunDomain}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`api:${mailgunKey}`)}`,
        },
        body: formData,
      }
    );

    if (!mgResponse.ok) {
      const errText = await mgResponse.text();
      console.error('[Callback] Mailgun error:', mgResponse.status, errText);
      return json('Der opstod en fejl ved afsendelse. Prøv venligst igen.');
    }

    console.log('[Callback] Email sent to', toEmail, 'for reason:', reason);
    return json('ok');
  } catch (err) {
    console.error('[Callback] Unexpected error:', err);
    return json('Der opstod en fejl. Prøv venligst igen.');
  }
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
