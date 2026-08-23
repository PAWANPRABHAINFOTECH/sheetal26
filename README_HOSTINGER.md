# Hostinger Node.js Deployment Instructions

This package contains the complete source code for the Sheetal Shivalaya Samiti website.

## Steps to Deploy on Hostinger:

1. **Upload**: Upload this ZIP file to your Hostinger File Manager in the root directory of your Node.js application.
2. **Extract**: Extract the contents of the ZIP file.
3. **Environment Variables**: Rename `.env.example` to `.env` and fill in your Supabase credentials.
4. **Install Dependencies**: Open the Node.js terminal in Hostinger and run:
   ```bash
   npm install
   ```
5. **Build for Node.js**:
   ```bash
   npm run build:node
   ```
6. **Start Application**: The application is configured to start using the command:
   ```bash
   node .output/server/index.mjs
   ```
   Ensure your Hostinger Node.js application settings point to this entry point or uses `npm start`.

## Project Structure:
- `src/`: Frontend and Server Function source code.
- `public/`: Static assets.
- `supabase/`: Database migrations and configuration.
- `package.json`: Project dependencies and scripts.
- `index.html`: Root entry point for Vite.
