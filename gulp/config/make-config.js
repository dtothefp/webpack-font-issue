import _ from 'lodash';
import {join} from 'path';

export default function(config) {
  let scriptDir = 'js';

  let sources = {
    srcDir: './src',
    testDir: './test',
    taskDir: './gulp/tasks',
    buildDir: './dist',
    devHost: 'localhost',
    devPort: 8000,
    hotPort: 8080,
    libraryName: 'pantsuit',
    addbase(...args) {
      let base = [process.cwd()];
      let allArgs = [...base, ...args];
      return join(...allArgs);
    },
    entry: ['./' + join(scriptDir, './index.js')]
  };

  return _.merge({}, config, {sources});
}
