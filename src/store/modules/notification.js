/*
 * @Author: kiralacus
 * @Date: 2022-03-12 16:18:03
 * @LastEditors: kiralacus
 * @LastEditTime: 2022-03-12 16:55:10
 * @Description:存储通知
 * @FilePath: \母体实验室\src\store\modules\notification.js
 */
import {
	sql_helper
} from '@/global/sql_helper'
import store from '@/store/index'
import Vue from 'vue'
import {
	getTreeList
} from '@/api/tree'
import {
	TreeDataDeal
} from '@/global/tree_deal.js'
const state = {
	//通知列表
	noticeList: [],
}
const getter = {
	noticeList: (state) => state.noticeList,
}
const getters = {
	noticeList: (state) => state.noticeList,
}
const mutations = {
  setNoticeList(state, noticeList) {
  	state.noticeList = noticeList
  },
	async putNoticeList(state, [pageName, noticeData]) {
		state.noticeList.push({pageName:pageName,noticeData,noticeData})
	},
}
const actions = {

}
export default {
	state,
	getters,
	mutations,
	actions,
}
