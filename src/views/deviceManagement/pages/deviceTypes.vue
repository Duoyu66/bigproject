<template>
	<div class="table-container">
		<vab-query-form>
			<vab-query-form-left-panel>
				<el-button icon="el-icon-plus" type="primary" @click="handleAdd">
					添加
				</el-button>
				<el-button icon="el-icon-upload2" type="primary" @click="upload2">
					上传
				</el-button>
			</vab-query-form-left-panel>
			<vab-query-form-right-panel>
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
					<el-form-item>
						<el-input v-model="queryForm.name" placeholder="类型名称" />
					</el-form-item>
					<el-form-item>
						<el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery">
							查询
						</el-button>
					</el-form-item>
				</el-form>
			</vab-query-form-right-panel>
		</vab-query-form>
		<!--        表格列表-->
		<el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="table.tableHeight"
		 @selection-change="setSelectRows" @sort-change="tableSortChange" @row-click="rowClick" highlight-current-row>
<!--			<el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>-->
			<el-table-column show-overflow-tooltip label="设备类别ID" prop="type_id" width="100" align="center"></el-table-column>
			<el-table-column show-overflow-tooltip label="设备类别名称" prop="name" width="120" align="center"></el-table-column>
			<el-table-column show-overflow-tooltip label="设备类型描述" prop="desc" header-align="center"></el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="150px" align="center" fixed="right">
				<template #default="{ row }">
					<el-button type="text" class="normal" @click="handleEdit(row)">
						编辑
					</el-button>
					<el-button type="text" class="danger" @click="handleDelete(row)">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
		 :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
		<table-edit ref="edit" @fetchData="fetchData"></table-edit>
		<updateEdit ref="update"></updateEdit>
	</div>
</template>

<script>
	import TableEdit from './../components/defaultEdit'
	import updateEdit from './../components/update_test'
	import treeData from './../../vab/tree/index'
  import { getList, doDelete } from '@/api/table'
	import {
		sql_helper
	} from '@/global/sql_helper'
	export default {
		name: 'ComprehensiveTable',
		//设置provider
		provide() {
			return {
				reload: this.reload
			}
		},
		components: {
			TableEdit,
			updateEdit,
			// eslint-disable-next-line vue/no-unused-components
			treeData,
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					published: 'success',
					draft: 'gray',
					deleted: 'danger',
				}
				return statusMap[status]
			},
		},
		data() {
			return {
				imgShow: true,
				list: [],
				imageList: [],
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					name: '',
				},
				table: {
					tableHeight: this.$(window).height() - 270
				}
			}
		},
		computed: {

		},
		created() {
			this.fetchData()
		},
		beforeDestroy() {},
		mounted: function() {
			this.$nextTick(function() {
				let exceptHeight = 270;
				// this.$refs.table.$el.offsetTop：表格距离浏览器的高度
				//tableSort为table中ref的值
				if (this.$refs.tableSort.$el) {
					this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight;
				}

				// 监听窗口大小变化
				let that = this;
				window.onresize = function() {
					if (that.$refs.tableSort.$el) {
						that.table.tableHeight = window.innerHeight - that.$refs.tableSort.$el.offsetTop - exceptHeight;
					}
				}
			});
		},
		methods: {
			upload2() {
				this.$refs['update'].showEditEx()
			},
			tableSortChange() {
				const imageList = []
				this.$refs.tableSort.tableData.forEach((item, index) => {
					imageList.push(item.img)
				})
				this.imageList = imageList
			},
			//复选框事件
			setSelectRows(val) {
				this.selectRows = val
			},
			//行点击事件
			rowClick(row) {
				console.log(row);
			},
			handleAdd() {
				this.$refs['edit'].showEdit()
			},
			handleEdit(row) {
				this.$refs['edit'].showEdit(row)
			},
			handleDelete(row) {
				//this.reload()
        console.log(row)
				let id = '';
				let that = this;
				let msg = '';
				if (row && row.type_id) {
					id = row.type_id
					msg = '你确定要删除当前项吗'
				} else {
					if (this.selectRows.length > 0) {
						id = that.selectRows.map((item) => "'" + item.type_id + "'").join()
						msg = '你确定要删除选中项吗'
					} else {
						this.$baseMessage('未选中任何行', 'error')
						return false
					}
				}
				this.$baseConfirm(msg, null, async () => {
					let list = [{
						field: "type_id",
						level: 1
					}]
					let form = {
						type_id: id
					}
          let data = JSON.parse(JSON.stringify(form))
          let sData = sql_helper.splicing_fob(4, 6, list, data);

					const msg = await doDelete(sData.sql);
					this.$baseMessage(msg, "success");
					this.fetchData();

				})
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData()
			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchData()
			},
			handleQuery() {
				this.queryForm.pageNo = 1
				this.fetchData()
			},
			async fetchData() {
				let that = this
				//根据sql自行编写
				let select_list = [{
					field: "name",
					type: 2,
					level: 1
				}, {
					field: "pageNo",
					type: 3,
					level: 2
				}, {
					field: "pageSize",
					type: 3,
					level: 3
				}]
        let queryForm1 = JSON.parse(JSON.stringify(this.queryForm))
        queryForm1.pageNo = (queryForm1.pageNo - 1) * queryForm1.pageSize + 1;
        queryForm1.pageSize = (queryForm1.pageNo) * queryForm1.pageSize;

				let sData = sql_helper.splicing_fob(1, 2, select_list, queryForm1);

        this.listLoading = true
        const { data, totalCount } = await getList(sData.sql)
        this.list = data
        this.total = totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 500)

				// that.AjaxHelper.QueryExec_fob(that.sql_helper.splicing_fob(1, 2, select_list, filed).sql, function(res) {
				// 	console.log(res);
				// 	const {
				// 		data,
				// 		totalCount
				// 	} = res;
				// 	//this.imageList = imageList
				// 	that.list = data
				// 	that.total = Number(totalCount)
				// 	console.log(that);
				// 	that.listLoading = false
				// }, function() {

				// })
			},
			testMessage() {
				this.$baseMessage('test1', 'success')
			},
			testALert() {
				this.$baseAlert('11')
				this.$baseAlert('11', '自定义标题', () => {
					/* 可以写回调; */
				})
				this.$baseAlert('11', null, () => {
					/* 可以写回调; */
				})
			},
			testConfirm() {
				this.$baseConfirm(
					'你确定要执行该操作?',
					null,
					() => {
						/* 可以写回调; */
					},
					() => {
						/* 可以写回调; */
					}
				)
			},
			testNotify() {
				this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
			},
			reload() {
				this.fetchData()
			}
		}
	}
</script>
