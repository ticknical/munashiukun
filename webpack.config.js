const path              = require('path');
const webpack           = require('webpack');
const serverlessWebpack = require('serverless-webpack');

module.exports = {
    mode: 'production',
    entry: serverlessWebpack.lib.entries,
    target: 'node',
    module: {
        rules: [
            // {
            //     enforce: 'pre',
            //     test: /\.js$/,
            //     use: [
            //         'eslint-loader'
            //     ],
            //     include: __dirname,
            //     exclude: /node_modules/,
            // },
            {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ],
                include: __dirname,
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.js'],
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src')
        ]
    }
};
