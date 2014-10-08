exec = require("child_process").exec
fs = require 'fs'

lastChange = {}

FILENAME = "leaflet.control.geosearch"
COFFEE_DIR = "coffee"
COFFEE = ["#{COFFEE_DIR}/#{FILENAME}.coffee"]
COFFEE_OUTPUT = "dist/js"
JS_OUTPUT = "#{COFFEE_OUTPUT}/#{FILENAME}.js"
JS_MIN_OUTPUT = "#{COFFEE_OUTPUT}/#{FILENAME}.min.js"

makeUgly = ->
  exec "closure #{JS_OUTPUT} --js_output_file #{JS_MIN_OUTPUT}", (err, stdout, stderr) ->
    return console.error err if err
    console.log "Minified #{JS_OUTPUT}"

compileCoffee = ->
  exec "coffee --join #{JS_OUTPUT} -c #{COFFEE}", (err, stdout, stderr) ->
    return console.error err if err
    console.log "Compiled #{JS_OUTPUT}"

watchFile = (file, fn) ->
  try
    fs.watch file, (event, filename) ->
      return if event isnt 'change'
      # ignore repeated event misfires
      fn file if Date.now() - lastChange[file] > 1000
      lastChange[file] = Date.now()
  catch e
    console.log "Error watching #{file}"

watchFiles = (files, fn) ->
  for file in files
    lastChange[file] = 0
    watchFile file, fn
    console.log "Watching #{file}"

task 'minify', "Minify #{JS_OUTPUT}", ->
  makeUgly()

task 'build', 'Compile *.coffee and *.less', ->
  compileCoffee()

task 'watch', 'Compile + watch *.coffee and *.less', ->
  watchFiles COFFEE, compileCoffee

task 'clean', "Cleans up the libs before a release", ->
  files = fs.readdirSync "#{COFFEE_OUTPUT}"
  (fs.unlinkSync "#{COFFEE_OUTPUT}/" + file) for file in files
