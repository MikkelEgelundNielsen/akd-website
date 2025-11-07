# Quick Authentication Setup

## Step 1: Create .env file

Create a file named `.env` in the `akd-website` directory with this content:

```bash
ASB_API_URL=https://selvbetjening.avlerinfo.dk:3333
```

## Step 2: Install Dependencies

```bash
cd akd-website
npm install
```

## Step 3: Start Development Server

```bash
npm run dev
```

## Step 4: Test Authentication

1. Open your browser to `http://localhost:4321`
2. Navigate to the "For Andelshavere" section
3. You'll be redirected to the login page
4. Enter your Avlerinfo farmer credentials
5. Upon successful login, you'll see the dashboard

## API Endpoints Used

The authentication system integrates with these Avlerinfo endpoints:

- **Login:** `https://selvbetjening.avlerinfo.dk:3333/api/farmers/login`
- **Validate:** `https://selvbetjening.avlerinfo.dk:3333/api/farmers/me`
- **Logout:** `https://selvbetjening.avlerinfo.dk:3333/api/farmers/logout`

## Troubleshooting

If you encounter issues:

1. **Check .env file exists** in the `akd-website` directory (not the root)
2. **Restart the dev server** after creating/editing .env
3. **Check API accessibility** - ensure you can reach `https://selvbetjening.avlerinfo.dk:3333`
4. **View server logs** in the terminal for detailed error messages

For more details, see `AUTHENTICATION.md`

