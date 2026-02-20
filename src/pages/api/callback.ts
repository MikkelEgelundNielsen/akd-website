import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { reason, name, phone } = await request.json();

    if (!name || !phone) {
      return new Response(
        JSON.stringify({ success: false, message: 'Navn og telefonnummer er påkrævet.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Wire up email delivery (e.g. Resend, SendGrid) when ready
    console.log('[Callback Request]', { reason, name, phone, timestamp: new Date().toISOString() });

    return new Response(
      JSON.stringify({ success: true, message: 'Tak! Vi ringer dig op hurtigst muligt.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: 'Der opstod en fejl. Prøv venligst igen.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
