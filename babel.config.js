'use strict';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * @type {babel.TransformOptions}
 */
module.exports = {
    presets: [
        ["@babel/preset-env"],
        ["@babel/preset-react", {
            development: isDev,
        }],
        ["@babel/preset-typescript"],
    ],
    plugins: [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-transform-runtime",
    ]
};
