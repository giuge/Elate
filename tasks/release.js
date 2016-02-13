'use strict'

var gulp = require('gulp')
var packager = require('electron-packager')
var jetpack = require('fs-jetpack')

var projectDir = jetpack
var buildDir = './build'
var releasesDir = './releases'
var iconDir = './resources/icon'
var manifest = projectDir.read('app/package.json', 'json')

var options = {
  'all': true,
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

var release = function() {
  packager(options, function done (err, appPath) {
    if(err) console.log(err)
  })
}


gulp.task('release', ['build'], function () {
  return release()
})
