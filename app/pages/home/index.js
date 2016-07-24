import React from 'react'

import Puzzle from 'components/15-puzzle'

const tiles = [...Array(16).keys()].map((_, index) => ({
  value: index ? index : null,
}))

export default () => (
  <Puzzle tiles={tiles} />
)
