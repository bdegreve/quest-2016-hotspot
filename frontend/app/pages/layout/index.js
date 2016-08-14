import React from 'react'
import { connect } from 'react-redux'

import PuzzleLock from 'pages/puzzle-lock'
import HolyGrail from 'pages/holy-grail'

const View = ({unlocked}) => unlocked
  ? <HolyGrail />
  : <PuzzleLock />

const mapStateToProps = (state) => ({
  unlocked: state['15-puzzle'].solved
})

export default connect(mapStateToProps)(View)
