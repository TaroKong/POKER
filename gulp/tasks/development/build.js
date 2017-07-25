/**
 * Created by tarojiang on 2017/7/12.
 */
const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('development:build', (cb) => {
  runSequence(
    'delete:pre',
    'webpack',
    ['styles', 'images'],
    'development:sprites',
    'autoprefixer',
    'assets',
    // 'development:cssnano',
    'development:manifest',
    'production:template',
    'delete:post',
    cb
  );
});
