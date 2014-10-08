var test        = require('tape')
var mod         = require('../src/array.js')
var find        = mod.find
var forEach     = mod.forEach
var reverse     = mod.reverse
var concat      = mod.concat
var flatten     = mod.flatten
var slice       = mod.slice
var push        = mod.push
var unshift     = mod.unshift
var remove      = mod.remove
var range       = mod.range

var addOne   = function (x) { return x + 1 }
var gtOne    = function (x) { return x > 1 }

test('find', function (t) {
  var found = find(gtOne, [0,3,1,2])

  t.plan(1)
  t.same(found, 3)
})

test('forEach', function (t) {
  var li    = [1,2,3,4,5]

  forEach(addOne, li)
  t.plan(1)
  t.same(li, [2,3,4,5,6])
})

test('reverse', function (t) {
  var r = reverse([1,2,3,4])

  t.plan(1)
  t.same(r, [4,3,2,1])
})

test('concat', function (t) {
  var group = concat([1,2,3], 4)

  t.plan(1)
  t.same(group, [1,2,3,4])
})

test('flatten', function (t) {
  var ar   = [[1,2,3], [4,5,6]]
  var flat = flatten(ar)

  t.plan(1)
  t.same(flat, [1,2,3,4,5,6])
})

test('slice', function (t) {
  var ar  = [1,2,3]
  var sub = slice(1, 3, ar)

  t.plan(1)
  t.same(sub, [2,3])
})

test('push', function (t) {
  var ar = [1,2,3]

  push(ar, 4)
  t.plan(1)
  t.same(ar, [1,2,3,4])
})

test('unshift', function (t) {
  var ar = [3,2,1]

  unshift(ar, 4)
  t.plan(1)
  t.same(ar, [4,3,2,1])
})

test('remove', function (t) {
  var ar = [1,2,3,4,2]

  remove(function (x) { return x === 2 }, ar)
  t.plan(1)
  t.same(ar, [1,3,4])
})

test('range', function (t) {
  var r = range(1,10)

  t.plan(1)
  t.same(r, [1,2,3,4,5,6,7,8,9,10])
})
