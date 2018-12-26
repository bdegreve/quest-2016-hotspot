import React from 'react'

export default ({ players, selected, onSelect }) =>
  <select
    value={selected || ''}
    onChange={(ev) => onSelect(ev.target.value)}
  >
    {players.map((player, index) =>
      <option key={index} value={index}>
        {player.name}
      </option>
    )}
  </select>
