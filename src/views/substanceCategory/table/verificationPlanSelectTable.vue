<template>
	<div style="height: calc(60vh);">
		<div class="voidrecord" style="margin-bottom: 16px">
			<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent
				style="width: 100%;padding-right:0px">
				<el-form-item style="">
					<el-input v-model="queryForm.mat_name" clearable style="width: 100%;" placeholder="类别">
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="queryForm.store_name" clearable style="width: 100%;" placeholder="名称">
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="queryForm.manager_id" clearable style="width: 100%;" placeholder="管理编号">
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-switch v-model="queryForm.isShowSelect" active-text="仅显示需要校检的标准物质" inactive-text=""
						@change="switchisShowSelect">
					</el-switch>
				</el-form-item>
				<el-form-item style="">
					<el-button icon="el-icon-search" type="primary" native-type="submit" @click="fetchData">
					</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-table ref="tableSort" v-loading="listLoading" highlight-current-row :data="tablelist" border
			:element-loading-text="table.check_show.elementLoadingText" :height="table.check_show.tableHeight"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="handleSelectionChange"
			@select="handleSelectionChange" @select-all="selectall">

			<el-table-column show-overflow-tooltip prop="manage_id" label="管理编号"></el-table-column>
			<el-table-column show-overflow-tooltip prop="store_name" label="名称"></el-table-column>
			<el-table-column show-overflow-tooltip prop="mat_name" label="类型">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="calibrate_date" label="上次校检日期" width="130px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="nextcalibrate_date" label="下次校检日期" width="130px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="check_method" label="上次校检方式">
			</el-table-column>
			<el-table-column type="selection" width="45" fixed="right">
			</el-table-column>
		</el-table>
		<el-pagination :background="table.check_show.background" :current-page="queryForm.pageNo"
			:layout="table.check_show.layout" :page-size="queryForm.pageSize" :total="total"
			@current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
	</div>
</template>

