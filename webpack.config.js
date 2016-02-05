var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')

module.exports = {
  // This enables access to node methods (like fs to access filesystem)
  target: 'electron',
  context: __dirname + '/app',
  devtool: 'source-map',
  entry: {
    index: './index.js',
    main: './main.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/app'
  },
  devServer: {
    contentBase: './build',
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true
  },
  resolve: {
    root: path.resolve(__dirname, 'node_modules'),
    alias: {
      lib: path.resolve(__dirname, 'app/lib'),
      components: path.resolve(__dirname, 'app/components'),
      stores: path.resolve(__dirname, 'app/stores'),
      actions: path.resolve(__dirname, 'app/actions'),
      styles: path.resolve(__dirname, 'app/styles'),
    },
    extensions: ['', '.js', '.jsx', '.css', '.json', '.scss']
  },
  node: {
    __dirname: true,
  },
  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    loaders: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader']
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.json$/,
        loaders: ['json-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new CopyWebpackPlugin([
      { from: './../prod.html', to: './../app/index.html' },
      { from: './assets', to: './../app/assets' },
      //{ from: './main.js', to: './../app/main.js' },
      { from: './../package.json', to: './../package.json'}
    ])
  ],
  externals: {
    'electron': 'require("electron")',
    'remote': 'require("remote")',
    'app': 'require("app")',
    'ipc': 'require("ipc")'
  }
}
