const MOVE_TILE = 'MOVE_TILE'
const N = 4

// Melencolia I ;-)
const INITIAL = [
  null, 3, 2, 13,
  5, 10, 11, 8,
  9, 6, 7, 12,
  4, 15, 14, 1
]

export const initialState = {
  tiles: INITIAL.map((value) => ({
    value
  })),
  solved: false
}

const index2ij = (index) => ({
  i: (index % N) | 0,
  j: (index / N) | 0
})

const ij2index = (i, j) => (j * N + i) | 0

const findSwapIndex = (tiles, index) => {
  const {i, j} = index2ij(index)
  if (i > 0) {
    const index2 = ij2index(i - 1, j)
    if (!tiles[index2].value) {
      return index2
    }
  }
  if (i < N - 1) {
    const index2 = ij2index(i + 1, j)
    if (!tiles[index2].value) {
      return index2
    }
  }
  if (j > 0) {
    const index2 = ij2index(i, j - 1)
    if (!tiles[index2].value) {
      return index2
    }
  }
  if (j < N - 1) {
    const index2 = ij2index(i, j + 1)
    if (!tiles[index2].value) {
      return index2
    }
  }
  return null
}

const isSolved = (tiles) => tiles.every(({value}, index) => (
  value === (index < (tiles.length - 1) ? (index + 1) : null) 
))

export default function (state = initialState, action) {
  switch (action.type) {
    case MOVE_TILE:
      if (action.value) {
        const {tiles} = state
        const index = tiles.findIndex((tile) => tile.value === action.value)
        const index2 = findSwapIndex(tiles, index)
        if (index2 !== null) {
          const newTiles = tiles.slice()
          newTiles[index] = tiles[index2]
          newTiles[index2] = tiles[index]
          return Object.assign({}, state, {
            tiles: newTiles,
            solved: isSolved(newTiles)
          })
        }
      }
      return state

    default:
      return state
  }
}