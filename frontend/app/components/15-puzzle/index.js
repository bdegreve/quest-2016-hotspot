import React from 'react'
import FlipMove from 'react-flip-move'

import styles from './style.less'

// classes instead of pure functions because react-flip-move demands it.

class Tile extends React.Component {
  render () {
    const {value, onClick, size, index} = this.props
    const style = {
      top: (size * Math.floor(index / 4)) + 'px',
      left: (size * (index % 4)) + 'px',
      width: size + 'px',
      height: size + 'px',
      lineHeight: size + 'px',
      fontSize: Math.floor(size / 2) + 'px',
      borderRadius: Math.floor(size / 20) + 'px'
    }

    return value
      ? <div className={styles.tile} onClick={onClick} style={style}>{value}</div>
      : <div style={style} />
  }
}

Tile.propTypes = {
  value: React.PropTypes.number,
  onClick: React.PropTypes.func.isRequired
}

class FifteenPuzzle extends React.Component {
  render () {
    const {size, tiles, onTileClick} = this.props
    const style = {
      width: size,
      height: size
    }

    return (
      <FlipMove duration={75} className={styles.container} style={style}>
        {tiles.map(({value}, index) => (
          <Tile
            key={value}
            value={value}
            index={index}
            onClick={() => onTileClick(value)}
            size={Math.floor(size / 4)} />
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
