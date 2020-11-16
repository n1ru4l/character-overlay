/**
 * create-react-app websocket proxy for development
 */
const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    proxy("/socket.io", {
      target: "http://localhost:4000",
      changeOrigin: true,
      ws: true,
    })
  );
};
