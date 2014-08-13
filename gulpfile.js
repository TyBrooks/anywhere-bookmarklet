var gulp = require('gulp');
var uglify = require('gulp-uglify');

var paths = {
  vendorScripts: ["!public/javascripts/vendor/jquery*", "public/javascript/vendor/*.js"],
  bookmarklet: "public/javascripts/bookmarklet.js",
  jquery: "public/javascripts/jquery-1.11.1.js",
  css: ["public/stylesheets/bookmarklet.css"]
}

gulp.task('default', function() {
  
})

gulp.task('minify', ['min-vendorjs', 'min-jquery', 'min-bookmarklet']);

gulp.task('min-vendorjs', function() {
  gulp.src(paths.vendorScripts)
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})

gulp.task('min-jquery', function() {
  gulp.src("public/javascripts/jquery-1.11.1.js")
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})

gulp.task('min-bookmarklet', function() {
  gulp.src(paths.bookmarklet)
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})

gulp.task('min-css', function() {
  gulp.src(paths.jquery)
    .pipe(minifier())
    .pipe(gulp.dest('dist'))
})