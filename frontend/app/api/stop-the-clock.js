import axios from 'axios'
import store from 'store'

export default (player) => {
  return axios.post('/api/players/stop-the-clock', player)
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
