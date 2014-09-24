var test    = require('tape')
var mod     = require('../src/graph.js')

var Node    = mod.Node
var cons    = mod.cons
var reduce  = mod.reduce
var map     = mod.map
var forEach = mod.forEach
var push    = function (ar, x) {
  ar.push(x) 
  return ar
}
var makeRocket = function (val) {
  val.type = "rocket"
  return val
}

test('Node', function (t) {
  var childNodes = [Node({id: 1}), Node({id: 2})]
  var root       = Node({id: 99}, childNodes)

  t.plan(3)
  t.same(root.value.id, 99)
  t.same(root.children[0].value.id, 1)
  t.same(root.children[1].value.id, 2)
})

test('cons', function (t) {
  var root          = Node({id: 99})

  cons(root, Node({id: 2}))
  t.plan(1)
  t.same(root.children[0].value.id, 2) 
})

test('reduce', function (t) {
  var childNodes = [Node({id: 1}), Node({id: 2})]
  var root       = Node({id: 99}, childNodes)
  var r          = reduce(push, [], root)

  t.plan(3)
  t.same(r[0], {id: 99})
  t.same(r[1], {id: 1})
  t.same(r[2], {id: 2})
})

test('map', function (t) {
  var grandChildren = [Node({id: 22})]
  var childNodes    = [Node({id: 1}, grandChildren), Node({id: 2})]
  var root          = Node({id: 99}, childNodes)
  var newGraph      = map(makeRocket, root)

  //TODO: IMPLEMENT ACTUAL TESTS.  THIS APPEARS TO BE WORKING
  t.plan(1)
  t.true(true)
})

test('forEach', function (t) {
  var grandChildren = [Node({id: 22})]
  var childNodes    = [Node({id: 1}, grandChildren), Node({id: 2})]
  var root          = Node({id: 99}, childNodes)

  //TODO: IMPLEMENT ACTUAL TESTS.  THIS APPEARS TO BE WORKING
  forEach(makeRocket, root)
  t.plan(1)
  t.true(true)
})
