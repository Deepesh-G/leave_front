import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Recommended dev server settings
  server: {
    port: 5173,         // frontend runs here
    open: true,         // auto-open browser
    host: true,
  },

  // Build optimization
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
