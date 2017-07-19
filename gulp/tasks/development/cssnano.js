/**
 * Created by tarojiang on 2017/7/18.
 */
const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');
const config = require('../../config');

gulp.task('development:cssnano', () => {
  return gulp.src(path.join(config.destFilePath, '**/*.css'), {base: config.destPath})
    .pipe(sourcemaps.init())
    .pipe(cssnano(config.cssnano))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.destPath));
});