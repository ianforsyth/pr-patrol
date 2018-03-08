const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const WriteFilePlugin = require('write-file-webpack-plugin');
const Dotenv = require('dotenv-webpack')

module.exports = merge(common, {
  devServer: {
    contentBase: path.resolve(__dirname, 'docs')
  },
  plugins: [
    new Dotenv({ path: './.env.prod' }),
    new WriteFilePlugin
  ],
})
