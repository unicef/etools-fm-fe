'use strict';
var gulp = require('gulp');

function copyBowerComponents() {
    return gulp.src(['./src/bower_components/**/*'], {since: gulp.lastRun(copyBowerComponents)})
        .pipe(gulp.dest('./build/bower_components/'));
}

function copyBowerToSrc() {
    return gulp.src(['./bower_components/**/*'], {since: gulp.lastRun(copyBowerToSrc)})
        .pipe(gulp.dest('./src/bower_components/'));
}

module.exports = function copyBower(toSrc) {
    return toSrc ? copyBowerToSrc : copyBowerComponents;
};
