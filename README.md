Demo of `Failed to decode downloaded font:`

Related to https://github.com/webpack/style-loader/issues/55

*Fonts will load initially with browserSync server but will flicker and then be blocked*

```sh
gulp watch #builds assets and serves from webpack-dev-server
gulp build #builds assets and serves from browser-sync
```

Setup:

```js
let fileLoader = 'file-loader?name=[path][name].[ext]';
let sassParams = [
  'sourceMap'
];

if (/* gulp watch*/) {
  sassLoader = [
    'style-loader',
    'css-loader?sourceMap&importLoaders=2',
    'postcss-loader',
    `sass-loader?${sassParams.join('&')}`
  ].join('!');

} else {
  sassLoader = ExtractTextPlugin.extract('style-loader', [
    'css-loader?sourceMap&importLoaders=2',
    'postcss-loader',
    `sass-loader?${sassParams.join('&')}`
  ].join('!'));
}

loaders: [
  {
    test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg$|\.eot$|\.woff$|\.ttf$|\.woff2($|\?)/,
    loader: fileLoader
  },
  {
    test: /\.scss$/,
    loader: sassLoader
  }
]
```
![](https://s3.amazonaws.com/f.cl.ly/items/3e3u0f370w0Z3g3X1h1n/Image%202015-08-31%20at%205.51.15%20PM.png)
