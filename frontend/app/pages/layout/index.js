import React from 'react'

import style from './style.less'

export default ({children}) => (
  <div className={style.main}>
    {children}
  </div>
)
