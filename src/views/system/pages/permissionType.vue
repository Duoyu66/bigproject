<template>

	<div class="table-container definition roledefinition">
		<vab-query-form>
			<vab-query-form-left-panel style="width: 100%;">
				<el-button type="primary" @click="handleAdd">
					添加类型
				</el-button>
			</vab-query-form-left-panel>
		</vab-query-form>
		<el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"
			highlight-current-row :height="table.tableHeight" @selection-change="setSelectRows"
			@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
			<el-table-column show-overflow-tooltip label="权限类型ID" prop="id"></el-table-column>
			<el-table-column show-overflow-tooltip prop="type" label="权限类型"></el-table-column>
			<el-table-column show-overflow-tooltip label="权限类型描述" prop="describe"></el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="180px">
				<template #default="{ row }">
					<el-button type="primary" class="normal" @click="dialogFormVisible = true">修改</el-button>
					<el-button @click="handleDelete(row)" class="danger">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<table-edit ref="edit"></table-edit>
	</div>
</template>

<script>
	import {
		getList,
		doDelete
	} from '@/api/table'
	import TableEdit from '../components/permissionType.vue'
	import treeData from './../../vab/tree/index'
	export default {
		name: 'ComprehensiveTable',
		components: {
			TableEdit,
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
					title: '',
				},
				dialogFormVisible: false,
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: ''
				},
				formLabelWidth: '120px',
				table: {
					tableHeight: this.$(window).height()
				}
			}
		},
		computed: {
			height() {
				return this.$baseTableHeight()
			},
		},
		created() {
			this.fetchData()
		},
		beforeDestroy() {},
		mounted: function() {
			// this.$nextTick(function() {
			// 	let exceptHeight = 205;
			// 	// this.$refs.table.$el.offsetTop：表格距离浏览器的高度
			// 	//tableSort为table中ref的值
			// 	if (this.$refs.tableSort.$el) {
			// 		this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop -
			// 			exceptHeight;
			// 	}

			// 	// 监听窗口大小变化
			// 	let that = this;
			// 	window.onresize = function() {
			// 		if (that.$refs.tableSort.$el) {
			// 			that.table.tableHeight = window.innerHeight - that.$refs.tableSort.$el.offsetTop -
			// 				exceptHeight;
			// 		}
			// 	}
			// });
		},
		methods: {
			tableSortChange() {
				const imageList = []
				this.$refs.tableSort.tableData.forEach((item, index) => {
					imageList.push(item.img)
				})
				this.imageList = imageList
			},
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
				this.$refs['edit'].showEdit()
			},
			handleDelete(row) {
				if (row.id) {
					this.$baseConfirm('你确定要删除采购日期为()的记录吗', null, async () => {
						const {
							msg
						} = await doDelete({
							ids: row.id
						})
						this.$baseMessage(msg, 'success')
						this.fetchData()
					})
				}
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
				this.listLoading = true
				const {
					data,
					totalCount
				} = await getList(this.queryForm)
				this.list = [{
						"id": "10001",
						"type": "类型1",
						"describe": "测试输出1"
					},
					{
						"id": "10005",
						"type": "类型8",
						"describe": "测试输出12"
					},
					{
						"id": "10020",
						"type": "类型71",
						"describe": "测试输出6"
					},
					{
						"id": "10013",
						"type": "类型6",
						"describe": "测试输出13"
					}
				]
				const imageList = []
				data.forEach((item, index) => {
					imageList.push(item.img)
				})
				this.imageList = imageList
				this.total = totalCount
				setTimeout(() => {
					this.listLoading = false
				}, 500)
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
		},
	}
</script>
