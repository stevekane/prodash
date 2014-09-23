var fs        = require("fs")
var path      = require("path")
var modName   = process.argv[2]
var destPath  = process.argv[3]

/*
 * Provide a file that you want to scaffold tests for and an optional
 * path where the test file should live.
 *
 * Crawl the module by keys and build the skeleton for testing this file
 * */

var TestBoilerplate = function (fn) {
  return (
    "test('" + fn + "', function (t) {\n\n" +

    "})\n\n"
  )
}

var maxLength = function (prev, cur) {
  return cur.length > prev ? cur.length : prev
}

var NumSpaces = function (number) {
  var spaces = ""

  for (var i = 0; i < number; ++i) {
    spaces += " "
  }
  return spaces
}

var LocalFn = function (maxSize, fn) {
  return (
    "var " + fn + NumSpaces(maxSize - fn.length) + " = mod." + fn + "\n"
  )
}

var ImportBoilerplate = function (moduleName, modFns) {
  var localFns = modFns.map(LocalFn).join("")
  var maxSize  = modFns.reduce(maxLength, "")
  var spaces   = NumSpaces(maxSize)

  return (
    "var test" + NumSpaces(maxSize - 4) + " = require('tape')\n" +
    "var mod" + NumSpaces(maxSize - 3) + " = require('" + moduleName + "')\n\n" +
    modFns.map(function (fn) {
      return LocalFn(maxSize, fn) 
    }).join("")
  )
}

var FileContents = function (moduleName) {
  var mod              = require(moduleName)
  var modFns           = Object.keys(mod)
  var testBoilerplates = modFns.map(TestBoilerplate).join("")

  return ImportBoilerplate(moduleName, modFns) + "\n\n" + testBoilerplates
}

var output = FileContents(modName)

process.stdout.write(output)
