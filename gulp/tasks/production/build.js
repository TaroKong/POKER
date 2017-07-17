/**
 * Created by tarojiang on 2017/7/12.
 */
const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('production:build', (cb) => {
  runSequence(
    'webpack',
    ['styles', 'images'],
    'sprites',
    'assets',
    'production:manifest',
    'template',
    'delete',
    cb
  );
});