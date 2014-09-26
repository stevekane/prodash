var test      = require('tape')
var fns       = require("../src/functions")
var mod       = require('../src/transducers')
var graph     = require("../src/graph")
var extend    = fns.extend
var compose   = fns.compose
var Node      = graph.Node
var cons      = mod.cons
var reduce    = mod.reduce
var empty     = mod.empty
var mapping   = mod.mapping
var filtering = mod.filtering

var addOne  = function (x) { return x + 1 }
var gtOne   = function (x) { return x > 1 }
var incId   = function (n) { n.id++; return n }
var getVal  = function (kv) { 
  var key    = Object.keys(kv)[0]

  return kv[key]
}
var bumpVal = function (kv) { 
  var result = {}
  var key    = Object.keys(kv)[0]

  result[key] = kv[key] + 1
  return result
}
var contains = function (ar, el) {
  for (var i = 0; i < ar.length; ++i) {
    if (el === ar[i]) return true
  }
  return false
}

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

test('reduce for array', function (t) {
  var m      = mapping(addOne, cons)
  var array  = [1,2,3]
  var result = reduce(m, [], array)

  t.plan(1)
  t.same(result, [2,3,4])
})

test('reduce for object', function (t) {
  var m      = mapping(bumpVal, extend)
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

test('reduce for a custom Graph data type', function (t) {
  var g      = Node({
    id:       1,
    children: [Node({id: 2})] 
  }) 
  var m      = mapping(incId)
  var result = reduce(m(cons), [], g)

  t.plan(2)
  t.same(result[0].id, 2)
  t.same(result[1].id, 3)
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

test('cons for custom graph data type', function (t) {
  var g     = Node({id: 1})
  var toAdd = Node({id: 2})

  cons(g, toAdd)
  t.plan(1)
  t.same(g.children[0].id, 2)
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

test('empty for custom graph data type', function (t) {
  var e = empty(Node({}))

  t.plan(1)
  t.true(e instanceof Node)
})
