/**
 * Created by tarojiang on 2017/7/13.
 */
const gulp = require('gulp');
const path = require('path');
const del = require('del');
const config = require('../../config');

gulp.task('delete:pre', () => {
  return del(path.join(config.destFilePath, '**'));
});

gulp.task('delete:post', () => {
  return del(config.delete);
});
