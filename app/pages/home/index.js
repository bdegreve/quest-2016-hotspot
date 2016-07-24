import React from 'react'
import { connect } from 'react-redux'

import Puzzle from 'containers/15-puzzle'

const Page = ({solved}) => (
  <div>
    <h1>Los de puzzel op</h1>
    <Puzzle />
    <p>{solved ? 'Congrats' : 'Still work to do ...'}</p>
  </div>
)
const mapStateToProps = (state) => ({
  solved: state['15-puzzle'].solved
})

export default connect(mapStateToProps)(Page)
