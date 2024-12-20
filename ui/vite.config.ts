import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 8080,
    proxy: {
      "/api": "http://localhost:8888",
    },
  },
});
