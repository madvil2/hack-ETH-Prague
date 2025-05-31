import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: "named",
        ref: true,
      },
      include: "**/*.svg",
    }),
    compression({
      algorithm: "brotliCompress",
      threshold: 0,
      verbose: true,
      deleteOriginFile: false,
    }),
    compression({
      algorithm: "gzip",
      threshold: 0,
      verbose: true,
      deleteOriginFile: false,
    }),
  ],
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/routes": path.resolve(__dirname, "./src/routes"),
      "@/i18n": path.resolve(__dirname, "./src/utils/i18n"),
      "@/icons": path.resolve(__dirname, "./src/assets/icons"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          '@use "@/styles/variables" as *; @use "@/styles/mixins" as *;',
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 4003,
    allowedHosts: true,
  },
  build: {
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
