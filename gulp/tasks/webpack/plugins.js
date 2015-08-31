import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';

export default function(opts) {
  let {ENV} = opts;
  const DEBUG = ENV === 'DEV';
  var cssBundle = 'css/[name].css';

  let plugins = [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jquery': 'jquery'
    })
  ];

  let prodPlugins = [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(DEBUG ? 'development' : 'production')
      }
    }),
    new ExtractTextPlugin(cssBundle, {
      allChunks: true
    }),
    new webpack.optimize.DedupePlugin()
  ];

  if(!DEBUG) {
    plugins.push(...prodPlugins);
  }

  return plugins;
}
