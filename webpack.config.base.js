module.exports = function getWebpackBaseConfig() {
    return {
        devtool: 'source-map',
        entry: [],
        output: {
            path: '',
            filename: 'bundle.js',
            libraryTarget: 'umd',
            library: 'SimpleListItemRangeSelector'
        },
        plugins: [],
        module: {
            loaders: [{
                exclude: /node_modules/,
                test: /\.js$/,
                loaders: ['babel-loader']
            }]
        }
    }
};