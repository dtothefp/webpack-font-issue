import {resolve} from 'path';
import webpack from 'webpack';
import eslintConfig from '../eslint/eslint-config';
import formatter from 'eslint-friendly-formatter';
import makeLoaders from './loaders';
import makePlugins from './plugins';
import autoprefixer from 'autoprefixer-core';

export default function(config) {
  const {ENV, sources} = config;
  let {
    addbase,
    srcDir,
    entry,
    devHost,
    devPort,
    hotPort,
    buildDir
  } = sources;
  const isDev = ENV === 'DEV';
  let rules = eslintConfig({ENV});
  let {preLoaders, loaders} = makeLoaders({ENV});
  let plugins = makePlugins({ENV});

  return config = {
    context: addbase(srcDir),
    entry: {
      main: entry
    },
    output: {
      path: addbase(buildDir),
      publicPath: isDev ? `http://${devHost}:${hotPort}/` : `http://${devHost}:${devPort}/`, //add cdn path here
      filename: 'js/[name].js'
    },
    eslint: {
      rules,
      configFile: resolve(__dirname, '..', 'eslint/es6-config.json'),
      formatter,
      emitError: true,
      emitWarning: true,
      failOnWarning: true,
      failOnError: true
    },
    externals: {
      jquery: 'jQuery'
    },
    module: {
      preLoaders,
      loaders
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.scss', '.css']
    },
    devtool: 'sourcemap',
    postcss: [
      autoprefixer
    ],
    plugins
  };
}
