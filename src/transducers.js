var fns   = require("./functions")
var curry = fns.curry
var trans = {}

var mapping = curry(function (transFn, stepFn) {
  return function (acc, x) {
    return stepFn(r, transFn(x))
  }
})

var filtering = curry(function (predFn, stepFn) {
  return function (acc, x) {
    return predFn(acc, x) ? stepFn(acc, x) : acc 
  }
})

module.exports = trans
