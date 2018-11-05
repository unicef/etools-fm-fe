const spawn = require('child_process').spawn;

function preBuild(done) {
    const proc = spawn('node', ['./node_modules/.bin/gulp', `buildElements`, '--buildOutput=src/build-elements']);
    proc.stdout.on('data', (data) => {
        console.log(`${data}`);
    });
    proc.stderr.on('data', (data) => {
        console.log(`\x1b[31m${data}\x1b[0m`);
    });

    proc.on('close', () => {
        done();
    });
}

module.exports = preBuild;
