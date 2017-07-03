/**
 * Created by tarojiang on 2017/6/19.
 */
const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const rev = require('gulp-rev');
const gulpIf = require('gulp-if');
const config = require('../../config');

const runStyle = (isBuild = false) => {
  return gulp.src(path.join(config.filePath, '**/*.?(s)css'), config.gulpSrc)
    .pipe(sass(config.sass).on('error', sass.logError))
    // .pipe(gulpIf(!isBuild, gulp.dest(config.destPath)))
    // .pipe(rev())
    // .pipe(gulpIf(isBuild, gulp.dest(config.destPath)))
    // .pipe(rev.manifest(config.manifest))
    .pipe(gulp.dest(config.destPath));
};

gulp.task('styles:build', () => {
  return runStyle(true);
});

gulp.task('styles', () => {
  return runStyle();
});