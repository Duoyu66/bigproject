/**
 * @description 导出默认通用配置
 */
const setting = {
	// 开发以及部署时的URL
	publicPath: '',
	// 生产环境构建文件的目录名
	outputDir: 'dist',
	// 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
	assetsDir: 'static',
	// 开发环境每次保存时是否输出为eslint编译警告
	lintOnSave: false,
	// 进行编译的依赖
	transpileDependencies: ['vue-echarts', 'resize-detector'],
	// 默认的接口地址 如果是开发环境和生产环境走vab-mock-server，当然你也可以选择自己配置成需要的接口地址
	// baseURL:  process.env.NODE_ENV === 'development' // ? 'vab-mock-server'
	// 	? // : 'https://localhost:5001/',
	// 	'http://42.193.118.98:5005' : process.env.NODE_ENV === 'experiment' ? 'http://42.193.118.98:5005' :
	// 	'http://42.193.118.98:5006',
	baseURL: baseURL_fob(),
	//'http://localhost:6010' : 'http://42.193.118.98:5006',
	//标题 （包括初次加载雪花屏的标题 页面的标题 浏览器的标题）
	title: '工程质量管理平台',
	title_abbreviation: '工程质量管理平台',
	//简写
	abbreviation: 'vab',
	//开发环境端口号
	devPort: '83',
	//版本号
	version: process.env.VUE_APP_VERSION,
	//这一项非常重要！请务必保留MIT协议下package.json及copyright作者信息 即可免费商用，不遵守此项约定你将无法使用该框架，如需自定义版权信息请联系QQ1204505056
	copyright: 'vab',
	//是否显示页面底部自定义版权信息
	footerCopyright: false,
	//是否显示顶部进度条
	progressBar: true,
	//加载遮罩
	loading: true,
	//缓存路由的最大数量
	keepAliveMaxNum: 99,
	// 路由模式，可选值为 history 或 hash
	routerMode: process.env.NODE_ENV === 'development' // ? 'vab-mock-server'
		?
		'hash' : 'hash',
	//不经过token校验的路由
	routesWhiteList: ['/login', '/register', '/404', '/401'],
	//404是否跳转
	notFoundIsJump: false,
	//加载时显示文字
	loadingText: '正在加载中...',
	//token名称
	tokenName: 'Authorization',
	//token 传输名称
	tokenAuthName: 'access_token',
	//token在localStorage、sessionStorage存储的key的名称
	tokenTableName: 'gtwise',
	tokenTableName2: 'gtwise_person',
	//token存储位置localStorage sessionStorage
	storage: 'localStorage',
	//token失效回退到登录页时是否记录本次的路由
	recordRoute: true,
	//是否显示logo，不显示时设置false，显示时请填写remixIcon图标名称，暂时只支持设置remixIcon
	logo: 'vuejs', //'vuejs-fill', //'',
	//是否显示在页面高亮错误
	errorLog: ['development'],
	//是否开启登录拦截
	loginInterception: true,
	//是否开启登录RSA加密
	loginRSA: false,
	//intelligence和all两种方式，前者后端权限只控制permissions不控制view文件的import（前后端配合，减轻后端工作量），all方式完全交给后端前端只负责加载
	authentication: 'all',
	//authentication: 'all',
	//vertical布局时是否只保持一个子菜单的展开
	uniqueOpened: true,
	//vertical布局时默认展开的菜单path，使用逗号隔开建议只展开一个
	defaultOopeneds: ['/vab'],
	//需要加loading层的请求，防止重复提交
	debounce: ['doEdit', '/api/Common/ExecSql'],
	//需要自动注入并加载的模块
	providePlugin: {
		//maptalks: 'maptalks',
		//'window.maptalks': 'maptalks',
		//jQuery: 'jquery',
		//$: 'jquery',
		axios: 'axios',
		'window.Quill': 'quill/dist/quill.js',
		Quill: 'quill/dist/quill.js'
	},
	//npm run build时是否自动生成7z压缩包
	build7z: true,
	//代码生成机生成在view下的文件夹名称
	templateFolder: 'project',
	homePage: '/',
	//是否显示终端donation打印
	donation: false,
	cdn: {
		css: [

		],
		js: [

		]
	},
	//默认的一级目录路径
	routeorg: [
		'/system/menu',
		'/system/permissionTypes',
		'/postArticle/menu',
		'/chemicalManagement/menu',
		'/officeManagement/menu',
		'/standardManagement/menu',
		'/testProcess/menu',
		'/testDevelopment/menu',
		'/userManages/menu',
		'/device/menu',
		'/testingRoom/menu',
		'/customer/menu',
		'/device/deviceClass',
		'/testingRoom/menu',
	],
	video_prefix_config: 'glcs-',
	video_servicer_ip: 'http://211.149.225.216:10000',
	//不需要点击左侧机构重载的路径，
	unwantedReloadRouthPath: ['/index'],
}
var pubulicUrl = '';

function baseURL_fob() {
	let NODE_ENV = process.env.NODE_ENV
	let url = ""
	switch (NODE_ENV) {
		case 'testMode':
		case "experiment":
		case 'development':
			url = "http://42.193.118.98:5022";
			//url = "http://192.168.1.200:7000";
			//url = "https://localhost:6001"
			break;
		case "production":
			//url = "http://42.193.118.98:5006";
			url = "http://42.193.118.98:5022";
			//url = "http://10.32.68.170:5001";
			//url = "http://192.168.1.200:7000";//中铁咨询内网webapi地址 中铁咨询生产环境 谨慎操作
			//url = "http://42.193.118.98:8083";//中铁咨询代理ip 中铁咨询生产环境 谨慎操作
			break;
		default:
			url = "http://42.193.118.98:5022";
			break;
	}
	return url;
}
module.exports = setting
