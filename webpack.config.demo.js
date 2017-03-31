const getWebpackBaseConfig = require('./webpack.config.base');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let webpackDemoConfig = getWebpackBaseConfig();
webpackDemoConfig.devtool = 'cheap-eval-source-map';
webpackDemoConfig.entry = ['./dev/main'];
webpackDemoConfig.output.path = path.join(__dirname, 'demo');
webpackDemoConfig.output.filename = 'bundle.js';
webpackDemoConfig.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({title: 'Simple List Item Range Selector'})
];
webpackDemoConfig.module.loaders.push( {
        test: /\.html$/,
        loader: "raw-loader"
    }, {
        test: /\.css/,
        use: ['style-loader', 'css-loader']
    }
);

module.exports = webpackDemoConfig;
