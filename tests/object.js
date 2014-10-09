var test    = require('tape')
var mod     = require('../src/object.js')
var hasKey  = mod.hasKey
var hasKeys = mod.hasKeys
var extend  = mod.extend

test('hasKey', function (t) {
  var obj = {
    name: "steve",
    age:  99 
  }

  t.plan(2)
  t.true(hasKey('name', obj))
  t.false(hasKey('height', obj))
})

test('hasKeys', function (t) {
  var obj = {
    name: "Steve",
    age:  9
  }

  var hasNameAndAge    = hasKeys(["name", "age"])
  var hasSchoolAndName = hasKeys(["school", "age"])

  t.plan(4)
  t.true(hasKeys(['name', 'age'], obj))
  t.false(hasKeys(['school', 'name'], obj))
  t.true(hasNameAndAge(obj))
  t.false(hasSchoolAndName(obj))
})

test('extend', function (t) {
  var player = {
    size: 10 
  }
  var attrs = {
    name: "Steven",
    age:  10
  }

  extend(player, attrs)
  t.plan(3)
  t.same(player.size, 10)
  t.same(player.name, "Steven")
  t.same(player.age, 10)
})
