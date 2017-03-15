const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: ['./src/js/simple-list-item-range-selector'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'simple-list-item-range-selector.js',
        libraryTarget: 'umd',
        library: 'SimpleListItemRangeSelector'
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