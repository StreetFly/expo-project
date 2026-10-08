const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    const requestUrl = req.url ? new URL(req.url, 'http://localhost') : null;
    const pathname = requestUrl?.pathname ?? req.url;

    if (typeof pathname === 'string' && pathname.toLowerCase().endsWith('.wasm')) {
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    }

    return middleware(req, res, next);
  };
};

module.exports = config;
