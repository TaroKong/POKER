/**
 * Created by tarojiang on 2017/6/14.
 */
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const through = require('through2');
const replace = require('gulp-replace');
const revReplace = require('gulp-rev-replace');
const config = require('../../config');

const preRevReplace = () => {
  let cache = [];

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
    } else {
      cache.push(file);
    }

    cb();
  }, function (cb) {
    const stream = this;
    const revManifest = require(config.manifest.path);

    cache.forEach((file) => {
      let contents = file.contents.toString().replace(/(src|href|url)[=\(]([\'\"]?)([\w\-\.\/\\]+)\2\)?/ig, (w, w1, w2, w3) => {
        w3 = w3.replace('\\', '/');

        let _path = path.relative(config.srcPath, path.dirname(file.path));

        if (revManifest[path.join(_path, w3)]) {
          _path = path.join(_path, w3);
        } else {
          _path = w3;
        }

        return `${w1}${w1 == 'url' ? '(' : '='}${w2}${_path}${w2}${w1 == 'url' ? ')' : ''}`;
      });

      file.contents = new Buffer(contents);

      stream.push(file);
    });

    cb();
  });
};

gulp.task('template', () => {
  return gulp.src(path.join(config.filePath, '**/*.html'), {base: path.join(config.srcPath, 'page')})
    // .pipe(preRevReplace())
    // .pipe(revReplace(Object.assign({
    //   manifest: gulp.src(config.manifest.path),
    //   replaceInExtensions: ['.html']
    // }, config.revReplace)))
    .pipe(gulp.dest(config.gulpDest('template')));
});