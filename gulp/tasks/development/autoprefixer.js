/**
 * Created by tarojiang on 2017/7/18.
 */
const gulp = require('gulp');
const path = require('path');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const config = require('../../config');

gulp.task('autoprefixer', () => {
  const processors = [
    autoprefixer(config.autoprefixer)
  ];

  return gulp.src(path.join(config.destFilePath, '**/*.css'), {base: config.destPath})
    .pipe(postcss(processors))
    .pipe(gulp.dest(config.destPath));
});

