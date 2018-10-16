module.exports = {
    // See https://github.com/Polymer/web-component-tester/blob/master/runner/config.js#L47-54
    activeBrowsers: [
        {
            // Accepts anything wd does: https://github.com/admc/wd#browser-initialization
            url: 'http://selenium-hub:4444/wd/hub',
            // ... any other capabilities you like:
            browserName: 'chrome',
        }
    ],
    plugins: {
        local: false,
        sauce: false,
    },
    webserver: {
        hostname: "apd"
    }
};
