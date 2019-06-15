'use strict';

/**
 * @param {ConfigAPI} api
 * @returns {TransformOptions}
 */
module.exports = (api) => {
    const isDev = !api.env('production');
    return {
        presets: [
            ["@babel/preset-env"],
        ],
        plugins: [
            ["@babel/plugin-transform-react-jsx"],
            ["@babel/plugin-transform-react-constant-elements"],
            ["@babel/plugin-transform-react-display-name"],
            isDev && ["@babel/plugin-transform-react-jsx-source"],
            ["@babel/plugin-transform-react-jsx-self"],
            isDev && ["@babel/plugin-transform-react-inline-elements"],
            ["@babel/plugin-syntax-dynamic-import"],
            ["@babel/plugin-transform-runtime"],
        ].filter(Boolean),
        overrides: [
            {
                test: /\.ts$/,
                plugins: [["@babel/plugin-transform-typescript"]],
            },
            {
                test: /\.tsx$/,
                plugins: [["@babel/plugin-transform-typescript", {isTSX: true}]],
            },
        ],
    };
};

