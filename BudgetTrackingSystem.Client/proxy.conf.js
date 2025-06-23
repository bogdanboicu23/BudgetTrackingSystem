const PROXY_CONFIG = [
  {
    context: [
      "/api"
    ],
    target: "http://localhost:5293",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    onProxyReq: (proxyReq, req, res) => {
      console.log('Proxying request:', req.method, req.url, '→', proxyReq.path);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log('Proxy response:', proxyRes.statusCode, 'from', req.url);
    }
  }
];

module.exports = PROXY_CONFIG;