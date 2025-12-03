import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  // Try all possible ways to access environment variables
  // In Astro with Cloudflare adapter, runtime env vars are in context.locals.runtime.env
  const locals = (context as any).locals;
  const localsRuntime = locals?.runtime;
  const localsRuntimeEnv = localsRuntime?.env;
  const contextRuntime = (context as any).runtime;
  const contextRuntimeEnv = contextRuntime?.env;
  
  // Get the actual value from import.meta.env (even if it's undefined/empty)
  const importMetaEnvValue = import.meta.env.ASB_API_URL;
  const importMetaEnvType = typeof importMetaEnvValue;
  const importMetaEnvIsEmpty = importMetaEnvValue === '' || importMetaEnvValue === undefined || importMetaEnvValue === null;
  
  // Try all possible access methods (prioritize locals.runtime.env for runtime vars)
  const apiUrl = localsRuntimeEnv?.ASB_API_URL || 
                 contextRuntimeEnv?.ASB_API_URL ||
                 importMetaEnvValue;
  
  // Get all import.meta.env keys (for debugging, but don't expose values)
  const envKeys = Object.keys(import.meta.env).filter(key => 
    !key.includes('SECRET') && !key.includes('PASSWORD') && !key.includes('TOKEN')
  );
  
  // Check if ASB_API_URL key exists but value is empty
  const hasKeyButNoValue = envKeys.includes('ASB_API_URL') && importMetaEnvIsEmpty;
  const isConfigured = !!apiUrl && apiUrl !== 'NOT SET' && apiUrl.trim() !== '';
  
  return new Response(
    JSON.stringify({ 
      configured: isConfigured,
      apiUrl: apiUrl || 'NOT SET',
      accessMethods: {
        localsRuntimeEnv: localsRuntimeEnv?.ASB_API_URL || 'NOT SET',
        contextRuntimeEnv: contextRuntimeEnv?.ASB_API_URL || 'NOT SET',
        importMetaEnv: importMetaEnvValue || 'NOT SET',
        importMetaEnvType: importMetaEnvType,
        importMetaEnvIsEmpty: importMetaEnvIsEmpty
      },
      diagnostics: {
        hasKeyInKeys: envKeys.includes('ASB_API_URL'),
        hasKeyButNoValue: hasKeyButNoValue,
        keyExistsButValueEmpty: hasKeyButNoValue,
        hasLocalsRuntime: !!localsRuntime,
        hasLocalsRuntimeEnv: !!localsRuntimeEnv,
        localsRuntimeEnvKeys: localsRuntimeEnv ? Object.keys(localsRuntimeEnv) : [],
        hasContextRuntime: !!contextRuntime,
        hasContextRuntimeEnv: !!contextRuntimeEnv,
        contextRuntimeEnvKeys: contextRuntimeEnv ? Object.keys(contextRuntimeEnv) : []
      },
      availableEnvKeys: envKeys,
      message: isConfigured
        ? 'Environment variable is accessible and configured correctly!'
        : hasKeyButNoValue
        ? 'Environment variable key exists but value is empty. Check Cloudflare Pages: Settings → Environment Variables → Production → Ensure ASB_API_URL has a value'
        : 'Environment variable is NOT accessible. Check Cloudflare Pages settings: Settings → Environment Variables → Production'
    }), 
    { 
      status: isConfigured ? 200 : 500,
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

