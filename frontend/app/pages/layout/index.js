import React from 'react'
import { connect } from 'react-redux'

import PuzzleLock from 'pages/puzzle-lock'
import HolyGrail from 'pages/holy-grail'
import Timer from 'containers/timer'
import Loading from 'components/loading'

import style from './style.less'

const View = ({loaded, unlocked}) => {
  if (!loaded) {
    return <Loading />
  }
  return <div className={style.wrapper}>
    <div className={style.timer}>
      <Timer />
    </div>
    <div className={style.main}>
      <div className={style.child}>
        {!unlocked ? <HolyGrail /> : <PuzzleLock />}
      </div>
    </div>
  </div>
}

const mapStateToProps = (state) => ({
  unlocked: state['15-puzzle'].solved,
  loaded: state.timer.started && state.players.loaded
})

export default connect(mapStateToProps)(View)
