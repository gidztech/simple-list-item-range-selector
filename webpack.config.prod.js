const getWebpackBaseConfig = require('./webpack.config.base');
const path = require('path');
const webpack = require('webpack');

let webpackProdConfig = getWebpackBaseConfig();
webpackProdConfig.devtool = 'source-map';
webpackProdConfig.entry = ['./src/js/simple-list-item-range-selector'];
webpackProdConfig.output.path = path.join(__dirname, 'dist');
webpackProdConfig.output.filename = 'simple-list-item-range-selector.js';
webpackProdConfig.plugins = [
    new webpack.optimize.UglifyJsPlugin({
        compressor: {
            warnings: false,
        },
    })
];

module.exports = webpackProdConfig;