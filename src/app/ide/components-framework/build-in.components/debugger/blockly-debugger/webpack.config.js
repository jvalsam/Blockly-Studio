const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');


module.exports = {
    entry: {
        bundle: './index.js',
        debuggee: './src/debuggee/debuggee.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: "source-map",
    node: {
        fs: 'empty'
    },
    plugins: [
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            files: ['./*.html'],
            server: { baseDir: ['./'] },
            browser: "chrome"
        })
    ]
};