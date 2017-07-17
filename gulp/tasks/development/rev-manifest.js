/**
 * Created by tarojiang on 2017/7/12.
 */
const gulp = require('gulp');
const path = require('path');
const rev = require('gulp-rev');
const config = require('../../config');

gulp.task('development:manifest', () => {
  return gulp.src(config.manifest.list.concat('!**/*.map'), {base: config.destPath})
    .pipe(rev())
    .pipe(rev.manifest(config.manifest))
    .pipe(gulp.dest(config.destPath));
});