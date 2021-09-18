const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    resolve: {
        alias: {
            images: path.resolve(__dirname, 'dist/images'),
            components: path.resolve(__dirname, 'src/components'),
            api: path.resolve(__dirname, 'src/api'),
        }
    },
    entry: {
        index: './src/index.js',
        vendor: ['react', 'react-dom']
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].bundle.js',
    },
    devServer: {
        port: 8080,
    },
    module: {
        rules: [
            {  // JS & JSX
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            }, {  // SASS
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        }
                    },
                    'sass-loader',
                ]
            }, {  // CSS
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options : {
                            url: false
                        }
                    }
                ]
            }, {  // PNG & JPG & GIF
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit:8192,
                            url: false,
                        }
                    }
                ]
            }
        ]
    },
    plugins: [new MiniCssExtractPlugin()],
};