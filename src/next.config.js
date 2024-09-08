// next.config.js
module.exports = {
    webpack: (config) => {
      config.resolve.fallback = {
        "path": require.resolve("path-browserify")
      };
  
      return config;
    },
  };
  