var fns = {}

var demethodize = function (obj, fnName) {
  return Function.prototype.call.bind(obj[fnName]) 
}

var extend = function (host, obj) {
  var ks = Object.keys(obj)

  for (var i = 0; i < ks.length; ++i) {
    host[ks[i]] = obj[ks[i]]
  }
  return host
}

var hasKey = function (obj, key) {
  return obj[key] !== undefined
}

var hasOwnKey = demethodize(Object, "hasOwnProperty")

var push = function (array, el) {
  array.push(el) 
  return array
}

var unshift = function (array, el) {
  array.unshift(el)
  return array
}

var reverse = function (list) {
  var backwards = []

  for (var i = 0; i < list.length; ++i) {
    backwards.unshift(list[i]) 
  }

  return backwards
}

//don't export?  just used in definitions
var badSlice = demethodize(Array.prototype, "slice")

var toArray = function (args) { return badSlice(args, 0) }

var allButFirst = function (args) { return badSlice(args, 1) }

var concat = demethodize(Array.prototype, "concat")

var apply = function (fn, argsList) { return fn.apply(this, argsList) }

var call = function (fn) { return fn.apply(this, allButFirst(arguments)) }

var bind = function (fn, obj) { return fn.bind(obj, allButFirst(arguments)) }

var compose = function (fns) {
  return function composed (val) {
    for (var i = fns.length - 1; i >= 0; --i) {
      val = fns[i](val)
    }
    return val
  }
}

var flip = function (fn) {
  return function () {
    return apply(fn, reverse(badSlice(arguments)))
  }
}

var slice = flip(badSlice)

var partial = function (fn) {
  var args = slice(1, arguments)

  return function partialed () {
    var innerArgs = toArray(arguments)
    var allArgs   = concat(args, innerArgs)

    return apply(fn, allArgs)
  }
}

//utility function used in curry def
var innerCurry = function (fn) {
  var args = allButFirst(arguments);

  return function () {
    var innerArgs = toArray(arguments);

    return apply(fn, concat(args, innerArgs));
  };
};

var curry = function curry (fn) {
  var fnArity = fn.length

  return function curried () {
    var notEnoughArgs    = arguments.length < fnArity
    var missingArgsCount = fnArity - arguments.length
    var stillMissingArgs = missingArgsCount > 0
    var args             = concat([fn], toArray(arguments))
    var result

    if (notEnoughArgs && stillMissingArgs) {
      result = curry(apply(innerCurry, args), missingArgsCount)
    } else if (notEnoughArgs) {
      result = apply(innerCurry, args)
    } else {
      result = apply(fn, slice(arguments)) 
    }
    return result
  }
}

var isObject = function (x) {
  return x instanceof Object &&
    Object.getPrototypeOf(x) === Object.getPrototypeOf({});
}

var isArray  = function (col) {
  return col instanceof Array
}

fns.demethodize = demethodize
fns.extend      = extend
fns.push        = push
fns.unshift     = unshift
fns.hasKey      = hasKey
fns.hasOwnKey   = hasOwnKey
fns.reverse     = reverse
fns.slice       = slice
fns.concat      = concat
fns.flip        = flip
fns.compose     = compose
fns.partial     = partial
fns.curry       = curry
fns.bind        = bind
fns.call        = call
fns.apply       = apply
fns.isObject    = isObject
fns.isArray     = isArray
module.exports  = fns
