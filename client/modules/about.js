var h = require('hyperscript')
var blobUrl = require('./helpers').bloburl
var markdown = require('./helpers').markdown
var avatar = require('./avatar')

exports.gives = { 
  message_content_mini: true
}

exports.create = function (api) {
  exports.message_content_mini = function (msg) {
    var about = msg.value.content
    var id = msg.value.content.about
    if (msg.value.content.type == 'description') {
      return h('span', markdown('**Description:** ' + about.description))
    }
    if (msg.value.content.type == 'loc') {
      return h('span', h('strong', 'Location: '), about.loc)
    } 
    if (msg.value.content.type == 'about') {
      if (msg.value.content.name) {
        return h('span', 'identifies as ', about.name)
      }
      if (msg.value.content.image) {
        return h('span', 'identifies as ', h('img.avatar--thumbnail', {src: blobUrl(about.image)}))
      }
    } else { return }
  }
  return exports
}
