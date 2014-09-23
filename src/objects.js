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

  while (++index < len) {
    key   = ks[index]
    accum = fn(accum, obj[key])  
  }
  return accum
}

var map = function (fn, obj) {
  return reduce(mapping(fn, cons), [], obj)
}

var filter = curry(function (predFn, ar) {
  return reduce(filtering(predFn, cons), [], obj)
})

object.keys   = keys
object.cons   = cons
object.map    = map
object.reduce = reduce
object.filter = filter

module.exports = object
