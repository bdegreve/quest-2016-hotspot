import React from 'react'
import { connect } from 'react-redux'

import Dimensions from 'react-dimensions'

import Puzzle from 'containers/15-puzzle'
import Timer from 'components/timer'
import GroupSelect from 'containers/group-select'

import style from './style.less'

const PuzzleWrapper = Dimensions()(
  class extends React.Component {
    render () {
      const { containerWidth, containerHeight, hasGroup } = this.props
      const size = Math.min(containerWidth, containerHeight)
      if (!hasGroup) {
        return <p style={{width: size, height: size}}>
          Selecteer je groep...
        </p>
      }
      return <Puzzle size={size} {...this.props} />
    }
  }
)

const since = Date.now()

const View = ({groups}) =>
  <div className={style.wrapper}>
    <div className={style.select}>
      <GroupSelect />
    </div>
    <div className={style.timer}>
      <Timer since={since} />
    </div>
    <div className={style.puzzle}>
      <div className={style.child}>
        <PuzzleWrapper hasGroup={groups.selected} />
      </div>
    </div>
  </div>

export default connect((state) => state)(View)
