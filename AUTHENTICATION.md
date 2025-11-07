# Authentication Setup Guide

This guide explains how to set up and use the authentication system for the "For Andelshavere" section.

## Overview

The authentication system protects the `/andelshavere` routes using:
- **Astro Middleware** for server-side route protection
- **Token-based authentication** against an existing ASB API (Loopback 3)
- **HTTP-only cookies** for secure session management

## Environment Variables

Create a `.env` file in the `akd-website` directory with the following variable:

```bash
# ASB API URL - Required for authentication
ASB_API_URL=https://selvbetjening.avlerinfo.dk:3333
```

### Examples:

**Production (Avlerinfo API):**
```bash
ASB_API_URL=https://selvbetjening.avlerinfo.dk:3333
```

**Local Development (if testing with local Loopback instance):**
```bash
ASB_API_URL=http://localhost:3000
```

## Protected Routes

All routes under `/andelshavere` are protected except:
- `/andelshavere/login` - Public login page

Protected routes include:
- `/andelshavere/` - Redirects to dashboard
- `/andelshavere/dashboard` - Main dashboard
- Any other routes under `/andelshavere/*`

## How It Works

### 1. User Login Flow

1. User visits `/andelshavere/login`
2. Submits username and password
3. Frontend calls `/api/auth/login` API endpoint
4. Backend validates credentials with ASB API
5. On success, sets secure HTTP-only cookie with token
6. Redirects to `/andelshavere/dashboard`

### 2. Authentication Middleware

For every protected route request:
1. Middleware checks for `akd_auth_token` cookie
2. If missing, redirects to `/andelshavere/login`
3. If present, validates token with ASB API
4. If valid, attaches user data to `Astro.locals.user`
5. If invalid, clears cookie and redirects to login

### 3. User Logout Flow

1. User clicks "Log ud" button
2. Frontend calls `/api/auth/logout` API endpoint
3. Backend calls ASB API logout (optional)
4. Clears the `akd_auth_token` cookie
5. Redirects to homepage

## API Endpoints

### POST `/api/auth/login`

Authenticates user with username and password.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Response (401):**
```json
{
  "message": "Forkert brugernavn eller adgangskode"
}
```

### POST `/api/auth/logout`

Logs out the current user.

**Success Response (200):**
```json
{
  "success": true
}
```

## Loopback 3 API Integration

The system integrates with the Avlerinfo API using the `farmers` model:

### Login Endpoint
- **URL:** `POST /api/farmers/login`
- **Base URL:** `https://selvbetjening.avlerinfo.dk:3333`
- **Full URL:** `https://selvbetjening.avlerinfo.dk:3333/api/farmers/login`
- **Request:** `{ "username": "...", "password": "..." }`
- **Response:** `{ "id": "token", "userId": "userId", ... }`

### Farmer Info Endpoint
- **URL:** `GET /api/farmers/me?access_token={token}`
- **Note:** Loopback 3 expects the token as a query parameter, not in headers
- **Response:** Farmer object with at least `{ "id": "...", "username": "..." }`

### Logout Endpoint
- **URL:** `POST /api/farmers/logout?access_token={token}`
- **Note:** Token is passed as a query parameter

## Security Features

- ✅ **HTTP-only cookies** - Cannot be accessed via JavaScript
- ✅ **Secure flag** - HTTPS only in production
- ✅ **SameSite strict** - CSRF protection
- ✅ **Server-side validation** - Every request validates token
- ✅ **Automatic cleanup** - Invalid tokens are removed
- ✅ **7-day expiration** - Tokens expire automatically

## Accessing User Data in Pages

In any protected page, access the authenticated user:

```astro
---
const user = Astro.locals.user;
---

<h1>Welcome, {user?.username}!</h1>
<p>Email: {user?.email}</p>
```

## Customization

### Adding New Protected Routes

Add routes to the middleware protection list in `src/middleware.ts`:

```typescript
const protectedRoutes = ['/andelshavere', '/another-protected-route'];
```

### Customizing User Type

Update the user interface in `src/env.d.ts`:

```typescript
interface Locals {
  user?: {
    id: string;
    username: string;
    email?: string;
    // Add your custom fields
    role?: string;
    companyId?: string;
  };
}
```

## Troubleshooting

### "ASB_API_URL environment variable is not set"
- Ensure `.env` file exists in `akd-website` directory
- Check that `ASB_API_URL=https://selvbetjening.avlerinfo.dk:3333` is defined in `.env`
- Restart the dev server after adding environment variables

### Login fails immediately
- Check that Avlerinfo API is accessible from the server
- Verify API endpoint URLs are correct: `/api/farmers/login`
- Check server logs for detailed error messages
- Ensure HTTPS and port 3333 are accessible

### Token validation fails
- Ensure Avlerinfo API `/api/farmers/me` endpoint is accessible
- Verify token is passed as query parameter: `?access_token={token}`
- Check if tokens have expired on the Avlerinfo API side (default TTL: 14 days)

## Development vs Production

### Development
```bash
# In development, uses HTTP for cookies (secure: false)
npm run dev
```

### Production
```bash
# In production, requires HTTPS (secure: true)
npm run build
npm run preview
```

## Testing

### Testing with Production API

To test with the real Avlerinfo API, set your `.env`:

```bash
ASB_API_URL=https://selvbetjening.avlerinfo.dk:3333
```

Use valid farmer credentials provided by the Avlerinfo system.

### Testing with Mock API (Optional)

To test authentication locally without the real API:

1. Create a mock API server
2. Point `ASB_API_URL` to the mock server
3. Return expected Loopback 3 response formats

Example mock login response:
```json
{
  "id": "mock-token-123",
  "userId": "farmer-456",
  "ttl": 604800
}
```

Example mock farmer info response:
```json
{
  "id": "farmer-456",
  "username": "testfarmer",
  "email": "test@example.com"
}
```

