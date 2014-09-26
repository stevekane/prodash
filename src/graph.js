var fns         = require("./functions")
var curry       = fns.curry
var extend      = fns.extend
var g           = {}

var Node = function (hash) {
  if (!(this instanceof Node)) return new Node(hash)
  extend(this, hash)
  this.children = this.children || []
}

var reduce = curry(function reduce (fn, accum, node) {
  accum = fn(accum, node)

  for (var i = 0; i < node.children.length; ++i) {
    reduce(fn, accum, node.children[i]) 
  }
  return accum
})

var cons = curry(function (node, childNode) {
  node.children.push(childNode)
  return node
})

var empty = function () { return Node({}) }

Node.prototype.__reduce = reduce

Node.prototype.__cons = cons

Node.prototype.__empty = empty

var attach = curry(function (node, childNode) {
  node.children.push(childNode)
  return node
})

var attachMany = curry(function (node, childNodes) {
  for (var i = 0; i < childNodes.length; ++i) {
    node.children.push(childNodes[i])   
  }
  return node
})

g.Node         = Node
g.attach       = attach
g.attachMany   = attachMany
module.exports = g
