import React from 'react'

import style from './style.less'

export default ({timer, players}) => {
  const stopped = checkStopped(players)
  return <Timer {...timer} {...stopped} />
}

function checkStopped ({selected, players}) {
  if (selected < 1 || selected >= players.length) {
    return null
  }
  const player = players[selected]
  if (!player.stopped) {
    return null
  }
  const ranking = players.reduce((rank, p) => {
    if (p.name !== player.name && p.stopped && p.stopped < player.stopped) {
      return rank + 1
    }
    return rank
  }, 1)
  return {
    stopped: player.stopped,
    ranking
  }
}

class Timer extends React.Component {
  componentDidMount () {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50)
  }

  componentWillUnmount () {
    clearInterval(this.forceUpdateInterval)
  }

  render () {
    const { started, stopped, ranking } = this.props
    const now = stopped || Date.now()
    const elapsed = started ? (now - started) : null
    return <div className={style.wrapper}>
      <TimeDelta millis={elapsed} />
      <Ranking ranking={ranking} />
    </div>
  }
}

const Ranking = ({ranking}) => {
  if (!ranking) {
    return null
  }
  const ste = ranking > 1 ? 'de' : 'ste'
  return <p className={style.ranking}>
    {`Jullie zijn de ${ranking}${ste} in dag rankschikking`}
  </p>
}

const TimeDelta = ({millis}) =>
  <p className={style.timer}>{_timeString(millis)}</p>

function _timeString (millis) {
  if (millis === null) {
    return '...'
  }
  millis = millis | 0
  let secs = (millis / 1000) | 0
  let mins = (secs / 60) | 0
  let hours = _padded((mins / 60) | 0)
  secs = _padded((secs % 60) | 0)
  mins = _padded((mins % 60) | 0)

  return `${hours}:${mins}:${secs}`
}

function _padded (x) {
  const s = x.toString()
  return s.length === 1 ? `0${s}` : s
}
