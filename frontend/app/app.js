import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'

import Layout from 'pages/layout'
import store from './store'
import './app.less'

import timer from 'api/timer'

if (typeof document !== 'undefined') {
  timer()
  ReactDOM.render(
    <Provider store={store}>
      <Layout />
    </Provider>,
    document.getElementById('content')
  )
}

export default (locals, callback) => {
  // locals.assets only contain javascript assets. we want all of them!
  const assets = getAssetPaths(locals.webpackStats, 'main') // same main as in webpack.config.js' entry
  const scripts = assets.filter((asset) => /\.jsx?$/.test(asset))
  const stylesheets = assets.filter((asset) => /\.css$/.test(asset))

  // don't render everything with renderToString.
  // see http://jeffhandley.github.io/QuickReactions/20-final-cleanup
  // (via http://stackoverflow.com/a/37621838)

  const content = ReactDOMServer.renderToString(
    <Provider store={store}>
      <Layout />
    </Provider>
  )

  const initialState = safeStringify(store.getState())

  const title = 'Lourdes Quest'
  const html = ReactDOMServer.renderToStaticMarkup(
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>{title}</title>
        {stylesheets.map((asset, index) => (
          <link key={index} rel='stylesheet' type='text/css' href={asset} />
        ))}
      </head>
      <body>
        <div id='content' dangerouslySetInnerHTML={{__html: content}} />
        <script id='initial-state'
          type='application/json'
          dangerouslySetInnerHTML={{__html: initialState}}
        />
        {scripts.map((asset, index) => (
          <script key={index} type='text/javascript' src={asset} />
        ))}
      </body>
    </html>
  )
  return callback(null, '<!DOCTYPE html>\n' + html)
}

function getAssetPaths (webpackStats, chunckName) {
  const stats = webpackStats.toJson()
  const assets = stats.assetsByChunkName[chunckName]
  let publicPath = stats.publicPath
  if (publicPath.length && !publicPath.endsWith('/')) {
    publicPath += '/'
  }
  return assets.map((asset) => publicPath + asset)
}

function safeStringify (obj) {
  return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}
