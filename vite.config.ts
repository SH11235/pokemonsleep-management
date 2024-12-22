import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "Pokemon Sleep Management",
                short_name: "PSM",
                start_url: "/pokemonsleep-management/",
                display: "standalone",
                background_color: "#ffffff",
                theme_color: "#3b82f6",
                icons: [
                    {
                        src: "/icons/icon-192×192.jpeg",
                        sizes: "192x192",
                        type: "image/jpeg",
                    },
                    {
                        src: "/icons/icon-512x512.jpeg",
                        sizes: "512x512",
                        type: "image/jpeg",
                    },
                ],
            },
        }),
    ],
    base: "/pokemonsleep-management/",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
