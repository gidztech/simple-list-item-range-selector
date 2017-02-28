var webpack = require('webpack');

module.exports = {
    entry: {
        main: ['./js/simple-list-item-selector.js']
    },
    output: {
        path: __dirname + '/dist',
        filename: 'simple-list-item-selector.js',
        libraryTarget: 'umd',
        library: 'SimpleListItemSelector'
    },
    module: {
        loaders: [
            {
                exclude: /node_modules/,
                test: /\.js$/,
                loaders: ['babel-loader']
            }
        ]
    },
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         sourceMap: true,
    //         compress: false
    //     })
    // ],
    devtool: 'source-map'
};