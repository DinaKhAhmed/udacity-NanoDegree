var gulp = require('gulp'),
	uglify = require('gulp-uglify'),//Minify JS
	minifyCSS = require('gulp-minify-css'),// Minify CSS
	htmlmin = require('gulp-htmlmin')//Minify CSS
rename = require('gulp-rename') // Rename Folders and Files Plugin

// Dev and Build Folders Paths
var paths = {
	scripts: ['src/js/*.js', 'src/js/*/*.js'],
	styles: ['src/css/*.css', 'src/css/*/*.css'],
	content: ['src/*.html'],
	copy: ['src/js/*.json']
}


// Uglifies js files and outputs them to dist/js
gulp.task('scripts', function () {
	return gulp.src(paths.scripts)
		.pipe(uglify())
		.pipe(gulp.dest('dist/js/'));
});

// Minifies css files and outputs them to dist/css
gulp.task('styles', function () {
	return gulp.src(paths.styles)
		.pipe(minifyCSS())
		.pipe(gulp.dest('dist/css/'));
});

// Minifies HTML and outputs it to dist
gulp.task('content', function () {
	return gulp.src(paths.content)
		.pipe(htmlmin({ collapseWhitespace: true, removeComments: true, minifyCSS: true, minifyJS: true, removeOptionalTags: true }))
		.pipe(gulp.dest('dist'));
});

// Copy the .ico file to dist
gulp.task('copy', function () {
	return gulp.src(paths.copy)
		.pipe(gulp.dest('dist/js'));
});

// Watches for changes and execute appropriate tasks
gulp.task('watch', function () {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.content, ['content']);
});

gulp.task('default', ['scripts', 'styles', 'content', 'copy', 'watch']);

