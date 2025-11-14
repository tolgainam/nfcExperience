import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages deployment
  // Use '/' for custom domain or root deployment
  // Use '/nfcExperience/' for GitHub Pages at username.github.io/nfcExperience/
  base: process.env.GITHUB_ACTIONS ? '/nfcExperience/' : '/',
})
