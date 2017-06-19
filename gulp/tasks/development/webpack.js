/**
 * Created by tarojiang on 2017/6/14.
 */
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const filter = require('gulp-filter');
const through = require('through2');
const path = require('path');
const glob = require('glob');
const rev = require('gulp-rev');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');
const config = require('../../config');

const runWebpack = (isBuild = false) => {
  const jsFilter = filter('**/*.js?(x)', {restore: true});

  return gulp.src(path.join(config.srcPath, '**/*.entry.js?(x)'))
    .pipe(named(file => {
      return path.relative(config.srcPath, file.path).replace(new RegExp(`${path.extname(file.path)}$`, 'i'), '');
    }))
    .pipe(webpackStream(config.webpack, webpack))
    .pipe(gulpIf(!isBuild, gulp.dest(config.destPath)))
    .pipe(jsFilter)
    .pipe(rev())
    .pipe(jsFilter.restore)
    .pipe(gulpIf(isBuild, gulp.dest(config.destPath)))
    .pipe(rev.manifest(config.manifest))
    .pipe(gulp.dest(config.destPath));
};

gulp.task('webpack:build', () => {
  return runWebpack(true);
});

gulp.task('webpack', () => {
  return runWebpack();
});

