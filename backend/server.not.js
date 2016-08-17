var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
var low = require('lowdb')
var fileAsync = require('lowdb/lib/file-async')

var db = low(path.join(__dirname, 'db.json'), {
  storage: fileAsync
})

db.defaults({ 
  started: Date.now(),
  players: [] }
)

var app = express()

app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.json());

app.get('/timer', function (req, res) {
  res.setHeader('Cache-Control', 'no-cache')
  res.json({
    started: new Date(db.get('started').value()).getTime(),
    now: Date.now()
  })
})

app.get('/players', function (req, res) {
  res.setHeader('Cache-Control', 'no-cache')
  res.json({
    players: db.get('players').value()
  })
})

app.post('/players/stop-the-clock', function  (req, res) {
  res.setHeader('Cache-Control', 'no-cache')

  console.log('---------')  
  var player = db.get('players')
    .find({name: req.body.name})
    .value()
  console.log('-- player:', player)
  
  if (!player.stopped) {
    player = db.get('players')
      .find({name: req.body.name})
      .assign({stopped: Date.now()})
      .value()
  }
  console.log('-- player:', player)

  var players = db.get('players').value()
  console.log('-- players:', players)
  
  res.json({
    players: players
  })
})

app.listen(app.get('port'), function () {
  console.log('Listening at http://localhost:' + app.get('port'))
})
