import { createStore, combineReducers } from 'redux'

import reducers from './reducers'

const rootReducer = combineReducers(reducers)
const initialState = getInitialState() 

export default createStore(rootReducer, initialState)
 store

  ReactDOM.render(
    <Provider store={store}>
      <Layout />
    </Provider>,
    document.getElementById('content')
  )
