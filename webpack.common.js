const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'app'),
  output: {
    path: __dirname + '/docs',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader'] },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /.(svg|png|ico)$/, loader: 'file-loader' }
    ]
  }
}
