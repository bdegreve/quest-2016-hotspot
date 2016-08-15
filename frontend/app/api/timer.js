import axios from 'axios'
import store from 'store'

export default () =>
  axios.get('/api/timer')
  .then((res) => res.data)
  .then((data) => {
    const started = data.started || Date.now()
    const now = data.now || Date.now()
    const running = now - started
    store.dispatch({
      type: 'TIMER_STARTED',
      value: (Date.now() - running)
    })
    return res
  })
  .catch((err) => {
    console.error(err)
  })
