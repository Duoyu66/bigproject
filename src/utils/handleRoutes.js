/**
 * @description all模式渲染后端返回路由
 * @param constantRoutes
 * @returns {*}
 */
const Layout = () => Promise.resolve(import('@/layouts'))
const EmptyLayout = () => Promise.resolve(import('@/layouts/EmptyLayout'))
export function convertRouter(asyncRoutes) {
	function convert(asyncRoutes) {
		return asyncRoutes.map((route) => {
			if (route.component) {
				if (route.component === 'Layout') {
					//route.component = (resolve) => require(['@/layouts'], resolve)
					route.component = Layout
				} else if (route.component === 'EmptyLayout') {
					// route.component = (resolve) =>
					// 	require(['@/layouts/EmptyLayout'], resolve)
					route.component = EmptyLayout
				} else {
					const index = route.component.indexOf('views')
					const path =
						index > 0 ? route.component.slice(index) : `views/${route.component}`
					//route.component = (resolve) => require([`@/${path}`], resolve)
					//Promise.resolve(require(`@/views/${view}`).default)
					//route.component = () => import(`@/${path}`)
					route.component = () => Promise.resolve(import(`@/${path}`))
					//route.component = () => Promise.resolve(require(`@/${path}`).default)
				}
			} else {
				route.component = EmptyLayout
				console.log(route.permission_id)
			}
			if (route.children && route.children.length)
				route.children = convert(route.children)
			if (route.children && route.children.length === 0) delete route.children
			return route
		})
	}
	asyncRoutes = convert(asyncRoutes)

	return asyncRoutes
}

/**
 * @description 判断当前路由是否包含权限
 * @param permissions
 * @param route
 * @returns {boolean|*}
 */
function hasPermission(permissions, route) {
	if (route.meta && route.meta.permissions) {
		return permissions.some((role) => route.meta.permissions.includes(role))
	} else {
		return true
	}
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description intelligence模式根据permissions数组拦截路由
 * @param routes
 * @param permissions
 * @returns {[]}
 */
export function filterAsyncRoutes(routes, permissions) {
	const finallyRoutes = []
	routes.forEach((route) => {
		const item = {
			...route
		}
		if (hasPermission(permissions, item)) {
			if (item.children) {
				item.children = filterAsyncRoutes(item.children, permissions)
			}
			finallyRoutes.push(item)
		}
	})
	return finallyRoutes
}
