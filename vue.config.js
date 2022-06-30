'use strict'
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const name = 'Vue3管理系统'
const port = 919

module.exports = {
  publicPath: './', // 打出来的包可以被部署在任意路径
  outputDir: 'dist', // 打包的文件存放的目录
  assetsDir: 'static', // 存放静态资源的目录(js,css,img,fonts)
  indexPath: 'index.html', // 指定生成的index.html的路径
  lintOnSave: process.env.NODE_ENV === 'development', // 开发环境下 配置eslint只警告不报错
  productionSourceMap: false, // 加速生产环境构建
  devServer: {
    port: port, // 指定服务监听的端口
    open: true, // 完成构建项目后,自动使用系统默认的浏览器打开网页
    overlay: {
      warnings: false, // 在浏览器上不显示全屏的warnings
      errors: true // 在浏览器上展示全屏的errors
    }
  },
  configureWebpack: { // 实现 新增/修改webpack配置
    name: name, // 项目名称
    resolve: { // 新增别名设置
      alias: {
        '@': resolve('src') // 引入绝对路径时 用`@`指定代表`src`
      }
    }
  },
  chainWebpack(config) { // 允许对内部的webpack配置进行更细粒度的修改
    config.plugin('preload').tap(() => [ // 配置预加载及热更新 提高SPA首屏速度
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    config.plugins.delete('prefetch') // 防止页面多的时候造成太多无意义的请求

    // 配置 svg-sprite-loader环境
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{ // 生产环境下 配置打包模块 script-ext-html-webpack-plugin
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: { // 配置打包压缩的别名
                libs: {
                  name: 'shy-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 只打包使用到的依赖
                },
                elementUI: {
                  name: 'shy-elementPlus', // 将element-plus单独打成一个包
                  priority: 20, // 设置的权重，需要大于libs 否则会被打包成libs
                  test: /[\\/]node_modules[\\/]_?element-plus(.*)/ // 适应淘宝镜像cnpm
                },
                commons: {
                  name: 'shy-commons',
                  test: resolve('src/components'),
                  minChunks: 3, // 最下公数
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single') // 线上更新版本时,利用浏览器缓存,使用户感知的影响到最低
        }
      )
  }
}
