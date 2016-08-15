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

    case 'SET_PLAYERS':
      if (action.value) {
        console.log('SET_PLAYERS', action.value)
        const players = [
          ...INITIAL_STATE.players,
          ...action.value.players]
        return Object.assign({}, state, {
          players,
          loaded: true
        })
      }
      return state

    case 'UPDATE_PLAYER':
      if (action.value) {
        console.log('UPDATE_PLAYER:', action.value)
        const player = action.value
        const {players} = state
        const index = players.findIndex((p) => p.name === player.name)
        if (index < 0) {
          return state
        }
        return Object.assign({}, state, {
          players: [
            ...players.slice(0, index),
            player,
            ...players.slice(index + 1)
          ]
        })
      }
      return state

    default:
      return state
  }
}
