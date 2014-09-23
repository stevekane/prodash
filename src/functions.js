var fns = {}

var demethodize = function (obj, fnName) {
  return Function.prototype.call.bind(obj[fnName]) 
}

var reverse = function (list) {
  var backwards = []

  for (var item in list) {
    backwards.unshift(list[item]) 
  }

  return backwards
}

//don't export?  just used in definitions
var badSlice = demethodize(Array.prototype, "slice")

var toArray = function (args) { return badSlice(args, 0) }

var allButFirst = function (args) { return badSlice(args, 1) }

var concat = demethodize(Array.prototype, "concat")

var dot = function (prop, obj) { return obj[prop] }

var apply = function (fn, argsList) { return fn.apply(this, argsList) }

var call = function (fn) { return fn.call(this, allButFirst(arguments)) }

var bind = function (fn) { return fn.bind(this, allButFirst(arguments)) }

var compose = function (fns) {
  return function composed (val) {
    for (var i = fns.length - 1 i >= 0 --i) {
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
    var allArgs = concat(args, innerArgs)

    return apply(fn, allArgs)
  }
}

var curry = function (fn, argsCount) {
  var fnArity = argsCount || fn.length

  return function curried () {
    var notEnoughArgs    = arguments.length < fnArity
    var missingArgsCount = fnArity - arguments.length
    var stillMissingArgs = missingArgsCount > 0
    var args             = concat([fn], toArray(arguments))
    var result

    if (notEnoughArgs && stillMissingArgs) {
      result = autoCurry(apply(curry, args), missingArgsCount)
    } else if (notEnoughArgs) {
      result = apply(curry, args)
    } else {
      result = apply(fn, slice(arguments)) 
    }
    return result
  }
}

fns.demethodize = demethodize
fns.reverse     = reverse
fns.slice       = slice
fns.concat      = concat
fns.flip        = flip
fns.dot         = dot
fns.compose     = compose
fns.partial     = partial
fns.curry       = curry
fns.bind        = bind
fns.call        = call
fns.apply       = apply
module.exports  = fns
