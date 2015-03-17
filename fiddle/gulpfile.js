var gulp = require('gulp');
var uglify = require('gulp-uglify');
var clean = require('gulp-minify-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

gulp.task('css', function () {
  return gulp.src('./css/*.css')
    .pipe(clean({ keepBreaks: true }))
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('plugin', function () {
  return gulp.src([
      './js/plugin.js'
    ])
    .pipe(uglify())
    .pipe(rename('plugin.min.js'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('js', ['plugin'], function () {
  return gulp.src([
      './js/vue.min.js',
      './js/codemirror.js',
      './js/css.js',
      './js/matchbrackets.js',
      './js/ZeroClipboard.min.js',
      './js/app.js'
    ])
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('default', ['css', 'js']);
