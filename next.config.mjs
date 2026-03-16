/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer) {
      // externalize sql.js so it's not bundled by webpack on server
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('sql.js');
      }
    }

    if (!isServer) {
      // Client-side: provide fallbacks for node built-ins
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        os: false,
        net: false,
        tls: false,
        child_process: false,
        'fs/promises': false,
      };
    }

    return config;
  },
};

export default nextConfig;
