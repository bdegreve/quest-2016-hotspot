var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')

module.exports = {
  entry: {
    main: [
      './app/app.js'
    ]
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name]-[hash].js',
    libraryTarget: 'umd'
  },
  devtool: '#source-map',
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
        loader: ExtractTextPlugin.extract('style', 'css?localIdentName=[local]-[hash:base64:5]!less')
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        lloader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.(png|jpg|jpeg)$/,
        loader: 'file'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name]-[hash].css'),
    new StaticSiteGeneratorPlugin('main', ['/'])
  ],
  resolve: {
    root: path.resolve('./app'),
    extensions: ['', '.js'],
    modulesDirectories: [
      'node_modules',
      'web_modules' // because https://github.com/webpack/webpack-dev-server/issues/60
    ]
  }
}
