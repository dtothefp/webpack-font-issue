import {readdirSync as read, statSync as stat, existsSync as exists} from 'fs';
import _ from 'lodash';
import path, {join} from 'path';
import yargs from 'yargs';
import gulp from 'gulp';
import pluginFn from 'gulp-load-plugins';
import makeConfig from './make-config';

var argv = yargs
            .usage('Usage: $0 <gulp> $1 <gulp_task> [-e <environment> -f <file_to_test>]')
            .alias('e', 'ENV')
            .alias('f', 'file')
            .argv;

/**
 * Environment defaults to `DEV` unless CLI arg -e is specified or `gulp build`
 */
if(!argv.ENV) {
  if(process.argv.indexOf('watch') !== -1) {
    argv.ENV = 'DEV';
  }
}

var keys = Object.keys(argv);
var cliConfig = keys.filter((arg) => {
  //filter out alias argvs
  return arg.length > 1 && !/\$/.test(arg);
}).reduce((o, arg, i) => {
  let val = argv[arg];
  if(!_.isBoolean(val)) {
    o[arg] = val;
  }

  //set default environment to `DEV`
  if(i === keys.length - 1 && !_.has(argv, 'ENV')) {
    o.ENV = 'DEV';
  }

  //TODO: set this in a smarter way
  if(o.ENV === 'DEV' || o.ENV === 'dev') {
    o.ENV = o.ENV.toUpperCase();
    process.env.DEV = true;
  }

  return o;
}, {});

const plugins = pluginFn({
  lazy: false,
  pattern: [
    'gulp-*',
    'gulp.*',
    'del',
    'run-sequence',
    'browser-sync'
  ],
  rename: {
    'gulp-util': 'gutil',
    'run-sequence': 'sequence'
  }
});
const config = makeConfig(cliConfig);
let {sources} = config;
const tasksDir = sources.addbase(sources.taskDir);

/**
 * Load all gulp task functions to access on the `tasksMap` Object. Passes
 * the `gulp` object, all plugins with `gulp-` prefix in `package.json` and
 * the entire `config` object from `./gulp/config` for access into gulp task
 * callback functions.
 * @param {String} path to the gulp task callback
 * @return {Function} callback function for use in `gulp.task`
 */
var getTask = (taskPath) => {
  return require(taskPath)(gulp, plugins, config);
};

/**
 * Strips dashes from string and converts the following character to uppercase
 * @param {String} potentially has dashes
 * @return {String} if string contains dashes they are stripped and following character to uppercase
 */
var dashToCamel = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * Creates an object with keys corresponding to the Gulp task name and
 * values corresponding to the callback function passed as the second
 * argument to `gulp.task`
 * @param {Array} all fill and directory names in the `gulp/task` directory
 * @return {Object} map of task names to callback functions to be used in `gulp.task`
 */
var tasksMap = read(tasksDir).reduce( (o, name) => {
  let taskPath = join(tasksDir, name);
  let isDir = stat(taskPath).isDirectory();
  var taskName;
  if( isDir ) {
    if( !exists(join(taskPath, 'index.js')) ) {
      throw new Error(`task ${name} directory must have filename index.js`);
    }
    taskName = name;
  } else {
    taskName = path.basename(name, '.js');
  }
  o[ dashToCamel(taskName) ] = getTask(taskPath);
  return o;
}, {});

export default tasksMap;
export var {ENV} = cliConfig;
export {plugins};
