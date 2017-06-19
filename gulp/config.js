/**
 * Created by tarojiang on 2017/6/14.
 */
const gulp = require('gulp');
const path = require('path');
const webpack = require('webpack');
const yargs = require('yargs');
const cwd = process.cwd();

const argv = yargs.argv;
const ENV = ~['dev', 'test', 'build'].indexOf(argv._[0]) ? argv._[0] : 'dev';

let srcPath = path.join(cwd, 'src');
let destPath = path.join(cwd, ENV);
let manifestPath = path.join(destPath, 'rev-manifest.json');

module.exports = {
  srcPath,
  destPath,
  manifest: {
    path: manifestPath,
    base: destPath,
    merge: true,
    transformer: {
      parse(...args) {
        return JSON.parse(...args);
      },
      stringify(...args) {
        if ('dev' === ENV) {
          Object.keys(args[0]).forEach((key) => {
            args[0][key] = key;
          });
        }

        return JSON.stringify(...args);
      }
    }
  },
  webpack: {
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react']
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          dead_code: true,
          drop_console: true,
          warnings: false
        },
        sourceMap: true
      })
    ]
  },
  revReplace: {
    base: srcPath
  }
};