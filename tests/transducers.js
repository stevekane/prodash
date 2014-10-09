var test       = require('tape')
var fns        = require("../src/functions")
var mod        = require('../src/transducers')
var compose    = fns.compose
var cons       = mod.cons
var reduce     = mod.reduce
var empty      = mod.empty
var mapping    = mod.mapping
var plucking   = mod.plucking
var filtering  = mod.filtering
var checking   = mod.checking
var cat        = mod.cat
var map        = mod.map
var mapcatting = mod.mapcatting
var mutating   = mod.mutating
var filter     = mod.filter
var transduce  = mod.transduce
var sequence   = mod.sequence
var into       = mod.into
var mutate     = mod.mutate
var addOne     = function (x) { return x + 1 }
var gtOne      = function (x) { return x > 1 }
var ltFifty    = function (x) { return x < 50 }
var incId      = function (n) { n.id++; return n }
var getVal     = function (kv) { 
  var key = Object.keys(kv)[0]

  return kv[key]
}

var valOverFifty = function (kv) {
  var key = Object.keys(kv)[0]

  return kv[key] > 50
}

var bumpVal = function (kv) { 
  var result = {}
  var key    = Object.keys(kv)[0]

  result[key] = kv[key] + 1
  return result
}

var olderThanTwo   = function (e) { return e.age > 2 }
var age            = function (e) { e.age++ }
var capitalizeName = function (e) { e.name = e.name.toUpperCase() }

var contains = function (ar, el) {
  for (var i = 0; i < ar.length; ++i) {
    if (el === ar[i]) return true
  }
  return false
}

test('mapping', function (t) {
  var m = mapping(addOne)(cons)
  var r = m([], 5)
  
  t.plan(2)
  t.true(typeof m === "function")
  t.same(r, [6])
})

test('plucking', function (t) {
  var m = plucking("position")(cons)
  var r = m([], {position: 45})

  t.plan(1)
  t.same(r, [45])
})

test('filtering', function (t) {
  var f  = filtering(gtOne)(cons)
  var r1 = f([], 5)

  t.plan(2)
  t.true(typeof f === "function")
  t.same(r1, [5])
})

test('checking', function (t) {
  var f  = checking("living", true)(cons)
  var r1 = f([], {living: true})
  var r2 = f([], {living: false})

  t.plan(2)
  t.same(r1, [{living: true}])
  t.same(r2, [])
})

test('reduce for array', function (t) {
  var m      = mapping(addOne)(cons)
  var array  = [1,2,3]
  var result = reduce(m, [], array)

  t.plan(1)
  t.same(result, [2,3,4])
})

test('reduce for object', function (t) {
  var m      = mapping(bumpVal)(cons)
  var obj    = { age: 10 }
  var result = reduce(m, {}, obj)

  t.plan(1)
  t.same(result, { age: 11 })
})

test('reduce can translate object to values array', function (t) {
  var m      = compose([mapping(getVal), mapping(addOne)])(cons)
  var obj    = { age: 10, size: 13, density: 4 }
  var result = reduce(m, [], obj)

  t.plan(3)
  t.true(contains(result, 11))
  t.true(contains(result, 14))
  t.true(contains(result, 5))
})

test('cons for object', function (t) {
  var obj   = { name: "biff" }
  var toAdd = { age: 42 }

  cons(obj, toAdd)
  t.plan(2)
  t.same(obj.name, "biff")
  t.same(obj.age, 42)
})

test('cons for array', function (t) {
  var arr   = [1,2,3]
  var toAdd = 4

  cons(arr, toAdd)
  t.plan(2)
  t.same(arr[3], 4)
  t.true(arr.length === 4)
})

test('empty for object', function (t) {
  var e = empty({})

  t.plan(1)
  t.same(e, {})
})

test('empty for array', function (t) {
  var e = empty([])

  t.plan(1)
  t.same(e, [])
})

