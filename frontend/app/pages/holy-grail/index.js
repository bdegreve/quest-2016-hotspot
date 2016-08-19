import React from 'react'

import Video from 'components/video'
import Ranking from 'containers/ranking'

import style from './style.less'

export default () =>
  <div className={style.wrapper}>
    <p className={style.quote}>
      Waar verstopte Jacomet De Graal?
    </p>
    <Video />
    <p className={style.quote}>
      Testis unus, testis nullus
    </p>
    <Ranking />
    <div className={style.ksadegraal}>
      <img src={require('./ksadegraal.png')} />
      <p>KSA De Graal werft aan! Lorum Ipsum!</p>
    </div>
  </div>
