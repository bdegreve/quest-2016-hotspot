import { connect } from 'react-redux'

import View from 'components/select'

const mapStateToProps = (state) => state.groups

const mapDispatchToProps = (dispatch) => ({
  onSelect: (value) => dispatch({
    type: 'SELECT_GROUP',
    value
  })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View)
