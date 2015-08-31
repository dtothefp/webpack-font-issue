import {join} from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import makeConfig from './make-config';
import open from 'open';

export default function(gulp, plugins, config) {
  const {ENV, sources} = config;
  let {addbase, buildDir, hotPort} = sources;
  const {gutil, browserSync} = plugins;
  const isDev = ENV === 'DEV';
  const webpackConfig = makeConfig(config);
  const {publicPath} = webpackConfig.output;

  return (cb) => {
    const compiler = webpack(webpackConfig);

    const logger = (err, stats) => {
      if(err) {
        throw new new gutil.PluginError({
          plugin: `[webpack]`,
          message: err.message
        });
      }

      if(!isDev) {
        gutil.log(stats.toString());
      }
    };

    compiler.plugin('compile', () => {
      gutil.log(`Webpack Bundling`);
    });

    compiler.plugin('done', (stats) => {
      gutil.log(`Webpack Bundled in ${stats.endTime - stats.startTime}ms`);

      if (stats.compilation.errors && stats.compilation.errors.length) {
        stats.compilation.errors.forEach((err) => gutil.log(err.message));
        if(ENV !== 'DEV') {
          process.exit(1);
        }
      }

      //avoid multiple calls of gulp callback
      if(cb && typeof cb === 'function') {
        let gulpCb = cb;
        cb = null;

        if(isDev) {
          open(publicPath);
        }

        gulpCb();
      } else {
        browserSync && browserSync.reload();
      }
    });

    if(isDev) {
      new WebpackDevServer(compiler, {
        contentBase: addbase(buildDir),
        publicPath,
        hot: true,
        quiet: false,
        noInfo: false,
        watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
        },
        headers: { 'X-Custom-Header': 'yes' },
        stats: { colors: true }
      }).listen(hotPort, 'localhost', logger);
    } else {
      compiler.watch({
        aggregateTimeout: 300,
        poll: true
      }, logger);
    }
  };
}
