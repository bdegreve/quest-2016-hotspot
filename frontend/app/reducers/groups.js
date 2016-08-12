const INITIAL_STATE = {
  selected: 0,
  groups: [
    'KSA ...',
    'KSA De Blauwvoet',
    'KSA De Meiskes',
    'KSA De Vlasbloem',
    'KSA Moerkerke',
    'KSA \'s Gravenwinkel',
    'KSA Ten Briel',
    'KSA Tijlsbond',
    'KSA Waregem'
  ]
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SELECT_GROUP':
      if (action.value) {
        const index = parseInt(action.value)
        return Object.assign({}, state, {
          selected: isNaN(index) ? 0 : index
        })
      }
      return state

    default:
      return state
  }
}
