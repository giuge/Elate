'use strict'

var gulp = require('gulp')


gulp.task('release', ['build'], function () {
  gulp.start('release-mac', 'release-win')
})
