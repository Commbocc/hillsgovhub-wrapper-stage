import type { Plugin } from "vite";
import { $fetch } from "ofetch";

export default async function dataApi(): Promise<Plugin> {
  const fileName = "data.json";

  const data = await $fetch(
    `https://hc-county-data-stack.netlify.app/api/v1/content-types/hillsgovhub_wrapper`
  );

  return {
    name: "data-api",

    // dev (serve)
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === `/${fileName}`) {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
          return;
        }
        next();
      });
    },

    // build
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName,
        source: JSON.stringify(data),
      });
    },
  };
}
