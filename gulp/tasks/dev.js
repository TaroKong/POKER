/**
 * Created by tarojiang on 2017/6/19.
 */
const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('dev', (cb) => {
  runSequence(
    'webpack:build',
    'html:build',
    cb
  );
});