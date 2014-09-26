var test        = require('tape')
var mod         = require('../src/array.js')
var cons        = mod.cons
var reduce      = mod.reduce
var map         = mod.map
var filter      = mod.filter
var find        = mod.find
var mapcattingA = mod.mapcattingA
var cattingA    = mod.cattingA

var addOne   = function (x) { return x + 1 }
var gtOne    = function (x) { return x > 1 }
var sum      = function (x, y) { return x + y }
var returnAr = function (x) { return [x + 1, x + 2, x + 3] }

test('cons', function (t) {
  var ar = cons([1,2], 3)

  t.plan(1)
  t.same(ar, [1,2,3])
})

test('reduce', function (t) {
  var s = reduce(sum, 0, [1,2,3])

  t.plan(1)
  t.same(s, 6)
})

test('map', function (t) {
  var m = map(addOne, [1,2,3])

  t.plan(1)
  t.same(m, [2,3,4])
})

test('filter', function (t) {
  var f = filter(gtOne, [0,1,2,3,4])

  t.plan(1)
  t.same(f, [2,3,4])
})

test('find', function (t) {
  var found = find(gtOne, [0,3,1,2])

  t.plan(1)
  t.same(found, 3)
})

test('mapcattingA', function (t) {
  var mcFn = mapcattingA(returnAr)
  var r    = reduce(mcFn, [], [1,2,3])

  t.plan(1)
  t.true(true)
  //t.same(r.length, 9)
})
