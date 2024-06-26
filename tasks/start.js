'use strict'

var Q = require('q')
var electron = require('electron-prebuilt')
var pathUtil = require('path')
var childProcess = require('child_process')
var kill = require('tree-kill')
var utils = require('./utils')
var watch

var gulpPath = pathUtil.resolve('./node_modules/.bin/gulp')

var stdio = 'inherit'
if (utils.getEnvName() == 'test') stdio = ['ignore', 'ignore', process.stderr]


var runBuild = function () {
  var deferred = Q.defer()

  var build = childProcess.spawn(utils.spawnablePath(gulpPath), [
    'build',
    '--env=' + utils.getEnvName(),
    '--color'
  ], {
    stdio: stdio
  })

  build.on('close', function (code) {
    deferred.resolve()
  })

  return deferred.promise
}


var runGulpWatch = function () {
  watch = childProcess.spawn(utils.spawnablePath(gulpPath), [
    'watch',
    '--env=' + utils.getEnvName(),
    '--color'
  ], {
    stdio: stdio
  })

  watch.on('close', function (code) {
    // Gulp watch exits when error occured during build.
    // Just respawn it then.
    runGulpWatch()
  })
}


var runApp = function () {
  var app = childProcess.spawn(electron, ['./build'], {
    // Always listen to what the app has to say :)
    stdio: 'inherit'
  })

  app.on('close', function (code) {
    // User closed the app. Kill the host process.
    kill(watch.pid, 'SIGKILL', function () {
      process.exit()
    })
  })
}


runBuild()
.then(function () {
  runGulpWatch()
  runApp()
})
