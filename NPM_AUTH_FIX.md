# Fixing "Access token expired or revoked" Error

## Quick Fix

This error occurs because npm classic tokens were deprecated. Here's how to fix it:

### For Local Development

1. **Clear cached npm tokens:**
   ```bash
   npm config delete //registry.npmjs.org/:_authToken
   rm ~/.npmrc  # On Windows: del %USERPROFILE%\.npmrc
   ```

2. **If you need to authenticate (for private packages only):**
   ```bash
   npm login
   ```
   This creates a 2-hour session token (no long-lived tokens needed).

3. **For public packages (like this project), you don't need authentication:**
   ```bash
   npm install
   ```
   Should work without any tokens.

### For CI/CD (GitHub Actions)

The workflow is already configured to work without tokens for public packages. If you're still seeing errors:

1. **Check if you have an `.npmrc` file in your repo:**
   ```bash
   # Remove it if it contains expired tokens
   rm .npmrc
   ```

2. **If you need private packages, create a granular access token:**
   - Go to [npm token settings](https://www.npmjs.com/settings/YOUR_USERNAME/tokens)
   - Create a **Granular Access Token** (not classic)
   - Add it to GitHub Secrets as `NPM_TOKEN`
   - Update workflow to use it (only if needed)

### Verify Your Setup

```bash
# Check npm config
npm config list

# Should NOT show any auth tokens for public repos
# If you see tokens, remove them:
npm config delete //registry.npmjs.org/:_authToken
```

### Common Causes

1. **Old `.npmrc` file** with expired classic token
2. **Global npm config** with cached token
3. **CI/CD secrets** with expired token (if using private packages)

### This Project

Since this project uses **public packages only**, you should **not need any npm authentication**. The error is likely from:
- A cached token in your local environment
- An old `.npmrc` file somewhere

**Solution:** Clear your npm config as shown above, then run `npm install` again.
