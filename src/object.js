var fns         = require("./functions")
var curry       = fns.curry
var object      = {}

var hasKey = curry(function (key, e) {
  return e[key] !== undefined
})

var hasKeys = curry(function (keys, e) {
  var res = true

  for (var i = 0; i < keys.length; ++i) {
    res = res && hasKey(keys[i], e)
  }
  return res
})

object.hasKey  = hasKey
object.hasKeys = hasKeys

module.exports = object
