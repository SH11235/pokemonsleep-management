import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom", // ブラウザ環境でテスト
        globals: true, // グローバル変数 (e.g., window, document) を有効化
        setupFiles: "./vitest.setup.ts",
    },
    resolve: {
        alias: {
            "@": "/src",
        },
    },
});
