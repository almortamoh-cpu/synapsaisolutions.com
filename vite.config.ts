import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Vite blocks requests whose Host is not local, to stop DNS-rebinding
    // attacks. That is correct for localhost, but it makes a `cloudflared
    // tunnel --url` preview return 403, because the request arrives with a
    // *.trycloudflare.com Host header.
    //
    // Scoped to that suffix rather than `true`, so loopback-only usage keeps
    // the protection. Production hosting is unaffected — Cloudflare Pages does
    // not read this file.
    allowedHosts: ['.trycloudflare.com'],
  },
  preview: {
    allowedHosts: ['.trycloudflare.com'],
  },
})