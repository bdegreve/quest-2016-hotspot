import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Layout from 'pages/layout'
import Home from 'pages/home'

// not a function this time.
export default (
  <Route path='/' component={Layout}>
    <IndexRoute component={Home} />
  </Route>
)
