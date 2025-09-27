import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      /** 👇 enable PWA in dev so BIP can fire */
      devOptions: { enabled: true, type: "module" },

      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png"
      ],
      manifest: {
        name: "Chartrr",
        short_name: "Chartr",
        description: "Others",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        /** 👇 use real icon files in /public/icons with the exact sizes */
        icons: [
          { src: "chartr-logo.png", sizes: "192x192", type: "image/png" },
          { src: "chartr-logo.pnpng", sizes: "512x512", type: "image/png" },
          {
            src: "/chartr-logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
  server: { host: true, port: 5174 }
});
