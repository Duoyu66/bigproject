<template>
	<div class="table-container definition">
		<vab-query-form>
			<vab-query-form-left-panel>
				<el-button type="primary" @click="handleAdd">添加检测室</el-button>
			</vab-query-form-left-panel>
			<vab-query-form-right-panel>
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
					<el-form-item>
						<el-input style="border-radius: 30px" v-model="queryForm.title" placeholder="按照检测室名称查询"
							prefix-icon="el-icon-search" />
					</el-form-item>
				</el-form>
			</vab-query-form-right-panel>
		</vab-query-form>

		<el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"
			highlight-current-row :height="table.tableHeight" @selection-change="setSelectRows"
			@sort-change="tableSortChange" :header-cell-style="{ background: '#e8f0ff' }">
			<el-table-column show-overflow-tooltip label="检测室管理编码" prop="number"></el-table-column>
			<el-table-column show-overflow-tooltip prop="name" label="检测室名称"></el-table-column>
			<el-table-column show-overflow-tooltip label="检测室介绍" prop="introduction"></el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="160px">
				<template #default="{ row }">
					<el-button type="primary" class="normal" @click="handleEdit(row)">
						修改
					</el-button>
					<!-- <el-dialog title="修改检测室" :visible.sync="dialogFormVisible" width="30%" style="text-align:left">
              <el-form :model="form">
                <el-form-item label="检测室编码" :label-width="formLabelWidth" style="padding-top:10px">
                  <el-input  style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="检测室名称" :label-width="formLabelWidth" style="padding-top:10px">
                  <el-input  style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="检测室描述" :label-width="formLabelWidth" style="padding-top:10px">
                  <el-input  style="width: 300px;"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
              </div>
            </el-dialog> -->
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
	import TableEdit from '../components/detectionRoomdefinition.vue'
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
				form: {
					name: 'a',
					norms: 'rygz',
					name1: 'a',
					name2: 'a',
					name3: 'a',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: '',
					mill: '',
					value1: ''
				},
				dialogFormVisible: false,
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
			this.$nextTick(function() {
				let exceptHeight = 205;
				// this.$refs.table.$el.offsetTop：表格距离浏览器的高度
				//tableSort为table中ref的值
				if (this.$refs.tableSort.$el) {
					this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop -
						exceptHeight;
				}

				// 监听窗口大小变化
				let that = this;
				window.onresize = function() {
					if (that.$refs.tableSort.$el) {
						that.table.tableHeight = window.innerHeight - that.$refs.tableSort.$el.offsetTop -
							exceptHeight;
					}
				}
			});
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
			handleEdit(row) {
				this.$refs['edit'].showEdit(row)
			},
			handleChange() {
				this.$refs['edit'].showEdit()
			},
			handleDelete(row) {
				if (row.id) {
					this.$baseConfirm('你确定要删除作废时间为()的记录吗', null, async () => {
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
						"number": "10001",
						"name": "力学检测室",
						"introduction": "通过力学仪器进行质量检测"
					},
					{
						"number": "10002",
						"name": "温湿度检测室",
						"introduction": "检测房间内的温度以及湿度"
					},
					{
						"number": "10003",
						"name": "监控室",
						"introduction": "对房间内的物品进行监控"
					},
					{
						"number": "10004",
						"name": "光学检测室",
						"introduction": "通过光学仪器进行质量检测"
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