test('cat', function (t) {
  var ar  = [[1,2], [3,4], [5,6]]
  var res = reduce(cat(cons), [], ar)

  t.plan(1)
  t.same(res, [1,2,3,4,5,6])
})

test('mapcatting', function (t) {
  var ar  = [[1,2], [3,4], [5,6]]
  var res = reduce(mapcatting(addOne)(cons), [], ar)

  t.plan(1)
  t.same(res, [2,3,4,5,6,7])
})

test('mutating', function (t) {
  var obj = {
    age:    21,
    height: 23,
    weight: 40
  }
  var noop = function () {}
  mutating(age)(noop)(undefined, obj)

  t.plan(1)
  t.same(obj.age, 22)
})

test('mutating used in chain', function (t) {
  var objects = [
    {age: 1, name: "Steve"}, 
    {age: 2, name: "Lynn"}, 
    {age: 3, name: "Brian"}
  ]
  var identity  = function (acc, e) { return e }
  var removeOld = filtering(olderThanTwo)
  var bumpAge   = mutating(age)
  var capName   = mutating(capitalizeName)
  var transform = compose([removeOld, bumpAge, capName])

  reduce(transform(identity), [], objects) 
  t.plan(2)
  t.same(objects[2].age, 4)
  t.same(objects[2].name, "BRIAN")
})

test('bigchain with transformation', function (t) {
  var stats = {
    age:    32,
    height: 64,
    width:  108
  }
  var m = compose([
    mapping(getVal),
    filtering(ltFifty)
  ])
  var result = reduce(m(cons), [], stats)

  t.plan(1)
  t.same(result[0], 32)
})

test('map for array', function (t) {
  var ar    = [1,2,3]
  var newAr = map(addOne, ar)

  t.plan(1)
  t.same([2,3,4], newAr)
})

test('map for object', function (t) {
  var obj = {
    age:    42,
    height: 58 
  }
  var newObj = map(bumpVal, obj)

  t.plan(1)
  t.same(newObj, {
    age:    43,
    height: 59 
  })
})

test('filter for array', function (t) {
  var ar    = [100,20,3]
  var newAr = filter(ltFifty, ar)

  t.plan(1)
  t.same(newAr, [20, 3])
})

test('filter for object', function (t) {
  var obj = {
    height: 50,
    weight: 100
  }
  var newObj = filter(valOverFifty, obj)

  t.plan(1)
  t.same(newObj, { weight: 100 })
})

test('mutate', function (t) {
  var objects = [
    {age: 1, name: "Steve"}, 
    {age: 2, name: "Lynn"}, 
    {age: 3, name: "Brian"}
  ]
  var removeOld = filtering(olderThanTwo)
  var bumpAge   = mutating(age)
  var capName   = mutating(capitalizeName)
  var transform = compose([removeOld, bumpAge, capName])

  mutate(transform, objects) 
  t.plan(2)
  t.same(objects[2].age, 4)
  t.same(objects[2].name, "BRIAN")
})

test('transduce from obj to array', function (t) {
  var stats = {
    age:    32,
    height: 64,
    width:  108
  }
  var m = compose([
    mapping(getVal),
    filtering(ltFifty)
  ])
  var result = transduce(m, cons, [], stats)

  t.plan(1)
  t.same(result[0], 32)
})

test('sequence', function (t) {
  var ar    = [1,2,3]
  var newAr = sequence(mapping(addOne), ar)

  t.plan(1)
  t.same([2,3,4], newAr)
})

test('into', function (t) {
  var bigValues = {
    radius: 10000,
    weight: 29381,
  }
  var properties = {
    age:        517128,
    importance: 32,
    power:      11
  }

  into(bigValues, filtering(valOverFifty), properties)
  t.plan(3)
  t.same(bigValues.age, properties.age)
  t.true(bigValues.importance === undefined)
  t.true(bigValues.power === undefined)
})
