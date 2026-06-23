import path from "path"
import { fileURLToPath } from "url"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Add CSP headers for security
    {
      name: 'csp-headers',
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader(
            'Content-Security-Policy',
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline'; " + // React requires inline scripts in dev
            "style-src 'self' 'unsafe-inline'; " +  // Tailwind requires inline styles
            "img-src 'self' data: https://raw.githubusercontent.com; " + // Allow Pokemon sprites
            "connect-src 'self'; " +
            "font-src 'self'; " +
            "object-src 'none'; " +
            "base-uri 'self'; " +
            "form-action 'self';"
          );
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
