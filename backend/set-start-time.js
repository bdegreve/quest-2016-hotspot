var path = require('path')
var lowdb = require('lowdb')

var db = lowdb(path.join(__dirname, 'db.json'))

db.set('started', Date.now()).value()
