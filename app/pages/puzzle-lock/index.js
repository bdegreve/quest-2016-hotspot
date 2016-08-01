import React from 'react'
import Dimensions from 'react-dimensions'

import Puzzle from 'containers/15-puzzle'

const PuzzleWrapper = Dimensions()(
  class extends React.Component {
    render () {
      const { containerWidth, containerHeight } = this.props
      const size = Math.min(containerWidth, containerHeight)
      return <Puzzle size={size} />
    }
  }
)

export default PuzzleWrapper
