
/**
 * @description Dependencies
 */

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var KarmaServer = require('karma').Server;
var watch = require('gulp-watch');

/**
 * @description Configuration
 */

var config = {
  karma: {
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }
};

/**
 * @description Default task
 */

gulp.task('default', [
  'test',
  'watch'
]);

/**
 * @description Watch for changes
 */

gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['test']);
});

/**
 * @description Test related tasks
 */

gulp.task('lint', function() {
  return gulp.src([
    './src/**/*.js'
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .on('error', function(error) {
    throw 'Linting failed';
  });
});

gulp.task('unit', function(callback) {
  return KarmaServer.start(config.karma, function(exitStatus) {
    if (exitStatus) {
      throw 'Unit testing failed';
    } else {
      callback(exitStatus);
    }
  });
});

gulp.task('test', [
  'lint',
  'unit'
]);
