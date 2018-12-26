import React from 'react'

import humanizeTime from 'lib/humanize-time'

import style from './style.less'

export default ({ timer, players }) => {
  const stopped = checkStopped(players)
  return <Timer {...timer} stopped={stopped} />
}

function checkStopped ({ selected, players }) {
  if (selected < 1 || selected >= players.length) {
    return null
  }
  const player = players[selected]
  return player.stopped
}

class Timer extends React.Component {
  componentDidMount () {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50)
  }

  componentWillUnmount () {
    clearInterval(this.forceUpdateInterval)
  }

  render () {
    const { started, stopped, correction } = this.props
    const now = stopped || (Date.now() + correction)
    const elapsed = started ? (now - started) : null
    return <div className={style.wrapper}>
      <TimeDelta millis={elapsed} />
    </div>
  }
}

const TimeDelta = ({ millis }) =>
  <p className={style.timer}>{humanizeTime(millis)}</p>
