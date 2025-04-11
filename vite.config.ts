import { defineConfig } from "vite";

export default defineConfig({
  server: {
    allowedHosts: true, // Bind the server to all network interfaces
  },
});
