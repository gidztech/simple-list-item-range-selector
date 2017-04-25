const getWebpackBaseConfig = require('./webpack.config.base');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let webpackDevConfig = getWebpackBaseConfig();
webpackDevConfig.devtool = 'inline-source-map';
webpackDevConfig.entry = [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './dev/main'
];
webpackDevConfig.output.path = path.join(__dirname, 'dist');
webpackDevConfig.output.filename = 'bundle.js';
webpackDevConfig.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({title: 'Simple List Item Range Selector'})
];
webpackDevConfig.module.loaders.push( {
        test: /\.html$/,
        loader: "raw-loader"
    }, {
        test: /\.css/,
        use: ['style-loader', 'css-loader']
    }
);
webpackDevConfig.devServer = {
    contentBase: path.join(__dirname, "dist"),
    hot: true
};

module.exports = webpackDevConfig;