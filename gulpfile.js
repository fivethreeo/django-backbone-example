var gulp = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');

gulp.task('less', function () {
  var LessPluginCleanCSS = require("less-plugin-clean-css"),
      cleancss = new LessPluginCleanCSS({advanced: true});
  
  var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
      autoprefix= new LessPluginAutoPrefix({browsers: ["last 2 versions"]});
  
  
  gulp.src('./less/*.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [ path.join(__dirname, 'bower_components') ],
      plugins: [autoprefix, cleancss]
     }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./app/css'));

});
