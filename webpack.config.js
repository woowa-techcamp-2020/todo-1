const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    kanban: './src/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
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
    new CopyPlugin({
      patterns: [{ from: 'src/static' }],
    }),
    new HtmlPlugin({
      title: '칸반',
      hash: true,
      filename: 'index.html',
      excludeChunks: ['login'], // entry에서 해당 리스트를 제외한 나머지
      template: './src/index.html',
    }),
  ],
};
