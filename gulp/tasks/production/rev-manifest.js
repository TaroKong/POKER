/**
 * Created by tarojiang on 2017/7/12.
 */
const gulp = require('gulp');
const path = require('path');
const glob = require('glob');
const through = require('through2');
const rev = require('gulp-rev');
const del = require('del');
const config = require('../../config');
let revManifest = {};
try {
  revManifest = require(config.manifest.path);
} catch(e){}

const operateDelete = () => {
  const cache = [];

  return through.obj(function (file, enc, cb) {
    cache.push(file.relative);
    cb(null, file);
  }, function (cb) {
    config.manifest.list.forEach((item) => {
      let willDelete = revManifest[path.relative(config.destPath, item)];

      if (willDelete && !~cache.indexOf(willDelete)) {
        config.delete.push(path.join(config.destPath, willDelete));
      }
    });

    cb();
  });
};

gulp.task('production:manifest', () => {
  config.delete = config.delete.concat(config.manifest.list);

  return gulp.src(config.manifest.list.concat('!**/*.map'), {base: config.destPath})
    .pipe(rev())
    .pipe(operateDelete())
    .pipe(gulp.dest(config.destPath))
    .pipe(rev.manifest(config.manifest))
    .pipe(gulp.dest(config.destPath));
});