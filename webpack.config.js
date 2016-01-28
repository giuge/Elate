var CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')

module.exports = {
  // This enables access to node methods (like fs to access filesystem)
  target: 'atom',
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
    root: path.resolve(__dirname, 'app'),
    extensions: ['', '.js', '.jsx', '.css', '.json', '.scss']
  },
  module: {
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
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './../prod.html', to: './../app/index.html' },
      { from: './main.js', to: './../app/main.js' },
      { from: './../package.json', to: './../package.json'}
    ])
  ],
  externals: {
    commonjs: [
      'desktop-capturer',
      'electron',
      'ipc',
      'ipc-renderer',
      'native-image',
      'remote',
      'web-frame',
      'clipboard',
      'crash-reporter',
      'screen',
      'shell'
    ]
  }
}
