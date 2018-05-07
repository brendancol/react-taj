const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('./package.json');
const libraryName= pkg.name;

module.exports = {
  entry: './src/react-taj/index.js',
  output: {
      path: path.join(__dirname, './dist'),
      filename: 'react-taj.js',
      library: libraryName,
      libraryTarget: 'umd',
      publicPath: '/dist/',
      umdNamedDefine: true
  },
  plugins: [
    new ExtractTextPlugin({
        filename: 'react-taj.css',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }, {
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ]
    }, {
      test: /\.(png|jpg|gif)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          context: path.resolve(__dirname, 'src/client/')
        }
      }]
    }]
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true
  }
};
