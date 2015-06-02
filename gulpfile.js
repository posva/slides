'use strict';

var gulp = require('gulp');
var gulpGulp = require('gulp-gulp');
var glob = require('glob');
var fs = require('fs');
var path = require('path');

gulp.task('gulp', function() {
  return gulp.src('./*/gulpfile.js')
    .pipe(gulpGulp());
});

function getNewestMtime(files) {
  var newest = 0;
  files.forEach(function(file) {
    var mtime = fs.statSync(file).mtime;
    if (newest < mtime)
      newest = mtime;
  });
  return newest;
}

gulp.task('default', function() {
  var slideDirs = glob.sync('*/src');
  var rebuildDirs = [];
  slideDirs.forEach(function(slidesDir) {
    var files = glob.sync(path.join(slidesDir, '**/*'));
    var newest = getNewestMtime(files);
    var currentPath = path.join('dist', path.dirname(slidesDir));
    var current = 0;
    if (fs.existsSync(currentPath)) {
      current = getNewestMtime(glob.sync(path.join(currentPath, '**/*')));
    }
    if (current < newest) {
      console.log(slidesDir, 'needs update');
      rebuildDirs.push(path.join(slidesDir, '../gulpfile.js'));
    }
  });
  return gulp.src(rebuildDirs)
    .pipe(gulpGulp());
});
