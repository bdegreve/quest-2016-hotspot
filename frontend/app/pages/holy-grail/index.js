import React from 'react'

import Video from 'components/video'
import Ranking from 'containers/ranking'

import style from './style.less'

export default () =>
  <div className={style.wrapper}>
    <p className={style.quote}>
      "De Graal dreigt ontmaskerd te worden.<br />
      In het holst van de nacht verzamelen de Rozenkruisers in de tempel
      onder het commissariaat.<br />
      Daar belasten ze Jacomet met de opdracht om de Graal in veiligheid te
      stellen."
    </p>
    <Video />
    <Ranking />
    <div className={style.ksadegraal}>
      <img src={require('./ksadegraal.png')} />
      <p>KSA de Graal werft aan! Meld je aan!</p>
    </div>
  </div>
