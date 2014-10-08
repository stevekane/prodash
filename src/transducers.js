var fns        = require("./functions")
var curry      = fns.curry
var compose    = fns.compose
var instanceOf = fns.instanceOf
var trans      = {}

var redNoop = function (acc, x) { return x }

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
  if      (instanceOf(Array, col))        return reduceArray(fn, accum, col)
  else if (instanceOf(Float32Array, col)) return reduceArray(fn, accum, col)
  else if (instanceOf(Uint32Array, col))  return reduceArray(fn, accum, col)
  else if (col.__reduce !== undefined)    return col.__reduce(fn, accum, col)
  else if (instanceOf(Object, col))       return reduceObject(fn, accum, col)
  else                                    throw new Error("unknown collection type")
})

var cons = curry(function (col, el) {
  if      (instanceOf(Array, col))   return consArray(col, el)
  else if (col.__cons !== undefined) return col.__cons(col, el)
  else if (instanceOf(Object, col))  return consObject(col, el)
  else                               throw new Error("unknown collection type")
})

var empty = function (col) {
  if      (instanceOf(Array, col))        return []
  else if (instanceOf(Float32Array, col)) return new Float32Array
  else if (instanceOf(Uint32Array, col))  return new Uint32Array
  else if (col.__empty !== undefined)     return col.__empty()
  else if (instanceOf(Object, col))       return {}
  else                                    throw new Error("unknown collection type")
}

var mapping = curry(function (transFn, stepFn) {
  return function (acc, x) {
    return stepFn(acc, transFn(x))
  }
})

var plucking = curry(function (propName, stepFn) {
  return mapping(function (x) { return x[propName] }, stepFn)
})

var filtering = curry(function (predFn, stepFn) {
  return function (acc, x) {
    return predFn(x) ? stepFn(acc, x) : acc 
  }
})

var checking = curry(function (prop, val, stepFn) {
  return filtering(function (x) { return x[prop] === val }, stepFn)
})

//THIS WILL MUTATE THE STRUCTURE PROVIDED TO IT DIRECTLY
var mutating = curry(function (mutFn, stepFn) {
  return function (acc, x) {
    mutFn(x)
    return stepFn(acc, x)
  }
})

var cat = function (fn) {
  return function (acc, x) {
    return reduce(fn, acc, x) 
  }
}

var map = curry(function (fn, col) {
  return reduce(mapping(fn, cons), empty(col), col)
})

var mapcatting = curry(function (transFn, stepFn) {
  return compose([cat, mapping(transFn)])(stepFn)
})

var filter = curry(function (predFn, col) {
  return reduce(filtering(predFn, cons), empty(col), col)
})

var mutate = curry(function (transFn, col) {
  return reduce(transFn(redNoop), undefined, col)
})

var transduce = curry(function (transFn, stepFn, init, col) {
  return reduce(transFn(stepFn), init, col)
})

var sequence = curry(function (transFn, col) {
  return reduce(transFn(cons), empty(col), col)
})

var into = curry(function (to, transFn, from) {
  return transduce(transFn, cons, to, from)
})

trans.reduce     = reduce
trans.cons       = cons
trans.empty      = empty
trans.mapping    = mapping
trans.plucking   = plucking
trans.cat        = cat
trans.filtering  = filtering
trans.checking   = checking
trans.map        = map
trans.mapcatting = mapcatting
trans.mutating   = mutating
trans.mutate     = mutate
trans.filter     = filter
trans.transduce  = transduce
trans.sequence   = sequence
trans.into       = into
module.exports   = trans
