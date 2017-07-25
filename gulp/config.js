/**
 * Created by tarojiang on 2017/6/14.
 */
const gulp = require('gulp');
const path = require('path');
const gutil = require('gulp-util');
const through = require('through2');
const webpack = require('webpack');
const yargs = require('yargs');
const cwd = process.cwd();

const argv = yargs.argv;
const ENV = ~['dev', 'test', 'build'].indexOf(argv._[0]) ? argv._[0] : 'dev';
const [isDev, isTest, isBuild] = ['dev' === ENV, 'test' === ENV, 'build' === ENV];

// 一些配置项
let srcPath = path.join(cwd, 'src');
let destPath = path.join(cwd, ENV);
let filePath = argv.file ? path.join(cwd, argv.file) : srcPath;
let commonPath = path.join(srcPath, 'common');
let destFilePath = path.join(destPath, path.relative(srcPath, filePath));
let slicePath = path.join(srcPath, 'slice');
let spritePath = path.join(destPath, 'sprites');
let imageExt = ['.jpg', '.png', '.gif'];
let manifestPath = path.join(destPath, 'rev-manifest.json');
let manifestList = [];
const revPrefix = path.join('/POKER', path.relative(cwd, destPath), '/');
const revSuffix = '?max_age=31536000';
const wpExternalModuleName = 'externalModules';

const getCommonNamed = (filePath) => {
  let named = '';

  if (filePath.indexOf(commonPath) === 0) {
    named = path.basename(path.dirname(filePath).replace(path.join(commonPath, 'js'), ''));
  }

  return named;
};

const transPath2Variable = (filePath) => {
  return filePath.replace(new RegExp(`${path.extname(filePath)}$|\/js`, 'ig'), '').replace(/[^a-zA-Z0-9]/g, '_');
};

