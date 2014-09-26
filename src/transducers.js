var fns      = require("./functions")
var hasKey   = fns.hasKey
var curry    = fns.curry
var compose  = fns.compose
var extend   = fns.extend
var push     = fns.push
var isArray  = fns.isArray
var isObject = fns.isObject
var trans    = {}

/*
 * TODO: implement reduce for types and possible base reduce for adding types?
 *       implement map and filter generically in terms of reduce
 *       implement cons for types
 *       restructure code to include special cases or possibly eliminate?
 *       add tests for type check functions in functions.js
 *       add tests for new functions and add tests for any missing functions
 */

var reduceArray = function (fn, accum, arr) {
  var index = -1
  var len   = arr.length

  while (++index < len) {
    accum = fn(accum, arr[index])
  }
  return accum
}

var reduceObject = function (fn, accum, obj) {
  var index = -1
  var ks    = Object.keys(obj)
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

var consArray = push

var consObject = extend

var reduce = curry(function (fn, accum, col) {
  if      (isArray(col))            return reduceArray(fn, accum, col)
  else if (hasKey(col, "__reduce")) return col.__reduce(fn, accum, col)
  else if (isObject(col))           return reduceObject(fn, accum, col)
  else                              throw new Error("unknown colection type")
})

var cons = curry(function (col, el) {
  if      (isArray(col))          return consArray(col, el)
  else if (hasKey(col, "__cons")) return col.__cons(col, el)
  else if (isObject(col))         return consObject(col, el)
  else                            throw new Error("unknown colection type")
})

var empty = function (col) {
  if      (isArray(col))           return []
  else if (hasKey(col, "__empty")) return col.__empty()
  else if (isObject(col))          return {}
  else                             throw new Error("unknown colection type")
}

var mapping = curry(function (transFn, stepFn) {
  return function (acc, x) {
    return stepFn(acc, transFn(x))
  }
})

var filtering = curry(function (predFn, stepFn) {
  return function (acc, x) {
    return predFn(x) ? stepFn(acc, x) : acc 
  }
})

var map = curry(function (fn, col) {
  return reduce(mapping(fn, cons), empty(col), col)
})

var filter = curry(function (predFn, col) {
  return reduce(filtering(predFn, cons), empty(col), col)
})

var cat = function (fn) {
  return function (acc, x) {
    return reduce(fn, acc, x) 
  }
}

trans.reduce     = reduce
trans.cons       = cons
trans.empty      = empty
trans.mapping    = mapping
trans.cat        = cat
trans.filtering  = filtering
module.exports   = trans
