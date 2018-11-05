'use strict';

const del = require('del');

function postBuild() {
    return del(['src/build-elements'], {force: true});
}

module.exports = postBuild;
