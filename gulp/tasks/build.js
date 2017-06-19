/**
 * Created by tarojiang on 2017/6/14.
 */
const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('build', (cb) => {
  runSequence(
    'webpack:build',
    'html:build',
    cb
  );
});