import { connect } from 'react-redux'

import View from 'components/ranking'

const mapStateToProps = (state) => ({
  timer: state.timer,
  players: state.players
})

export default connect(
  mapStateToProps
)(View)
