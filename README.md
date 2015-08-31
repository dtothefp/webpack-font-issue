Demo of `Failed to decode downloaded font:`

```sh
gulp watch #builds assets and serves from webpack-dev-server
gulp build #builds assets and serves from browser-sync
```

Setup:

```js
let fileLoader = 'file-loader?name=[path][name].[ext]';
let sassParams = [
  `outputStyle=${DEBUG ? 'expanded' : 'compressed'}`
];

if (/* gulp watch*/) {
  sassParams.push('sourceMap');

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
<img width="485" alt="screen shot 2015-08-28 at 12 25 33 pm" src="http://cl.ly/image/3d1C0c0A0z2l">
