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
var innerCurry = function (fn, args) {
  return function () {
    for (var i = 0, startingIndex = args.length; i < arguments.length; ++i) {
      args[i + startingIndex] = arguments[i] 
    }

    return fn.apply(null, args);
  };
};

var curry = function (fn, arity) {
  var fnArity = arity || fn.length

  return function () {
    var missingArgsCount = fnArity - arguments.length
    var notEnoughArgs    = missingArgsCount > 0
    var args             = []

    for (var i = 0; i < arguments.length; ++i) {
      args[i] = arguments[i] 
    }

    if (notEnoughArgs) return curry(innerCurry(fn, args), missingArgsCount)
    else               return fn.apply(null, args)
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
