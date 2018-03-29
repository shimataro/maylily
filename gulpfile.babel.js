import path from "path";
import gulp from "gulp";
import babel from "gulp-babel";

gulp.task("build", ["build-js"]);

gulp.task("build-js", () =>
{
	const src = path.resolve("src");
	const dist = path.resolve("dist");

	return gulp.src(path.join(src, "**", "*.es"))
		.pipe(babel())
		.pipe(gulp.dest(dist));
});

gulp.task("watch", ["watch-gulpfile", "watch-js"]);

gulp.task("watch-gulpfile", () =>
{
	return gulp.watch("gulpfile.babel.js", ["build"]);
});

gulp.task("watch-js", () =>
{
	return gulp.watch("src/**/*.es", ["build-js"]);
});
