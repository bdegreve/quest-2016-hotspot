import React from 'react'

import Timer from 'containers/timer'
import Video from 'components/video'

import style from './style.less'

export default () =>
  <div className={style.wrapper}>
    <div className={style.timer}>
      <Timer />
    </div>
    <div className={style.main}>
      <div className={style.child}>
        <Video />
      </div>
    </div>
  </div>
