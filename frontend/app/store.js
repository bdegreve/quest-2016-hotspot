import { createStore, combineReducers } from 'redux'

import reducers from './reducers'

function getInitialState () {
  if (typeof document === 'undefined') {
    return undefined
  }
  const initialState = document.getElementById('initial-state')
  if (!initialState) {
    return undefined
  }
  return JSON.parse(initialState.innerHTML)
}

const rootReducer = combineReducers(reducers)
const initialState = getInitialState()

export default createStore(rootReducer, initialState)
