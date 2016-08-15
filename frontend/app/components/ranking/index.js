import React from 'react'

import humanizeTime from 'lib/humanize-time'

import style from './style.less'

export default ({timer, players}) => {
  const started = timer.started
  const player = players.players[players.selected]

  const stoppedPlayers = players.players.filter((p) => p.stopped)
  stoppedPlayers.sort((a, b) => {
    if (a.stopped < b.stopped) {
      return -1
    }
    if (b.stopped < a.stopped) {
      return 1
    }
    return 0
  })

  return <div>
    <h2>Dag rangschikking</h2>
    <ol>
      {stoppedPlayers.map((p) =>
        <li key={p.name} className={p.name === player.name ? style.this : style.other}>
          {p.name} - {humanizeTime(p.stopped - started)}
        </li>
      )}
    </ol>
  </div>
}
