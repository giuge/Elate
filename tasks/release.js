'use strict'

var gulp = require('gulp')
var nuget = require('gulp-nuget-pack')
var packager = require('electron-packager')
var jetpack = require('fs-jetpack')
var appdmg = require('appdmg')
var childProcess = require('child_process')
var path = require('path')
var os = require('os')
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


var nugetOptions = {
  'id': 'elate',
  'title': manifest.productName,
  'version': manifest.version,
  'authors': manifest.author,
  'description': manifest.description,
  'language': 'en-en',
  'projectUrl': manifest.url,
  // Only works with remote urls :(
  'iconUrl': 'http://i.cubeupload.com/B9K0Uy.png',
  'copyright': manifest.copyright,
  'outputDir': releasesDir,
  'baseDir': './releases/Elate-win32-ia32'
}


var pack = function() {
  var deferred = Q.defer()
  packager(options, function done (err, appPath) {
    if(err) deferred.reject(err)
    else {
      // We need to add an extension otherwise Squirrel will not work
      jetpack.rename('./releases/Elate-win32-ia32/LICENSE', 'LICENSE.txt')
      jetpack.rename('./releases/Elate-win32-ia32/version', 'version.txt')
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


// The app needs to stay in lib/net45 for squirrel to work
var makeNuget = function(done) {
  var deferred = Q.defer()
  nuget(nugetOptions, [{src: './releases/Elate-win32-ia32', dest: 'lib/net45'}], function done() {
    deferred.resolve()
  })
  return deferred.promise
}


// Uses Squirrel releasify to create the actual packages from the nuget
function addWindowsPathFix(path) {
  return ['"', path, '"'].join('');
}

var makeWinRelease = function() {
  var deferred = Q.defer()
  var squirrelPath = path.join(__dirname, '..', 'resources', 'windows', 'squirrel')
  var loadingGifPath = path.join(__dirname, '..', 'resources', 'windows', 'default.gif')
  var nugetPath = path.join(__dirname, '..', 'releases') + '/Elate.' + manifest.version + '.nupkg'
  var releasesDir = path.join(__dirname, '..', 'releases', 'tmp')

  var createSetupCommand = [
    '--releasify', addWindowsPathFix(nugetPath),
    '--loadingGif', addWindowsPathFix(loadingGifPath),
    '--releaseDir', addWindowsPathFix(releasesDir)
  ]

  if (os.platform() !== 'win32') {
    squirrelPath = path.join(squirrelPath, 'Squirrel-Mono.exe')
    createSetupCommand.unshift(addWindowsPathFix(squirrelPath))
    createSetupCommand.unshift('mono')
    createSetupCommand = createSetupCommand.join(' ')
  } else {
    squirrelPath = path.join(squirrelPath, 'Squirrel.exe')
    createSetupCommand.unshift(addWindowsPathFix(squirrelPath))
    createSetupCommand = createSetupCommand.join(' ')
  }

  childProcess.execSync(createSetupCommand, function() {
    console.log('Created Setup.exe for ' + manifest.productName)
    deferred.resolve()
  })

  return deferred.promise
}


gulp.task('release', ['build'], function () {
  return pack()
  .then(makeDMG)
  .then(makeNuget)
  .then(makeWinRelease)
  .catch(function(err) {
    console.log(err)
  })
})
