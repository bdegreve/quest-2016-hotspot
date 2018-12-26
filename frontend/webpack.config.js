const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')

const DEBUG = process.env.NODE_ENV !== 'production'
const HASH = !DEBUG ? '-[hash]' : ''
const CHUNKHASH = !DEBUG ? '-[chunkhash]' : ''
console.log('DEBUG:', DEBUG)

const plugins = [
  new webpack.LoaderOptionsPlugin({
    debug: !!DEBUG,
    minimize: !DEBUG
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new MiniCssExtractPlugin({
    filename: `[name]${CHUNKHASH}.css`,
    chunkFilename: `[id]${CHUNKHASH}.css`
  }),
  new StaticSiteGeneratorPlugin({
    entry: 'main',
    paths: ['/'],
    globals: {
      // shimming 'window' as self, to make webpack-dev-server/client happy.
      self: {
        location: {},
        postMessage: () => {},
        addEventListener: () => {}
      }
    }
  })
]

const cssLoaders = [
  // always using MiniCssExtractPlugin.loader even in debug mode, because
  // style-loader in combination with static-site-generator-webpack-plugin
  // gives a "window is not defined" error.
  MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      // don't localize names by default, otherwise bootstrap get
      // localized too. Instead explicitly :local(...) what needs to be.
      // ?importLoaders=1 seems not required for now.
      // https://css-tricks.com/css-modules-part-3-react/
      // https://github.com/css-modules/css-modules
      modules: 'global',
      localIdentName: '[local]_[hash:base64:5]'
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        autoprefixer({
          browsers: ['last 3 versions', '> 0.1%', 'android > 4']
        })
      ]
    }
  }
]

module.exports = {
  mode: DEBUG ? 'development' : 'production',
  entry: {
    main: ['babel-polyfill', './app/app.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `[name]${CHUNKHASH}.js`,
    chunkFilename: `[name]${CHUNKHASH}-chunk.js`,
    libraryTarget: 'umd',
    pathinfo: !!DEBUG,
    // errr, a "temp" hack for a "window is not defined" error we get in
    // static-site-generator-webpack-plugin with webpack 4
    // https://github.com/markdalgleish/static-site-generator-webpack-plugin/issues/130
    globalObject: "typeof self !== 'undefined' ? self : this"

  },
  devtool: DEBUG ? '#eval-source-map' : '#source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        enforce: 'pre',
        use: 'standard-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader' // see .babelrc
      },
      {
        test: /\.css$/,
        use: cssLoaders
      },
      {
        test: /\.less$/,
        use: [
          ...cssLoaders,
          {
            loader: 'less-loader',
            options: {
              // hack for less-loader 4.0 that now uses webpack's loaders
              // by default, and thus can't cope with @import url(https://...)
              // Specifying paths option forces it back to less' original
              // loaders
              paths: [
                path.resolve(__dirname, './app'),
                path.resolve(__dirname, 'node_modules')
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|eot|ttf|svg|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `[name]${HASH}.[ext]`
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogv)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `[name]${HASH}.[ext]`
            }
          }
        ]
      }
    ]
  },
  plugins,
  resolve: {
    modules: [
      path.resolve(__dirname, 'app'),
      __dirname,
      'node_modules',
      'web_modules' // because https://github.com/webpack/webpack-dev-server/issues/60
    ]
  }
}
