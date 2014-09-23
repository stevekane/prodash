var transducers = require("./transducers")
var mapping     = transducers.mapping
var filtering   = transducers.filtering
var obj         = {}

var keys = Object.keys

//TODO: implement w/ transducers
var map = function (fn, o) {
  return o 
}

obj.keys = keys
obj.map  = map

module.exports = obj
