var test        = require('tape')
var mod         = require('../src/functions.js')
var demethodize = mod.demethodize
var instanceOf  = mod.instanceOf
var flip        = mod.flip
var compose     = mod.compose
var partial     = mod.partial
var curry       = mod.curry
var call        = mod.call
var apply       = mod.apply

var add1 = function (x) { return x + 1 }
var add2 = function (x) { return x + 2 }
var join = function (s1, s2) { return s1 + s2 }

test('demethodize', function (t) {
  var cct   = demethodize(Array.prototype, "concat") 
  var group = cct([1,2,3], 4)

  t.plan(1)
  t.same([1,2,3,4], group)
})

test('instanceOf', function (t) {
  var obj = {}
  var arr = []

  t.plan(2)
  t.true(instanceOf(Object, obj))
  t.true(instanceOf(Array, arr))
})

test('flip', function (t) {
  var res = flip(join)("steve", "kane") 

  t.plan(1)
  t.same("kanesteve", res)
})

test('compose', function (t) {
  var add3 = compose([add1, add2])
  var sum  = add3(7)

  t.plan(1)
  t.same(sum, 10)
})

test('partial', function (t) {
  var makeSteve = partial(join, "Steve")
  var player    = makeSteve(" Williams")

  t.plan(2)
  t.true(typeof makeSteve === "function")
  t.same(player, "Steve Williams")
})

test('curry', function (t) {
  var jCurried  = curry(join)  
  var makeSteve = jCurried("Steve")
  var player    = makeSteve(" Jackson")

  t.plan(2)
  t.true(typeof makeSteve === "function")
  t.same(player, "Steve Jackson")
})

test('curry varying args', function (t) {
  var addAll = curry(function (a,b,c,d,e) {
    return a + b + c + d + e 
  })
  var result = addAll(1)(2,3)(4)(5)

  t.plan(1)
  t.same(result, 15)
})

test('call', function (t) {
  var n = call(join, "steve", "kane")

  t.plan(1)
  t.same("stevekane", n)
})

test('apply', function (t) {
  var n = apply(join, ["steve", "kane"])

  t.plan(1)
  t.same("stevekane", n)
})
