var transducers = require("./transducers")
var fns         = require("./functions")
var mapping     = transducers.mapping
var filtering   = transducers.filtering
var curry       = fns.curry
var g           = {}

var Node = function (hash, nodes) {
  var node = {}

  node.value    = hash
  node.children = nodes || []
  return node
}

var cons = function (node, childNode) {
  node.children.push(childNode)
  return node
}

var reduce = function reduce (fn, accum, node) {
  accum = fn(accum, node.value)

  for (var i = 0; i < node.children.length; ++i) {
    reduce(fn, accum, node.children[i]) 
  }
  return accum
}

var map = function (fn, node) {
  var r = Node(fn(node.value))

  for (var i = 0; i < node.children.length; ++i) {
    cons(r, map(fn, node.children[i]))
  }
  return r
}

var forEach = function (fn, node) {
  fn(node.value)  

  for (var i = 0; i < node.children.length; ++i) {
    forEach(fn, node.children[i])
  }
  return node
}

g.Node    = Node
g.cons    = cons
g.reduce  = reduce
g.map     = map
g.forEach = forEach

module.exports = g
