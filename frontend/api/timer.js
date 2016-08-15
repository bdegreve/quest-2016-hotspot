import axios from 'axios'
import store from 'store'

export default () =>
  axios.get('/api/timer')
  .then((res) => {
    store.dispatch({
      type: 'SET_STARTED',
      users: res.data
    });
    return res
  })
  .catch((err) => {
    console.error(err)
  })
