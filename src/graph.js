var fns         = require("./functions")
var array       = require("./array")
var consA       = array.cons
var curry       = fns.curry
var g           = {}

var Node = function (hash, nodes) {
  hash.children = nodes || []
  return hash
}

var cons = function (node, childNode) {
  node.children.push(childNode)
  return node
}

var reduce = curry(function reduce (fn, accum, node) {
  accum = fn(accum, node)

  for (var i = 0; i < node.children.length; ++i) {
    reduce(fn, accum, node.children[i]) 
  }
  return accum
})

var forEach = curry(function (fn, node) {
  fn(node)  

  for (var i = 0; i < node.children.length; ++i) {
    forEach(fn, node.children[i])
  }
  return node
})

/*
 * Iterate over all nodes in the tree pushing them onto an array
 * Note.  This is simply a special case of the reduce function
 * where all outputs are pushed onto an array
 */
var flatten = function (redFn, graph) {
  return reduce(redFn(consA), [], graph)
}

g.Node       = Node
g.cons       = cons
g.reduce     = reduce
g.forEach    = forEach
g.flatten    = flatten

module.exports = g
