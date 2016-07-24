import fifteenPuzzle, { initialState as fifteenInitialState } from './15-puzzle'

const reducers = {
  '15-puzzle': fifteenPuzzle
}

export const initialState = {
  '15-puzzle': fifteenInitialState
}

export default reducers
