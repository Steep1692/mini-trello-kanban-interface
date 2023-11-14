/* craco.config.js */
const path = require(`path`);

module.exports = {
  webpack: {
    // makes an import shortcut/alias in create-react-app
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    }
  },
};