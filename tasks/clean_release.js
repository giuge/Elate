'use strict'

var gulp = require('gulp')
var jetpack = require('fs-jetpack')
var zip = require('gulp-zip')
var exec = require('child_process').exec
var Q = require('q')
var fs = require("fs")

var fixNames = function() {
  var projectDir = jetpack
  var manifest = projectDir.read('app/package.json', 'json')

  var oldNuget = './releases/Elate.' + manifest.version + '.nupkg'
  var newNuget = jetpack.find('./releases/tmp', { matching: '*.nupkg' })[0]
  var newNugetPath = './releases/Elate.' + manifest.version + '-full.nupkg'

  jetpack.remove(oldNuget)
  jetpack.copy('./releases/tmp/RELEASES', './releases/RELEASES')
  jetpack.copy('./releases/tmp/Setup.exe', './releases/ElateSetup.exe')
  jetpack.copy(newNuget, newNugetPath, { overwrite: true })
  jetpack.remove('./releases/tmp')

  // Change the nuget name
  if(newNugetPath.indexOf('Elate.') !== -1) {
    var newNugetName = newNugetPath.split('/').pop().split('.')
    newNugetName.shift()
    newNugetName = newNugetName.join('.')
    newNugetName = 'elate-' + newNugetName
    jetpack.rename(newNugetPath, newNugetName)
  }

  // Change win installer name
  var exeURI = jetpack.find('./releases', { matching: '*.exe' })[0]
  var exeName = exeURI.split('/').pop()
  var newExeName = exeName.split(' ').join('')

  jetpack.rename(exeURI, newExeName)
  return Q()
}

var zipMac = function() {
  var deferred = Q.defer()
  var cmd = 'ditto -c -k --sequesterRsrc --keepParent ' +  './releases/Elate-darwin-x64/Elate.app ./releases/elate-mac.zip'
  exec(cmd, function(err, out, code){
    if(err) deferred.reject(err)
    else deferred.resolve()
  })
  return deferred.promise
}

var zipWin = function() {
  var deferred = Q.defer()
  var cmd = 'ditto -c -k --sequesterRsrc --keepParent ' +  './releases/Elate-win32-ia32 ./releases/elate-win.zip'
  exec(cmd, function(err, out, code){
    if(err) deferred.reject(err)
    else deferred.resolve()
  })
  return deferred.promise
}

var removeFolders = function() {
  let dirs = jetpack.find('./releases', { matching: 'Elate-*' })
  for(var i in dirs) {
    jetpack.remove(dirs[i])
  }
}


gulp.task('clean_release', function () {
  return fixNames()
  .then(zipMac)
  .then(zipWin)
  .then(removeFolders)
  .catch(function(err) {
    console.log(err)
  })
})
