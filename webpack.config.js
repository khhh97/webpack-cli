const webpack = require('webpack')
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

// 打包 HTML
const htmlPlugin = new htmlWebpackPlugin({
  template: './public/index.html',
  filename: 'index.html',
  minify: {
    removeComments: process.env.NODE_ENV === 'production',  // 删除注释
    collapseWhitespace: process.env.NODE_ENV === 'production' // 去除回车换行空格
  }
})

module.exports = {
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'js/app.[hash:15].js',
    path: path.resolve(__dirname, './build')
  },
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  plugins: [
    new CleanWebpackPlugin(),
    htmlPlugin,
    new MiniCssExtractPlugin({
      filename: 'css/[hash:15].css',
      chunkFilename: 'css/[id].[hash:15].css',
      ignoreOrder: false
    })
  ],
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  devServer: {
    host: 'localhost',
    hot: true,
    port: '8080',
    open: true, // 告诉 dev-server 在 server 启动后打开浏览器
    contentBase: './'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              outputPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              outputPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              outputPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.(woff2|woff|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loade',
        options: {
          name: '[name].[hash:15].[ext]',
          outputPath: 'fonts',
          publicPath: '../fonts'
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:7].[ext]',
          outputPath: 'images',
          publicPath: '../images'
        }
      }
    ]
  }
}
