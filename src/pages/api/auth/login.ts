import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const { request, cookies, locals } = context;
  
  try {
    const { username, password } = await request.json();
    
    // Validate input
    if (!username || !password) {
      return new Response(
        JSON.stringify({ message: 'Du skal udfylde både brugernavn og adgangskode.' }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Access Cloudflare runtime environment
    // In Cloudflare Pages, env vars are available through import.meta.env
    // But we also try runtime context as fallback
    const runtime = (context as any).runtime;
    const runtimeEnv = runtime?.env;
    
    // Primary method: import.meta.env (standard for Cloudflare Pages)
    // Fallback: runtime.env (Cloudflare Workers pattern)
    const apiUrl = import.meta.env.ASB_API_URL || runtimeEnv?.ASB_API_URL;
    
    // Log for debugging (check Cloudflare function logs, not browser console)
    console.log('[Login API] Environment check:', {
      hasRuntime: !!runtime,
      hasRuntimeEnv: !!runtimeEnv,
      runtimeEnvKeys: runtimeEnv ? Object.keys(runtimeEnv) : [],
      importMetaEnvKeys: Object.keys(import.meta.env),
      hasImportMetaEnvASB: !!import.meta.env.ASB_API_URL,
      importMetaEnvASBValue: import.meta.env.ASB_API_URL || 'NOT SET',
      runtimeEnvASBValue: runtimeEnv?.ASB_API_URL || 'NOT SET',
      finalApiUrl: apiUrl ? 'SET' : 'NOT SET',
      finalApiUrlValue: apiUrl || 'NOT SET'
    });
    
    if (!apiUrl || apiUrl.trim() === '') {
      console.error('ASB_API_URL environment variable is not set or is empty');
      return new Response(
        JSON.stringify({ 
          message: 'Login-systemet er ikke korrekt konfigureret. Kontakt venligst support.',
          error: 'ASB_API_URL_MISSING'
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Call Loopback 3 login endpoint (farmers model)
    const loginUrl = `${apiUrl}/api/farmers/login`;
    console.log('Calling Avlerinfo API:', loginUrl);
    
    let response: Response;
    try {
      response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(
        JSON.stringify({ 
          message: 'Vi kan ikke forbinde til login-systemet lige nu. Prøv venligst igen om lidt.',
          error: 'NETWORK_ERROR',
          details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    console.log('Avlerinfo API response status:', response.status);
    console.log('Avlerinfo API response ok:', response.ok);
    
    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (e) {
        const text = await response.text().catch(() => '');
        errorData = { text };
      }
      console.log('Login failed:', errorData);
      return new Response(
        JSON.stringify({ 
          message: 'Hmm, det brugernavn eller den adgangskode kender vi ikke. Prøv venligst igen.' 
        }), 
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    let data: any;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      const text = await response.text().catch(() => '');
      console.error('Response text:', text);
      return new Response(
        JSON.stringify({ 
          message: 'Der opstod et problem med login-systemet. Prøv venligst igen om lidt.',
          error: 'INVALID_RESPONSE'
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    console.log('Avlerinfo API response data:', data);
    
    // Loopback 3 typically returns { id: 'token', userId: 'userId', ... }
    const token = data.id;
    const userId = data.userId;
    console.log('Token received:', token ? 'Yes' : 'No');
    console.log('User ID:', userId);
    
    if (!token) {
      console.error('No token in response:', data);
      return new Response(
        JSON.stringify({ 
          message: 'Der opstod et problem med login-systemet. Prøv venligst igen om lidt.',
          error: 'NO_TOKEN_RECEIVED'
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Set secure HTTP-only cookies - store both token and userId
    console.log('Setting auth cookies...');
    cookies.set('akd_auth_token', token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD, // HTTPS in production
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    // Also store userId to fetch farmer data later
    cookies.set('akd_user_id', userId?.toString() || '', {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    console.log('Login successful, returning success response');
    return new Response(
      JSON.stringify({ success: true }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { errorMessage, errorStack });
    
    return new Response(
      JSON.stringify({ 
        message: 'Vi kan ikke forbinde til login-systemet lige nu. Prøv venligst igen om lidt.',
        error: 'UNEXPECTED_ERROR',
        details: import.meta.env.PROD ? undefined : errorMessage // Only show details in dev
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

