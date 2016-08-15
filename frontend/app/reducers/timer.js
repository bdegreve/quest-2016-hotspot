const INITIAL_STATE = {
  started: null
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'TIMER_STARTED':
      if (action.value) {
        const { started, now } = action.value
        const correction = now ? (now - Date.now()) : 0
        return Object.assign({}, state, {
          started,
          correction
        })
      }
      return state

    default:
      return state
  }
}
