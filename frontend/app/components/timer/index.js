import React from 'react'

import style from './style.less'

export default class Timer extends React.Component {
  componentDidMount () {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50)
  }

  componentWillUnmount () {
    clearInterval(this.forceUpdateInterval)
  }

  render () {
    const elapsed = Date.now() - this.props.since
    return <div className={style.wrapper}>
      <TimeDelta millis={elapsed} />
    </div>
  }
}

const TimeDelta = ({millis}) =>
  <p className={style.timer}>{_timeString(millis)}</p>

function _timeString (millis) {
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