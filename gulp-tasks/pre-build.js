const gulp = require('gulp');
const polytempl = require('polytempl');
const combine = require('stream-combiner2').obj;
// const through2 = require('through2').obj;
const compileHtmlTags = require('gulp-compile-html-tags');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
// const path = require('path');

function preBuild(done) {
    return gulp.src(['./src/elements/**/*.html'])
        .pipe(polytempl([{
            path: `${process.cwd()}/bower_components/`, new_base: `${process.cwd()}/src/bower_components/`
        }]))
        .pipe(gulpif(
            function(file) {
                return !~file.basename.indexOf('.spec.html');
            },
            combine(
                compileHtmlTags('style', function(tag, data) {
                    return data.pipe(sass().on('error', function(error) {
                        console.log('\x1b[31m%s\x1b[0m', error.message);
                        done();
                    }));
                })
            )
        ))
        .pipe(gulp.dest('./elements'))
        .on('end', () => done());
}

module.exports = preBuild;
