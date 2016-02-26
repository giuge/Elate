'use strict'

var gulp = require('gulp')
var nuget = require('gulp-nuget-pack')
var packager = require('electron-packager')
var jetpack = require('fs-jetpack')
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
  'platform': ['win32'],
  'arch': 'ia32',
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

var nugetOptions = {
  'id': 'elate',
  'title': manifest.productName,
  'version': manifest.version,
  'authors': 'Elate',
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
  var squirrelPath = path.join(__dirname, '..', 'resources', 'windows', 'squirrel')
  var loadingGifPath = path.join(__dirname, '..', 'resources', 'windows', 'default.gif')
  var nugetPath = path.join(__dirname, '..', 'releases') + '/Elate.' + manifest.version + '.nupkg'
  var releasesDir = path.join(__dirname, '..', 'releases', 'tmp')
  var setupIconDir = path.join(__dirname, '..', 'resources', 'icon.ico')

  var createSetupCommand = [
    '--releasify', addWindowsPathFix(nugetPath),
    '--loadingGif', addWindowsPathFix(loadingGifPath),
    '--setupIcon', addWindowsPathFix(setupIconDir),
    '--releaseDir', addWindowsPathFix(releasesDir)
  ]

  if (os.platform() !== 'win32') {
    squirrelPath = path.join(squirrelPath, 'Update-Mono.exe')
    createSetupCommand.unshift(addWindowsPathFix(squirrelPath))
    createSetupCommand.unshift('mono')
    createSetupCommand = createSetupCommand.join(' ')
  } else {
    squirrelPath = path.join(squirrelPath, 'Update.exe')
    createSetupCommand.unshift(addWindowsPathFix(squirrelPath))
    createSetupCommand = createSetupCommand.join(' ')
  }

  childProcess.execSync(createSetupCommand, function() {
    console.log('Created Setup.exe for ' + manifest.productName)
  })

  return Q()
}


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


var zipWin = function() {
  if(os.platform() != 'darwin') {
    console.log('You can create zips on OSX only atm.')
    return
  }
  var deferred = Q.defer()
  var from = path.join(__dirname, '..', 'releases', 'Elate-win32-ia32')
  var to = path.join(__dirname, '..', 'releases', 'elate-win.zip')

  var cmd = 'ditto -c -k --sequesterRsrc ' +  from + ' ' + to
  childProcess.exec(cmd, function(err, out, code){
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

  return Q()
}


gulp.task('release-win', function () {
  return pack()
  .then(makeNuget)
  .then(zipWin)
  .then(makeWinRelease)
  .then(fixNames)
  .then(removeFolders)
  .catch(function(err) {
    console.log(err)
  })
})
