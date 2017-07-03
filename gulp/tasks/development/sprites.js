/**
 * Created by tarojiang on 2017/6/19.
 */
const gulp = require('gulp');
const path = require('path');
const through = require('through2');
const postcss = require('gulp-postcss');
const sprites = require('postcss-sprites');
const config = require('../../config');

gulp.task('sprites', () => {
  const processors = [
    sprites(config.sprites)
  ];

  return gulp.src(path.join(config.destFilePath, '**/*.css'), {base: config.destPath})
    .pipe(postcss(processors))
    .pipe(gulp.dest(config.destPath));
});