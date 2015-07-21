'use strict';

var gulp = require('gulp'),
  gulpGulp = require('gulp-gulp'),
  glob = require('glob'),
  fs = require('fs'),
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
  ghPages = require('gulp-gh-pages'),
  path = require('path'),
  imagemin = require('gulp-imagemin'),
  PORT = 4000,
  isDist = process.argv.indexOf('serve') === -1;

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

gulp.task('bundle', ['common'], function() {
  var slideDirs = glob.sync('*/src');
  var rebuildDirs = [];
  slideDirs.forEach(function(slidesDir) {
    if (slidesDir === 'boilerplate/src') return;
    var files = glob.sync(path.join(slidesDir, '**/*'));
    files.push(path.join(slidesDir, '../dist/thumb.png'));
    var newest = getNewestMtime(files);
    var currentPath = path.join('dist', path.dirname(slidesDir));
    var current = 0;
    if (fs.existsSync(currentPath)) {
      current = getNewestMtime(glob.sync(path.join(currentPath, '**/*')));
    }
    if (current < newest) {
      gutil.log('Updating', slidesDir);
      rebuildDirs.push(path.join(slidesDir, '../gulpfile.js'));
    }
  });
  return gulp.src(rebuildDirs)
    .pipe(gulpGulp());
});

gulp.task('common', ['clean:common'], function() {
  return gulp.src('common/**/*')
  .pipe(gulp.dest('./dist/common/'));
});

gulp.task('deploy', ['bundle'], function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('slides', ['clean:slides'], function() {
  var slideDirs = glob.sync('*/src');
  var rebuildDirs = [];
  slideDirs.splice(slideDirs.indexOf('boilerplate/src'), 1);
  slideDirs.forEach(function(dir) {
    var dir = dir.split('/')[0];
    var contents = fs.readFileSync(path.join(dir, 'README.md'), {
      encoding: 'utf8'
    });
    var title = contents.split('\n')[0].slice(2);
    fs.appendFileSync('src/slides.jade', "+slides('" +
      title + "', '" + dir + "')\n");
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
      'paths': ['./node_modules']
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
  return gulp.src(['src/images/**/*', 'common/**/*'])
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(connect.reload());
});

gulp.task('clean', function(done) {
  del('dist', done);
});

gulp.task('clean:slides', function(done) {
  del('src/slides.jade', done);
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

gulp.task('clean:common', function(done) {
  del('dist/common', done);
});

gulp.task('connect', ['build'], function() {
  connect.server({
    root: 'dist',
    livereload: true,
    port: PORT
  });
});

gulp.task('open', ['connect'], function(done) {
  opn('http://localhost:' + PORT, done);
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.jade', ['html']);
  gulp.watch('src/styles/**/*.styl', ['css']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch(['*/README.md'], ['slides']);
  gulp.watch(['*/src/**/*', '*/dist/thumb.png'], ['bundle']);
  gulp.watch([
    'src/scripts/**/*.js',
  ], ['js']);
});

gulp.task('build', ['slides', 'js', 'html', 'css', 'images', 'bundle']);

gulp.task('serve', ['bundle', 'slides', 'open', 'watch']);

gulp.task('default', ['build']);
