import React from 'react'

export default ({groups, selected, onSelect}) =>
  <select
    value={selected || ''}
    onChange={(ev) => onSelect(ev.target.value)}
  >
    {groups.map((group, index) =>
      <option key={index} value={index}>
        {group}
      </option>
    )}
  </select>
