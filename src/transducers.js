var fns   = require("./functions")
var curry = fns.curry
var trans = {}

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

trans.mapping   = mapping
trans.filtering = filtering

module.exports = trans
