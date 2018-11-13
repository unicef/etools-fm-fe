const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const argv = require('yargs').argv;
const path = require('path');

const COUNTER_PROPERTY_NAME = 'filesChangedCount';
process.env.BUILD_CACHE_PATH = path.normalize(`${process.cwd()}/gulp-tasks/`);
process.env.WP_CONFIG_PATH = path.normalize(`${process.cwd()}/gulp-tasks/wp-config.js`);
process.env.NOT_CHAIN_REBUILD = false;
process.env.COUNTER_PROPERTY_NAME = COUNTER_PROPERTY_NAME;
if (argv.develop) {
    // process.env.ENV = 'development';
}

const clean = require('./gulp-tasks/clean');
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
global[COUNTER_PROPERTY_NAME] = 99;

const build = require('./gulp-tasks/build');

gulp.task('buildElements', gulp.series(buildElements));

gulp.task('watch', function() {
    const watcher = gulp.watch(['./src/elements/**/*.*'], gulp.series(buildElements));
    gulp.watch(['./src/manifest.json', './index.html'], gulp.series(copyAssets));
    gulp.watch(['./src/images/**/*.*'], gulp.series(copyImages));
    gulp.watch(['./src/bower_components/**/*.*'], gulp.series(copyBower()));

    watcher.on('all', (eventName, path) => {
        const isAddOrChange = eventName === 'add' || eventName === 'change';
        const isTmpFile = !!~path.indexOf('jb_tmp');
        const isScriptFile = !!~path.indexOf('.js') || !!~path.indexOf('.ts');
        if (!isAddOrChange || isTmpFile || !isScriptFile) {return;}
        global[COUNTER_PROPERTY_NAME]++;
    });
});

gulp.task('lint', gulp.series(jsLinter));
gulp.task('test', gulp.series(clean, gulp.parallel(buildElements, copyAssets, copyBower()), runTests));

gulp.task('startServer', () => {nodemon({script: 'express.js'});});

gulp.task('devBuild', gulp.series(clean, gulp.parallel(buildElements, copyAssets, copyImages, copyBower())));
gulp.task('prodBuild', gulp.series(clean, preBuild, build, postBuild));

gulp.task('devup', gulp.series('devBuild', gulp.parallel('startServer', 'watch')));

gulp.task('default', gulp.series(['prodBuild']));
