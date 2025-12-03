import { defineMiddleware } from 'astro:middleware';
import type { MiddlewareNext } from 'astro';

// Protected route patterns - all routes under /andelshavere except login
const protectedRoutes = ['/andelshavere'];
const publicRoutes = ['/andelshavere/login'];

export const onRequest = defineMiddleware(async (context, next: MiddlewareNext) => {
  const { url, cookies, redirect } = context;
  
  // Check if this is a public route - if so, skip all auth checks
  const isPublicRoute = publicRoutes.some(route => url.pathname === route);
  
  if (isPublicRoute) {
    // Still check for auth cookies to set user for LoginButton, but don't validate
    const authToken = cookies.get('akd_auth_token')?.value;
    const userId = cookies.get('akd_user_id')?.value;
    
    if (authToken && userId) {
      try {
        // Access env vars through Cloudflare runtime (locals.runtime.env for runtime vars)
        const localsRuntime = (context.locals as any)?.runtime;
        const localsRuntimeEnv = localsRuntime?.env;
        const contextRuntime = (context as any)?.runtime;
        const contextRuntimeEnv = contextRuntime?.env;
        const apiUrlRaw = localsRuntimeEnv?.ASB_API_URL || 
                          contextRuntimeEnv?.ASB_API_URL ||
                          import.meta.env.ASB_API_URL;
        // Remove trailing slash if present to avoid double slashes
        const apiUrl = apiUrlRaw ? apiUrlRaw.toString().replace(/\/+$/, '') : null;
        if (apiUrl) {
          const validateUrl = `${apiUrl}/api/farmers/${userId}?access_token=${authToken}`;
          const response = await fetch(validateUrl);
          if (response.ok) {
            const user = await response.json();
            context.locals.user = user;
          }
        }
      } catch (error) {
        // Silently fail on public routes
      }
    }
    
    return next();
  }
  
  // Check if the current path is protected (excluding public routes)
  const isProtectedRoute = protectedRoutes.some(route => 
    url.pathname.startsWith(route)
  );
  
  // Get auth token and user ID from cookies (check on all routes)
  const authToken = cookies.get('akd_auth_token')?.value;
  const userId = cookies.get('akd_user_id')?.value;
  
  // If we have auth cookies, validate them and set user on all pages
  if (authToken && userId) {
    try {
      // Access env vars through Cloudflare runtime or standard way
      const cloudflareEnv = (context as any)?.runtime?.env;
      const apiUrl = cloudflareEnv?.ASB_API_URL || import.meta.env.ASB_API_URL;
      
      if (apiUrl) {
        // Try to fetch farmer data using the userId and access_token
        const validateUrl = `${apiUrl}/api/farmers/${userId}?access_token=${authToken}`;
        console.log('[Middleware] Validating auth on:', url.pathname);
        const response = await fetch(validateUrl);
        
        if (response.ok) {
          // Token is valid, attach user to locals for use in pages (including LoginButton)
          const user = await response.json();
          context.locals.user = user;
          console.log('[Middleware] User set on locals for:', url.pathname, 'User ID:', user?.id);
        } else {
          // Invalid token, clear cookies
          console.log('[Middleware] Token validation failed, status:', response.status);
          cookies.delete('akd_auth_token', { path: '/' });
          cookies.delete('akd_user_id', { path: '/' });
          
          // Only redirect if this is a protected route
          if (isProtectedRoute) {
            return redirect('/andelshavere/login');
          }
        }
      } else {
        console.log('[Middleware] ASB_API_URL not set, skipping auth validation');
      }
    } catch (error) {
      console.error('[Middleware] Auth validation failed:', error);
      cookies.delete('akd_auth_token', { path: '/' });
      cookies.delete('akd_user_id', { path: '/' });
      
      // Only redirect if this is a protected route
      if (isProtectedRoute) {
        return redirect('/andelshavere/login');
      }
    }
  } else {
    console.log('[Middleware] No auth cookies found on:', url.pathname);
    if (isProtectedRoute) {
      // No token and this is a protected route, redirect to login
      return redirect('/andelshavere/login');
    }
  }
  
  return next();
});

