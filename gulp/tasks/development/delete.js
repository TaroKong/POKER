/**
 * Created by tarojiang on 2017/7/13.
 */
const gulp = require('gulp');
const del = require('del');
const config = require('../../config');

gulp.task('delete', (cb) => {
  return del(config.delete);
});