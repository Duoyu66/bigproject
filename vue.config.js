/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description cli配置
 */

const path = require('path')
const {
	publicPath,
	assetsDir,
	outputDir,
	lintOnSave,
	transpileDependencies,
	title,
	abbreviation,
	devPort,
	providePlugin,
	build7z,
	donation,
	baseURL,
	cdn,
} = require('./src/config')
const {
	webpackBarName,
	webpackBanner,
	donationConsole
} = require('zx-layouts')

if (donation) donationConsole()
const {
	version,
	author
} = require('./package.json')
const Webpack = require('webpack')
const WebpackBar = require('webpackbar')
const FileManagerPlugin = require('filemanager-webpack-plugin')
//混淆
const JavaScriptObfuscator = require('webpack-obfuscator');
//gzip压缩
const CompressionPlugin = require('compression-webpack-plugin')
//const HtmlWebpackPlugin = require('html-webpack-plugin');
//这是webpack内置的压缩插件，仅仅支持JS文件的压缩
const TerserPlugin = require('terser-webpack-plugin')
const AutoInjectPlugin = require('./auto-inject-plugin-master/autoInjectPlugin')
//const AutoInjectPlugin = require('auto-inject-plugin')
//const autoInjectPlugin = require('auto-inject-webpack-plugin');
//js代码混淆
//const WebpackObfuscator = require('webpack-obfuscator');
//压缩css
//const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

//const CopyWebpackPlugin = require('copy-webpack-plugin');
const dayjs = require('dayjs')
const date = dayjs().format('YYYY_M_D')
const time = dayjs().format('YYYY-M-D HH:mm:ss')
const productionGzipExtensions = ['html', 'js', 'css', 'svg']
process.env.VUE_APP_TITLE = title || '试验室'
process.env.VUE_APP_AUTHOR = author || 'gtwise'
process.env.VUE_APP_UPDATE_TIME = time
process.env.VUE_APP_VERSION = version

const resolve = (dir) => path.join(__dirname, dir)


let isProduction = false

