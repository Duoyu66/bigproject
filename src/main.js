/*
 * @Author: Mortar
 * @Date: 2021-03-02 09:51:13
 * @LastEditors: Mortar
 * @LastEditTime: 2021-03-05 20:16:46
 * @Description:
 * @FilePath: \母体实验室\src\main.js
 */
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins'
import '@/layouts/export'
import './utils/dialog'


import {
	pageDeal,
	search_fob,
	update_fob,
	insert_fob,
	delete_fob,
	delete_from_fob,
	QueryExec_fob,
	QueryExecAndPage_fob,
	QueryExec_fobEx,
	ExecSql_fob,
	delete_from_fobEx,
} from '@/global/form.helper'
import {
	sql_helper
} from '@/global/sql_helper'
import {
	DESHelper
} from '@/global/des.helper'
import {
	sataic_variable
} from './global/sataic_variable.vue'
let proxyMiddleware = require('http-proxy-middleware') //获取插件
//const axios = () => import("axios")
import axios from 'axios'
import $ from 'jquery'
import autoHeight from './utils/directive/auto-height'
import {
	getParamUnit
} from './utils/Parameter'
window.getParamUnit = getParamUnit;
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import trendstable from 'trendstable'
import 'trendstable/lib/trendstable.css'
import {
	loadMore
} from './utils/directive/loadMore' // 下拉加载更多

// import layer from 'vue-layer'
// import 'vue-layer/lib/vue-layer.css';
import layer from '@/lib/layer/vue-layer.umd.min'
import '@/lib/layer/vue-layer.css';
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

import UUID from 'vue-uuid'
import VuetifulBoard from './vueful-board.js'

Vue.use(VuetifulBoard)
Vue.use(UUID)
import './assets/scss/index.scss';
import * as echarts from 'echarts';

import Print from 'vue-print-nb'

Vue.use(Print)

Vue.prototype.$echarts = echarts

// import vllayer from 'vl-layer'
// import 'vl-layer/vl-layer.css';
// Vue.prototype.$vllayer = layer(Vue);
Vue.prototype.$layer = layer(Vue, {
	msgtime: 3, //目前只有一项，即msg方法的默认消失时间，单位：秒
});

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 生产环境默认都使用mock，如果正式用于生产环境时，记得去掉
 */
let isProduction = false
switch (process.env.NODE_ENV) {
	case 'production':
		isProduction = true
		break
		//测试打包的环境
	case 'test':
	case 'experiment':
		isProduction = true
		break
}
if (!isProduction) {
	const {
		mockXHR
	} = require('@/utils/static')
	mockXHR()
}



Vue.prototype.constructor = Vue
Vue.prototype.$axios = axios
//axios.defaults.baseURL = '/api' //关键代码
Vue.config.productionTip = false

Vue.prototype.sql_helper = sql_helper
Vue.prototype.static_var = sataic_variable
Vue.prototype.deshelper = DESHelper
Vue.prototype.$ = $

//form
Vue.prototype.pageDeal = pageDeal
Vue.prototype.search_fob = search_fob
Vue.prototype.update_fob = update_fob
Vue.prototype.insert_fob = insert_fob
Vue.prototype.delete_fob = delete_fob
Vue.prototype.delete_from_fob = delete_from_fob
Vue.prototype.delete_from_fobEx = delete_from_fobEx
Vue.prototype.QueryExecAndPage_fob = QueryExecAndPage_fob;
Vue.prototype.ExecSql_fob = ExecSql_fob
Vue.prototype.QueryExec_fob = QueryExec_fob
Vue.prototype.QueryExec_fobEx = QueryExec_fobEx
//Vue.use(global);
Vue.directive('auto-height', autoHeight)

Vue.directive('loadmore', {
	bind: loadMore
});
Vue.use(Viewer, {
	defaultOptions: {
		zIndex: 9999
	}
})
Vue.use(trendstable)

Viewer.setDefaults({
	Options: {
		inline: true,
		button: true,
		navbar: true,
		title: true,
		toolbar: true,
		tooltip: true,
		movable: true,
		zoomable: true,
		rotatable: true,
		scalable: true,
		transition: true,
		fullscreen: true,
		keyboard: true,
		url: 'data-source',
	},
})
let ThisVue = new Vue({
	el: '#vue-admin-beautiful',
	router,
	store,
	render: (h) => h(App),
})
//window.Vue = ThisVue
Vue.prototype.ThisVue = ThisVue
window.vue_vm = ThisVue
window._Vue = Vue
