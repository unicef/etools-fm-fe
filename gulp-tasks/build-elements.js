'use strict';

const gulp = require('gulp');
const compileHtmlTags = require('gulp-compile-html-tags');
const sass = require('gulp-sass');
const builder = require('polytempl');
const gulpIf = require('gulp-if');
// const fs = require('fs');
const combine = require('stream-combiner2').obj;
const through2 = require('through2').obj;
const path = require('path');
const webpackOptions = require('./wp-config');
const argv = require('yargs').argv;
const outputPath = argv.buildOutput || './build/';
// const replace = require('gulp-replace');

function buildElements(done) {
    // let testSources = [];
    gulp.src(['./src/elements/**/*.html'])
        .pipe(builder(
            [`${process.cwd()}/src/bower_components/`],
            null,
            webpackOptions
        ))
        // compile html/js/scss
        .pipe(gulpIf(
            function(file) {
                return !~file.basename.indexOf('.spec.html');
            },
            combine(
                compileHtmlTags('style', function(tag, data) {
                    return data.pipe(sass().on('error', function(error) {
                        console.log('\x1b[31m%s\x1b[0m', error.message);
                        done();
                    }));
                }),
                compileHtmlTags('script', function(tag, data) {
                    return data;
                }),
                through2(function(file, enc, callback) {
                    if (!argv.buildOutput) {
                        file.base = path.normalize(file.base + '/..');
                    }
                    callback(null, file);
                })
            )
        ))
        .pipe(gulp.dest(outputPath))
        .on('end', function() {
            done();
        });
}

module.exports = buildElements;
