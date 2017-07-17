/**
 * Created by tarojiang on 2017/7/12.
 */
const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('development:build', (cb) => {
  runSequence(
    'webpack',
    ['styles', 'images'],
    'sprites',
    'assets',
    'development:manifest',
    'template',
    'delete',
    cb
  );
});