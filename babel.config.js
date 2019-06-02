'use strict';

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    presets: [
        ["@babel/preset-env"],
        ["@babel/preset-react", {
            development: isDev,
        }],
        ["@babel/preset-typescript"],
    ],
    plugins: [
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread"
    ]
};
