import React from 'react'

import Video from 'components/video'
import Ranking from 'containers/ranking'

import style from './style.less'

export default () =>
  <div className={style.wrapper}>
    <Video />
    <Ranking />
  </div>
