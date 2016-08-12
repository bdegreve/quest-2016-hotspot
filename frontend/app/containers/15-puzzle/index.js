import { connect } from 'react-redux'

import View from 'components/15-puzzle'

const mapStateToProps = (state) => state['15-puzzle']

const mapDispatchToProps = (dispatch) => ({
  onTileClick: (value) => dispatch({
    type: 'MOVE_TILE',
    value
  })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View)
