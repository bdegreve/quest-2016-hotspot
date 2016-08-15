import React from 'react'

import Dimensions from 'react-dimensions'

const View = ({width}) =>
  <video width={width} controls autoplay>
    <source src={require('media/lourdes-eindfilm-android.mp4')} type='video/mp4' />
    Your browser does not support HTML5 video tag.
  </video>

export default Dimensions()(
  class extends React.Component {
    render () {
      const { containerWidth } = this.props
      return <View width={containerWidth} />
    }
  }
)
