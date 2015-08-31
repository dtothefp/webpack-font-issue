import {join} from 'path';

export default function(gulp, plugins, config) {
  let {del} = plugins;
  let {sources} = config
  let {addbase, buildDir} = sources;

  return (cb) => {
    del([
      addbase(buildDir)
    ], cb);
  };
}
