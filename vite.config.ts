import fs from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const certDir = path.resolve(__dirname, ".certs");
const certFile = path.join(certDir, "dev-cert.pem");
const keyFile = path.join(certDir, "dev-key.pem");
const https =
  fs.existsSync(certFile) && fs.existsSync(keyFile)
    ? {
        cert: fs.readFileSync(certFile),
        key: fs.readFileSync(keyFile),
      }
    : undefined;

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    https,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: "src",
    }),
    viteReact(),
    nitro(),
  ],
});
