var express = require('express')
var proxy = require('express-http-proxy')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')

var config = require('./webpack.config')

var app = express()

app.set('port', (process.env.PORT || 8080))

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  quiet: false,
  stats: {
    colors: true
  }
}))

app.use('/api', proxy('localhost:3000'))

app.listen(app.get('port'), '0.0.0.0', function () {
  console.log('Listening at http://0.0.0.0:' + app.get('port'))
})
