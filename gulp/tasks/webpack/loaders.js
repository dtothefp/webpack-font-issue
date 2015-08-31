import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default function(opts) {
  var {ENV, includePaths} = opts;
  const DEBUG = ENV === 'DEV';
  let jsxLoader, sassLoader, cssLoader;
  let fileLoader = 'file-loader?name=[path][name].[ext]';

  let htmlLoader = [
    'file-loader?name=[path][name].[ext]',
    'template-html-loader?' + [
      'raw=true',
      'engine=lodash',
      'debug=' + DEBUG
    ].join('&')
  ].join('!');

  let jsonLoader = ['json-loader'];

  let sassParams = [
    'sourceMap'
  ];

  if(includePaths && Array.isArray(includePaths)) {
    includePaths.reduce((list, fp) => {
      list.push(`includePaths[]=${fp}`);
      return list;
    }, sassParams);
  }

  if (DEBUG) {
    jsxLoader = [];
    jsxLoader.push('babel-loader?optional[]=runtime&stage=0&plugins=rewire');

    sassLoader = [
      'style-loader',
      'css-loader?sourceMap&importLoaders=2',
      'postcss-loader',
      `sass-loader?${sassParams.join('&')}`
    ].join('!');

  } else {
    jsxLoader = ['babel-loader?optional[]=runtime&stage=0'];

    sassLoader = ExtractTextPlugin.extract('style-loader', [
      'css-loader?sourceMap&importLoaders=2',
      'postcss-loader',
      `sass-loader?${sassParams.join('&')}`
    ].join('!'));
  }

  var preLoaders = [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    }
  ];

  var loaders = [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: jsxLoader
    },
    {
      test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg$|\.eot$|\.woff$|\.ttf$|\.woff2($|\?)/,
      loader: fileLoader
    },
    {
      test: /\.html$/,
      loader: htmlLoader
    },
    {
      test: /\.scss$/,
      loader: sassLoader
    }
  ];

  return {preLoaders, loaders};
}
