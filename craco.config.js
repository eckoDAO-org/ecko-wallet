/* craco.config.js */
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@Components': path.resolve(__dirname, 'src/components'),
      '@Utils': path.resolve(__dirname, 'src/utils'),
      '@Css': path.resolve(__dirname, 'src/css'),
      '@Reducers': path.resolve(__dirname, 'src/reducers'),
      '@ledgerhq/devices': '@ledgerhq/devices/lib-es',
    },
  },
  devServer: {
    writeToDisk: true,
  },
};
