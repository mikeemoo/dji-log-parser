var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: __dirname + "/lib",
  output: {
    path: __dirname,
    filename: "browser.js"
  },
  plugins: [
    new UglifyJSPlugin()
  ]
};