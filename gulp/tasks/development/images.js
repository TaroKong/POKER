/**
 * Created by tarojiang on 2017/6/26.
 */
const gulp = require('gulp');
const path = require('path');
const config = require('../../config');

gulp.task('images', () => {
  return gulp.src([path.join(config.filePath, '**/*.{png,jpg,gif}'), `!${path.join(config.srcPath, '**/slice/**')}`], config.gulpSrc)
    .pipe(gulp.dest(config.destPath))
});