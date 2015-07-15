'use strict';

var pkg = require('./package.json'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  connect = require('gulp-connect'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  jade = require('gulp-jade'),
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  csso = require('gulp-csso'),
  del = require('del'),
  through = require('through'),
  opn = require('opn'),
  path = require('path'),
  imagemin = require('gulp-imagemin'),
  webshot = require('webshot'),
  taskListing = require('gulp-task-listing'),
  isDist = process.argv.indexOf('serve') === -1;

gulp.task('help', taskListing);

gulp.task('webshot', function(done) {
  connect.server({
    root: 'dist',
    port: 8888
  });
  webshot('http://localhost:8888', 'dist/thumbail.png', function(err) {
    if (err)
      console.error('Error webshotting', err);
    connect.serverClose();
    done();
  });
});

gulp.task('js', ['clean:js'], function() {
  return gulp.src('src/scripts/main.js')
    .pipe(isDist ? through() : plumber())
    .pipe(browserify({
      debug: !isDist
    }))
    .pipe(isDist ? uglify() : through())
    .pipe(rename('build.js'))
    .pipe(gulp.dest('dist/build'))
    .pipe(connect.reload());
});

gulp.task('html', ['clean:html'], function() {
  return gulp.src('src/index.jade')
    .pipe(isDist ? through() : plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('css', ['clean:css'], function() {
  return gulp.src('src/styles/main.styl')
    .pipe(isDist ? through() : plumber())
    .pipe(stylus({
      // Allow CSS to be imported from node_modules
      'include css': true,
      'paths': ['../node_modules']
    }))
    .pipe(autoprefixer('last 2 versions', {
      map: false
    }))
    .pipe(isDist ? csso() : through())
    .pipe(rename('build.css'))
    .pipe(gulp.dest('dist/build'))
    .pipe(connect.reload());
});

gulp.task('images', ['clean:images'], function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('dist/images'))
    .pipe(connect.reload());
});

gulp.task('imagemin', function() {
  return gulp.src('src/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('src/images'));
});

gulp.task('clean', function(done) {
  del('dist', done);
});

gulp.task('clean:html', function(done) {
  del('dist/index.html', done);
});

gulp.task('clean:js', function(done) {
  del('dist/build/build.js', done);
});

gulp.task('clean:css', function(done) {
  del('dist/build/build.css', done);
});

gulp.task('clean:images', function(done) {
  del('dist/images', done);
});

gulp.task('connect', ['build'], function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('open', ['connect'], function(done) {
  opn('http://localhost:8080', done);
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.jade', ['html']);
  gulp.watch('src/styles/**/*.styl', ['css']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch([
    'src/scripts/**/*.js',
    'bespoke-theme-*/dist/*.js' // Allow themes to be developed in parallel
  ], ['js']);
});

gulp.task('bundle', ['build'], function() {
  return gulp.src('dist/**/*')
    .pipe(gulp.dest(path.join('../dist', path.basename(path.resolve('.')))));
});

gulp.task('build', ['js', 'html', 'css', 'images']);

gulp.task('serve', ['open', 'watch']);

gulp.task('default', ['bundle']);
