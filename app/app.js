import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, RouterContext, browserHistory, match, createMemoryHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import routes from './routes'
import reducers from './reducers'
import './app.less'

const rootReducer = combineReducers(Object.assign({}, reducers, {
  routing: routerReducer
}))

if (typeof document !== 'undefined') {
  const initialStateElement = document.getElementById('initial-state')
  const initialState = initialStateElement ? JSON.parse(initialStateElement.innerHTML) : null
  const store = createStore(rootReducer, initialState)

  const history = syncHistoryWithStore(browserHistory, store)
  match({routes, history}, (_, redirectLocation, renderProps) => {
    ReactDOM.render(
      <Provider store={store}>
        <Router {...renderProps} />
      </Provider>,
      document.getElementById('content')
    )
  })
}

export default (locals, callback) => {
  // locals.assets only contain javascript assets. we want all of them!
  const assets = getAssetPaths(locals.webpackStats, 'main') // same main as in webpack.config.js' entry
  const scripts = assets.filter((asset) => /\.jsx?$/.test(asset))
  const stylesheets = assets.filter((asset) => /\.css$/.test(asset))

  const store = createStore(rootReducer)
  const history = syncHistoryWithStore(createMemoryHistory(), store)
  const location = history.createLocation(locals.path)

  return match({routes, location, history}, (err, redirectLocation, renderProps) => {
    if (err) {
      throw err
    }
    if (redirectLocation) {
      throw new Error(`app.js: Cannot deal with redirections yet for ${locals.path}`)
    }
    if (!renderProps) {
      throw new Error(`app.js: Route ${locals.path} not found.`)
    }

    // don't render everything with renderToString.
    // see http://jeffhandley.github.io/QuickReactions/20-final-cleanup
    // (via http://stackoverflow.com/a/37621838)

    const content = ReactDOMServer.renderToString(
      <Provider store={store}>
        <RouterContext {...renderProps} />
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
  })
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
