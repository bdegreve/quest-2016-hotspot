const MOVE_TILE = 'MOVE_TILE'
const N = 4

export const initialState = {
  tiles: [...Array(N * N).keys()].map((_, index) => ({
    value: index || null
  }))
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

export default function (state = initialState, action) {
  switch (action.type) {
    case MOVE_TILE:
      if (action.value) {
        const {tiles} = state
        const index = tiles.findIndex((tile) => tile.value === action.value)
        const index2 = findSwapIndex(tiles, index)
        console.log('been here', state, index, index2)
        if (index2 !== null) {
          const newTiles = tiles.slice()
          newTiles[index] = tiles[index2]
          newTiles[index2] = tiles[index]
          return Object.assign({}, state, {
            tiles: newTiles
          })
        }
      }
      return state

    default:
      return state
  }
}
