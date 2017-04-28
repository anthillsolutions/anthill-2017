'use strict';

import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

const $ = gulpLoadPlugins();
const DEST = 'dist';
browserSync.create();

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
    .pipe($.jshint.reporter('default'))
    .pipe($.jshint.reporter('fail'));
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
    .pipe($.jscs.reporter())
    .pipe($.jscs.reporter('fail'));
});

/**
 * Task fonts
 * Move fonts to DEST
 */
gulp.task('fonts', () => {
  return gulp.src([
      'src/fonts/*',
      'src/lib/font-awesome/fonts/*',
    ])
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
    'src/favicon.ico',
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
 * Task watch-html
 * Listen to html task and reload the browser
 */
gulp.task('watch-html', ['html'], () => {
  return browserSync.reload();
});

/**
 * Task serve
 * Launch an instance of the server and listen to
 * every change reloading the browser
 */
gulp.task('serve', ['html'], () => {
  browserSync.init({
    proxy: $.util.PROXY || 'http://localhost:10000'
  });
  $.watch([
    'src/scss/*.scss',
    'src/views/*.twig',
    'src/views/**/*.twig',
    'src/js/*.js',
  ], $.batch((events, done) => {
    gulp.start('watch-html', done);
  }));
});

/**
 * Task test
 * Build the project and test for it's consistency
 */
gulp.task('test', () => {
  return $.runSequence(
    'jshint',
    'jscs');
});

/**
 * Task reload
 * reload the browser after executing default
 */
gulp.task('reload', ['default'], () => {
  browserSync.reload();
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
