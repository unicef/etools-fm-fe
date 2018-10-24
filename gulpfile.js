const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const argv = require('yargs').argv;
// if (argv.develop) {
    process.env.ENV = 'development';
// }

const clean = require('./gulp-tasks/clean');
const path = require('path');
const preBuild = require('./gulp-tasks/pre-build');
const postBuild = require('./gulp-tasks/post-build');
const buildElements = require('./gulp-tasks/build-elements');
const copyAssets = require('./gulp-tasks/copy-assets');
const copyImages = require('./gulp-tasks/copy-images');
const copyBower = require('./gulp-tasks/copy-bower');
const runTests = require('./gulp-tasks/test');
const jsLinter = require('./gulp-tasks/js-linter');
global.config = {
    appName: 'etoolsApd',
    polymerJsonPath: path.join(process.cwd(), 'polymer.json'),
    buildDirectory: 'build'
};

const build = require('./gulp-tasks/build');

gulp.task('watch', function() {
    gulp.watch(['./src/elements/**/*.*'], gulp.series(jsLinter, buildElements));
    gulp.watch(['./src/manifest.json', './index.html'], gulp.series(copyAssets));
    gulp.watch(['./src/images/**/*.*'], gulp.series(copyImages));
    gulp.watch(['./src/bower_components/**/*.*'], gulp.series(copyBower()));
});

gulp.task('lint', gulp.series(jsLinter));
gulp.task('test', gulp.series(clean, gulp.parallel(buildElements, copyAssets, copyBower()), runTests));

gulp.task('startServer', () => {nodemon({script: 'express.js'});});

gulp.task('devBuild', gulp.series(clean, jsLinter, gulp.parallel(buildElements, copyAssets, copyImages, copyBower())));
gulp.task('prodBuild', gulp.series(clean, preBuild, build, postBuild));

gulp.task('devup', gulp.series('devBuild', gulp.parallel('startServer', 'watch')));

gulp.task('default', gulp.series(['prodBuild']));
