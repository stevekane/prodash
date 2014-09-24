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
  for (var i = 0; i < ar.length; ++i) {
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
  for (var i = 0; i < ar.length; ++i) {
    if (predFn(ar[i])) return ar[i] 
  }
  return null
})

//TODO: add tests!
var forEach = curry(function (transFn, ar) {
  for (var i = 0; i < ar.length; ++i) {
    transFn(ar[i]) 
  }
})

array.cons    = cons
array.reduce  = reduce
array.map     = map
array.filter  = filter
array.find    = find
array.forEach = forEach

module.exports = array
