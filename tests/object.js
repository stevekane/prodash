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

  t.plan(2)
  t.true(hasKeys(['name', 'age'], obj))
  t.false(hasKeys(['school', 'name'], obj))
})
