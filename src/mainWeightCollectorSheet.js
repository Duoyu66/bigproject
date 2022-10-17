import Vue from 'vue'
import AppWeightCollectorSheet from './AppWeightCollectorSheet.vue'
import ElementUI from 'element-ui';
import axios from 'axios'
import store from './store'
//import $ from 'jquery'
// import './plugins'
import 'element-ui/lib/theme-chalk/index.css';
import Vab from '@/utils/vab'
import {
	pageDeal,
	search_fob,
	update_fob,
	insert_fob,
	delete_fob,
	delete_from_fob,
	QueryExec_fob,
	QueryExec_fobEx,
	ExecSql_fob,
	delete_from_fobEx,
} from '@/global/form.helper'
Vue.prototype.pageDeal = pageDeal
Vue.prototype.search_fob = search_fob
Vue.prototype.update_fob = update_fob
Vue.prototype.insert_fob = insert_fob
Vue.prototype.delete_fob = delete_fob
Vue.prototype.delete_from_fob = delete_from_fob
Vue.prototype.delete_from_fobEx = delete_from_fobEx
Vue.prototype.ExecSql_fob = ExecSql_fob
Vue.prototype.QueryExec_fob = QueryExec_fob
Vue.prototype.QueryExec_fobEx = QueryExec_fobEx
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(Vab);
Vue.use(ElementUI);
new Vue({
	render: h => h(AppWeightCollectorSheet),
}).$mount('#app')
