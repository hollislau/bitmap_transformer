const gulp = require("gulp");
const eslint = require("gulp-eslint");
const mocha = require("gulp-mocha");

var files = ["index.js", "lib/**/*.js", "bin/*", "gulpfile.js"];

gulp.task("lint:test", () => {
  return gulp.src("./test/**/*test.js")
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format());
});

gulp.task("lint:nontest", () => {
  return gulp.src(files)
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format());
});

gulp.task("test", () => {
  return gulp.src("./test/bm_trans_test.js")
    .pipe(mocha({
      "reporter": "nyan"
    }));
});

gulp.task("lint", ["lint:nontest", "lint:test"]);

gulp.task("watch", () => {
  gulp.watch(files, ["lint"]);
  gulp.watch("./lib/bm_trans.js", ["test"]);
});

gulp.task("default", ["lint", "test", "watch"]);
