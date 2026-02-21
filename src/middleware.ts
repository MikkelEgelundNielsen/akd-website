import { defineMiddleware } from 'astro:middleware';
import type { MiddlewareNext } from 'astro';

const publicRoutes = ['/andelshavere/login', '/andelshavere/andele'];

export const onRequest = defineMiddleware(async (context, next: MiddlewareNext) => {
  const { url, cookies, redirect } = context;

  // Only run auth logic for /andelshavere routes — avoids touching
  // request.headers on prerendered public pages (which triggers build warnings).
  if (!url.pathname.startsWith('/andelshavere')) {
    return next();
  }

  const isPublicRoute = publicRoutes.some(route => url.pathname === route);
  const isProtectedRoute = !isPublicRoute;

  const authToken = cookies.get('akd_auth_token')?.value;
  const userId = cookies.get('akd_user_id')?.value;

  if (authToken && userId) {
    try {
      const localsRuntimeEnv = (context.locals as any)?.runtime?.env;
      const contextRuntimeEnv = (context as any)?.runtime?.env;
      const apiUrlRaw = localsRuntimeEnv?.ASB_API_URL ||
                        contextRuntimeEnv?.ASB_API_URL ||
                        import.meta.env.ASB_API_URL;
      const apiUrl = apiUrlRaw ? apiUrlRaw.toString().replace(/\/+$/, '') : null;

      if (apiUrl) {
        const validateUrl = `${apiUrl}/api/farmers/${userId}?access_token=${authToken}`;
        const response = await fetch(validateUrl);

        if (response.ok) {
          context.locals.user = await response.json();
        } else {
          cookies.delete('akd_auth_token', { path: '/' });
          cookies.delete('akd_user_id', { path: '/' });

          if (isProtectedRoute) {
            return redirect('/andelshavere/login');
          }
        }
      }
    } catch (error) {
      console.error('[Middleware] Auth validation failed:', error);
      cookies.delete('akd_auth_token', { path: '/' });
      cookies.delete('akd_user_id', { path: '/' });

      if (isProtectedRoute) {
        return redirect('/andelshavere/login');
      }
    }
  } else if (isProtectedRoute) {
    return redirect('/andelshavere/login');
  }

  return next();
});

