'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const through2 = require('through2').obj;
const fs = require('fs');
const gulpIf = require('gulp-if');
const combine = require('stream-combiner2').obj;
const argv = require('yargs').argv;

function lint() {
    let eslintResults = {};
    let cacheFilePath = process.cwd() + '/build/lintCache.json';

    try {
        eslintResults = JSON.parse(fs.readFileSync(cacheFilePath));
    } catch (e) {
        console.info('No lint cache file');
    }

    return gulp.src(['./src/elements/**/*.js', './src/elements/**/*.html', '!**/*.spec.html'], {read: false})
        .pipe(gulpIf(
            (file) => {
                let cached = eslintResults[file.path];
                return !(cached && cached.mtime == file.stat.mtime.toJSON() && cached.eslint);
            },
            combine(
                through2((file, enc, callback) => {
                    file.contents = fs.readFileSync(file.path);
                    callback(null, file);
                }),
                eslint(),
                through2((file, enc, callback) => {
                    eslintResults[file.path] = {
                        eslint: file.eslint.success,
                        mtime: file.stat.mtime
                    };
                    callback(null, file);
                })
            )
        ))
        .pipe(eslint.format())
        .pipe(gulpIf(argv.pc, eslint.failAfterError()))
        .on('end', function() {
            if (!fs.existsSync('build')) {
                fs.mkdirSync('build');
            }
            fs.writeFileSync(cacheFilePath, JSON.stringify(eslintResults));
        });
}

module.exports = lint;
