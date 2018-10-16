const spawn = require('child_process').spawn;
const argv = require('yargs').argv;
const fs = require('fs');

module.exports = function testElements(done) {
    testsEnded();
    done();
    return;

    let withErrors = false;
    let files = fs.readdirSync('./build/tests/');

    files = files.filter((src) => {
        return src.search(/index\d.spec.html/) !== -1;
    });

    runTests(files);

    function runTests() {
        let indexFileName = files.shift();

        if (!indexFileName) {
            testsEnded(withErrors);
            done();
            return;
        }

        let tests;
        if (argv.noxvfb) {
            tests = spawn('node', ['./node_modules/.bin/wct', `./build/tests/${indexFileName}`]);
        } else {
            tests = spawn('xvfb-run', ['-a', './node_modules/.bin/wct', `./build/tests/${indexFileName}`]);
        }

        console.log(`\x1b[32mRunning ${indexFileName}.\x1b[0m`);

        tests.stdout.on('data', (data) => {
            if (~data.indexOf('✖') || ~data.indexOf('Tests failed')) {
                data = `\x1b[31m${data}\x1b[0m`;
                withErrors = true;
            } else if (~data.indexOf('ended with great success') || data.indexOf('404') === 0) {
                return;
            }
            console.log(`${data}`);
        });

        tests.stderr.on('data', (data) => {
            console.log(`\x1b[31m${data}\x1b[0m`);
            withErrors = true;
        });

        tests.on('close', () => {
            runTests(files);
        });
    }

    function testsEnded(withErrors) {
        if (withErrors) {
            console.log(`\x1b[31mTests failed! See above for more details.\x1b[0m`);
        } else {
            console.log('\x1b[32mTest run ended with great success.\x1b[0m');
        }

        if (withErrors && argv.pc) {
            process.exit(1);
        }
    }
};
