# AWS Amplify Setup Guide

## After Adding Amplify via Console

When you add AWS Amplify to your repository via the AWS Console, follow these steps:

### 1. Generated Files

After connecting your repo in the Amplify Console, it will:
- Generate `amplify_outputs.json` in the root directory
- This file contains your API endpoints, auth configuration, etc.

### 2. App Configuration

The app is already configured to automatically load Amplify:

- **`app/_layout.tsx`**: Automatically imports and configures Amplify if `amplify_outputs.json` exists
- **No manual configuration needed** - the app will work once the file is generated

### 3. Install AWS Amplify Package

Once Amplify is set up, add the package to your dependencies:

```bash
npm install aws-amplify
```

The exact version will be determined by your Amplify Gen 2 setup. Typically:
- Amplify Gen 2 uses `aws-amplify@^6.0.0` or later
- The Amplify CLI will recommend the correct version

### 4. Verify Configuration

After `amplify_outputs.json` is generated:

1. **Check the file exists**: It should be in the root directory
2. **Verify it's not in .gitignore**: The file should be committed (it's safe to commit)
3. **Test the app**: The app will automatically configure Amplify on startup

### 5. App Settings That May Need Updates

#### app.json

The current `app.json` is already configured, but you may want to update:

- **`extra.eas.projectId`**: Update with your actual EAS project ID if using Expo Application Services
- **Bundle identifiers**: Already set to `com.prophecy.app` (iOS) and `com.prophecy.app` (Android)

#### iOS Configuration

If you're using Cognito for authentication, you may need to add URL schemes:

```json
{
  "ios": {
    "infoPlist": {
      "CFBundleURLTypes": [
        {
          "CFBundleURLSchemes": ["prophecy"]
        }
      ]
    }
  }
}
```

#### Android Configuration

For Android deep linking:

```json
{
  "android": {
    "intentFilters": [
      {
        "action": "VIEW",
        "data": [
          {
            "scheme": "prophecy"
          }
        ]
      }
    ]
  }
}
```

### 6. Environment-Specific Configuration

If you have multiple environments (dev, staging, prod), you can:

1. Create separate Amplify apps in the console
2. Use different `amplify_outputs.json` files per environment
3. Or use environment variables to switch configurations

### 7. Next Steps

After Amplify is configured:

1. **Test Authentication**: Try signing in/up
2. **Test GraphQL**: Query your AppSync API
3. **Test Subscriptions**: Verify real-time updates work
4. **Deploy**: The Amplify Console will automatically deploy on git push

### Troubleshooting

**Issue**: `amplify_outputs.json` not found
- **Solution**: Make sure Amplify Console has connected your repo and generated the file

**Issue**: Amplify not configuring
- **Solution**: Check that `aws-amplify` package is installed and `amplify_outputs.json` exists

**Issue**: Auth not working
- **Solution**: Verify Cognito is configured in your Amplify backend and URL schemes match

**Issue**: GraphQL queries failing
- **Solution**: Check that AppSync API is deployed and `amplify_outputs.json` has the correct API URL

### Files That Reference Amplify

- `app/_layout.tsx` - Auto-configures Amplify on app startup
- `src/services/amplifyConfig.ts` - (To be created) Centralized Amplify config
- `src/services/authService.ts` - (To be created) Auth service using Amplify
- `src/services/graphqlService.ts` - (To be created) GraphQL client using Amplify

These service files will be created as you implement features, but the basic configuration in `app/_layout.tsx` is sufficient to get started.
