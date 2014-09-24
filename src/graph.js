var fns         = require("./functions")
var curry       = fns.curry
var g           = {}

var Node = function (hash, nodes) {
  return {
    value:    hash,
    children: nodes || [] 
  }
}

var cons = function (node, childNode) {
  node.children.push(childNode)
  return node
}

var reduce = curry(function reduce (fn, accum, node) {
  accum = fn(accum, node.value)

  for (var i = 0; i < node.children.length; ++i) {
    reduce(fn, accum, node.children[i]) 
  }
  return accum
})

var forEach = curry(function (fn, node) {
  fn(node.value)  

  for (var i = 0; i < node.children.length; ++i) {
    forEach(fn, node.children[i])
  }
  return node
})

g.Node    = Node
g.cons    = cons
g.reduce  = reduce
g.forEach = forEach

module.exports = g
