import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  // Try all possible ways to access environment variables
  const runtime = (context as any).runtime;
  const runtimeEnv = runtime?.env;
  
  // Primary method: import.meta.env (standard for Cloudflare Pages)
  const apiUrl = import.meta.env.ASB_API_URL || runtimeEnv?.ASB_API_URL;
  
  // Get all import.meta.env keys (for debugging, but don't expose values)
  const envKeys = Object.keys(import.meta.env).filter(key => 
    !key.includes('SECRET') && !key.includes('PASSWORD') && !key.includes('TOKEN')
  );
  
  return new Response(
    JSON.stringify({ 
      configured: !!apiUrl,
      apiUrl: apiUrl || 'NOT SET',
      accessMethods: {
        importMetaEnv: import.meta.env.ASB_API_URL || 'NOT SET',
        runtimeEnv: runtimeEnv?.ASB_API_URL || 'NOT SET'
      },
      availableEnvKeys: envKeys,
      runtimeEnvKeys: runtimeEnv ? Object.keys(runtimeEnv) : [],
      hasRuntime: !!runtime,
      message: apiUrl 
        ? 'Environment variable is accessible' 
        : 'Environment variable is NOT accessible. Check Cloudflare Pages settings: Settings → Environment Variables → Production'
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

