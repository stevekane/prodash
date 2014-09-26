var transducers = require("./transducers")
var fns         = require("./functions")
var mapping     = transducers.mapping
var filtering   = transducers.filtering
var catting     = transducers.catting
var mapcatting  = transducers.mapcatting
var curry       = fns.curry
var compose     = fns.compose
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

//TODO should probably have recursive def for arbitrary nesting
var flatten = function (listOfLists) {
  var res = [] 

  for (var i = 0; i < listOfLists.length; ++i) {
    for (var j = 0; j < listOfLists[i].length; ++j) {
      res.push(listOfLists[i][j])
    } 
  }
  return res
}

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

var mapcattingA = mapcatting(reduce, [], map)

var cattingA = catting(reduce, [])

array.cons         = cons
array.reduce       = reduce
array.map          = map
array.filter       = filter
array.find         = find
array.forEach      = forEach
array.flatten      = flatten
array.mapcattingA  = mapcattingA
array.cattingA     = cattingA

module.exports = array
