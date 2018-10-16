'use strict';

const del = require('del');

function postBuild() {
    return del(['elements'], {force: true});
}

module.exports = postBuild;
