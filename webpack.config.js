const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pkg = require('./package.json')

const PORT = process.env.PORT || 8080
const production = process.env.NODE_ENV === 'production'

const htmlWebpackPluginConfig = {
  title: `${pkg.name} | ${pkg.description}`,
  minify: { collapseWhitespace: true },
  favicon: 'build/favicon.ico',
}

const entry = [
  'babel-polyfill',
  './example/index.js',
]

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new HtmlWebpackPlugin(production ? htmlWebpackPluginConfig : undefined),
]

if (production) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false, screw_ie8: true } })
  )
} else {
  entry.unshift(
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch'
  )
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}

module.exports = {
  plugins,
  entry,
  cache: true,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
  },
  resolve: {
    alias: {
      [pkg.name]: path.resolve(__dirname, 'src/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.styl$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { minimize: true } },
          { loader: 'stylus-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { minimize: true } },
        ],
      },
    ],
  },
  devServer: {
    contentBase: './example',
    hot: true,
    publicPath: '/',
    host: '0.0.0.0',
    port: PORT,
  },
}
