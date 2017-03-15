const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: ['./src/js/simple-list-item-selector'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'simple-list-item-selector.js',
        libraryTarget: 'umd',
        library: 'SimpleListItemSelector'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
            },
        })
    ],
    module: {
        loaders: [{
            exclude: /node_modules/,
            test: /\.js$/,
            loaders: ['babel-loader']
        }]
    }
}