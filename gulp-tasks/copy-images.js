'use strict';
const gulp = require('gulp');

function copyImages() {
    return gulp.src(['./src/images/**/*.*'], {since: gulp.lastRun(copyImages)})
        .pipe(gulp.dest('./build/images'));
}

module.exports = copyImages;
