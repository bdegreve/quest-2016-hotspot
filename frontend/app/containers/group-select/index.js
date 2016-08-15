import { connect } from 'react-redux'

import View from 'components/select'

const mapStateToProps = (state) => state.players

const mapDispatchToProps = (dispatch) => ({
  onSelect: (value) => dispatch({
    type: 'SELECT_PLAYER',
    value
  })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View)
