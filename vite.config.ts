import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        app: "index.html"
      }
    }
  },
  test: {
    environment: "jsdom",
    globals: true
  }
});
