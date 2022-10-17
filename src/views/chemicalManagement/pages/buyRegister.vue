<template>
	<div class="definition purchase equipment_btn">
		<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
			<el-tab-pane label="购入登记" name="first" class="buy">
				<div class="usage">
					<PurchaseForm ref="PurchaseForm"></PurchaseForm>
					<div>
						<el-button class="purchase_btn" type="primary">确 定</el-button>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="购入台账" name="second">
				<el-table ref="tableSort" v-loading="listLoading" :data="list" border
					:element-loading-text="elementLoadingText" highlight-current-row :height="table.tableHeight"
					:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
					@sort-change="tableSortChange">
					<el-table-column show-overflow-tooltip label="名称" prop="name"></el-table-column>
					<el-table-column show-overflow-tooltip prop="type" label="规格型号"></el-table-column>
					<el-table-column show-overflow-tooltip label="采购日期" prop="time1"></el-table-column>
					<el-table-column show-overflow-tooltip label="有效期" prop="date"></el-table-column>
					<el-table-column show-overflow-tooltip prop="number" label="数量"></el-table-column>
					<el-table-column show-overflow-tooltip label="生产厂家" prop="factory"></el-table-column>
					<el-table-column show-overflow-tooltip label="价格" prop="price"></el-table-column>
					<el-table-column show-overflow-tooltip label="购买人" prop="purchaser"></el-table-column>
					<el-table-column show-overflow-tooltip label="主要成分" prop="component"></el-table-column>
					<el-table-column show-overflow-tooltip label="操作" width="180px">
						<template #default="{ row }">
							<el-button type="primary" class="normal" @click="handleAdd">
								修改
							</el-button>
							<el-button class="danger" @click="handleDelete(row)">
								删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
					:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
					@size-change="handleSizeChange"></el-pagination>
				<table-edit ref="edit"></table-edit>
			</el-tab-pane>
		</el-tabs>
		<!-- <table-edit1 ref="edit1"></table-edit1> -->
		<table-edit ref="edit"></table-edit>
	</div>
</template>

<script>
	import {
		getList,
		doDelete
	} from '@/api/table'
	import TableEdit from '../components/chemicalPurchase.vue'
	import PurchaseForm from '../form/PurchaseForm.vue'
	import treeData from './../../vab/tree/index'
	export default {
		name: 'ComprehensiveTable',
		components: {
			TableEdit,
			PurchaseForm,
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
				activeName: 'first',
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
					value1: '',
					norms: 'cj',
					name: 'rygz',
					region: 'g',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: '',
				},
				formLabelWidth: '120px',
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
				let exceptHeight = 280
				// this.$refs.table.$el.offsetTop：表格距离浏览器的高度
				//tableSort为table中ref的值
				if (this.$refs.tableSort.$el) {
					this.table.tableHeight =
						window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight
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
			handleClick(tab, event) {
				console.log(tab, event)
			},
			handleAdd() {
				this.$refs['edit'].showEdit()
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
						name: '硫酸钠',
						type: '无',
						time1: '2020-02-03',
						date: '50天',
						number: '150g',
						factory: '广东',
						price: '189',
						purchaser: '李向前',
						component: 'Na₂SO₄',
					},
					{
						name: '硝酸钾',
						type: '无',
						time1: '2020-02-03',
						date: '50天',
						number: '150g',
						factory: '广东',
						price: '160',
						purchaser: '李向前',
						component: 'NaNO3',
					},
					{
						name: '硫酸铜',
						type: '无',
						time1: '2020-02-03',
						date: '160天',
						number: '150g',
						factory: '广东',
						price: '230',
						purchaser: '李向前',
						component: 'CuSO₄',
					},
					{
						name: '氧化钙',
						type: '无',
						time1: '2020-02-03',
						date: '85天',
						number: '150g',
						factory: '广东',
						price: '400',
						purchaser: '李向前',
						component: 'CaO',
					},
					{
						name: '盐酸',
						type: '无',
						time1: '2020-02-04',
						date: '200天',
						number: '500ml',
						factory: '广西',
						price: '600',
						purchaser: '张译文',
						component: 'HCl',
					},
					{
						name: '硫酸',
						type: '无',
						time1: '2020-02-06',
						date: '50天',
						number: '600ml',
						factory: '天津',
						price: '750',
						purchaser: '鲁文',
						component: 'H₂SO₄',
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
