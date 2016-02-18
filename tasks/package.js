'use strict'

var gulp = require('gulp')
var nuget = require('gulp-nuget-pack')
var packager = require('electron-packager')
var jetpack = require('fs-jetpack')
var appdmg = require('appdmg')
var Q = require('q')

var projectDir = jetpack
var buildDir = './build'
var releasesDir = './releases'
var iconDir = './resources/icon'
var manifest = projectDir.read('app/package.json', 'json')

var options = {
  'platform': ['darwin', 'win32'],
  'arch': 'all',
  'name': manifest.productName,
  'app-version': manifest.version,
  'app-bundle-id': manifest.identifier,
  'build-version': manifest.version,
  'icon': iconDir,
  'dir': buildDir,
  'out': releasesDir,
  'asar': true,
  'overwrite': true,
  'sign': 'JB29VD9G3E'
}

var dmgOptions = {
  'title': manifest.productName,
  'icon': iconDir + '.icns',
  'background': './resources/osx/dmg-background.png',
  'icon-size': 128,
  'contents': [
    { 'x': 410, 'y': 220, 'type': 'link', 'path': '/Applications' },
    { 'x': 130, 'y': 220, 'type': 'file', 'path': releasesDir + '/Elate-darwin-x64/Elate.app' }
  ]
}


var pack = function() {
  var deferred = Q.defer()
  packager(options, function done (err, appPath) {
    if(err) deferred.reject(err)
    else {
      //jetpack.copy('./resources/windows/Squirrel.exe', './releases/Elate-win32-ia32/Squirrel.exe')
      deferred.resolve()
    }
  })
  return deferred.promise
}

var makeDMG = function() {
  console.log('Creating dmg file')
  var deferred = Q.defer()
  var ee = appdmg({
    basepath: __dirname + '/../',
    target: releasesDir + '/Elate.dmg',
    specification: dmgOptions
  })

  ee.on('error', function (err) {
    deferred.reject(err)
  })

  ee.on('finish', function () {
    deferred.resolve()
    console.log('Created dmg file for ' + dmgOptions.title)
  })
}


gulp.task('package', ['build'], function () {
  return pack()
  .then(makeDMG)
  //.then(makeNuget)
  .catch(function(err) {
    console.log(err)
  })
})
