'use strict';

try{
// Load plugins
var gulp             = require('gulp');
var less             = require('gulp-less');
var autoprefixer     = require('gulp-autoprefixer');
var cleancss         = require('gulp-clean-css');
var uglify           = require('gulp-uglify');
var rename           = require('gulp-rename');
var del              = require('del');
var concat           = require('gulp-concat');
var notify           = require('gulp-notify');
var debug            = require('gulp-debug');
var gulpthemeless    = require('gulp-theme-less');
var plumber          = require('gulp-plumber');
var livereload       = require('gulp-livereload');
var express          = require('express');
}catch (e) {

  console.log(e.toString());
  console.log('Please run `npm install`\n');
  process.exit(1);
 
}

// function startExpress() {
//   var express = require('express');
//   var app = express();
//   app.use(require('connect-livereload')({port: 35729}));
//   app.use(express.static(__dirname));
//   app.listen(8080);
//   console.log("Application Started", "Listening on Port 8080")
// }

gulp.task('express', function(){
  var express = require('express');
  var app = express();
  var port = 8080;
  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(__dirname));
  app.listen(port);
  console.log(`Serving express at localhost:${port}`);
});

var lr;
gulp.task('livereload', function(){
  lr = require('tiny-lr')();
  lr.listen(35729);
});

// var tinylr;
// gulp.task('livereload', function() {
//   tinylr = require('tiny-lr')();
//   tinylr.listen(35729);
// });

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  lr.changed({
    body: {
      files: [fileName]
    }
  });
}


gulp.task('global-styles', function(){
    return gulp.src("less/bootstrap.less")
    .pipe(plumber())
    .pipe(debug({verbose: true}))
    .pipe(concat('globals.css'))    
    .pipe(less({compatability: "*"}))
    .pipe(gulp.dest('globals'))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(cleancss({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('globals/'))
    .pipe(livereload());
});

// WATCH TASKS

gulp.task('gcss', function(){
    gulp.watch(['theme/variables.less', 'less/*.less'], ['global-styles'], notifyLiveReload);
    gulp.watch('theme/variables.less', notifyLiveReload);
    gulp.watch('less/*.less', notifyLiveReload);
});

gulp.task('default', ['gcss', 'express', 'livereload'], function(){});


