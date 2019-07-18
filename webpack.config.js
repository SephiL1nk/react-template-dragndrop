var path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: './src/development.js',
  devServer: {
    open: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader:[ 'style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css-loader', 'sass-loader']
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html' 
    }),
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
}