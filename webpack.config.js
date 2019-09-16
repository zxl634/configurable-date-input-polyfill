const path = require('path');

module.exports = {
    entry: {
        app: './configurable-date-input-polyfill.js'
    },
    output: {
        filename: 'configurable-date-input-polyfill.dist.js',
        path: path.resolve(__dirname, '')
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/, // include .js files
                exclude:path.resolve(__dirname, "node_modules"), // exclude any and all files in the node_modules folder
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }]
            },
            {
                test:/\.(s*)css$/,
                exclude:path.resolve(__dirname, "node_modules"), // exclude any and all files in the node_modules folder
                use:['style-loader','css-loader', 'sass-loader']
            }
        ]
    },
};
