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
  try {
    const { reason, name, phone } = await request.json();

    if (!name || !phone) {
      return new Response(
        JSON.stringify({ success: false, message: 'Navn og telefonnummer er påkrævet.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const toEmail = await getRecipientEmail(reason || 'Generel henvendelse');

    // Cloudflare runtime env → build-time env fallback
    const env = (locals as any)?.runtime?.env || {};
    const mailgunKey = env.MAILGUN_API_KEY || import.meta.env.MAILGUN_API_KEY;
    const mailgunDomain = env.MAILGUN_DOMAIN || import.meta.env.MAILGUN_DOMAIN;
    const mailgunFrom = env.MAILGUN_FROM || import.meta.env.MAILGUN_FROM
      || `AKD Danmark <kontakt@${mailgunDomain}>`;

    if (!mailgunKey || !mailgunDomain) {
      console.error('[Callback] Missing env vars. MAILGUN_API_KEY:', !!mailgunKey, 'MAILGUN_DOMAIN:', !!mailgunDomain);
      return new Response(
        JSON.stringify({ success: false, message: 'E-mail er ikke konfigureret. Kontakt os venligst direkte.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const mgUrl = `https://api.eu.mailgun.net/v3/${mailgunDomain}/messages`;
    const reasonLabel = reason || 'Generel henvendelse';
    const timestamp = new Date().toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' });

    const formData = new FormData();
    formData.append('from', mailgunFrom);
    formData.append('to', toEmail);
    formData.append('h:Reply-To', 'info@akd.dk');
    formData.append('subject', `Opkald ønsket: ${reasonLabel}`);
    formData.append('text', [
      `Ny anmodning om opkald`,
      ``,
      `Emne:      ${reasonLabel}`,
      `Navn:      ${name}`,
      `Telefon:   ${phone}`,
      `Tidspunkt: ${timestamp}`,
    ].join('\n'));
    formData.append('html', `
      <div style="font-family:'Open Sans',Helvetica,Arial,sans-serif;max-width:520px;">
        <h2 style="color:#2D3A2E;margin:0 0 16px;">Ny anmodning om opkald</h2>
        <table style="border-collapse:collapse;font-size:15px;color:#2D3A2E;width:100%;">
          <tr>
            <td style="padding:8px 16px 8px 0;font-weight:600;white-space:nowrap;vertical-align:top;">Emne</td>
            <td style="padding:8px 0;">${esc(reasonLabel)}</td>
          </tr>
          <tr style="background:#f8f7f5;">
            <td style="padding:8px 16px 8px 0;font-weight:600;white-space:nowrap;vertical-align:top;">Navn</td>
            <td style="padding:8px 0;">${esc(name)}</td>
          </tr>
          <tr>
            <td style="padding:8px 16px 8px 0;font-weight:600;white-space:nowrap;vertical-align:top;">Telefon</td>
            <td style="padding:8px 0;"><a href="tel:${esc(phone)}" style="color:#D4883A;text-decoration:none;">${esc(phone)}</a></td>
          </tr>
          <tr style="background:#f8f7f5;">
            <td style="padding:8px 16px 8px 0;font-weight:600;white-space:nowrap;vertical-align:top;">Tidspunkt</td>
            <td style="padding:8px 0;">${timestamp}</td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-size:13px;color:#2D3A2E80;">Denne besked er sendt automatisk fra akddanmark.dk</p>
      </div>
    `);

    console.log('[Callback] POST', mgUrl, '| from:', mailgunFrom, '| to:', toEmail);

    const mgRes = await fetch(mgUrl, {
      method: 'POST',
      headers: { Authorization: `Basic ${btoa(`api:${mailgunKey}`)}` },
      body: formData,
    });

    if (!mgRes.ok) {
      const errBody = await mgRes.text();
      console.error('[Callback] Mailgun', mgRes.status, errBody);
      return new Response(
        JSON.stringify({ success: false, message: 'Der opstod en fejl ved afsendelse. Prøv venligst igen.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[Callback] Sent to', toEmail, 'for:', reason);
    return new Response(
      JSON.stringify({ success: true, message: 'Tak! Vi ringer dig op hurtigst muligt.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[Callback] Unexpected:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Der opstod en fejl. Prøv venligst igen.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
