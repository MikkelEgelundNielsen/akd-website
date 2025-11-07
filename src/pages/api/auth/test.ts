import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const apiUrl = import.meta.env.ASB_API_URL;
  
  if (!apiUrl) {
    return new Response(
      JSON.stringify({ 
        error: 'ASB_API_URL not configured',
        message: 'Please set ASB_API_URL in your .env file'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
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

