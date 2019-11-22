const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common');
const postcssPresetEnv = require('postcss-preset-env');
const flexBugFixes = require('postcss-flexbugs-fixes');
const postcssImport = require('postcss-import');

module.exports = merge(common, {
    mode: "development",
    devtool: "eval",
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    devServer: {
        contentBase: path.resolve(__dirname, "public"),
        host: "0.0.0.0", // this allows VMs to access the server
        port: 3000,
        disableHostCheck: true
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            importLoaders: 1,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                postcssImport({
                                    path: [
                                        path.resolve(__dirname, "../src/_scss")
                                    ]
                                }),
                                postcssPresetEnv({ stage: 2 }),
                                flexBugFixes()
                            ]
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            includePaths: ["./src/_scss", "./node_modules"]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                USASPENDING_API: process.env.USASPENDING_API
                    ? JSON.stringify(process.env.USASPENDING_API)
                    : JSON.stringify("http://localhost:8000/api/"),
                MAPBOX_TOKEN: process.env.MAPBOX_TOKEN
                    ? JSON.stringify(process.env.MAPBOX_TOKEN)
                    : JSON.stringify(""),
                GA_TRACKING_ID: process.env.GA_TRACKING_ID
                    ? JSON.stringify(process.env.GA_TRACKING_ID)
                    : JSON.stringify(""),
                IS_DEV: JSON.stringify('true')
            }
        })
    ]
});
