var transducers = require("./transducers")
var fns         = require("./functions")
var mapping     = transducers.mapping
var filtering   = transducers.filtering
var curry       = fns.curry
var array       = {}

var cons = function (ar, x) {
  ar.push(x)
  return ar
}

var reduce = curry(function (fn, accum, ar) {  
  for (var i in ar) {
    accum = fn(accum, ar[i]) 
  }
  return accum
})

var map = curry(function (fn, ar) {
  return reduce(mapping(fn, cons), [], ar)
})

var filter = curry(function (predFn, ar) {
  return reduce(filtering(predFn, cons), [], ar)
})

var find = curry(function (predFn, ar) {
  for (var i in ar) {
    if (predFn(ar[i])) return ar[i] 
  }
  return null
})

array.cons   = cons
array.reduce = reduce
array.map    = map
array.filter = filter
array.find   = find

module.exports = array
