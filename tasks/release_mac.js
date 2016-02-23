'use strict'

var gulp = require('gulp')
var packager = require('electron-packager')
var jetpack = require('fs-jetpack')
var appdmg = require('appdmg')
var path = require('path')
var os = require('os')
var exec = require('child_process').exec
var Q = require('q')

var projectDir = jetpack
var buildDir = './build'
var releasesDir = './releases'
var iconDir = './resources/icon'
var manifest = projectDir.read('app/package.json', 'json')

var options = {
  'platform': ['darwin'],
  'arch': 'all',
  'name': manifest.productName,
  'app-version': manifest.version,
  'app-bundle-id': manifest.identifier,
  'helper-bundle-id': manifest.identifier,
  'build-version': manifest.version,
  'icon': iconDir,
  'dir': buildDir,
  'out': releasesDir,
  'asar': true,
  'overwrite': true,
  'sign': 'JB29VD9G3E',
  'app-copyright': manifest.copyright,
  'version-string': {
    'CompanyName': 'Elate',
    'ProductName': manifest.productName,
    'LegalCopyright': manifest.copyright
  }
}

var dmgOptions = {
  'title': manifest.productName,
  'icon': iconDir + '.icns',
  'background': path.join(__dirname, '..', 'resources', 'osx', 'dmg-background.png'),
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
      deferred.resolve()
    }
  })
  return deferred.promise
}


var makeDMG = function() {
  if(os.platform() != 'darwin') {
    console.log('You can create DMGs on OSX only.')
    return
  }

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
    console.log('Created dmg file for ' + dmgOptions.title)
    deferred.resolve()
  })

  return deferred.promise
}

var zipMac = function() {
  if(os.platform() != 'darwin') {
    console.log('You can create zips on OSX only atm.')
    return
  }
  var deferred = Q.defer()
  var cmd = 'ditto -c -k --sequesterRsrc ' +  './releases/Elate-darwin-x64/Elate.app ./releases/elate-mac.zip'
  exec(cmd, function(err, out, code){
    if(err) deferred.reject(err)
    else deferred.resolve()
  })
  return deferred.promise
}

var removeFolders = function() {
  console.log('Cleaning up')
  let dirs = jetpack.find('./releases', { matching: 'Elate-*' })
  for(var i in dirs) {
    jetpack.remove(dirs[i])
  }
}


gulp.task('release-mac', function () {
  return pack()
  .then(makeDMG)
  .then(zipMac)
  .then(removeFolders)
  .catch(function(err) {
    console.log(err)
  })
})
