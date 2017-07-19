/**
 * Created by tarojiang on 2017/7/18.
 */
const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const path = require('path');
const config = require('../../config');

gulp.task('production:cssnano', () => {
  return gulp.src(path.join(config.destFilePath, '**/*.css'), {base: config.destPath})
    .pipe(cssnano(config.cssnano))
    .pipe(gulp.dest(config.destPath));
});