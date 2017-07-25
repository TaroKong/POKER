/**
 * Created by tarojiang on 2017/7/12.
 */
const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('production:build', (cb) => {
  runSequence(
    'delete:pre',
    'webpack',
    ['styles', 'images'],
    'development:sprites',
    'autoprefixer',
    'assets',
    'production:cssnano',
    'production:manifest',
    ['production:sprites', 'production:template'],
    'delete:post',
    cb
  );
});
