/**
 * Created by tarojiang on 2017/6/19.
 */
const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const rev = require('gulp-rev');
const config = require('../../config');

gulp.task('styles', () => {
  return gulp.src(path.join(config.filePath, '**/*.?(s)css'), config.gulpSrc)
    .pipe(sass(config.sass).on('error', sass.logError))
    .pipe(gulp.dest(config.gulpDest()));
});