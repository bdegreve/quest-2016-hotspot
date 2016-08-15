import React from 'react'

import Dimensions from 'react-dimensions'

const View = ({width}) =>
  <video width={width} controls autoPlay>
    <source src={require('media/filmpje.mp4')} type='video/mp4' />
    <source src={require('media/filmpje.webm')} type='video/webm' />
    Shoot, your browser does not support HTML5 video tag :-(
  </video>

export default Dimensions()(
  class extends React.Component {
    render () {
      const { containerWidth } = this.props
      return <View width={containerWidth} />
    }
  }
)
