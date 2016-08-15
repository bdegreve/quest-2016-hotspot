import { connect } from 'react-redux'

import View from 'components/timer'

const mapStateToProps = (state) => state.timer

export default connect(
  mapStateToProps
)(View)
