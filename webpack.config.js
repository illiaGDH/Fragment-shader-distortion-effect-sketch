const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const PATH = require('path');

module.exports = {
  mode: 'development',
  entry: './src/js/app.js',
  output: {
    filename: 'bundle.js',
    path: PATH.resolve(__dirname, 'dist')
  },
  devServer: {
    port: 4200
  },
  plugins: [
    new HtmlWebpackPlugin(
      {
        template: './src/index.html'
      }
    ),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {from: './src/img', to: './img'}
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ]
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify-loader'
        ]
      }
    ]
  }
}