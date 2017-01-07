'use strict';

import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
const DEST = 'dist';

/**
 * Task jshint
 * Use js lint
 */
gulp.task('jshint', () => {
  return gulp.src([
    'src/js/*.js',
    'gulfile.js',
  ])
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('default'));
});

/**
 * Task jscs
 * Use js cs lint
 */
gulp.task('jscs', () => {
  return gulp.src([
    'src/js/*.js',
    'gulfile.js',
  ])
    .pipe($.jscs('.jscsrc'))
    .pipe($.jscs.reporter());
});

/**
 * Task fonts
 * Move fonts to DEST
 */
gulp.task('fonts', () => {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest(DEST + '/fonts'));
});

/**
 * Task images
 * Apply imagemin and move it to DEST
 */
gulp.task('images', () => {
  return gulp.src('src/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{cleanupIDs: false}],
    }))))
    .pipe(gulp.dest(DEST + '/images'));
});

/**
 * Task styles
 * Apply scss transformation to css
 */
gulp.task('styles', () => {
  return gulp.src('src/scss/*.scss')
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.'],
    }))
    .pipe(gulp.dest('src/css'));
});

/**
 * Task html
 * Apply uglify, minify to src
 */
gulp.task('html', ['styles'], () => {
  return gulp.src('src/**/*.twig')
    .pipe($.useref())
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss()))
    .pipe($.replace(/css\/bundle\.css/, '{{paths.theme}}css/bundle.css'))
    .pipe($.replace(/js\/bundle\.js/, '{{paths.theme}}js/bundle.js'))
    .pipe(gulp.dest(DEST));
});

/**
 * Task theme
 * Move theme.yml file to dest
 */
gulp.task('theme', () => {
  return gulp.src([
    'src/theme.yml',
    'src/favicon.png',
  ])
    .pipe(gulp.dest(DEST));
});

/**
 * Task clean
 * Remove dist directory
 */
gulp.task('clean', () => {
  return del([
    DEST,
    'src/css',
  ]);
});

/**
 * Task watch
 * Launch task default each time a file is modified
 */
gulp.task('watch', ['default'], () => {
  $.watch([
    'src/scss/*.scss',
    'src/views/*.twig',
    'src/views/**/*.twig',
    'src/js/*.js',
  ], $.batch((events, done) => {
    gulp.start('default', done);
  }));
});

/**
 * Task default
 * Apply all tasks to build project
 */
gulp.task('default', ['clean'], () => {
  return $.runSequence(
    'clean',
    'jshint',
    'jscs',
    'fonts',
    'images',
    'html',
    'theme');
});
