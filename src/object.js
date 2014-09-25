var fns         = require("./functions")
var transducers = require("./transducers")
var mapping     = transducers.mapping
var filtering   = transducers.filtering
var curry       = fns.curry
var object      = {}

var keys = Object.keys

var cons = function (host, obj) {
  var index = -1
  var ks    = keys(obj)
  var len   = ks.length
  var key

  while (++index < len) {
    key       = ks[index]
    host[key] = obj[key]
  }
  return host
}

var reduce = function (fn, accum, obj) {
  var index = -1
  var ks    = keys(obj)
  var len   = ks.length
  var key
  var kv

  while (++index < len) {
    key     = ks[index]
    kv      = {}
    kv[key] = obj[key]
    accum   = fn(accum, kv)
  }
  return accum
}

var map = curry(function (fn, obj) {
  return reduce(mapping(fn, cons), {}, obj)
})

var filter = curry(function (predFn, obj) {
  return reduce(filtering(predFn, cons), {}, obj)
})

var has = curry(function (props, e) {
  var res = true

  for (var i = 0; i < props.length; ++i) {
    res = res && e.hasOwnProperty(props[i])
  }
  return res
})

object.keys   = keys
object.cons   = cons
object.map    = map
object.reduce = reduce
object.filter = filter
object.has    = has

module.exports = object
