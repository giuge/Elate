'use strict'

var gulp = require('gulp')
var jetpack = require('fs-jetpack')
var zip = require('gulp-zip')
var exec = require('child_process').exec
var Q = require('q')
var fs = require("fs")

var fixNames = function() {
  // // Change the nuget name
  // var nugetURI = jetpack.find('./releases', { matching: '*.nupkg' })[0]
  // var nugetName = nugetURI.split('/').pop()
  //
  // if(nugetName.indexOf('Elate.') !== -1) {
  //   var newNugetName = nugetName.split('.')
  //   newNugetName.shift()
  //   newNugetName = newNugetName.join('.')
  //   newNugetName = 'elate-' + newNugetName
  //   jetpack.rename(nugetURI, newNugetName)
  // }
  //
  // // Change win installer name
  // var exeURI = jetpack.find('./releases', { matching: '*.exe' })[0]
  // var exeName = exeURI.split('/').pop()
  // var newExeName = exeName.split(' ').join('')
  //
  // jetpack.rename(exeURI, newExeName)
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
