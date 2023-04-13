const PROXY_CONFIG = [
  {
    context: [
      "/backend",
      "/authorize",
      "/plugins",
    ],
    "target": "http://127.0.0.1:8080/",
    "changeOrigin": false,
    "secure": false,
    "logLevel": "debug",
    "bypass": function (req, res, options) {
    }
  },
];

module.exports = PROXY_CONFIG
