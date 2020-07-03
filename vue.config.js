const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir)
}
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css', 'png', 'ttf', 'woff', 'woff2', 'eot']

module.exports = {
  runtimeCompiler: true,
  lintOnSave: false,
  publicPath: '/',
  productionSourceMap: false,
  crossorigin: 'anonymous',
  // devServer: {
  //   proxy: {
  //   '^/api': {
  //     target: '<url>',
  //     ws: true,
  //     changeOrigin: true
  //   },
  //   '^/foo': {
  //     target: '<other_url>'
  //   }
  // }
  // }
  configureWebpack: config => {
    config.resolve.extensions = ['.js', '.less', '.scss', '.vue']
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 1024,
          minRatio: 0.8
        }))
    }
  },
  chainWebpack: config => {
  }
}
