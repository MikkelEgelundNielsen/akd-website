# Cloudflare Pages Deployment Guide

This guide walks you through deploying the AKD website to Cloudflare Pages via GitHub.

## Overview

The site is configured with:
- **Hybrid rendering mode**: Static pages are pre-rendered at build time, authentication pages use SSR
- **Cloudflare adapter**: Optimized for Cloudflare Workers/Pages
- **GitHub integration**: Automatic deployments on every push

---

## Prerequisites

1. **GitHub repository** with your code pushed
2. **Cloudflare account** (free tier works fine)
3. **Domain** (optional, Cloudflare provides a free `.pages.dev` subdomain)

---

## Step 1: Push Your Code to GitHub

If you haven't already:

```bash
cd /Users/mikkelnielsen/GIT/akddanmark/akd-website

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Configure for Cloudflare Pages deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/akddanmark.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Connect to Cloudflare Pages

### 2.1 Create a New Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** in the sidebar
3. Click **Create application**
4. Select the **Pages** tab
5. Click **Connect to Git**

### 2.2 Authorize GitHub

1. Click **Connect GitHub**
2. Authorize Cloudflare to access your repositories
3. Select your repository: `akddanmark` (or your repo name)
4. Click **Begin setup**

### 2.3 Configure Build Settings

Set the following in the Cloudflare Pages setup:

| Setting | Value |
|---------|-------|
| **Project name** | `akd-website` (or your preferred name) |
| **Production branch** | `main` |
| **Framework preset** | `Astro` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/akd-website` (if monorepo, otherwise leave blank) |

### 2.4 Environment Variables

Click **Add variable** and add the following:

| Variable name | Value | Environment |
|---------------|-------|-------------|
| `NODE_VERSION` | `20` | Production & Preview |
| `ASB_API_URL` | `https://selvbetjening.avlerinfo.dk:3333` | Production & Preview |

**Important:**
- Set `NODE_VERSION=20` to ensure compatibility
- Set `ASB_API_URL` to your Loopback API endpoint
- You can add different values for Production vs Preview environments if needed

### 2.5 Deploy

1. Click **Save and Deploy**
2. Cloudflare will start building your site
3. First build typically takes 2-3 minutes

---

## Step 3: Verify Deployment

Once the build completes:

