'use strict';

const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

/**
 * @type {function(webpack.Configuration, webpack.Configuration): webpack.Configuration}
 */
const webpackMerge = require('webpack-merge');


/**
 *  @type {webpack.Configuration}
 */
const common = {
    target: 'web',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new ForkTsCheckerWebpackPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            {test: /\.css$/, use: [{loader: 'style-loader'}, {loader: 'css-loader'}]},
            {test: /\.(ts|tsx)$/, use: [{loader: 'babel-loader'}], exclude: /node_modules/},
            {test: /\.(png|svg|jpg|git|ttf|woff|woff2|eot)$/, use: [{loader: 'file-loader'}]},
        ]
    },
};

let config;

if (process.env.NODE_ENV === 'production') {
    config = webpackMerge(common, {
        mode: 'production',
        devtool: 'source-map',
    });
} else {
    config = webpackMerge(common, {
        mode: 'development',
        devtool: 'inline-source-map',
    });
}

module.exports = config;
