/**
 * @description 3个子配置，通用配置|主题配置|网络配置导出
 */
const setting = require('./setting.config')
const theme = require('./theme.config')
const network = require('./net.config')
// module.exports = {
//   dev: {
//     proxyTable: {
//       '/webapi/*': {
//         target: 'https://localhost:5001/', // 接口的域名
//         // secure: false,  // 如果是https接口，需要配置这个参数
//         changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
//         pathRewrite: {
//           '^/webapi': '/',
//         },
//       },
//     },
//   },
// }

module.exports = Object.assign({}, setting, theme, network)
