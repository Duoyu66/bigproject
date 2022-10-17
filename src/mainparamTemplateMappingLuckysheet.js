import Vue from 'vue'
import AppLuckySheet from './AppparamTemplateMappingLuckysheet.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import layer from '@/lib/layer/vue-layer.umd.min'
import '@/lib/layer/vue-layer.css';

Vue.prototype.$layer = layer(Vue, {
	msgtime: 3, //目前只有一项，即msg方法的默认消失时间，单位：秒
});

Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
	render: h => h(AppLuckySheet),
}).$mount('#app')
