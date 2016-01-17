//==============//
// DEPENDENCIES //
//==============//

// Local dependencies.
var pkg = require('./package.json');

// Node dependencies.
var fs = require('fs');

// Third-party dependencies.
var del = require('del');
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var header = require('gulp-header');


//=========//
// GLOBALS //
//=========//


//=======//
// CLEAN //
//=======//

gulp.task('clean', function (callback) {
  del(['dist'], callback);
});


//=======//
// BUILD //
//=======//

gulp.task('build', ['clean'], function () {
  var headerContent = fs.readFileSync('src/header.js', 'utf8');
  return gulp
    .src([
      './src/module.js'
    ])
    .pipe(concat('betsol-load-on-demand.js'))
    .pipe(header(headerContent, { pkg : pkg } ))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(header(headerContent, { pkg : pkg } ))
    .pipe(rename('betsol-load-on-demand.min.js'))
    .pipe(gulp.dest('dist'))
    .on('error', gutil.log)
  ;
});


//==============//
// DEFAULT TASK //
//==============//

gulp.task('default', ['build']);
