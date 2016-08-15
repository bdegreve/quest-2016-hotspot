import React from 'react'
import { connect } from 'react-redux'

import PuzzleLock from 'pages/puzzle-lock'
import HolyGrail from 'pages/holy-grail'
import Timer from 'containers/timer'
import Loading from 'components/loading'
import stopTheClock from 'api/stop-the-clock'

import style from './style.less'

class Layout extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps.unlocked && !this.props.unlocked) {
      const {selected, players} = this.props.players
      if (selected > 0 && selected < players.length) {
        stopTheClock(players[selected])
      }
    }
  }

  render () {
    const {loaded, unlocked} = this.props
    if (!loaded) {
      return <Loading />
    }
    return <div className={style.wrapper}>
      <div className={style.timer}>
        <Timer />
      </div>
      <div className={style.main}>
        <div className={style.child}>
          {unlocked ? <HolyGrail /> : <PuzzleLock />}
        </div>
      </div>
    </div>
  }
}

const mapStateToProps = (state) => ({
  unlocked: state['15-puzzle'].solved,
  loaded: state.timer.started && state.players.loaded,
  players: state.players
})

export default connect(mapStateToProps)(Layout)
