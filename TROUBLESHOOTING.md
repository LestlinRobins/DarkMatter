# Troubleshooting Guide

## Node.js Version Compatibility

If you encounter the error:

```
You are using Node.js 20.16.0. Vite requires Node.js version 20.19+ or 22.12+
```

### Solutions:

1. **Update Node.js** (Recommended)

   - Download the latest LTS version from [nodejs.org](https://nodejs.org/)
   - Or use a Node version manager:

     ```bash
     # Using nvm (Mac/Linux)
     nvm install 20.19.0
     nvm use 20.19.0

     # Using nvm-windows (Windows)
     nvm install 20.19.0
     nvm use 20.19.0
     ```

2. **Alternative: Use older Vite version** (Not recommended for new projects)
   ```bash
   npm install vite@4.5.5 --save-dev
   ```

## Common Issues

### TailwindCSS PostCSS Plugin Error

If you see the error: "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin..."

**Solution:**

1. Install the correct PostCSS plugin:

   ```bash
   npm install -D @tailwindcss/postcss
   ```

2. Update `postcss.config.js`:
   ```javascript
   export default {
     plugins: {
       "@tailwindcss/postcss": {},
       autoprefixer: {},
     },
   };
   ```

### TailwindCSS not working

1. Make sure `tailwind.config.js` and `postcss.config.js` exist
2. Verify CSS imports in `src/index.css`
3. Check that the content paths in `tailwind.config.js` are correct
4. Ensure you're using `@tailwindcss/postcss` plugin (not `tailwindcss` directly)

### API CORS Issues

If you encounter CORS errors like "Access-Control-Allow-Origin does not match":

**Automatic Solutions Implemented:**

1. **Vite Proxy**: The app automatically tries to use a proxy server first
2. **Direct API Fallback**: If proxy fails, tries direct API access
3. **Mock Data Fallback**: If both fail, uses sample data for demonstration

**Manual Troubleshooting:**

1. **Restart Dev Server**: Make sure to restart after any config changes:

   ```bash
   npm run dev
   ```

2. **Check Proxy Configuration**: Verify `vite.config.js` has the proxy setup:

   ```javascript
   server: {
     proxy: {
       '/api': {
         target: 'https://osdr.nasa.gov/osdr',
         changeOrigin: true,
         secure: true
       }
     }
   }
   ```

3. **Browser Console**: Check for detailed error messages
4. **Connection Status**: The app shows which data source is being used
5. **Network Tab**: Check if requests are going to `/api/*` (proxy) or direct URLs

### Build Issues

If you get TypeScript-related errors:

1. Make sure all `.tsx` and `.ts` files have been converted to `.jsx` and `.js`
2. Update imports to use `.jsx` extensions where needed
3. Check `package.json` scripts don't reference TypeScript commands

## Testing the Application

Even if the dev server won't start due to Node.js version issues, you can:

1. **Test API endpoints directly in browser:**

   ```javascript
   // Open browser console and run:
   fetch("https://osdr.nasa.gov/osdr/api/datasets")
     .then((r) => r.json())
     .then(console.log);
   ```

2. **Review the code structure:**

   - All components are properly structured
   - TailwindCSS classes are correctly applied
   - React hooks are used appropriately

3. **Validate the build configuration:**
   - Check that all file extensions are `.jsx` for components
   - Verify `main.jsx` is referenced in `index.html`
   - Ensure `package.json` scripts are updated for JavaScript

## Quick Start with Compatible Node.js

If you upgrade Node.js to 20.19+ or 22.12+:

1. Clear npm cache:

   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and package-lock.json:

   ```bash
   rm -rf node_modules package-lock.json
   # Windows: rmdir /s node_modules & del package-lock.json
   ```

3. Reinstall dependencies:

   ```bash
   npm install
   ```

4. Start dev server:
   ```bash
   npm run dev
   ```

The application should then work perfectly with the NASA OSDR API integration!
