var path = require('path')
var fs = require('fs')
var express = require('express')
var bodyParser = require('body-parser')

var PATH = path.join(__dirname, 'db.json')

var app = express()

app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.json())

function load (cb) {
  var data = fs.readFileSync(PATH)
  return JSON.parse(data)
}

function save (data) {
  fs.writeFileSync(PATH, JSON.stringify(data, null, 2))
}

app.get('/timer', function (req, res) {
  res.setHeader('Cache-Control', 'no-cache')
  var data = load()
  res.json({
    started: new Date(data.started).getTime(),
    now: Date.now()
  })
})

app.get('/players', function (req, res) {
  res.setHeader('Cache-Control', 'no-cache')
  var data = load()
  res.json({
    players: data.players
  })
})

app.post('/players/stop-the-clock', function (req, res) {
  res.setHeader('Cache-Control', 'no-cache')

  console.log('---------')
  var data = load()

  var players = data.players.map(function (p) {
    if (p.name === req.body.name && !p.stopped) {
      p.stopped = Date.now()
    }
    return p
  })

  data.players = players
  save(data)

  res.json({
    players: players
  })
})

app.listen(app.get('port'), function () {
  console.log('Listening at http://localhost:' + app.get('port'))
})
