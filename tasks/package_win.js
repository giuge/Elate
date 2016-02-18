var gulp = require('gulp')
var winInstaller = require('electron-winstaller')
var jetpack = require('fs-jetpack')

var manifest = jetpack.read('app/package.json', 'json')
var buildDir = './build'
var iconDir = './resources/icon'

var opts = {
  'appDirectory': './releases/Elate-win32-ia32',
  'outputDirectory': './releases',
  'loadingGif': './resources/windows/default.gif',
  'title' : manifest.productName,
  'name' : 'elate',
  'version': manifest.version,
  'description': manifest.description,
  'iconUrl': iconDir + '.ico',
  'setupIcon': iconDir + '.ico',
  'noMsi': false
}


gulp.task('package_win', function(done) {
  return winInstaller.createWindowsInstaller(opts, function done(err) {
    if(err) return console.log(err)
    else return console.log('Created installers and nupkgs for win.')
  })
})
