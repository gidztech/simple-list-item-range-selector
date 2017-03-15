var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'cheap-eval-source-map',
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './example/index',
        './src/js/simple-list-item-selector',
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        libraryTarget: 'umd',
        library: 'SimpleListItemSelector'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './example/index.html'
        })
    ],
    module: {
        loaders: [{
            test: /\.html$/,
            loader: "raw-loader"
        }, {
            exclude: /node_modules/,
            test: /\.js$/,
            loaders: ['babel-loader']
        }],

    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        //publicPath: path.join(__dirname, "dist")
        hot: true
    }
}