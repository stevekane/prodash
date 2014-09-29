var fns        = require("./functions")
var curry      = fns.curry
var compose    = fns.compose
var instanceOf = fns.instanceOf
var trans      = {}

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

var consArray = function (array, el) {
  array.push(el)
  return array
}

var consObject = function (host, obj) {
  var ks = Object.keys(obj)

  for (var i = 0; i < ks.length; ++i) {
    host[ks[i]] = obj[ks[i]]
  }
  return host
}

var reduce = curry(function (fn, accum, col) {
  if      (instanceOf(Array, col))     return reduceArray(fn, accum, col)
  else if (col.__reduce !== undefined) return col.__reduce(fn, accum, col)
  else if (instanceOf(Object, col))    return reduceObject(fn, accum, col)
  else                                 throw new Error("unknown colection type")
})

var cons = curry(function (col, el) {
  if      (instanceOf(Array, col))   return consArray(col, el)
  else if (col.__cons !== undefined) return col.__cons(col, el)
  else if (instanceOf(Object, col))  return consObject(col, el)
  else                               throw new Error("unknown colection type")
})

var empty = function (col) {
  if      (instanceOf(Array, col))    return []
  else if (col.__empty !== undefined) return col.__empty()
  else if (instanceOf(Object, col))   return {}
  else                                throw new Error("unknown colection type")
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

trans.reduce    = reduce
trans.cons      = cons
trans.empty     = empty
trans.mapping   = mapping
trans.filtering = filtering
trans.map       = map
trans.filter    = filter
trans.cat       = cat
module.exports  = trans
