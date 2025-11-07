# Troubleshooting Guide

## Issue: 404 Error on API Routes

If you see 404 errors on `/api/auth/login` or other API routes:

### Solution: Restart the Dev Server

**IMPORTANT:** After making changes to API routes or configuration files, you MUST restart the dev server.

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart it:
npm run dev
```

### Why This Happens

In Astro SSR mode:
- API routes need `export const prerender = false;`
- Changes to routing configuration require a server restart
- The dev server caches route information

## Issue: Environment Variables Not Loading

If authentication fails with "ASB_API_URL not configured":

### Solution: Check .env Location and Restart

1. Ensure `.env` file is in the `akd-website` directory (not root)
2. Verify it contains: `ASB_API_URL=https://selvbetjening.avlerinfo.dk:3333`
3. **RESTART the dev server** - environment variables are only loaded on startup

```bash
# Correct location:
akd-website/.env  ✅

# Wrong location:
.env  ❌ (root directory)
```

## Issue: 401 Unauthorized from Avlerinfo API

If you see 401 errors after the login request reaches the API:

### Possible Causes:

1. **Invalid Credentials** - Ensure you're using valid farmer credentials
2. **API Changes** - The Avlerinfo API structure may have changed
3. **Network Issues** - The API may be temporarily unavailable

### Test API Connection:

Visit: `http://localhost:4321/api/auth/test`

This will show:
- ✅ If environment variables are configured
- ✅ If the API is reachable
- ✅ What response status you're getting

## Issue: CORS Errors

If you see CORS errors in the browser console:

### This is Normal!

The authentication happens **server-side**, so CORS doesn't apply. The frontend calls your Astro API routes, which then call the Avlerinfo API server-to-server.

If you see CORS errors, it means:
- You're trying to call the Avlerinfo API directly from the browser (don't do this)
- OR there's an issue with how the routes are configured

## Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Still Having Issues?

1. Check the terminal logs where `npm run dev` is running
2. Check the browser console (F12)
3. Check the Network tab in DevTools
4. Test the API connection: `http://localhost:4321/api/auth/test`
5. Verify `.env` file exists and has the correct URL
6. Ensure you've restarted the dev server after any config changes

## Quick Restart Checklist

After making these changes, restart the server:
- ✅ Created or edited `.env` file
- ✅ Modified `astro.config.mjs`
- ✅ Changed API route files
- ✅ Updated environment variables
- ✅ Installed new dependencies

