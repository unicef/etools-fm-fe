const ENVIRONMENT = process.env.ENV;

module.exports = {
    watch: false,
    devtool: ENVIRONMENT === 'development' ? 'cheap-module-inline-source-map' : false,
    module: {
        loaders: [{
            test: /\.ts(x?)$/,
            loader: 'ts-loader',
            enforce: 'pre',
            exclude: [/node_modules/]
        }, {
            test: /\.ts$/,
            enforce: 'pre',
            loader: 'tslint-loader',
            exclude: [/node_modules/]
        }]
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    }
};