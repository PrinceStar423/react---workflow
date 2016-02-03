//-------------------------------------------------------------------------
//  export webpack config
//-------------------------------------------------------------------------

const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const DEBUG = global.DEBUG
const VERBOSE = global.VERBOSE
const WATCH = global.WATCH

const AUTOPREFIXER = `{
  browsers: [
    'Android >= 4',
    'Chrome >= 35',
    'Firefox >= 31',
    'Explorer >= 9',
    'iOS >= 7',
    'Opera >= 12',
    'Safari >= 7.1',
  ],
}`

// for babel and other tool env
process.env.NODE_ENV = DEBUG ? 'development' : 'production'

const GLOBALS = {
  __DEV__: DEBUG,
  __PRO__: !DEBUG,
}

//-------------------------------------------------------------------------
//  Configuration for the client-side bundle (app.js)
//-------------------------------------------------------------------------

const appConfig = {

  entry: [
    ...(WATCH ? ['webpack-hot-middleware/client'] : []),
    path.join(__dirname, '../client/app.js'),
  ],

  output: {
    path: path.join(__dirname, '../build'),
    // if your want to cdn, just change here
    publicPath: '/',
    sourcePrefix: '',
    trunkFilename: DEBUG ? '[id].bundle.js' : '[id].[chunkhash].bundle.js',
    filename: DEBUG ? 'bundle.js' : '[chunkhash].[name].bundle.js',
  },

  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.less'],
    root: [
      path.join(__dirname, '../client/components'),
      path.join(__dirname, '../client/theme'),
    ],
  },

  plugins: [
    // create index.html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      cache: true,
      inject: true,
      template: 'html!./client/index.html',
      favicon: './client/favicon.ico',
      minify: {
        removeComments: false,
        collapseWhitespace: false,
      },
    }),

    new ExtractTextPlugin(DEBUG ? 'app.css' : '[chunkhash].app.css'),

    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.DefinePlugin(GLOBALS),

    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: DEBUG ? 'commons.js' : '[chunkhash].[name].js',
      // (Modules must be shared between 2 entries)
      minChunks: 2,
      /* chunks: ["pageA", "pageB"], */
      // (Only use these entries)
    }),

    ...(!DEBUG ? [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: VERBOSE,
        },
      }),
      //new webpack.optimize.AggressiveMergingPlugin(),
    ] : []),
    ...(WATCH ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ] : []),
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.(txt|md)$/,
        loader: 'raw-loader',
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=5000',
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
      }, {
        test: /\.css/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?' + (DEBUG ? 'sourceMap' : '') + `!postcss-loader?${AUTOPREFIXER}`),
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?' + (DEBUG ? 'sourceMap' : '') + `!postcss-loader?${AUTOPREFIXER}!less-loader?` + (DEBUG ? 'sourceMap' : '')),
      },
    ],
  },

  postcss: () => {
    return [autoprefixer]
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

}

module.exports = appConfig
