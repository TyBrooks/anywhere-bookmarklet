var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');

var paths = {
  vendorScripts: "public/javascripts/vendor/*.js",
  bookmarklet: "public/javascripts/bookmarklet.js",
  servejs: "public/javascripts/serve_bookmarklet.js",
  css: ["public/stylesheets/bookmarklet.css"]
}

gulp.task('default', ['minify', 'watch', 'move-css'])

gulp.task('minify', ['min-js', 'min-servejs']);

gulp.task('min-js', function() {
  gulp.src([paths.vendorScripts, paths.bookmarklet])
    .pipe(uglify("bookmarklet.js"))
    .pipe(gulp.dest('public/bookmarklet/api'))
})

gulp.task('min-servejs', function() {
  gulp.src(paths.servejs)
    .pipe(uglify("serve_bookmarklet.js"))
    .pipe(gulp.dest('public/bookmarklet/api'))
})

gulp.task('watch', function() {
  var serveWatch = gulp.watch('paths.servejs', ['min-servejs']);
  var scriptWatch = gulp.watch([paths.bookmarklet, paths.vendorScripts], ['min-js']);
  var cssWatch = gulp.watch(paths.css, ['css-watch']);
})

gulp.task('move-css', function() {
  gulp.src(paths.css)
    .pipe(gulp.dest('public/bookmarklet/api'))
})