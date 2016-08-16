import React from 'react'

import style from './style.less'

export default () =>
  <video className={style.video} controls autoPlay>
    <source src={require('./filmpje.mp4')} type='video/mp4' />
    <source src={require('./filmpje.webm')} type='video/webm' />
    Shoot, your browser does not support HTML5 video tag :-(
  </video>