1. Click on your deployment URL (e.g., `https://akd-website.pages.dev`)
2. Test the following:
   - ✅ Homepage loads correctly
   - ✅ Navigation works
   - ✅ Static pages load fast (they're pre-rendered)
   - ✅ `/andelshavere/login` page loads
   - ✅ Login functionality works
   - ✅ Protected pages require authentication

---

## Step 4: Custom Domain (Optional)

### 4.1 Add Your Domain

1. In Cloudflare Pages, go to your project
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter your domain: `akddanmark.dk`
5. Follow the DNS setup instructions

### 4.2 DNS Configuration

If your domain is already on Cloudflare:
- Cloudflare will automatically configure DNS

If your domain is elsewhere:
- Add a CNAME record: `akddanmark.dk` → `akd-website.pages.dev`
- Or follow Cloudflare's specific instructions

### 4.3 SSL/TLS

Cloudflare automatically provides:
- ✅ Free SSL certificate
- ✅ Automatic HTTPS redirect
- ✅ Modern TLS protocols

---

## Automatic Deployments

Once connected, Cloudflare Pages automatically:

### Production Deployments
- **Trigger:** Push to `main` branch
- **URL:** Your custom domain or `*.pages.dev` domain
- **Environment:** Production environment variables

### Preview Deployments
- **Trigger:** Push to any other branch or Pull Request
- **URL:** Unique preview URL (e.g., `abc123.akd-website.pages.dev`)
- **Environment:** Preview environment variables
- **Automatic cleanup:** Deleted when branch/PR is closed

---

## Build Configuration

Your `astro.config.mjs` is configured with:

```javascript
export default defineConfig({
  output: 'static', // Best of both worlds
  adapter: cloudflare({
    mode: 'directory'
  }),
  // ... rest of config
});
```

**Hybrid mode means:**
- Pages with `export const prerender = true` → Built at build time (fast, cached)
- Pages without prerender (like `/andelshavere/*`) → Rendered on-demand (SSR)

---

## Local Development with Cloudflare

### Using Astro Dev Server (Recommended for development)

```bash
npm run dev
```

This uses your `.env` file for environment variables.

### Using Wrangler (Test Cloudflare-specific features)

Install Wrangler:

```bash
npm install -g wrangler
```

Run locally with Cloudflare Workers environment:

```bash
# Build first
npm run build

# Run with Wrangler
npx wrangler pages dev dist

# Or with custom port
npx wrangler pages dev dist --port 8788
```

This uses `.dev.vars` for environment variables.

---

## Environment Variables Management

### Local Development

Create `.env` file (gitignored):

```bash
# .env
ASB_API_URL=https://selvbetjening.avlerinfo.dk:3333
```

For Cloudflare-specific local testing, use `.dev.vars` (gitignored):

```bash
# .dev.vars
ASB_API_URL=https://selvbetjening.avlerinfo.dk:3333
```

### Production/Preview

Set in Cloudflare Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add/edit variables
3. Choose environment: Production, Preview, or Both

**Note:** After changing environment variables, you need to trigger a new deployment.

---

## Troubleshooting

### Build Fails: "Module not found"

**Solution:** Ensure `NODE_VERSION=20` is set in environment variables.

### Authentication Not Working

**Solution:** 
1. Verify `ASB_API_URL` is set correctly in Cloudflare
2. Check that your API endpoint is accessible from Cloudflare's network
3. Review build logs for any errors

### Static Pages Show Old Content

**Solution:**
1. Pages with `prerender = true` are cached at build time
2. Trigger a new deployment to rebuild
3. Or use [on-demand ISR](https://developers.cloudflare.com/pages/functions/incremental-static-regeneration/) (advanced)

### 404 on Dynamic Routes

**Solution:**
1. Ensure `[slug].astro` has `export const prerender = true`
2. Check that `getStaticPaths()` is returning all expected pages
3. Review build logs for warnings

### Deployment Stuck/Fails

**Solution:**
1. Check build logs in Cloudflare dashboard
2. Try canceling and redeploying
3. Verify `package.json` scripts are correct
4. Ensure all dependencies are in `package.json` (not just devDependencies)

---

## Performance Features

Cloudflare Pages provides automatically:

✅ **Global CDN** - Content served from 200+ locations worldwide  
✅ **HTTP/2 & HTTP/3** - Modern protocols for faster loading  
✅ **Brotli compression** - Better compression than gzip  
✅ **Smart routing** - Requests routed to nearest data center  
✅ **DDoS protection** - Built-in security  
✅ **Web Analytics** - Free, privacy-first analytics  

---

## Rollback a Deployment

If something goes wrong:

1. Go to your project in Cloudflare Pages
2. Click **Deployments** tab
3. Find a previous successful deployment
4. Click **...** → **Rollback to this deployment**

---

## CI/CD Integration

Since you're deploying via GitHub:

- **Automatic builds** on every commit to `main`
- **Preview deployments** for pull requests
- **Branch deployments** for feature branches

To **skip a build**, include `[skip ci]` in your commit message:

```bash
git commit -m "Update README [skip ci]"
```

---

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)

---

## Support

If you encounter issues:

1. Check [Cloudflare Status](https://www.cloudflarestatus.com/)
2. Review build logs in Cloudflare dashboard
3. Check Cloudflare Community forums
4. Contact Cloudflare support (available on paid plans)

---

## Quick Reference

### Deploy Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test locally
npm run preview

# Test with Cloudflare Workers
npx wrangler pages dev dist
```

### Important Files

- `astro.config.mjs` - Cloudflare adapter configuration
- `.dev.vars` - Local environment variables for Wrangler
- `.env` - Local environment variables for Astro dev server
- `.gitignore` - Ensures secrets aren't committed

### Key Directories

- `dist/` - Built output (deployed to Cloudflare)
- `.astro/` - Astro build cache
- `src/pages/` - Your pages (with prerender flags)
- `src/middleware.ts` - Authentication middleware (runs on edge)

---

**Your site is now ready to deploy to Cloudflare Pages!** 🚀

Simply push your code to GitHub, and Cloudflare will automatically build and deploy your site.


