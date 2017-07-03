/**
 * Created by tarojiang on 2017/6/26.
 */
const gulp = require('gulp');
const path = require('path');
const postcss = require('gulp-postcss');
const assets = require('postcss-assets');
const config = require('../../config');

gulp.task('assets', () => {
  const processors = [
    assets(config.assets)
  ];

  return gulp.src(path.join(config.destFilePath, '**/*.css'), {base: config.destPath})
    .pipe(postcss(processors))
    .pipe(gulp.dest(config.destPath));
});