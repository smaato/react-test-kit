'use strict';

var istanbul = require('browserify-istanbul');

module.exports = function(config) {
  config.set({
    frameworks: [
      'phantomjs-shim',
      'browserify',
      'jasmine'
    ],
    basePath: '',
    // Specify the JS to compile to create a functioning test environment.
    files: [
      'node_modules/react/dist/react-with-addons.js',
      'node_modules/babel-core/browser-polyfill.js',
      'src/**/*.js'
    ],
    browsers: ['PhantomJS'],
    // The reporters with which to surface test results.
    reporters: [
      'dots',
      'coverage'
    ],
    coverageReporter: {
      dir: 'reports/coverage'
    },
    // Specify preprocessors through which files should be run, excluding test
    // files.
    preprocessors: {
      'src/**/*.js': ['browserify']
    },
    // Configuration for the above `browserify` preprocessor.
    browserify: {
      debug: true,
      transform: ['babelify', 'browserify-istanbul']
    }
  });
};