<script>
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
	} from '@/utils/dateHelp'
	import {
		sql_helper
	} from '@/global/sql_helper'

	import {
		handleSelectionChange,
		toggleSelectionList
	} from '@/utils/tableHelper'
	import {
		GetRmAlloc,
		GetOrgId,
		GetPersonRoleMax,
		getOrgNameByselect,
		GetPersonList,
		file_about,
		GetRmStore,
		GetRmBuyMinDate,
		GetRmBaseInfoByStoreId
	} from '../commonJs/common.substanceCategory.js'

	export default {
		name: 'verificationPlanSelectTable',
		components: {

		},
		model: {
			prop: 'value',
			event: 'on-change',
		},
		props: {
			org_id: {
				type: String,
				required: false,
				default: ''
			},
			value: {
				type: Array,
				required: false,
				default: function() {
					return []
				}
			},
			type: {
				type: String,
				required: false,
				default: 'check_Calibrate'
			}
		},
		data() {
			let that = this
			return {
				tablelist: [],
				total: 0,
				listLoading: false,
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					isShowSelect: true,
					mat_name: '',
					store_name: '',
					manager_id: '',

				},
				table: {
					check_show: {
						elementLoadingText: '加载中...',
						total: 0,
						tableHeight: 'calc(70%)',
						background: false,
						layout: 'total, sizes, prev, pager, next, jumper',
						selectRows: [{

						}]
					}
				},


				formdefalut: {

				},


			}
		},
		watch: {

		},
		created() {
			this.init()
		},
		methods: {
			async init() {
				let length = 0
				let item = {}
				let selectRows = []
				switch (this.type) {
					case 'check_Calibrate':
						length = this.value.length
						for (let i = 0; i < length; i++) {
							item = this.value[i]
							selectRows.push({
								store_id: item
							})
						}
						this.table.check_show.selectRows = selectRows
						this.fetchData();
						break
				}
			},
			isReadOnly(txt) {
				if (this.readonly) {
					return ''
				}
				return txt
			},
			selectall(val) {
				if (val.length == 0) {
					this.UpdateSelect(this.tablelist, 1)
				} else {
					this.UpdateSelect(val, 0)
				}
			},
			handleSelectionChange(val, row) {
				if (!val || val.length == 0) {
					val = []
				}
				if (!row) {
					return false
				}

				if (this.listLoading) {
					return false
				}
				let select_stauts = handleSelectionChange(val, row)
				if (select_stauts.code != 200) {
					return false
				}
				let opertion_type = 0;
				if (select_stauts.data) {
					opertion_type = 0
				} else {
					opertion_type = 1
				}
				this.UpdateSelect([row], opertion_type)
			},
			UpdateSelect(array, opertion_type) {
				let length = array.length
				let item = {}
				let store_id = 0
				let selectRows = this.table.check_show.selectRows

				for (let i = 0; i < length; i++) {
					item = array[i]
					store_id = item.store_id
					let find = selectRows.filter((val) => {
						if (val.store_id == store_id) {
							return val
						}
					})
					switch (opertion_type) {
						//添加
						case 0:
							if (find.length == 0) {
								selectRows.push(item)
							}

							break
							//删除
						case 1:
							if (find.length > 0) {
								selectRows.splice(selectRows.indexOf(find[0]), 1);
							}
							break
					}
				}
				this.table.check_show.selectRows = selectRows

				//this.UpdataValue(selectRows)
			},
			UpdataValue(selectRows) {
				if (!selectRows) {
					selectRows = this.table.check_show.selectRows
				}
				let length = selectRows.length
				let item = {}
				let set = new Set()
				for (let i = 0; i < length; i++) {
					item = selectRows[i]
					set.add(item.store_id)
				}
				let array = Array.from(set);
				this.$emit('UpdateSelect', selectRows);
				this.$emit('update:value', array)
				this.$emit('on-change', array);
			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchData({
					pageNo: val,
				})
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData({
					pageNo: this.queryForm.pageNo,
				})
			},
			async getOrgId() {
				if (this.org_id) {
					return this.org_id
				}
				return await GetOrgId()
			},
			close() {
				let that = this
				that.$refs['purchase_from'].resetFields()

				that.form = JSON.parse(JSON.stringify(that.formdefalut))
			},
			resetForm() {
				this.$nextTick(() => {
					this.$refs['purchase_from'].resetFields()
				})
			},
			async QueryExec_fob_custom(list, form, sqlcode) {
				return await this.QueryExec_fob(sqlcode, list, form)
			},
			toggleSelection(tableData) {
				if (!tableData) {
					tableData = this.tablelist
				}
				if (!tableData) {
					tableData = []
				}
				let data = this.table.check_show.selectRows
				let length = data.length
				let selectList = []
				for (let i = 0; i < length; i++) {
					try {
						let item = data[i]
						let find = tableData.filter((val) => {
							if (val.store_id == item.store_id) {
								return val
							}
						})
						if (find.length > 0) {
							selectList.push(find[0])
							//判断类别名称是否可用，不可用将查到的赋值给当前
							if (!item.mat_name) {
								find[0].isReadOnly = true
								data[i] = find[0]
							}
						}
					} catch (e) {
						console.log(e)
					}
				}
				toggleSelectionList(this, 'tableSort', selectList)
			},
			switchisShowSelect() {
				this.fetchData()
			},
			async fetchData(pageInfo, treeNode, resolve) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				switch (that.type) {
					case 'check_Calibrate':
						await that.fechDataCalibrate(pageInfo, treeNode, resolve)
						this.toggleSelection()
						break
				}
			},
			async fechDataCalibrate() {
				let alist = [{
						field: 'mat_name',
						type: 2,
						level: 1,
					}, {
						field: 'manager_id',
						type: 2,
						level: 2,
					},
					{
						field: 'store_name',
						type: 2,
						level: 3,
					},
					{
						field: 'last_date_start',
						type: 3,
						level: 4,
					},
					{
						field: 'last_date_end',
						type: 3,
						level: 5,
					},
					{
						field: 'org_id',
						type: 3,
						level: 6,
					},
					{
						field: 'implementation_date',
						type: 3,
						level: 7,
					},
					{
						field: 'isShowAll',
						type: 3,
						level: 8,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 9,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 10,
					},
				]
				this.queryForm.org_id = await this.getOrgId()
				if (this.queryForm.isShowSelect) {
					this.queryForm.isShowAll = 1
				} else {
					this.queryForm.isShowAll = 0
				}
				let key_json = {
					loading: 'listLoading', //加载效果属性名
					data: 'tablelist', //数据属性名
					total: 'total', //总数属性名
					queryForm: 'queryForm', //查询条件属性名
				}
				await this.search_fob(alist, this, 599, key_json)
			},
		},
	}
</script>

<style>
</style>