export default function(gulp, plugins, config) {
  const {browserSync} = plugins;
  const {sources} = config;
  const {devPort, buildDir} = sources;

  return (cb) => {
    browserSync({
      server: buildDir,
      port: devPort
    }, cb);
  };
}
