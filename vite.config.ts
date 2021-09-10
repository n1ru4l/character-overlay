import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { babelPlugin } from "@graphql-codegen/gql-tag-operations-preset";
import * as babel from "@babel/core";

const backendAddress = "http://localhost:4000";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "es2019",
    minify: false,
  },
  resolve: {
    alias: {
      "socket.io-client": "socket.io-client/dist/socket.io.js",
    },
  },
  server: {
    proxy: {
      "/socket.io": {
        target: backendAddress,
        ws: true,
      },
      "/uploads": backendAddress,
      "/upload": backendAddress,
    },
  },
  plugins: [
    reactRefresh(),
    {
      name: "babel",
      enforce: "post",
      async transform(source: string, filename: string) {
        if (filename.includes("node_modules")) {
          return undefined;
        }
        const sourceRegex = /\.(j|t)sx?$/;

        if (!sourceRegex.test(filename)) {
          return undefined;
        }

        const result = await babel.transformAsync(source, {
          filename,
          plugins: [
            [babelPlugin, { artifactDirectory: "./src/__generated__" }],
          ],
          babelrc: false,
          configFile: false,
          sourceMaps: true,
        });

        return result;
      },
    },
  ],
});
