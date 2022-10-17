<template>
	<div class="table-container definition purchase calc cailbration period">
		<el-tabs type="card" :value="this.$route.query.tabs ? this.$route.query.tabs : 1" class="box_center">
			<el-tab-pane label="消耗登记" class="center">
				<el-form :model="form" style="
            height: 360px;
            width: 700px;
            margin: 20px auto;
            padding-bottom: 50px;
            border: 1px solid #ccc;
            padding: 40px;
          ">
					<div style="height: 100%">
						<el-form-item label="化学品" :label-width="formLabelWidth1">
							<!-- <el-select v-model="form.name" style="width: 250px">
                <el-option label="123" value="xst"></el-option>
              </el-select> -->
							<el-select v-model="form.name" style="width: 350px">
								<el-option label="123" value="xst"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="规格" :label-width="formLabelWidth1">
							<el-input v-model="form.number" style="width: 350px"></el-input>
						</el-form-item>
						<el-form-item label="计量单位" :label-width="formLabelWidth1">
							<el-input v-model="form.number" style="width: 350px"></el-input>
						</el-form-item>
						<el-form-item label="试验记录" :label-width="formLabelWidth1">
							<el-select v-model="form.name" style="width: 350px">
								<el-option label="123" value="xst"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="参数" :label-width="formLabelWidth1">
							<el-select v-model="form.name" style="width: 350px">
								<el-option label="123" value="xst"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="数量" :label-width="formLabelWidth1">
							<el-input v-model="form.criterion" style="width: 350px"></el-input>
						</el-form-item>
						<el-form-item label="系统填写人" :label-width="formLabelWidth1">
							<el-input v-model="form.criterion" style="width: 350px"></el-input>
						</el-form-item>
					</div>
					<el-button type="primary" class="makesures"
						style="margin-left: 50%; transform: translate(-50%); width: 80px">
						添 加
					</el-button>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="消耗记录">
				<vab-query-form>
					<!-- <vab-query-form-left-panel>
            <el-button type="primary" @click="handleAdd">添加记录</el-button>
          </vab-query-form-left-panel> -->
					<vab-query-form-right-panel style="float: right">
						<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
							<el-form-item>
								<el-input style="border-radius: 30px" v-model="queryForm.title" placeholder="按照标准物质名称搜索"
									prefix-icon="el-icon-search" />
							</el-form-item>
						</el-form>
					</vab-query-form-right-panel>
				</vab-query-form>

				<el-table ref="tableSort" v-loading="listLoading" :data="list" border
					:element-loading-text="elementLoadingText" highlight-current-row :height="table.tableHeight"
					@selection-change="setSelectRows" @sort-change="tableSortChange"
					:header-cell-style="{ background: '#e8f0ff' }">
					<el-table-column show-overflow-tooltip label="化学品名称" prop="name"></el-table-column>
					<el-table-column show-overflow-tooltip prop="type" label="规格"></el-table-column>
					<el-table-column show-overflow-tooltip label="计量单位" prop="unit"></el-table-column>
					<el-table-column show-overflow-tooltip prop="number" label="消耗数量"></el-table-column>
					<el-table-column show-overflow-tooltip label="试验委托编号" prop="people1"></el-table-column>
					<el-table-column show-overflow-tooltip label="参数名称" prop="result"></el-table-column>
					<el-table-column show-overflow-tooltip label="记录人" prop="people1"></el-table-column>
					<el-table-column show-overflow-tooltip label="记录时间" prop="time"></el-table-column>
					<el-table-column show-overflow-tooltip label="操作" width="100px">
						<template #default="{ row }">
							<el-button @click="handleEdit(row)" type="primary">
								修改
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
					:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
					@size-change="handleSizeChange"></el-pagination>
			</el-tab-pane>
		</el-tabs>

		<table-edit ref="edit"></table-edit>
		<!-- 修改 -->
		<!-- <el-dialog title="修改作废记录" :visible.sync="dialogVisible" width="480px">
      <el-form :model="list2" style="height: 300px">
        <el-form-item label="化学品名称" :label-width="formLabelWidth">
          <el-input v-model="list2.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="规格" :label-width="formLabelWidth">
          <el-input v-model="list2.type" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="计量单位" :label-width="formLabelWidth">
          <el-input v-model="list2.unit" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="消耗数量" :label-width="formLabelWidth">
          <el-input v-model="list2.mode" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="试验委托编号" :label-width="formLabelWidth">
          <el-input v-model="list2.number" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="参数名称" :label-width="formLabelWidth">
          <el-input v-model="list2.result" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="记录人" :label-width="formLabelWidth">
          <el-input v-model="list2.people1" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="记录时间" :label-width="formLabelWidth">
          <el-input v-model="list2.time" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogVisible = false"
          style="margin-left: 79px"
        >
          确 定
        </el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog> -->
	</div>
</template>

<script>
	import {
		getList,
		doDelete
	} from '@/api/table'
	import TableEdit from '../components/verificationRecord.vue'
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
				// dialogVisible: false,
				activeName: 'second',
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
				formLabelWidth: '100px',
				formLabelWidth1: '195px',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: '',
				},
				dialogFormVisible: false,
				list2: [],
				table: {
					tableHeight: this.$(window).height(),
				},
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
				let exceptHeight = 195
				// this.$refs.table.$el.offsetTop：表格距离浏览器的高度
				//tableSort为table中ref的值
				if (this.$refs.tableSort.$el) {
					this.table.tableHeight =
						window.innerHeight -
						this.$refs.tableSort.$el.offsetTop -
						exceptHeight
				}

				// 监听窗口大小变化
				let that = this
				window.onresize = function() {
					if (that.$refs.tableSort.$el) {
						that.table.tableHeight =
							window.innerHeight -
							that.$refs.tableSort.$el.offsetTop -
							exceptHeight
					}
				}
			})
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
			handleDelete(row) {
				if (row.id) {
					this.$baseConfirm(
						'你确定要删除采购日期为()的记录吗',
						null,
						async () => {
							const {
								msg
							} = await doDelete({
								ids: row.id,
							})
							this.$baseMessage(msg, 'success')
							this.fetchData()
						}
					)
				}
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData()
			},
			// handleamend(val) {
			//   this.list2 = val
			//   console.log(this.list2)
			//   console.log(1)
			//   this.dialogVisible = true
			// },
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
						name: '石膏',
						type: '箱',
						unit: 'kg',
						mode: '12',
						number: '10001',
						people1: '李向前',
						result: '密度',
						people2: '张浩',
						time: '2020-12-28',
					},
					{
						number: '10002',
						name: '石灰',
						type: '袋',
						mode: '12',
						people1: '张华',
						result: '密度',
						unit: 'kg',
						people2: '叶凡',
						time: '2020-12-28',
					},
					{
						number: '10015',
						name: '试验用砂',
						type: '袋',
						mode: '12',
						unit: 'kg',
						people1: '刘雯',
						result: '密度',
						people2: '叶凡',
						time: '2020-12-28',
					},
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
