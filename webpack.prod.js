const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
  plugins: [
    new CleanWebpackPlugin(['docs'], { exclude: ['CNAME', 'img/'] }),
    new Dotenv({ path: './.env.prod' }),
    new CopyWebpackPlugin([{ from: 'img/favicons/', to: 'img/favicons/' }]),
  ],
})
