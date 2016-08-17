import React from 'react'

import Video from 'components/video'
import Ranking from 'containers/ranking'

import style from './style.less'

export default () =>
  <div className={style.wrapper}>
    <Video />
    <p className={style.quote}>
      Lorum Ipsum
    </p>
    <Ranking />
    <div className={style.ksadegraal}>
      <img src={require('./ksadegraal.png')} />
      <p>KSA De Graal zoekt nieuwe leiding. Meld je aan!</p>
    </div>
  </div>
