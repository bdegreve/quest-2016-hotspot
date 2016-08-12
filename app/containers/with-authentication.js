import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

export default function (Component) {
  class Authenticated extends React.Component {
    componentWillMount () {
      console.log('been here', this.props.isAuthenticated)
      this._verify()
    }

    componentWillReceiveProps (nextProps) {
      this._verify()
    }

    render () {
      return this.props.isAuthenticated
        ? <Component {...this.props} />
        : null
    }

    _verify () {
      console.log('been here', this.props.dispatch)
      if (!this.props.isAuthenticated) {
        const redirect = this.props.location.pathname
        console.log('done that', redirect)
        this.props.dispatch(push(`/login?next=${redirect}`))
      }
    }
  }

  const mapStateToProps = (state) => ({
    isAuthenticated: state['15-puzzle'].solved
  })

  return connect(mapStateToProps)(Authenticated)
}
