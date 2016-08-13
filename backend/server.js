var express = require('express')

var app = express()

app.set('port', (process.env.PORT || 3000))

app.get('/timer', function (req, res) {
  res.setHeader('Cache-Control', 'no-cache')
  res.json({
    now: Date.now()
  })
})

app.get('/groups', function (req, res) {

})

app.post('/group', function  (req, res) {
  
})

app.listen(app.get('port'), function () {
  console.log('Listening at http://localhost:' + app.get('port'))
})
