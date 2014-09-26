var test       = require('tape')
var mod        = require('../src/graph.js')
var trans      = require("../src/transducers.js")
var fns        = require("../src/functions")
var mapping    = trans.mapping
var filtering  = trans.filtering
var compose    = fns.compose
var Node       = mod.Node
var attach     = mod.attach
var attachMany = mod.attachMany
var push       = function (ar, x) {
  ar.push(x) 
  return ar
}

test('Node', function (t) {
  var childNodes = [Node({id: 1}), Node({id: 2})]
  var root       = Node({
    id:       99,
    children: childNodes
  })

  attachMany(root, childNodes)
  t.plan(3)
  t.same(root.id, 99)
  t.same(root.children[0].id, 1)
  t.same(root.children[1].id, 2)
})

test('Node.prototype.__reduce', function (t) {
  var childNodes = [Node({id: 1}), Node({id: 2})]
  var root       = Node({
    id:       99,
    children: childNodes
  })

  r = Node.prototype.__reduce(push, [], root)

  t.plan(3)
  t.same(r[0].id, 99)
  t.same(r[1].id, 1)
  t.same(r[2].id, 2)
})

test('Node.prototype.__cons', function (t) {
  var root = Node({id: 99})

  Node.prototype.__cons(root, Node({id: 2}))
  t.plan(1)
  t.same(root.children[0].id, 2) 
})

test('Node.__empty', function (t) {
  var ne = Node.prototype.__empty()

  t.plan(1)
  t.same(ne.children, [])
})
