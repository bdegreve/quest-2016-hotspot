const INITIAL_STATE = {
  selected: 0,
  players: [
    {
      name: 'Selecteer je groep ...'
    }
  ],
  loaded: false
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SELECT_PLAYER':
      if (action.value) {
        const index = parseInt(action.value)
        return Object.assign({}, state, {
          selected: isNaN(index) ? 0 : index
        })
      }
      return state

    case 'LOAD_PLAYERS':
      if (action.value) {
        const players = [
          ...INITIAL_STATE.players,
          ...action.value.players]
        return Object.assign({}, state, {
          players,
          loaded: true
        })
      }
      return state

    default:
      return state
  }
}
