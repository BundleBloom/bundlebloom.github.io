import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The site is served from https://bundlebloom.github.io/ (root). Override with BASE_PATH for project pages.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: { target: 'es2022', sourcemap: false },
});
