module.exports = {
  entry: "./script.js",
  output: {
    path: __dirname,
    filename: "./dist/bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {}
};