module.exports = {
  srcPath,
  destPath,
  filePath,
  destFilePath,
  commonPath,
  wpExternalModuleName,
  imageExt,
  // gulp.src 参数
  gulpSrc: {
    base: srcPath
  },
  gulpDest(taskName = '') {
    return (file) => {
      let _destPath = '';
      const _path = path.resolve(destPath, file.relative);

      switch (taskName) {
        case 'images':
          if (~imageExt.indexOf(path.extname(file.relative))) {
            manifestList.push(_path);
          }
          break;
        case 'template':
          _destPath = path.join(destPath, 'template');
          break;
        default:
          if (!~['.map'].indexOf(path.extname(file.relative)) && !~manifestList.indexOf(_path)) {
            manifestList.push(_path);
          }
          break;
      }

      return _destPath || destPath;
    };
  },
  // 将要被删除的文件列表
  delete: [],
  // gulp-rev 参数
  manifest: {
    list: manifestList,
    path: manifestPath,
    base: destPath,
    merge: true,
    transformer: {
      parse(...args) {
        return JSON.parse(...args);
      },
      stringify(...args) {
        if (isDev) {
          Object.keys(args[0]).forEach((key) => {
            args[0][key] = key;
          });
        }

        return JSON.stringify(...args);
      }
    }
  },
  // 私有处理 external 的方法，转换 export 为全局属性或方法
  // 最终允许 js 中 import/require 操作时不将文件打包入其中，而是外部引用
  exteralModuleOperator: () => {
    let cache = {};

    return through.obj(
      function transformFunction(file, enc, cb) {
        if (file.isNull()) {
          this.push(file);
        } else {
          let named = getCommonNamed(file.path);

          if (named) {
            if (!Array.isArray(cache[named])) {
              cache[named] = [];
            }

            cache[named].push(file);
          } else {
            this.push(file);
          }
        }

        cb();
      },
      function flushFunction(cb) {
        const stream = this;

        Object.keys(cache).forEach((named) => {
          let newJsFile = [];
          let variables = [];

          cache[named].reduce((newJsFile, file) => {
            let variable = transPath2Variable(path.relative(srcPath, file.path));

            newJsFile.push(`import * as ${variable} from '${file.path}';\n`);
            variables.push(variable);

            return newJsFile;
          }, newJsFile);

          newJsFile.push(`window.${wpExternalModuleName} = {\n    ...window.${wpExternalModuleName},\n    ${variables.join(',\n    ')}\n};`);

          newJsFile = new gutil.File({
            cwd: cwd,
            base: srcPath,
            path: path.join(commonPath, 'js', `.${wpExternalModuleName}`, `${named}.js`),
            contents: new Buffer(newJsFile.join('\n'))
          });

          stream.push(newJsFile);
        });

        cb();
      }
    );
  },
  // webpack 打包参数
  webpack: {
    output: {
      filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: srcPath,
          enforce: 'pre',
          use: [{
            loader: 'eslint-loader'
          }]
        },
        {
          test: /\.jsx?$/,
          include: srcPath,
          // exclude: /(node_modules)/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-0', 'react']
            }
          }]
        }
      ]
    },
    plugins: (() => {
      const plugins = [];

      !isDev && plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
          dead_code: true,
          drop_console: true,
          warnings: false
        },
        sourceMap: true
      }));

      return plugins;
    })(),
    resolve: {
      alias: {
        'common': path.join(commonPath, 'js')
      }
    },
    externals: [
      function (context, request, cb) {
        /**
         * 可以使用外部引用的条件
         * 1. request 的是 common 下的 js 文件
         * 2. request 的是 common 下存在子级的 js 文件
         *
         * 否则使用 alias 中的配置
         */

        if (request.indexOf('common') === 0 && path.dirname(request) !== 'common') {
          return cb(null, `window.${wpExternalModuleName}.${transPath2Variable(request)}`);
        }

        cb();
      }
    ]
  },
  // gulp-rev-replace 资源替换
  revReplace: {
    base: destPath,
    prefix: revPrefix,
    modifyReved(reved) {
      // 静态资源后缀，会自动为 img、css、js 等资源添加后缀
      return isDev ? reved : `${reved}${revSuffix}`;
    }
  },
  // named 参数
  named(file) {
    const extname = path.extname(file.path);

    if (~file.path.indexOf(`.${wpExternalModuleName}`)) {// 将 .${wpExternalModuleName} 下的文件打包输出
      return path.join(
        path.relative(srcPath, path.join(commonPath, 'js')),
        path.basename(file.path.split(`.${wpExternalModuleName}/`)[1].replace(new RegExp(`${extname}$`, 'i'), ''))
      );
    }

    return path.relative(srcPath, file.path).replace(new RegExp(`${extname}$`, 'i'), '');
  },
  // gulp-sass 参数
  sass: {
    includePaths: [srcPath],
    // outputStyle: 'expanded' // isDev ? 'expanded' : 'compressed'
  },
  // postcss-sprites 参数
  sprites: {
    basePath: srcPath,
    // 合并后的雪碧图存放的地址
    spritePath: spritePath,
    // 生成雪碧图后的样式表的存放地址
    stylesheetPath: null, // path.join(destPath, '**', '*.css'),
    spritesmith: {padding: 4},
    filterBy: (image) => {
      if (!~image.path.indexOf(slicePath)) {
        return Promise.reject();
      }
      return Promise.resolve();
    },
    // 将图片分组，可以实现按照文件夹生成雪碧图
    groupBy: (image) => {
      // console.log(image);
      let groupName = (path.dirname(image.styleFilePath).replace(`${path.join(destPath, 'page')}`, '').replace(/(^\/|\/$)/, '') || 'uncredited').split('/');

      if (~image.styleFilePath.indexOf(path.join(destPath, 'common'))) {
        groupName = ['common'];
      }

      return Promise.resolve(groupName.join('.'));
    },
    hooks: {
      onSaveSpritesheet(opts, {groups, extension}) {
        const _path = path.join(opts.spritePath, ['sprite', ...groups, extension].join('.'));

        manifestList.push(_path);

        return _path;
      }
    }
  },
  // postcss-assets 参数
  assets: {
    // 图片搜索路径
    loadPaths: [path.join(destPath, '**'), path.join(srcPath, '**')],
    // 图片路径是否使用相对于 css 文件的路径
    relative: true
  },
  preRevReplace() {
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
      let revManifest = {};
      try {
        revManifest = require(manifestPath);
      } catch (e) {
      }

      cache.forEach((file) => {
        let contents = file.contents.toString().replace(/(src|href|url)[=\(]([\'\"]?)([\w\-\.\/\\]+)\2\)?/ig, (w, w1, w2, w3) => {
          w3 = w3.replace('\\', '/');

          let _path = path.relative(~file.path.indexOf(srcPath) ? srcPath : destPath, path.dirname(file.path));

          _path = path.join(_path, w3);

          if (!revManifest[_path]) {
            _path = w3;
          }

          return `${w1}${w1 == 'url' ? '(' : '='}${w2}${_path}${w2}${w1 == 'url' ? ')' : ''}`;
        });

        file.contents = new Buffer(contents);

        stream.push(file);
      });

      cb();
    });
  },
  cssnano: {
    zindex: false,
    autoprefixer: false
  },
  autoprefixer: {
    browsers: ['> 5%', 'ie >= 8']
  }
};
