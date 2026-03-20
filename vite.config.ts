import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
// import DataApi from "./src/plugins/data-api";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue({
        customElement: true,
      }),

      // DataApi(),
    ],

    build: {
      rollupOptions: {
        output: {
          format: "es",
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
      },
    },

    base: env.VITE_BASE_URL || "/",
  };
});
