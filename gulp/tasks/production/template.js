/**
 * Created by tarojiang on 2017/7/17.
 */
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const through = require('through2');
const replace = require('gulp-replace');
const revReplace = require('gulp-rev-replace');
const config = require('../../config');

gulp.task('production:template', () => {
  return gulp.src(path.join(config.filePath, '**/*.html'), {base: path.join(config.srcPath, 'page')})
  .pipe(config.preRevReplace())
  .pipe(revReplace(Object.assign({
    manifest: gulp.src(config.manifest.path),
    replaceInExtensions: ['.html']
  }, config.revReplace)))
  .pipe(gulp.dest(config.gulpDest('template')));
});