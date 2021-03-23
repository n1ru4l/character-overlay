import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

const backendAddress = "http://localhost:4000";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    target: "safari14",
    minify: false,
  },
  resolve: {
    alias: {
      "socket.io-client": "socket.io-client/dist/socket.io.js",
    },
  },
  server: {
    proxy: {
      "/socket.io": backendAddress,
      "/uploads": backendAddress,
      "/upload": backendAddress,
    },
  },
});
