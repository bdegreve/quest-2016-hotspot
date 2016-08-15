const INITIAL_STATE = {
  started: null
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'TIMER_STARTED':
      return Object.assign({}, state, {
        started: action.value
      })

    default:
      return state
  }
}