switch (process.env.NODE_ENV) {
	case 'production':
		isProduction = true
		break
		//测试打包的环境
	case 'testMode':
	case 'experiment':
		isProduction = true
		break
	case 'development':
		isProduction = false
		break
}
console.log('isProduction', isProduction)
const mockServer = () => {
	if (!isProduction) return require('./mock')
	else return ''
}
let cdn_copy = isProduction ? cdn : {
	css: [],
	js: []
}
let page_Object = {
	index: {
		template: "public/index.html",
		entry: "src/main.js",
		filename: "index.html",
		chunks: [
			"chunk-common", //这是admin和Index入口公用的chunk
			"chunk-vendors",
			"chunk-element-ui", //index的单独chunk
			"chunk-echarts",
			"chunk-pdf",
			//"chunk-zxplayer",
			"chunk-brace",
			"chunk-exceljs",
			"chunk-vabicon",
			"chunk-components",
			"chunk-other",
			"index", //注意：这个是页面名称的chunk,下面的chunk名称需要对呀splitChunk对应的名称
		]
	},
	luckSheet: {
		template: "public/spreadjssheet.html",
		entry: "src/mainLuckySheet.js",
		filename: "luckysheet.html",
		// chunks: [
		// 	"luckSheet", //注意：这个是页面名称的chunk,下面的chunk名称需要对呀splitChunk对应的名称
		// 	"chunk-vendors", //这是admin和Index入口公用的chunk
		// 	"chunk-common",
		// 	"chunk-elementUI", //index的单独chunk
		// 	"chunk-echarts",
		// 	"chunk-other",
		// ]
	},
  WeightCollectorSheet: {
  	template: "public/spreadjssheet.html",
  	entry: "src/mainWeightCollectorSheet.js",
  	filename: "WeightCollectorSheet.html",
  	// chunks: [
  	// 	"luckSheet", //注意：这个是页面名称的chunk,下面的chunk名称需要对呀splitChunk对应的名称
  	// 	"chunk-vendors", //这是admin和Index入口公用的chunk
  	// 	"chunk-common",
  	// 	"chunk-elementUI", //index的单独chunk
  	// 	"chunk-echarts",
  	// 	"chunk-other",
  	// ]
  },
	SpreadJsDictionary: {
		template: "public/spreadjssheet.html",
		entry: "src/mainSpreadJsDictionary.js",
		filename: "SpreadJsDictionary.html",
		// chunks: [
		// 	"luckSheet", //注意：这个是页面名称的chunk,下面的chunk名称需要对呀splitChunk对应的名称
		// 	"chunk-vendors", //这是admin和Index入口公用的chunk
		// 	"chunk-common",
		// 	"chunk-elementUI", //index的单独chunk
		// 	"chunk-echarts",
		// 	"chunk-other",
		// ]
	},
	SpreadJsExport: {
		template: "public/spreadjssheet.html",
		entry: "src/mainSpreadJsExport.js",
		filename: "SpreadJsExport.html",
		// chunks: [
		// 	"luckSheet", //注意：这个是页面名称的chunk,下面的chunk名称需要对呀splitChunk对应的名称
		// 	"chunk-vendors", //这是admin和Index入口公用的chunk
		// 	"chunk-common",
		// 	"chunk-elementUI", //index的单独chunk
		// 	"chunk-echarts",
		// 	"chunk-other",
		// ]
	},
	mainImport: {
		template: "public/luckysheet.html",
		entry: "src/mainImport.js",
		filename: "mainImport.html",
		// chunks: [
		// 	"luckSheetTestData", //注意：这个是页面名称的chunk,下面的chunk名称需要对呀splitChunk对应的名称
		// 	"chunk-vendors", //这是admin和Index入口公用的chunk
		// 	"chunk-common",
		// 	"chunk-elementUI", //index的单独chunk
		// 	"chunk-echarts",
		// ]
	},
	TestDataReviewWhole: {
		template: "public/spreadjssheet.html",
		entry: "src/mainAppTestDataReviewWhole.js",
		filename: "TestDataReviewWhole.html",
		// chunks: [
		// 	"luckSheetTestDataApproval", //注意：这个是页面名称的chunk,下面的chunk名称需要对呀splitChunk对应的名称
		// 	"chunk-vendors", //这是admin和Index入口公用的chunk
		// 	"chunk-common",
		// 	"chunk-elementUI", //index的单独chunk
		// 	"chunk-echarts",
		// ]
	},
	TestDataPrint: {
		template: "public/spreadjssheet.html",
		entry: "src/mainAppTestDataPrint.js",
		filename: "TestDataPrint.html",
		// chunks: [
		// 	"luckSheetTestDataApproval", //注意：这个是页面名称的chunk,下面的chunk名称需要对呀splitChunk对应的名称
		// 	"chunk-vendors", //这是admin和Index入口公用的chunk
		// 	"chunk-common",
		// 	"chunk-elementUI", //index的单独chunk
		// 	"chunk-echarts",
		// ]
	},
	template: {
		template: "public/luckysheet.html",
		entry: "src/mainTemplateLuckySheet.js",
		filename: "TemplateLuckySheet.html",
		// chunks: [
		// 	"template", //注意：这个是页面名称的chunk,下面的chunk名称需要对呀splitChunk对应的名称
		// 	"chunk-vendors", //这是admin和Index入口公用的chunk
		// 	"chunk-common",
		// 	"chunk-elementUI", //index的单独chunk
		// 	"chunk-echarts",
		// ]
	},
	AppparamTemplateMappingLuckysheet: {
		template: "public/luckysheet.html",
		entry: "src/mainparamTemplateMappingLuckysheet.js",
		filename: "paramTemplateMappingLuckysheet.html",
	}
}
module.exports = {
	// pages: {
	// 	index: {
	// 		// page 的入口
	// 		entry: 'src/main.js',
	// 		// 模板来源
	// 		template: 'public/index.html',
	// 		// 在 dist/index.html 的输出
	// 		filename: 'index.html',
	// 		// 当使用 title 选项时，
	// 		// template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
	// 		title: 'Index Page',
	// 		// 在这个页面中包含的块，默认情况下会包含
	// 		// 提取出来的通用 chunk 和 vendor chunk。

	// 	},
	// 	// 当使用只有入口的字符串格式时，
	// 	// 模板会被推导为 `public/subpage.html`
	// 	// 并且如果找不到的话，就回退到 `public/index.html`。
	// 	// 输出文件名会被推导为 `subpage.html`。
	// 	// subpage: 'src/subpage/main.js'
	// },
	pages: isProduction ? page_Object : page_Object,
	publicPath,
	assetsDir,
	outputDir,
	lintOnSave,
	transpileDependencies,
	devServer: {
		hot: true,
		port: devPort,
		open: true,
		noInfo: false,
		overlay: {
			warnings: true,
			errors: true,
		},
		//代理
		proxy: {
			'/webapi': {
				target: baseURL, //'http://42.193.118.98:5005', // 接口的域名
				//target: 'http://192.168.0.199:5005', // 接口的域名
				//target: 'https://localhost:5001',
				// secure: false,  // 如果是https接口，需要配置这个参数
				changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
				pathRewrite: {
					'^/webapi': '', // 这里用‘/api’代替target里面的地址，组件中调用接口时直接用api代替 比如我要调用'http://xxx.com:8080/api/NEWS/getNews.json?page=1&pageSize=10'，直接写‘/api/NEWS/getNews.json?page=1&pageSize=10’即可
				},
			},
      '/geocoder': {
      	target: 'http://api.map.baidu.com', //'http://42.193.118.98:5005', // 接口的域名
      	//target: 'http://192.168.0.199:5005', // 接口的域名
      	//target: 'https://localhost:5001',
      	// secure: false,  // 如果是https接口，需要配置这个参数
      	changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      	pathRewrite: {
      		'^/geocoder': '', // 这里用‘/api’代替target里面的地址，组件中调用接口时直接用api代替 比如我要调用'http://xxx.com:8080/api/NEWS/getNews.json?page=1&pageSize=10'，直接写‘/api/NEWS/getNews.json?page=1&pageSize=10’即可
      	},
      },
		},
		after: mockServer(),
	},
	configureWebpack() {
		return {
			optimization: {
				//minimize: false,
				minimizer: [
					new TerserPlugin({
						terserOptions: {
							ecma: undefined,
							warnings: false, //false
							parse: {},
							mangle: true, // Note `mangle.properties` is `false` by default.
							parallel: true,
							test: /\.js(\?.*)?$/i,
							cache: true, // 启用缓存，可以加速压缩处理
							extractComments: true, //regexp条件提取注释，并删除其余注释
							ie8: false,
							compress: {
								//pure_funcs: ['console.log'],
							},
						},
					}),
				],
			},
			resolve: {
				alias: {
					'@': resolve('src'),
				},
			},
			plugins: [
				new Webpack.ProvidePlugin(providePlugin, [{
					'window.Quill': 'quill/dist/quill.js',
					'Quill': 'quill/dist/quill.js'
				}]),
				new WebpackBar({
					name: webpackBarName,
				}),
			],
		}
	},
	chainWebpack(config) {

		config.module
			.rule('svg')
			.exclude.add(resolve('src/remixIcon'))
			.add(resolve('src/colorfulIcon'))
			.end()

		config.module
			.rule('remixIcon')
			.test(/\.svg$/)
			.include.add(resolve('src/remixIcon'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'remix-icon-[name]',
			})
			.end()

		config.module
			.rule('colorfulIcon')
			.test(/\.svg$/)
			.include.add(resolve('src/colorfulIcon'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'colorful-icon-[name]',
			})
			.end()
		/*  config.when(process.env.NODE_ENV === "development", (config) => {
		  config.devtool("source-map");
		}); */
		let preloadAndprefetchDelete = {
			index: {

			},
			luckSheet: {

			},
      WeightCollectorSheet: {

      },
      TestDataReviewWhole: {

      },
			TestData: {

			},
			template: {

			},
			AppparamTemplateMappingLuckysheet: {

			},
			SpreadJsDictionary: {

			},
			TestDataPrint: {

			},
			SpreadJsExport: {

			}
		}
		let preloadAndprefetchDeleteList = Object.keys(preloadAndprefetchDelete);
		for (let i = 0; i < preloadAndprefetchDeleteList.length; i++) {
			let item = preloadAndprefetchDeleteList[i];
			config.plugins.delete('preload-' + item);
			config.plugins.delete('prefetch-' + item);
		}
		//主页面预读
		// config.plugins.delete('preload-index')
		// config.plugins.delete('prefetch-index')
		// // luckSheet
		// config.plugins.delete('preload-luckSheet')
		// config.plugins.delete('prefetch-luckSheet')

		// config.plugins.delete('preload-luckSheetTestData')
		// config.plugins.delete('prefetch-luckSheetTestData')

		// config.plugins.delete('preload-luckSheetTestDataApproval')
		// config.plugins.delete('prefetch-luckSheetTestDataApproval')


		// config.plugins.delete('preload-TestData')
		// config.plugins.delete('prefetch-TestData')


		// config.plugins.delete('preload-template')
		// config.plugins.delete('prefetch-template')

		// config.plugins.delete('preload-AppparamTemplateMappingLuckysheet')
		// config.plugins.delete('prefetch-AppparamTemplateMappingLuckysheet')
		// config.plugins.delete('preload-SpreadJsDictionary')
		// config.plugins.delete('prefetch-SpreadJsDictionary')

		// config.plugins.delete('preload-SpreadJsExport')
		// config.plugins.delete('prefetch-SpreadJsExport')

		// config.plugins.delete('preload-TestDataPrint')
		// config.plugins.delete('prefetch-TestDataPrint')

		config.set('externals', {
			// axios: 'axios',
			//jquery: 'jquery',
			//jQuery: 'jquery',
			//$: 'jquery',
			//echarts: "echarts"
		})
		config.when(isProduction, (config) => {
			//   删除懒加载模块的prefetch，降低带宽压力
			//   而且预渲染时生成的prefetch标签是modern版本的，低版本浏览器是不需要的
			//console.log(config)


			//使用externals设置排除项

			// config.plugin('copyWebpackPlugin')
			// 	.use(new CopyWebpackPlugin([{
			// 		from: resolve('src/assets/js'),
			// 		to: 'js',
			// 		transform: function(content) {
			// 			return UglifyJS.minify(content.toString()).code;
			// 		}
			// 	}]));

			//gzpi压缩
			// config.plugin('compressionPlugin').use(
			// 	new CompressionPlugin({
			// 		//filename: '[path].gz[query]',
			// 		algorithm: 'gzip',
			// 		test: /\.js$|\.html$|.\css/, //匹配文件名,
			// 		threshold: 10240,
			// 		minRatio: 0.8,
			// 		deleteOriginalAssets: false,
			// 	})
			// )
			// config.optimization.minimizer().use(new TerserPlugin({
			// 	terserOptions: {
			// 		ecma: undefined,
			// 		warnings: false, //false
			// 		parse: {},
			// 		mangle: true, // Note `mangle.properties` is `false` by default.
			// 		parallel: true,
			// 		test: /\.js(\?.*)?$/i,
			// 		cache: true, // 启用缓存，可以加速压缩处理
			// 		extractComments: true, //regexp条件提取注释，并删除其余注释
			// 		ie8: false,
			// 		compress: {
			// 			pure_funcs: ['console.log'],
			// 		},
			// 	},
			// }))
			config.plugin('JavaScriptObfuscator')
				.use(new JavaScriptObfuscator({
					// 压缩代码
					compact: true,
					// 是否启用控制流扁平化(降低1.5倍的运行速度)
					controlFlowFlattening: true,
					// 应用概率;在较大的代码库中，建议降低此值，因为大量的控制流转换可能会增加代码的大小并降低代码的速度。
					controlFlowFlatteningThreshold: 0.5,
					// 随机的死代码块(增加了混淆代码的大小)
					deadCodeInjection: false,
					// 此选项几乎不可能使用开发者工具的控制台选项卡
					debugProtection: false,
					// 如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
					debugProtectionInterval: true,
					// 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
					disableConsoleOutput: true,//true
					// 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
					identifierNamesGenerator: 'mangled',
					log: false,
					// 是否启用全局变量和函数名称的混淆
					renameGlobals: false,
					// 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
					rotateStringArray: true,
					// 混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true;
					selfDefending: true,
					// 删除字符串文字并将它们放在一个特殊的数组中
					stringArray: true,
					stringArrayEncoding: ['none'], //none base64 rc4
					stringArrayThreshold: 0.75,
					// 允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
					unicodeEscapeSequence: false
				}, ['[\\/]node_modules[\\/]', 'chunk-vendors**', 'chunk-[a-zA-Z].js']));
			config.performance.set('hints', false)
			config.devtool('none')
			config.optimization.minimize(true)
			// 删除系统默认的splitChunk
			config.optimization.delete("splitChunks");
			config.output.filename = "[name].[hash].js";
			config.output.chunkFilename = "[name].[hash].js";
			config.optimization.splitChunks({
				chunks: 'all',
				//minChunks: 1, //引入次数，如果为2 那么一个资源最少被引用两次才可以被拆分出来
				//minChunks: 6, //引入次数，如果为2 那么一个资源最少被引用两次才可以被拆分出来
				// maxAsyncRequests: 15, // 按需加载的最大并行请求数
				// maxInitialRequests: 9, // 一个入口最大并行请求数
				//minSize: 400 * 1024, // 形成一个新代码块最小的体积,只有 >= minSize 的bundle会被拆分出来
				//maxSize: 8 * 1024 * 1024, //拆分之前最大的数值，默认为0，即不做限制
				//minSize: 20 * 1024, // 形成一个新代码块最小的体积,只有 >= minSize 的bundle会被拆分出来
				//maxSize: 5 * 1024 * 1024, //拆分之前最大的数值，默认为0，即不做限制
				cacheGroups: {
					// libs: {
					// 	name: 'chunk-libs',
					// 	test: /[\\/]node_modules[\\/]/,
					// 	priority: 10,
					// 	chunks: 'initial',
					// },
					// elementUI: {
					// 	name: 'chunk-elementUI',
					// 	priority: 20,
					// 	test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
					// },
					// fortawesome: {
					// 	name: 'chunk-fortawesome',
					// 	priority: 20,
					// 	test: /[\\/]node_modules[\\/]_?@fortawesome(.*)/,
					// },
					// commons: {
					// 	name: 'chunk-comomns',
					// 	test: resolve('src/components'), // 可自定义拓展你的规则
					// 	minChunks: 2, // 最小共用次数
					// 	priority: 5,
					// 	reuseExistingChunk: true,
					// },

					// 抽离所有入口的公用资源为一个chunk
					// view: {
					// 	name: "chunk-view",
					// 	test: /[\\/]src[\\/]views[\\/]/,
					// 	chunks: "all",
					// 	minChunks: 1, //引入次数，如果为2 那么一个资源最少被引用两次才可以被拆分出来
					// 	//minSize: 0,
					// 	priority: 1,
					// 	reuseExistingChunk: true,
					// 	enforce: true,
					// 	minSize: 20 * 1024, // 形成一个新代码块最小的体积,只有 >= minSize 的bundle会被拆分出来
					// 	maxSize: 5 * 1024 * 1024, //拆分之前最大的数值，默认为0，即不做限制
					// },

					other: {
						name: "chunk-other",
						test: /^(?!.*[\\/]src[\\/]views[\\/]).*$/,
						chunks: "all",
						priority: -10,
						reuseExistingChunk: true,
						enforce: true,
					},
					common: {
						name: "chunk-common",
						test: /[\\/]src[\\/](?!.*views).*$/,
						chunks: "all",
						minChunks: 1, //引入次数，如果为2 那么一个资源最少被引用两次才可以被拆分出来
						//minSize: 0,
						priority: 1,
						reuseExistingChunk: true,
						enforce: true,
						minSize: 20 * 1024, // 形成一个新代码块最小的体积,只有 >= minSize 的bundle会被拆分出来
						maxSize: 5 * 1024 * 1024, //拆分之前最大的数值，默认为0，即不做限制
					},
					vendors: {
						name: "chunk-vendors",
						test: /[\\/]node_modules[\\/]/,
						chunks: "all",
						priority: 2,
						reuseExistingChunk: true,
						minChunks: 2, //引入次数，如果为2 那么一个资源最少被引用两次才可以被拆分出来
						enforce: true,
						minSize: 50 * 1024, // 形成一个新代码块最小的体积,只有 >= minSize 的bundle会被拆分出来
						maxSize: 6 * 1024 * 1024, //拆分之前最大的数值，默认为0，即不做限制
					},
					element: {
						name: "chunk-element-ui",
						test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
						chunks: "all",
						priority: 3,
						reuseExistingChunk: true,
						enforce: true
					},

					echarts: {
						name: "chunk-echarts",
						test: /[\\/]node_modules[\\/]_?echarts(.*)/,
						chunks: "all",
						priority: 4,
						reuseExistingChunk: true,
						enforce: true
					},
					pdf: {
						name: "chunk-pdf",
						test: /[\\/]node_modules[\\/]_?pdfjs(.*)/,
						chunks: "all",
						priority: 4,
						reuseExistingChunk: true,
						enforce: true
					},
					zxplayer: {
						name: "chunk-zxplayer",
						test: /[\\/]node_modules[\\/]_?zx-player(.*)/,
						chunks: "all",
						priority: 4,
						reuseExistingChunk: true,
						enforce: true
					},
					brace: {
						name: "chunk-brace",
						test: /[\\/]node_modules[\\/]_?brace(.*)/,
						chunks: "all",
						priority: 4,
						reuseExistingChunk: true,
						enforce: true
					},
					exceljs: {
						name: "chunk-exceljs",
						test: /[\\/]node_modules[\\/]_?exceljs(.*)/,
						chunks: "all",
						priority: 4,
						reuseExistingChunk: true,
						enforce: true
					},
					vabicon: {
						name: "chunk-vabicon",
						test: /[\\/]node_modules[\\/]_?vab-icon(.*)/,
						chunks: "all",
						priority: 4,
						reuseExistingChunk: true,
						enforce: true
					},
					luckyexcel: {
						name: 'chunk-luckyexcel',
						test: /[\\/]node_modules[\\/]_?luckyexcel(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},
					eIconPicker: {
						name: 'chunk-e-icon-picker',
						test: /[\\/]node_modules[\\/]_?e-icon-picker(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},
					elTreeTransfer: {
						name: 'chunk-el-tree-transfer',
						test: /[\\/]node_modules[\\/]_?el-tree-transfer(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},
					zxMarkdownEditor: {
						name: 'chunk-zx-markdown-editor',
						test: /[\\/]node_modules[\\/]_?zx-markdown-editor(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},
					zxQuill: {
						name: 'chunk-zx-quill',
						test: /[\\/]node_modules[\\/]_?zx-quill(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},
					Quill: {
						name: 'chunk-quill',
						test: /[\\/]node_modules[\\/]_?quill(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},
					vue: {
						name: 'chunk-vue',
						test: /[\\/]node_modules[\\/]_?vue(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},
					zrender: {
						name: 'chunk-zrender',
						test: /[\\/]node_modules[\\/]_?zrender(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},
					riophaeVueTreeselect: {
						name: 'chunk-riophae_vue-treeselect',
						test: /[\\/]node_modules[\\/]_?@riophae_vue-treeselect(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},

					mockjs: {
						name: 'chunk-mockjs',
						test: /[\\/]node_modules[\\/]_?mockjs(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},
					jsencrypt: {
						name: 'chunk-jsencrypt',
						test: /[\\/]node_modules[\\/]_?jsencrypt(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 5,
						reuseExistingChunk: true,
					},
					flatpickr: {
						name: 'chunk-flatpickr',
						test: /[\\/]node_modules[\\/]_?flatpickr(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},
					zxVerify: {
						name: 'chunk-zx-verify',
						test: /[\\/]node_modules[\\/]_?zx-verify(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},
					viewerjs: {
						name: 'chunk-viewerjs',
						test: /[\\/]node_modules[\\/]_?viewerjs(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},
					elliptic: {
						name: 'chunk-elliptic',
						test: /[\\/]node_modules[\\/]_?elliptic(.*)/,
						chunks: "all",
						minChunks: 1, // 最小共用次数
						priority: 4,
						reuseExistingChunk: true,
					},
					file_saver: {
						name: "chunk-file-saver",
						test: /[\\/]node_modules[\\/]_?file-saver(.*)/,
						chunks: "all",
						priority: 5,
						reuseExistingChunk: true,
						enforce: true
					},
					mock: {
						name: "chunk-mock-reponse",
						test: /[\\/]mock[\\/]/,
						chunks: "all",
						priority: 10,
						reuseExistingChunk: true,
						enforce: true
					},
					components: {
						name: 'chunk-components',
						test: /[\\/]src[\\/]components[\\/]/, // 可自定义拓展你的规则
						chunks: "all",
						minChunks: 2, // 最小共用次数
						priority: 11,
						reuseExistingChunk: true,
					},
					vue_layer: {
						name: "chunk-Layer",
						test: /[\\/]src[\\/]lib[\\/]layer[\\/]/,
						chunks: "all",
						priority: 20,
						reuseExistingChunk: true,
						enforce: true
					},

				},
			})
			// 将依赖自动注入到对应页面中
			config.plugin('AutoInjectPlugin').use(new AutoInjectPlugin({
				cdn: cdn_copy,
				allInJectchunks: [
					"chunk-common",
					"chunk-vendors",
					"chunk-element-ui",
					//"chunk-echarts",
					//"chunk-pdf",
					///"chunk-zxplayer",
					"chunk-brace",
					//"chunk-exceljs",
					"chunk-vabicon",
					//"chunk-components",
					"chunk-other",
					"chunk-mock-reponse",
					"chunk-vue", //入口js已经打包必要的vue组件
					"chunk-jsencrypt",
					"chunk-luckyexcel"
				],
				inJectchunksByOutputName: {
					"index.html": {
						"chunk-Layer": {
							js: true,
							css: true,
						}
					},
					'SpreadJsDictionary.html': {
						"chunk-common": {
							js: true,
							css: false,
						},
						"chunk-Layer": {
							js: true,
							css: true,
						},
						"chunk-exceljs": {
							js: true,
							css: true,
						}
					},
					'TemplateLuckySheet.html': {
						"chunk-common": {
							js: true,
							css: false,
						},
						"chunk-Layer": {
							js: true,
							css: true,
						}
					},
					'luckysheet.html': {
						"chunk-common": {
							js: true,
							css: false,
						}
					},
          'WeightCollectorSheet.html': {
          	"chunk-common": {
          		js: true,
          		css: false,
          	}
          },
          'TestDataReviewWhole.html': {
            "chunk-common": {
            	js: true,
            	css: false,
            }
          },
					'paramTemplateMappingLuckysheet.html': {
						"chunk-common": {
							js: true,
							css: false,
						},
						"chunk-Layer": {
							js: true,
							css: true,
						}
					},
					'SpreadJsExport.html': {
						"chunk-common": {
							js: true,
							css: false,
						},
						"chunk-exceljs": {
							js: true,
							css: true,
						},
						"chunk-file-saver": {
							js: true,
							css: true,
						},
						"chunk-components": {
							js: true,
							css: true,
						}

					},
					'TestDataPrint.html': {
						"chunk-common": {
							js: true,
							css: false,
						},
						"chunk-exceljs": {
							js: true,
							css: true,
						}
					},
				}

			}))

			// config.plugin('AutoInjectPlugin').use(new AutoInjectPlugin({
			// 	cdn: cdn_copy,
			// 	allInJectchunks: [

			// 	]
			// }))

			// config.plugin('autoInjectPlugin').use(new autoInjectPlugin({
			// 	outputURI: '/' + outputDir + '/',
			// 	commonChunks: ["chunk-common",
			// 		"chunk-vendors",
			// 		"chunk-element-ui",
			// 		"chunk-echarts",
			// 		"chunk-pdf",
			// 		"chunk-zxplayer",
			// 		"chunk-brace",
			// 		"chunk-exceljs",
			// 		"chunk-vabicon",
			// 		"chunk-components",
			// 		"chunk-other"
			// 	], // name of commonsChunk.
			// }), )
			// config.plugin('HtmlWebpackPlugin').use(
			// 	Object.keys(page_Object).map(page =>
			// 		new HtmlWebpackPlugin({
			// 			filename: `${page}.html`,
			// 			chunks: [page, , "chunk-common",
			// 				"chunk-vendors",
			// 				"chunk-element-ui",
			// 				"chunk-echarts",
			// 				"chunk-pdf",
			// 				"chunk-zxplayer",
			// 				"chunk-brace",
			// 				"chunk-exceljs",
			// 				"chunk-vabicon",
			// 				"chunk-components",
			// 				"chunk-other"
			// 			],
			// 			template: page_Object[page].template,
			// 			// 模块热替换时依旧会使用vue-cli内置的HtmlWebpackPlugin，
			// 			// 疑似是vue-cli的问题，开发环境下加入hash，让其识别文件变化
			// 			//hash: process.env.NODE_ENV === 'development',
			// 		})),
			// )
			// ...Object.keys(page_Object).map(pages => ))
			// new HtmlWebpackPlugin({
			// 	inject: true,
			// 	chunks: ["chunk-common",
			// 		"chunk-vendors",
			// 		"chunk-element-ui",
			// 		"chunk-echarts",
			// 		"chunk-pdf",
			// 		"chunk-zxplayer",
			// 		"chunk-brace",
			// 		"chunk-exceljs",
			// 		"chunk-vabicon",
			// 		"chunk-components",
			// 		"chunk-other"
			// 	]

			// })

			//config.optimization.runtimeChunk({name: 'manifest'})
			config
				.plugin('banner')
				.use(Webpack.BannerPlugin, [`${webpackBanner}${time}`])
				.end()
			config.module
				.rule('images')
				.use('image-webpack-loader')
				.loader('image-webpack-loader')
				.options({
					bypassOnDebug: true,
				})
				.end()
		})

		if (build7z) {
			config.when(isProduction, (config) => {
				config
					.plugin('fileManager')
					.use(FileManagerPlugin, [{
						onEnd: {
							delete: [`./${outputDir}/video`, `./${outputDir}/data`],
							archive: [{
								source: `./${outputDir}`,
								destination: `./${outputDir}/${abbreviation}_${outputDir}_${date}.7z`,
							}, ],
						},
					}, ])
					.end()
			})
		}
	},
	runtimeCompiler: true,
	productionSourceMap: false,
	css: {
		requireModuleExtension: true,
		sourceMap: true,
		loaderOptions: {
			scss: {
				/*sass-loader 8.0语法 */
				//prependData: '@import "~@/styles/variables.scss";',

				/*sass-loader 9.0写法，感谢github用户 shaonialife*/
				additionalData(content, loaderContext) {
					const {
						resourcePath,
						rootContext
					} = loaderContext
					const relativePath = path.relative(rootContext, resourcePath)
					if (
						relativePath.replace(/\\/g, '/') !== 'src/styles/variables.scss'
					) {
						return '@import "~@/styles/variables.scss";' + content
					}
					return content
				},
			},
		},
	},
}
