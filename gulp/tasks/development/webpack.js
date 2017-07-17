/**
 * Created by tarojiang on 2017/6/14.
 */
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const gutil = require('gulp-util');
const filter = require('gulp-filter');
const through = require('through2');
const path = require('path');
const glob = require('glob');
const rev = require('gulp-rev');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');
const del = require('del');
const config = require('../../config');

gulp.task('webpack', () => {
  const jsFilter = filter(['**/*.js?(x)', '!**/common/js/*.js?(x)'], {restore: true, dot: true});
  const commonFilter = filter('**/common/js/**/*.js?(x)', {restore: true});
  // 不需要打包的文件，如：common/js/*.js?(x) 文件，这部分文件应直接在 html 中使用 script 引入
  const noWBFilter = filter('**/common/js/*.js?(x)', {restore: true});
  let src = [];

  if (config.filePath.indexOf(config.commonPath) === 0) {
    src.push(path.join(config.filePath, '**/*.js?(x)'));
  } else {
    src.push(path.join(config.filePath, '**/*.entry.js?(x)'));

    if (~[config.srcPath, `${config.srcPath}/`].indexOf(config.filePath)) {
      src.push(path.join(config.srcPath, 'common/js/**/*.js?(x)'));
    }
  }

  const wpExternalModule = path.join(config.commonPath, `js/**/.${config.wpExternalModuleName}*/**`);

  // 不打包在 config.exteralModuleOperator 中临时产生的文件
  src.push(`!${wpExternalModule}`);

  // 记录要删除的文件：删除在 config.exteralModuleOperator 中临时产生的文件
  config.delete.push(wpExternalModule);

  // 删除在 config.exteralModuleOperator 中临时产生的文件
  // const delTmpJsFiles = () => {
  //   del.sync(path.join(config.commonPath, `js/**/.${config.wpExternalModuleName}*/**`));
  // };
  //
  // delTmpJsFiles();

  return gulp.src(src, Object.assign({dot: true}, config.gulpSrc))
    .pipe(commonFilter)
    .pipe(config.exteralModuleOperator())
    .pipe(gulp.dest(config.srcPath))
    .pipe(commonFilter.restore)
    .pipe(noWBFilter)
    .pipe(gulp.dest(config.gulpDest()))
    .pipe(noWBFilter.restore)
    .pipe(jsFilter)
    .pipe(named(config.named))
    .pipe(webpackStream(config.webpack, webpack))
    // .pipe(gulpIf(!isBuild, gulp.dest(config.destPath)))
    // .pipe(jsFilter)
    // .pipe(rev())
    // .pipe(jsFilter.restore)
    // .pipe(gulpIf(isBuild, gulp.dest(config.destPath)))
    // .pipe(rev.manifest(config.manifest))
    .pipe(gulp.dest(config.gulpDest()))
    /*.on('finish', () => {
     delTmpJsFiles();
     })*/;
});

