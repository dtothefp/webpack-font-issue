import gulp from 'gulp';
import tasks, {ENV, plugins as $} from './gulp/config';

const isDev = ENV === 'DEV';

gulp.task('browser-sync', tasks.browserSync);
gulp.task('clean', tasks.clean);
gulp.task('lint', tasks.eslint);
gulp.task('webpack', tasks.webpack);

gulp.task('build', (cb) => {
let tasks = ['clean', 'lint', 'webpack'];
  if(isDev) {
    $.sequence(
      tasks,
      cb
    );
  } else {
    $.sequence(
      tasks,
      'browser-sync',
      cb
    );
  }

});

gulp.task('default', ['build']);

gulp.task('watch', ['build']);
