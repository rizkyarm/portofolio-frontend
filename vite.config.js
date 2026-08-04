import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const vitePrerender = require("vite-plugin-prerender");

function routesFromSitemap() {
  try {
    const sitemap = fs.readFileSync(path.resolve("public/sitemap.xml"), "utf-8");
    const routes = [...sitemap.matchAll(/<loc>https?:\/\/[^<]+?(\/[^<]*)<\/loc>/g)]
      .map((m) => m[1])
      .filter((r) => r !== "/" && !r.includes("/api/"));
    return ["/", ...routes];
  } catch {
    return ["/"];
  }
}

const prerenderRoutes = routesFromSitemap();

console.log(`[vite] Prerender routes: ${prerenderRoutes.join(", ")}`);

export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
      staticDir: path.resolve("dist"),
      routes: prerenderRoutes,
      server: {
        port: 4173,
        proxy: {
          "/api": {
            target: process.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, "") || "https://rizkiaditiyar-backend.my.id",
            changeOrigin: true,
          },
        },
      },
      renderer: new vitePrerender.PuppeteerRenderer({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
        skipThirdPartyRequests: false,
        maxConcurrentRoutes: 2,
        renderAfterTime: 8000,
        consoleHandler: (route, message) => {
          if (message.type() === "error" || message.type() === "warning") {
            console.log(`[prerender:${route}] ${message.type()}: ${message.text()}`);
          }
        },
      }),
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
});
