var webpack = require('webpack');
var path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
    entry: [
        'webpack-jquery-ui',
        './app.ts'
    ],
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.html']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
            { test: /\.html/, loaders: ["html-loader?exportAsEs6Default"] },
            { test: /\.(jpe?g|png|gif|svg)$/i, loaders: ["file-loader?name=/images/[name].[ext]", "image-webpack-loader"] },
            { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url?limit=10000' },
            { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' },
            { test: /\.scss/, exclude: /node_modules/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap&includePaths[]=node_modules/compass-mixins/lib' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: require.resolve("jquery"), loader: "expose-loader?$" }
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
            onBuildStart: ['py cg_components.py']
        }),
        new webpack.ProvidePlugin({
            '$': "jquery",
            'jQuery': "jquery",
            'Tether': 'tether',
            'Popper': 'popper.js'
        })
    ]
}