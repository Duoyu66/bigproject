import request from '@/utils/request'
import {
	ZlibHelper
} from '@/global/zlibHelper'
import store from '@/store/index'
import {
	Loading
} from 'element-ui';
import Vue from 'vue';
import VabProgress from 'nprogress'
import 'nprogress/nprogress.css'
VabProgress.configure({
	easing: 'ease',
	speed: 500,
	trickleSpeed: 200,
	showSpinner: false,
})
export async function waterMark(apply_id, fileType) {
	VabProgress.start();
	const person_id = store.getters['user/person_id'];
	let getData = await request({
		url: '/api/Image/waterMark',
		method: 'post',
		data: {
			apply_id: apply_id,
			fileType: fileType,
			person_id: person_id
		}
	})
	// if (getData && getData.data) {
	// 	getData.data = ZlibHelper.DeCompressInterData_fob(getData.data)
	// }
	VabProgress.done();
	if (getData.staus <= 0) {
		Vue.prototype.$message({
			message: getData.msg,
			type: 'warning'
		});
	}
	if (!getData.data && getData.staus > 0) {
		Vue.prototype.$message({
			message: '获取资质文件失败，请刷新重试',
			type: 'warning'
		});
		getData.staus = -1;
	}
	return getData;
}
