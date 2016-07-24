import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Layout from 'pages/layout'
import PuzzleLock from 'pages/puzzle-lock'

// not a function this time.
export default (
  <Route path='/' component={Layout}>
    <IndexRoute component={PuzzleLock} />
  </Route>
)
