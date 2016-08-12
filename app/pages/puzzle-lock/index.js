import React from 'react'
import Dimensions from 'react-dimensions'

import Puzzle from 'containers/15-puzzle'
import Timer from 'components/timer'
import GroupSelect from 'components/group-select'

import style from './style.less'

const PuzzleWrapper = Dimensions({
  className: style.child
})(
  class extends React.Component {
    render () {
      const { containerWidth, containerHeight } = this.props
      const size = Math.min(containerWidth, containerHeight)
      return <Puzzle size={size} {...this.props} />
    }
  }
)

const since = Date.now()

export default () =>
  <div className={style.wrapper}>
    <GroupSelect className={style.select} />
    <div className={style.timer}>
      <Timer since={since} />
    </div>
    <div className={style.puzzle}>
      <PuzzleWrapper />
    </div>
  </div>
