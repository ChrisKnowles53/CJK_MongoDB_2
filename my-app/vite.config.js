import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/CJK_MongoDB_2/" : "/", // keep prod base, dev = "/"
  plugins: [react(), svgr()],
  server: {
    port: 3000,
    proxy: {
      // API
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // <-- strip "/api"
      },
      // Static image paths from backend (adjust to what your BE serves)
      "/uploads": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/images": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
}));
