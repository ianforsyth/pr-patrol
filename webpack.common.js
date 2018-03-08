const webpack = require('webpack')
const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: path.resolve(__dirname, 'app'),
  output: {
    path: __dirname + '/docs',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new Dotenv(),
  ],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader'] },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /.(svg|png|ico)$/, loader: 'file-loader' }
    ]
  }
}
