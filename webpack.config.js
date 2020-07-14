const path = require('path');
const WebpackHtmlPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  watchOptions: {
    ignored: ['node_modules/**'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.png$|\.jpg$|\.gif$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$|\.scss$|\.sass$/,
        loader: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new WebpackHtmlPlugin({
      template: 'src/index.html',
    }),
  ],
};
