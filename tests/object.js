var test   = require('tape')
var mod    = require('../src/object.js')

var keys   = mod.keys
var cons   = mod.cons
var map    = mod.map
var reduce = mod.reduce
var filter = mod.filter


test('keys', function (t) {
  var obj = {
    name: "Steve",
    age:  9 
  }
  var ks = keys(obj)

  t.plan(1)
  t.same(ks, ["name", "age"])
})

test('cons', function (t) {
  var player = {}
  var position = {
    position: 0 
  }
  var newPlayer = cons(player, position)

  t.plan(1)
  t.same(newPlayer, {position: 0})
})

test('map', function (t) {
  var assets = {
    bg: "background", 
    fg: "foreground"
  }
  var addPng = function (obj) { 
    var k   = keys(obj)[0]
    var out = {}

    out[k] = obj[k] + ".png"
    return out
  }
  var pngs   = map(addPng, assets)

  t.plan(1)
  t.same(pngs, {
    bg: "background.png",
    fg: "foreground.png" 
  })
})

test('reduce', function (t) {
  var assets = {
    bg: "background", 
    fg: "foreground"
  }
  var getValues = function (list, obj) {
    var k = keys(obj)[0]

    list.push(obj[k])
    return list
  }
  var letters = reduce(getValues, [], assets)

  t.plan(1)
  t.same(letters, ["background", "foreground"])
})

test('filter', function (t) {
  var assets = {
    bg: "background", 
    fg: "foreground"
  }
  var fileNamesWithB = function (kv) {
    var k = keys(kv)[0] 

    return kv[k][0] === "b"
  }
  var bFiles = filter(fileNamesWithB, assets)

  t.plan(1)
  t.same(bFiles, {bg: "background"})
})
