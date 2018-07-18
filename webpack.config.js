var webpack = require('webpack');
var path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    devtool: "source-map",
    entry: {
        main: './app.ts'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.html']
    },
    module: {
        rules: [
            { test: /\.ts$/, use:[ {loader: 'ts-loader'} ] },
            { test: /\.html/, use:[ {loader: "html-loader?exportAsEs6Default"} ] },
            { test: /\.xml$/, use:[ {loader: 'xml-loader' } ] },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    { loader: "file-loader?name=/images/[name].[ext]" },
                    { loader: "image-webpack-loader" }
                ]
            },
            { test: /\.(woff2?|ttf|eot|svg)$/, use:[ {loader: 'url?limit=10000' } ] },
            { test: /bootstrap\/dist\/js\/umd\//, use: [ {loader: 'imports?jQuery=jquery' } ] },
            {
                test: /\.scss/,
                exclude: /node_modules/,
                use: [
                    {loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap&includePaths[]=node_modules/compass-mixins/lib' }
                ]
            },
            {
                test: /\.css$/,
                loaders: ['style-loader!css-loader', "style-loader", "css-loader"]
            },
            {
                test: require.resolve("jquery"),
                use: [
                    {loader: "expose-loader?$"},
                    { loader: 'expose-loader', options: 'jQuery' },
                    { loader: 'expose-loader', options: '$' }
                ] 
            },
            {
                test: require.resolve('tether'),
                use: [
                    { loader: 'expose-loader', options: 'Tether' }
                ]
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    devtool: "source-map",
    performance: { hints: false },
    plugins: [
        new WebpackShellPlugin({
            onBuildStart: ['python cg_components.py']
        }),
        new webpack.ProvidePlugin({
            '$': "jquery",
            'Tether': 'tether',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            "window.$": "jquery",
            Popper: ['popper.js', 'default'],
            Tether: "tether"
            // In case you imported plugins individually, you must also require them here:
            // Util: "exports-loader?Util!bootstrap/js/dist/util",
            // Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 8080,
            server: {
                baseDir: ['./'],
                directory: true
            }
        })
    ]
}