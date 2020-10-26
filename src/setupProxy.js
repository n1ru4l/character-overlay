/**
 * create-react-app websocket proxy for development
 */
const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(proxy("/graphql", { target: "ws://localhost:3000", ws: true }));
};
