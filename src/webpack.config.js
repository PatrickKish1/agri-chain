// Remove the unused import
// const path = require('path'); 

module.exports = {
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify") // Set fallback for 'path'
      }
    },
  };
  