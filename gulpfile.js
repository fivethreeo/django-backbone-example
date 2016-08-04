
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var prompt = require('prompt');
var async = require('async');
var request = require('request');
var ftp = require('vinyl-ftp');
var File = require('vinyl');

function vinyl_file_gulpstream(vinylfile) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(vinylfile)
    this.push(null)
  }
  return src
}

gulp.task('js', function (callback) {

  var requirejs = require('requirejs');

  var config = {
      baseUrl: '',
      name: 'main',
      include: [
        'requireLib',
        'text',
        'jquery',
        'underscore',
        'bootstrap',
        'backbone',
        'select2',
        'backbone-filter'
      ],
      optimize: "uglify",
      out: 'static/main.js',
      // The shim config allows us to configure dependencies for
      // scripts that do not call define() to register a module
      'shim': {
          'underscore': {
              'exports': '_'
          },
          'backbone': {
              'deps': [
                  'underscore',
                  'jquery'
              ],
              'exports': 'Backbone'
          }
      },
      'paths': {
          'jquery': 'bower_components/jquery/dist/jquery',
          'underscore': 'bower_components/underscore/underscore',
          'backbone': 'bower_components/backbone/backbone',
          'backbone-filter': 'bower_components/backbone-filtered-collection/backbone-filtered-collection',
          'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',
          'text': 'bower_components/text/text',
          'select2': 'bower_components/select2/dist/js/select2',
          'requireLib': 'bower_components/requirejs/require',
          'backbone.validation': 'bower_components/backbone.validation/src/backbone-validation-amd',
          'backbone.stickit': 'bower_components/backbone.stickit/backbone.stickit'

      }
  };

  return requirejs.optimize(config, function (res) {
    callback();
  }, function(err) {
    console.log(err);
  });

});

gulp.task('sass', function () {

  gulp.src('sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      style: 'compressed',
      includePaths: [ 
      path.join(__dirname, 'bower_components', 'bootstrap-sass', 'assets', 'stylesheets'),
      path.join(__dirname, 'bower_components'),
      path.join(__dirname, 'sass')
    ]}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(path.join(__dirname, 'static')));

});

gulp.task('copy', function() {
  gulp.src([path.join(__dirname, 'bower_components', 'bootstrap', 'fonts') + '/**/*' ])
    .pipe(gulp.dest(path.join(__dirname, 'static', 'fonts')));
});

gulp.task('build', ['js', 'sass', 'copy'], function () {
   
});

gulp.task('deploy', [], function (callback) {

    var urls = {
      'dishes_flat': "http://127.0.0.1:8000/api/v1/dishes_flat?limit=1000",
      'sopin_dishtypes': "http://127.0.0.1:8000/api/v1/sopin_dishtypes?limit=1000",
      'dishtypes': "http://127.0.0.1:8000/api/v1/dishtypes?limit=1000",
      'restaurants': "http://127.0.0.1:8000/api/v1/restaurants?limit=1000",
      'kitchens': "http://127.0.0.1:8000/api/v1/kitchens?limit=1000",
      'indgredients': "http://127.0.0.1:8000/api/v1/indgredients?limit=1000"
    }

    var conn = ftp.create( {
        host:     'ftp.domeneshop.no',
        user:     'hongri',
        password: '8U7ihP#x',
        parallel: 10,
        log:      gutil.log
    } );

    async.waterfall([function(cb) {
        var globs = [
          'static/**/**'
        ];
        gulp.src( globs, { base: './static/', buffer: false } )
          .pipe( conn.newer( '/www/static/' ) ) // only upload newer files
          .pipe( conn.dest( '/www/static/' ) ).on('end', function() { cb(); });
      },
      function(cb) {
        var globs = [
          'nobuild_static/**/**'
        ];
        gulp.src( globs, { base: './nobuild_static/', buffer: false } )
          .pipe( conn.newer( '/www/static/' ) ) // only upload newer files
          .pipe( conn.dest( '/www/static/' ) ).on('end', function() { cb(); });
      },
      function(cb) {
        var globs = [
          'django/sopin/templates/**/**'
        ];
        gulp.src( globs, { base: './django/sopin/templates/', buffer: false } )
          .pipe( conn.newer( '/www/' ) ) // only upload newer files
          .pipe( conn.dest( '/www/' ) ).on('end', function() { cb(); });
      },
      function(cb) {
        async.each(Object.keys(urls), function (key, urlcb) {
          console.log(urls[key]);
          request({
            url: urls[key],
            json: true
          },
          function (error, response, body) {
            if (!error && response.statusCode === 200) {
              console.log(JSON.stringify(body)) // Print the json response
              var jsonFile = new File({
                cwd: ".",
                base: ".",
                path: key+".json",
                contents: new Buffer(JSON.stringify(body))
              });
              vinyl_file_gulpstream(jsonFile)
                .pipe( conn.dest( '/www/' ) ).on('end', function() { urlcb() });
            }
          });

        }, function () {
          cb();
        });

        cb();
      }], function() {
      callback();

    })

});