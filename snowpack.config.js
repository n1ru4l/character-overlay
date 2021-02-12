"use strict";

const httpProxy = require("http-proxy");
const proxy = httpProxy.createServer({
  target: "http://localhost:4000",
});

const proxyHandler = (req, res) => proxy.web(req, res, () => undefined);

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
  },
  routes: [
    {
      src: "/socket.io/.*",
      dest: proxyHandler,
    },
    {
      src: "/uploads",
      dest: proxyHandler,
    },
    {
      src: "/upload",
      dest: proxyHandler,
    },
    { match: "routes", src: ".*", dest: "/index.html" },
  ],
  optimize: {
    bundle: true,
    splitting: true,
    minify: true,
  },
  packageOptions: {
    polyfillNode: true,
  },
  plugins: ["snowpack-plugin-hash"],
  exclude: ["*.graphql"],
};
