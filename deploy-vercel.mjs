import { mkdirSync, cpSync, rmSync, writeFileSync } from 'fs';

// Start fresh by clearing folder
rmSync('.vercel/output', { recursive: true, force: true });

// Create folders
mkdirSync('.vercel/output/static', { recursive: true });

// Copy images and CSS files
console.log('Copying static files from example...');
cpSync('./example', '.vercel/output/static', { recursive: true });

// Define version for Build Output API
// https://vercel.com/docs/build-output-api/v3
writeFileSync('.vercel/output/config.json', `{"version": 3}`);

console.log('✅ Done copying static files');
