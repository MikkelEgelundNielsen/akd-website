import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  const token = cookies.get('akd_auth_token')?.value;
  
  if (token) {
    // Optional: Call Loopback logout endpoint
    try {
      const apiUrl = import.meta.env.ASB_API_URL;
      
      if (apiUrl) {
        // Loopback 3 expects token as query parameter
        await fetch(`${apiUrl}/api/farmers/logout?access_token=${token}`, {
          method: 'POST'
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if remote logout fails
    }
  }
  
  // Clear cookies
  cookies.delete('akd_auth_token', { path: '/' });
  cookies.delete('akd_user_id', { path: '/' });
  
  return new Response(
    JSON.stringify({ success: true }), 
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

