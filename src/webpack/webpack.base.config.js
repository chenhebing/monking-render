import glob from 'glob';
import path from 'path';

import config from 'monking/lib/config';

const isProd = config.isProd;

const mode = isProd ? 'production' : 'development';

const jsFile = (dir) => glob.sync(`${dir}/*/index.js?(x)`).reduce((prev, curr) => {
    const normalCurrPath = path.normalize(curr);
    const name = normalCurrPath.replace(`${dir}`, '').slice(1).replace(/\.jsx?$/g, '');
    prev[name] = ['react-dom', normalCurrPath];
    return prev;
}, {});

const baseConfig = {
    devtool: isProd ? false : 'cheap-module-eval-source-map',
    entry: jsFile(path.normalize(config.path.pages)),
    mode,
    resolve: {
        alias: config.alias,
        extensions: ['.js', '.jsx'],
        modules: [config.path.client, 'node_modules']
    },
    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.(png|jpg?g|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 100000,
                name: '[name].[ext]?[hash]'
            }
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: '[name].[ext]?[hash]'
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: '[name].[ext]?[hash]'
            }
        }]
    }
};

export default baseConfig;
