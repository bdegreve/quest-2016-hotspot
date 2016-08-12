import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Layout from 'pages/layout'
import PuzzleLock from 'pages/puzzle-lock'
import HolyGrail from 'pages/holy-grail'
import withAuth from 'containers/with-authentication'

// not a function this time.
export default (
  <Route path='/' component={Layout}>
    <IndexRoute component={withAuth(HolyGrail)} />
    <Route path='login' component={PuzzleLock} />
  </Route>
)
