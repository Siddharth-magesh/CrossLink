import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/CrossLink/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "CrossLink",
        short_name: "CrossLink",
        start_url: "/CrossLink/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#212529",
        icons: [
          {
            src: "/logo.jpg",
            sizes: "192x192",
            type: "image/jpeg",
          },
          {
            src: "/logo.jpg",
            sizes: "512x512",
            type: "image/jpeg",
          },
          {
            src: "/logo.jpg",
            sizes: "256x256",
            type: "image/jpeg",
          }, 
        ],
      },
      workbox: {
        navigateFallback: '/CrossLink/index.html',
      },
      devOptions: {
        enabled: true
      }
    }),
  ],
  server: {
    host: true, // Listen on all interfaces for tunnel/port-forward compatibility
    port: 3030,
  },
});
