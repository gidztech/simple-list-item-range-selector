const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'cheap-eval-source-map',
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './dev/main'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        libraryTarget: 'umd',
        library: 'SimpleListItemRangeSelector'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({title: 'Simple List Item Range Selector'})
    ],
    module: {
        loaders: [{
            test: /\.html$/,
            loader: "raw-loader"
        },{
            test: /\.css/,
            use: ['style-loader', 'css-loader']
        }, {
            exclude: /node_modules/,
            test: /\.js$/,
            loaders: ['babel-loader']
        }],

    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        hot: true
    }
}