const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: [
    //'webpack-dev-server/client?http://localhost:9000',
    path.join(__dirname, 'client/src/index.js')
  ],
  output: {
    path: path.join(__dirname, 'client/build'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:9000'
  },
  devServer: {
    hot: true,
    contentBase: './client/build',
    port: 9000,
    stats: 'minimal'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'client/src'),
        loader: 'babel-loader',
        query: {
          presets: ['react']
        }
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
