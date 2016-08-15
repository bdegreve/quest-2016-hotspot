import axios from 'axios'
import store from 'store'

export default () => {
  return axios.get('/api/players')
  .then((res) => res.data)
  .then((data) => {
    store.dispatch({
      type: 'SET_PLAYERS',
      value: data
    })
    return data
  })
  .catch((err) => {
    console.error(err)
  })
}
