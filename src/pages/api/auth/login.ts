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
    // In Astro with Cloudflare adapter, runtime env vars are in context.locals.runtime.env
    // Build-time vars are in import.meta.env
    const localsRuntime = (locals as any)?.runtime;
    const localsRuntimeEnv = localsRuntime?.env;
    const contextRuntime = (context as any).runtime;
    const contextRuntimeEnv = contextRuntime?.env;
    
    // Try all possible access methods
    const apiUrlRaw = localsRuntimeEnv?.ASB_API_URL || 
                      contextRuntimeEnv?.ASB_API_URL ||
                      import.meta.env.ASB_API_URL;
    
    // Remove trailing slash if present to avoid double slashes
    const apiUrl = apiUrlRaw ? apiUrlRaw.toString().replace(/\/+$/, '') : null;
    
    // Log for debugging (check Cloudflare function logs, not browser console)
    console.log('[Login API] Environment check:', {
      hasLocalsRuntime: !!localsRuntime,
      hasLocalsRuntimeEnv: !!localsRuntimeEnv,
      localsRuntimeEnvKeys: localsRuntimeEnv ? Object.keys(localsRuntimeEnv) : [],
      hasContextRuntime: !!contextRuntime,
      hasContextRuntimeEnv: !!contextRuntimeEnv,
      contextRuntimeEnvKeys: contextRuntimeEnv ? Object.keys(contextRuntimeEnv) : [],
      importMetaEnvKeys: Object.keys(import.meta.env),
      hasImportMetaEnvASB: !!import.meta.env.ASB_API_URL,
      importMetaEnvASBValue: import.meta.env.ASB_API_URL || 'NOT SET',
      localsRuntimeEnvASBValue: localsRuntimeEnv?.ASB_API_URL || 'NOT SET',
      contextRuntimeEnvASBValue: contextRuntimeEnv?.ASB_API_URL || 'NOT SET',
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
    console.log('Login request payload:', { username, passwordLength: password?.length || 0 });
    
    let response: Response;
    try {
      response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
    console.log('Avlerinfo API response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      let errorData: any = {};
      let errorText = '';
      try {
        errorText = await response.text();
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { text: errorText };
        }
      } catch (e) {
        errorData = { error: 'Could not read response' };
      }
      console.log('Login failed - Status:', response.status);
      console.log('Login failed - Error data:', errorData);
      console.log('Login failed - Error text:', errorText);
      
      // Return more specific error messages based on status
      let errorMessage = 'Hmm, det brugernavn eller den adgangskode kender vi ikke. Prøv venligst igen.';
      if (response.status === 401 || response.status === 403) {
        errorMessage = 'Hmm, det brugernavn eller den adgangskode kender vi ikke. Prøv venligst igen.';
      } else if (response.status >= 500) {
        errorMessage = 'Login-systemet er midlertidigt utilgængeligt. Prøv venligst igen om lidt.';
      }
      
      return new Response(
        JSON.stringify({ 
          message: errorMessage,
          error: 'LOGIN_FAILED',
          status: response.status
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

