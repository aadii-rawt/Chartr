import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    manifest: {
      name: 'Chartrr',
      short_name: 'Chartr',
      description: 'Others',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: 'chartr-logo.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'chartr-logo.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'chartr-logo.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    }
  })
  ],
  server: {
    host: true,
    port: 5174,
  },
})
