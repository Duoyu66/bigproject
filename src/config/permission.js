/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import Vue from 'vue'
import router from '@/router'
import {
	resetRouter
} from '@/router'
import store from '@/store'
import VabProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/pageTitle'
import {
	authentication,
	loginInterception,
	progressBar,
	loading,
	recordRoute,
	routesWhiteList,
	tokenTableName,
	notFoundIsJump,
	homePage
} from '@/config'

import {
	Loading
} from 'element-ui';

VabProgress.configure({
	easing: 'ease',
	speed: 500,
	trickleSpeed: 200,
	showSpinner: false,
})
let loadingInstance = undefined
// // 导航守卫
// // 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach(async (to, from, next) => {
	// console.log('beforeEach', to)
	// if (to.path === '/404' && !notFoundIsJump) {
	// 	console.log('beforeEach 无权限或者未找到该页面1');
	// 	Vue.prototype.$baseMessage(
	// 		`跳转失败，您无权限打开此页面或者未找到该页面`,
	// 		'warning'
	// 	);
	// 	return '';
	// } else if (to.path === '/404') {
	// 	next()
	// 	return '';
	// }

	// const hasPermissions =
	// 	store.getters['user/permissions'] &&
	// 	store.getters['user/permissions'].length > 0
	// let nextFlag = true;

	// if (hasPermissions) {
	// 	nextFlag = await store.dispatch('routes/autoJudge', to)
	// 	if (nextFlag) {
	// 		next()
	// 	} else {
	// 		console.log('beforeEach 无权限或者未找到该页面2');
	// 		Vue.prototype.$baseMessage(
	// 			`跳转失败，您无权限打开此页面或者未找到该页面`,
	// 			'warning'
	// 		);
	// 	}

	// } else {
	// 	next()
	// }
	next()
})
router.beforeResolve(async (to, from, next) => {
	console.log('beforeResolve', to.path)
	if (to.path === '/404' && !notFoundIsJump) {
		console.log('beforeResolve 无权限或者未找到该页面 1');
		Vue.prototype.$baseMessage(
			`跳转失败，您无权限打开此页面或者未找到该页面`,
			'warning'
		);
		return '';
	}
	// else if (to.path === '/404') {
	// 	next()
	// 	return '';
	// }

	if (progressBar) VabProgress.start()
	let hasToken = store.getters['user/accessToken']
	if (!loginInterception) hasToken = true

	if (hasToken) {
		if (to.path === '/login') {
			next({
				path: '/'
			})
			if (progressBar) VabProgress.done()
			if (loading && loadingInstance) {
				loadingInstance.close();
				loadingInstance = undefined
			}
		} else {
			const hasPermissions =
				store.getters['user/permissions'] &&
				store.getters['user/permissions'].length > 0
			let nextFlag = true
			//debugger
			if (hasPermissions) {
				nextFlag = await store.dispatch('routes/autoJudge', to)
				if (nextFlag) {
					next()
				} else {
					console.log('beforeResolve 无权限或者未找到该页面2');
					Vue.prototype.$baseMessage(
						`跳转失败，您无权限打开此页面或者未找到该页面`,
						'warning'
					);
				}

			} else {
				try {
					if (loading) {
						loadingInstance = Loading.service({
							fullscreen: true,
							text: '正在加载所需数据....'
						});
					}
					let now = new Date();
					let beginTime = now.getMilliseconds(); //获取当前秒数
					let permissions
					if (!loginInterception) {
						//settings.js loginInterception为false时，创建虚拟权限
						await store.dispatch('user/setPermissions', ['admin'])
						permissions = ['admin']
					} else {
						permissions = await store.dispatch('user/getUserInfo')
						// await store.dispatch('user/setPermissions', ['admin'])
						// permissions = ['admin']
					}

					if (!permissions) {
						await store.dispatch('user/resetAccessToken')
						next('/login')
					}
					let accessRoutes = []
					if (authentication === 'intelligence') {
						accessRoutes = await store.dispatch('routes/setRoutes', permissions)
					} else if (authentication === 'all') {
						accessRoutes = await store.dispatch('routes/setAllRoutes')

					}
					let hasIndex = false
					if (accessRoutes) {
						let temp = accessRoutes.filter((item) => {
							if (item.path == homePage) {
								return item
							}
						})
						if (temp.length > 0) {
							hasIndex = true
						}
						if (!hasIndex) {
							Vue.prototype.$baseMessage(
								`无首页权限，请联系管理员`,
								'warning'
							);
						}
					}

					//判断是否有权限
					if (!accessRoutes || accessRoutes.length == 0 || !hasIndex) {
						//无权限
						await store.dispatch('user/resetAccessToken')
						next('/login')
					} else {
						//console.log(resetRouter)
						resetRouter()
						//router.removeRoute()
						router.addRoutes(accessRoutes)
						nextFlag = await store.dispatch('routes/autoJudge', to)
						if (nextFlag) {
							next({
								...to,
								replace: true
							})
						} else {
							console.log('beforeResolve 无权限或者未找到该页面3');
							Vue.prototype.$baseMessage(
								`跳转失败，您无权限打开此页面或者未找到该页面`,
								'warning'
							);
						}

					}
					if (progressBar) VabProgress.done()

					let endT = new Date();
					let endTime = endT.getMilliseconds(); //获取当前秒数
					let spTime = (endTime - beginTime);
					console.log(spTime + 'ms')
					if (loading && loadingInstance) {
						loadingInstance.close();
					}
					//
				} catch (e) {
					console.log(e)
					await store.dispatch('user/resetAccessToken')
					if (loading && loadingInstance) {
						loadingInstance.close();
					}
					if (progressBar) VabProgress.done()
				}
			}
		}
	} else {

		if (routesWhiteList.indexOf(to.path) !== -1) {
			next()
		} else {
			if (recordRoute) {
				next(`/login?redirect=${to.path}`)
			} else {
				next('/login')
			}

			if (progressBar) VabProgress.done()
		}
	}
	document.title = getPageTitle(to.meta.title)
})
router.afterEach(() => {
	if (progressBar) VabProgress.done()
})
