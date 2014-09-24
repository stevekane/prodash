var test      = require('tape')
var mod       = require('../src/transducers.js')

var mapping   = mod.mapping
var filtering = mod.filtering

var cons = function (ar, x) {
  ar.push(x)
  return ar
}
var addOne = function (x) { return x + 1 }
var gtOne  = function (x) { return x > 1 }

test('mapping', function (t) {
  var m = mapping(addOne, cons)
  var r = m([], 5)
  
  t.plan(2)
  t.true(typeof m === "function")
  t.same(r, [6])
})

test('filtering', function (t) {
  var f  = filtering(gtOne, cons)
  var r1 = f([], 5)
  var r2 = f([r1], 1)

  t.plan(2)
  t.true(typeof f === "function")
  t.same(r1, [5])
})
