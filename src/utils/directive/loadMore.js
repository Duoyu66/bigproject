import Vue from 'vue'
const lodash = require('lodash');
export const loadMore = (el, binding) => {
	console.log('loadMore')
	const fun = lodash.debounce(() => {
		binding.value();
	}, 1000);
	let flag = true;
	const SELECTDOWN_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
	SELECTDOWN_DOM.addEventListener('scroll', function() {
		const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
		if (CONDITION) {
			binding.value()
		}
	})
};
