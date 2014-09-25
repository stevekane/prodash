var test      = require('tape')
var mod       = require('../src/graph.js')
var trans     = require("../src/transducers.js")
var fns       = require("../src/functions")
var mapping   = trans.mapping
var filtering = trans.filtering
var compose   = fns.compose
var Node      = mod.Node
var cons      = mod.cons
var reduce    = mod.reduce
var forEach   = mod.forEach
var flatten   = mod.flatten
var push      = function (ar, x) {
  ar.push(x) 
  return ar
}
var makeRocket = function (n) {
  n.type = "rocket"
  return n
}

test('Node', function (t) {
  var childNodes = [Node({id: 1}), Node({id: 2})]
  var root       = Node({id: 99}, childNodes)

  t.plan(3)
  t.same(root.id, 99)
  t.same(root.children[0].id, 1)
  t.same(root.children[1].id, 2)
})

test('cons', function (t) {
  var root          = Node({id: 99})

  cons(root, Node({id: 2}))
  t.plan(1)
  t.same(root.children[0].id, 2) 
})

test('reduce', function (t) {
  var childNodes = [Node({id: 1}), Node({id: 2})]
  var root       = Node({id: 99}, childNodes)
  var r          = reduce(push, [], root)

  t.plan(3)
  t.same(r[0].id, 99)
  t.same(r[1].id, 1)
  t.same(r[2].id, 2)
})

test('forEach', function (t) {
  var grandChildren = [Node({id: 22})]
  var childNodes    = [Node({id: 1}, grandChildren), Node({id: 2})]
  var root          = Node({id: 99}, childNodes)

  forEach(makeRocket, root)
  t.plan(4)
  t.same(root.type, "rocket")
  t.same(root.children[0].type, "rocket")
  t.same(root.children[1].type, "rocket")
  t.same(root.children[0].children[0].type, "rocket")
})

test('flatten', function (t) {
  var grandChildren = [Node({id: 22})]
  var childNodes    = [Node({id: 1}, grandChildren), Node({id: 2})]
  var root          = Node({id: 99}, childNodes)
  var removeLow     = filtering(function (x) { return x.id > 15 })
  var incId         = mapping(function (x) { x.id++; return x })
  var identity      = mapping(function (x) { return x })
  var processTree   = compose([removeLow, incId])
  var someNodes     = flatten(processTree, root)
  var allNodes      = flatten(identity, root)

  t.plan(4)
  t.true(someNodes.length === 2)
  t.same(someNodes[0].id, 100)
  t.same(someNodes[1].id, 23)
  t.true(allNodes.length === 4)
})
