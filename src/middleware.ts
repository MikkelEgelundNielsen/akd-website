import { defineMiddleware } from 'astro:middleware';
import type { MiddlewareNext } from 'astro';

// Protected route patterns - all routes under /andelshavere except login
const protectedRoutes = ['/andelshavere'];
const publicRoutes = ['/andelshavere/login'];

export const onRequest = defineMiddleware(async (context, next: MiddlewareNext) => {
  const { url, cookies, redirect } = context;
  
  // Check if this is a public route
  const isPublicRoute = publicRoutes.some(route => url.pathname === route);
  
  if (isPublicRoute) {
    return next();
  }
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    url.pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    // Get auth token and user ID from cookies
    const authToken = cookies.get('akd_auth_token')?.value;
    const userId = cookies.get('akd_user_id')?.value;
    
    console.log('[Middleware] Checking protected route:', url.pathname);
    console.log('[Middleware] Auth token present:', !!authToken);
    console.log('[Middleware] User ID present:', !!userId);
    
    if (!authToken || !userId) {
      // No token, redirect to login
      console.log('[Middleware] No token or user ID found, redirecting to login');
      return redirect('/andelshavere/login');
    }
    
    // Validate token by fetching farmer data with token
    try {
      const apiUrl = import.meta.env.ASB_API_URL;
      
      if (!apiUrl) {
        console.error('ASB_API_URL environment variable is not set');
        return redirect('/andelshavere/login');
      }
      
      // Try to fetch farmer data using the userId and access_token
      const validateUrl = `${apiUrl}/api/farmers/${userId}?access_token=${authToken}`;
      console.log('[Middleware] Validating token by fetching farmer:', validateUrl);
      const response = await fetch(validateUrl);
      
      console.log('[Middleware] Validation response status:', response.status);
      
      if (!response.ok) {
        // Invalid token, clear cookies and redirect
        console.log('[Middleware] Token validation failed, clearing cookies');
        const errorText = await response.text().catch(() => 'No error details');
        console.log('[Middleware] Error response:', errorText);
        cookies.delete('akd_auth_token', { path: '/' });
        cookies.delete('akd_user_id', { path: '/' });
        return redirect('/andelshavere/login');
      }
      
      // Token is valid, attach user to locals for use in pages
      const user = await response.json();
      console.log('[Middleware] Token valid, farmer data loaded');
      context.locals.user = user;
      
    } catch (error) {
      console.error('[Middleware] Auth validation failed:', error);
      cookies.delete('akd_auth_token', { path: '/' });
      cookies.delete('akd_user_id', { path: '/' });
      return redirect('/andelshavere/login');
    }
  }
  
  return next();
});

