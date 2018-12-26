import axios from 'axios'
import store from 'store'

export default () =>
  axios.get('/api/timer')
    .then((res) => res.data)
    .then((data) => {
      store.dispatch({
        type: 'TIMER_STARTED',
        value: data
      })
      return data
    })
    .catch((err) => {
      console.error(err)
    })
