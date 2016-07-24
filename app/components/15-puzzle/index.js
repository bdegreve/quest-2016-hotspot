import React from 'react'

import style from './style.less'

const Tile = ({value, onClickTile}) => {
  if (!value) {
    return <div className={style.square} />
  }
  return (
    <div className={style.tile} onClick={onClickTile}>
      {value}
    </div>
  )
}

export default ({tiles, onClickTile}) => (
  <div className={style.container}>
    {tiles.map(({value}) => (
      <Tile key={value} value={value} onClickTile={onClickTile} />
    ))}
  </div>
)

