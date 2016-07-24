import React from 'react'
import FlipMove from 'react-flip-move'

import style from './style.less'

// classes instead of pure functions because react-flip-move demands it.

class Tile extends React.Component {
  render () {
    const {value, onClick} = this.props
    return value
      ? <div className={style.tile} onClick={onClick}>{value}</div>
      : <div className={style.square} />
  }
}

Tile.propTypes = {
  value: React.PropTypes.number,
  onClick: React.PropTypes.func.isRequired
}

class FifteenPuzzle extends React.Component {
  render () {
    const {tiles, onTileClick} = this.props
    return (
      <FlipMove duration={150} className={style.container}>
          {tiles.map(({value}) => (
            <Tile
              key={value}
              value={value}
              onClick={() => onTileClick(value)} />
          ))}
      </FlipMove>
    )
  }
}

FifteenPuzzle.propTypes = {
  tiles: React.PropTypes.arrayOf(React.PropTypes.object),
  onTileClick: React.PropTypes.func.isRequired
}

export default FifteenPuzzle
