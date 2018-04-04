var fs = require('fs')
var path = require('path')
var ssbKeys = require('ssb-keys')
var stringify = require('pull-stringify')
var open = require('opn')
var home = require('os-homedir')()

var config = {
  name: 'cora',
  local: 'true',
  port: 3232,
  path: path.join(home, '.cora'),
  ws: { port: 3222 },
  caps: {
    shs: 'c1YpUTIUNKTb8vT58DfkOP5Avu/kOwpc3FJtVelLabM=',
    sign: null
  }
}

config.keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))

var coraClient = fs.readFileSync(path.join('./build/index.html'))

var manifestFile = path.join(config.path, 'manifest.json')

var createSbot = require('scuttlebot')
  .use(require('scuttlebot/plugins/master'))
  .use(require('scuttlebot/plugins/gossip'))
  .use(require('scuttlebot/plugins/replicate'))
  .use(require('ssb-friends'))
  .use(require('ssb-blobs'))
  .use(require('ssb-query'))
  .use(require('ssb-links'))
  .use(require('ssb-ebt'))
  .use(require('scuttlebot/plugins/invite'))
  .use(require('scuttlebot/plugins/local'))
  .use(require('decent-ssb/plugins/ws'))
  .use({
    name: 'serve',
    version: '1.0.0',
    init: function (sbot) {
      sbot.ws.use(function (req, res, next) {
        var send = {} 
        send = config
        delete send.keys // very important to keep this, as it removes the server keys from the config before broadcast
        send.address = sbot.ws.getAddress()
        if(req.url == '/')
          res.end(coraClient)
        if(req.url == '/get-config')
          res.end(JSON.stringify(send))
        else next()
      })
    }
  })

open('http://localhost:' + config.ws.port, {wait: false})

var server = createSbot(config)

fs.writeFileSync(manifestFile, JSON.stringify(server.getManifest(), null, 2))

