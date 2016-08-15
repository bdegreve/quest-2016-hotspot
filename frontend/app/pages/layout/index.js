import React from 'react'
import { connect } from 'react-redux'

import PuzzleLock from 'pages/puzzle-lock'
import HolyGrail from 'pages/holy-grail'
import Loading from 'components/loading'

const View = ({loaded, unlocked}) => {
  if (!loaded) {
    return <Loading />
  }
  return unlocked ? <HolyGrail /> : <PuzzleLock />
}

const mapStateToProps = (state) => ({
  unlocked: state['15-puzzle'].solved,
  loaded: state.timer.started && state.players.loaded
})

export default connect(mapStateToProps)(View)
