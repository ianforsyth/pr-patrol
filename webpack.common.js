const webpack = require('webpack')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'app'),
  output: {
    path: __dirname + '/docs',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new Dotenv(),
    new WriteFilePlugin
  ],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader'] },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /.(svg|png|ico)$/, loader: 'file-loader' }
    ]
  }
}
