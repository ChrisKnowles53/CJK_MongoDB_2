import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ command }) => ({
  base: "/", // Netlify serves at root
  plugins: [react(), svgr()],
  server: {
    port: 3000,
    proxy: {
      // Dev-only API proxy → http://localhost:5001/products
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // Keep /uploads ONLY if you actually serve files from backend/uploads in dev
      // "/uploads": {
      //   target: "http://localhost:5001",
      //   changeOrigin: true,
      // },
    },
  },
}));
