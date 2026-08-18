export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      "/ws": {
        target: "http://localhost:8081",
        ws: true,
      },
    },
  },
});