var webpack = require("webpack");

module.exports = {
  watch: false,
  Buffer: false,
  entry: __dirname + "/lib",
  output: {
    path: __dirname,
    filename: "browser.js"
  },
  resolve: {
    extensions: [
      "", ".js"
    ]
  }
};