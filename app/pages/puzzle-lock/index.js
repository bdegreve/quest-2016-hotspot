import React from 'react'
import Dimensions from 'react-dimensions'

import Puzzle from 'containers/15-puzzle'
import Timer from 'components/timer'

import style from './style.less'

const PuzzleWrapper = Dimensions()(
  class extends React.Component {
    render () {
      const { containerWidth, containerHeight } = this.props
      const size = Math.min(containerWidth, containerHeight)
      return <Puzzle size={size} />
    }
  }
)

const since = Date.now()

export default () =>
  <div className={style.wrapper}>
    <Timer since={since} />
    <PuzzleWrapper />
  </div>
