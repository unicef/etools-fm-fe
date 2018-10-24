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
// const replace = require('gulp-replace');

function buildElements(done) {
    // let testSources = [];
    gulp.src(['./src/elements/**/*.html'])
        // .pipe(gulpIf(
        //     function(file) {
        //         return ~file.basename.indexOf('.spec.html');
        //     },
        //     // move test files into /tests folder
        //     through2(function(file, enc, callback) {
        //         file.base = path.normalize(file.base + '/..');
        //         file.path = `${file.base}/tests/${file.basename}`;
        //
        //         testSources.push(file.basename);
        //         testSources.push(`${file.basename}?dom=shadow`);
        //         callback(null, file);
        //     })
        // ))
        // combine html/js/scss
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
                    file.base = path.normalize(file.base + '/..');
                    callback(null, file);
                })
            )
        ))
        .pipe(gulp.dest('./build/'))
        .on('end', function() {
            // let testsPerFile = 24;
            // let indexFilesLength = Math.ceil(testSources.length / testsPerFile) || 1;
            //
            // console.log(`\x1b[32mFound ${testSources.length} test files. They will be combined into ${indexFilesLength} file(s).\x1b[0m`);
            //
            // for (let i = 0; i < indexFilesLength; i++) {
            //     fs.writeFileSync(`./build/tests/index${i + 1}.spec.html`, fs.readFileSync('./src/tests/index.spec.html'));
            // }
            //
            // // add test sources to index{1,2...}.spec.html
            // gulp.src('./build/tests/index*.spec.html')
            //     .pipe(replace('<!--testSources-->', function(match) {
            //         return `"${testSources.splice(0, testsPerFile).join('", "')}"`;
            //     }))
            //     .pipe(gulp.dest('./build/tests/'));

            done();
        });
}

module.exports = buildElements;
