var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')

var DEBUG = process.env.NODE_ENV !== 'production'
console.log('DEBUG:', DEBUG)

module.exports = {
  entry: {
    main: [
      'babel-polyfill',
      './app/app.js'
    ]
  },
  debug: DEBUG,
  output: {
    path: path.resolve('dist'),
    filename: '[name]-[hash].js',
    libraryTarget: 'umd',
    pathinfo: DEBUG
  },
  devtool: DEBUG ? '#eval-source-map' : '#source-map',
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'standard',
        exclude: /(node_modules|bower_components)/
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {} // see .babelrc
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css?localIdentName=[local]-[hash:base64:5]!postcss!less')
      },
      {
        test: /\.(png|jpg|jpeg|eot|ttf|svg|woff|woff2|mp4|webm|ogv)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name]-[hash].css'),
    new StaticSiteGeneratorPlugin('main', ['/'])
  ].concat(DEBUG ? [] : [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ]),
  resolve: {
    root: path.resolve('./app'),
    extensions: ['', '.js'],
    modulesDirectories: [
      'node_modules',
      'web_modules' // because https://github.com/webpack/webpack-dev-server/issues/60
    ]
  },
  postcss: [
    autoprefixer({
      browsers: [
        'last 2 versions',
        '> 0.1%',
        'android > 4']
    })
  ]
}
