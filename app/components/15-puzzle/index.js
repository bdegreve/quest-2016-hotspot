import React from 'react'

import style from './style.less'

const Tile = ({value, onClick}) => (
  value
    ? <div className={style.tile} onClick={onClick}>{value}</div>
    : <div className={style.square} />
)

Tile.propTypes = {
  value: React.PropTypes.number,
  onClick: React.PropTypes.func.isRequired
}

const FifteenPuzzle = ({tiles, onTileClick}) => (
  <div className={style.container}>
    {tiles.map(({value}) => (
      <Tile
        key={value}
        value={value}
        onClick={() => onTileClick(value)} />
    ))}
  </div>
)

FifteenPuzzle.propTypes = {
  tiles: React.PropTypes.arrayOf(React.PropTypes.object),
  onTileClick: React.PropTypes.func.isRequired
}

export default (props) => props.tiles ? <FifteenPuzzle {...props} /> : null
