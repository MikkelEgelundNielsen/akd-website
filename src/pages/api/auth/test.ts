import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  // Try all possible ways to access environment variables
  const runtime = (context as any).runtime;
  const runtimeEnv = runtime?.env;
  const locals = (context as any).locals;
  const localsRuntime = locals?.runtime;
  const localsEnv = localsRuntime?.env;
  
  const apiUrl = runtimeEnv?.ASB_API_URL || 
                 localsEnv?.ASB_API_URL ||
                 import.meta.env.ASB_API_URL ||
                 (globalThis as any).ASB_API_URL;
  
  return new Response(
    JSON.stringify({ 
      configured: !!apiUrl,
      apiUrl: apiUrl || 'NOT SET',
      accessMethods: {
        runtimeEnv: runtimeEnv?.ASB_API_URL || 'NOT SET',
        localsEnv: localsEnv?.ASB_API_URL || 'NOT SET',
        importMetaEnv: import.meta.env.ASB_API_URL || 'NOT SET',
        globalThis: (globalThis as any).ASB_API_URL || 'NOT SET'
      },
      runtimeKeys: runtimeEnv ? Object.keys(runtimeEnv) : [],
      localsEnvKeys: localsEnv ? Object.keys(localsEnv) : [],
      hasRuntime: !!runtime,
      hasLocalsRuntime: !!localsRuntime,
      message: apiUrl ? 'Environment variable is accessible' : 'Environment variable is NOT accessible. Check Cloudflare Pages settings.'
    }), 
    { 
      status: apiUrl ? 200 : 500,
      headers: { 'Content-Type': 'application/json' }
    }
  );
  
  // Test connection to the API
  try {
    const testUrl = `${apiUrl}/api/farmers/login`;
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test',
        password: 'test'
      }),
    });
    
    return new Response(
      JSON.stringify({ 
        configured: true,
        apiUrl: apiUrl,
        testEndpoint: testUrl,
        testResponse: {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        },
        message: 'Connection test completed. A 401 is expected for invalid credentials, which means the API is reachable.'
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        configured: true,
        apiUrl: apiUrl,
        error: 'Connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        message: 'Cannot reach the Avlerinfo API. Check if the URL is correct and accessible from your server.'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

