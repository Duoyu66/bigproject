<template>
	<!-- 检测室门禁记录 -->
	<div class="table-container definition purchase equipment baseBox">
		<vab-query-form>
			<vab-query-form-right-panel style="width: 100%">
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
					<el-form-item>
						<el-input style="border-radius: 30px" v-model="queryForm.title" placeholder="按检测室名称搜索"
							prefix-icon="el-icon-search" />
					</el-form-item>
					<el-form-item>
						<el-button icon="el-icon-search" type="primary" native-type="submit" @click="searchByName">
							查询
						</el-button>
					</el-form-item>
				</el-form>
			</vab-query-form-right-panel>
		</vab-query-form>

		<el-container>
			<el-aside width="10%">
				<el-table ref="tableSort" v-loading="listLoading" :data="list1" border
					:element-loading-text="elementLoadingText" highlight-current-row :height="table.tableHeight"
					@selection-change="setSelectRows" @sort-change="tableSortChange" @row-click="changePerson"
					:header-cell-style="{ background: '#e8f0ff' }">
					<el-table-column show-overflow-tooltip label="进入人员" prop="peopleName" min-width="100%" >
					</el-table-column>
				</el-table>
			</el-aside>
			<el-main>
				<el-table ref="tableSort" v-loading="listLoading" :data="list" border
					:element-loading-text="elementLoadingText" highlight-current-row :height="table.tableHeight"
					@selection-change="setSelectRows" @sort-change="tableSortChange"
					:header-cell-style="{ background: '#e8f0ff' }">
					<el-table-column show-overflow-tooltip label="检测室名称" prop="testRoomName1"></el-table-column>
					<el-table-column show-overflow-tooltip label="房间号" prop="roomNumber"></el-table-column>
					<el-table-column show-overflow-tooltip label="出入" prop="out"></el-table-column>
					<el-table-column show-overflow-tooltip label="出入时间" prop="time"></el-table-column>
				</el-table>
				<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
					:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
					@size-change="handleSizeChange"></el-pagination>
				<table-edit ref="edit"></table-edit>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import {
		getList,
		doDelete,
		doEdit,
		ExecSql,
		QueryExec
	} from '@/api/table'
	import TableEdit from './../components/defaultEdit'
	import treeData from './../../vab/tree/index'
	import {
		mapActions,
		mapGetters
	} from 'vuex'
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
				inperson:'',
				list: [],
				list1: [],
				listsum:[],
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
					number: '',
				},
				formLabelWidth: '120px',
				table: {
					tableHeight: this.$(window).height() - 100,
				},
			}
		},
		computed: {
			height() {
				return this.$baseTableHeight()
			},
			...mapGetters({
				current_org: 'org/current_org',
			})
		},
		created() {
			this.fetchData()
		},
		beforeDestroy() {},
		mounted: function() {
			this.$nextTick(function() {
				let exceptHeight = 205
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
			searchByName(){
				this.queryForm.pageNo=1
				this.fetchData();
			},
			changePerson(row){
				this.inperson=row.id
				let temp=[]
				this.listsum.forEach((item,index) => {
					temp.push(item)
				})
				this.list.splice(0,this.list.length)
				if(this.listsum.length!==0){
					temp.forEach((item,index) => {
						if(item.id+''===this.inperson+''){
							this.list.splice(this.list.length,0,item)
						}
					})
				}
			},
			tableSortChange() {
				const imageList = []
				this.$refs.tableSort.tableData.forEach((item, index) => {
					imageList.push(item.img)
				})
				this.imageList = imageList
			},
			setSelectRows(val) {
				this.selectRows = val
				console.log(val)
			},
			
			handleDelete(row) {
				if (row.id) {
					this.$baseConfirm(
						'你确定要删除标准物质名称为()的记录吗',
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
				this.list=[]
				this.list1=[]
				this.listsum=[]
				let sDatax,sData
				if(this.queryForm.title===''){
					sDatax = '[Q]827{' + this.current_org + '}|^SYS'
					sData = '[Q]828{' + this.current_org + '}|^SYS'
				}
				else{
					sDatax = '[Q]829{' + this.current_org +'$`' + this.queryForm.title+'}|^SYS'
					sData = '[Q]830{' + this.current_org + '$`'+this.queryForm.title +'}|^SYS'
				}
				const resx = await QueryExec(sDatax)
				const res = await QueryExec(sData)
				console.log('list1   ',resx.data)
				console.log('list   ',res.data)
				resx.data.forEach((item, index) => {
					this.list1.push({
						'id':item.person_id,
						'peopleName': item.name
					})
				})
				
				this.inperson=this.list1.length==0 ? '' : this.list1[0].id
				res.data.forEach((item, index) => {
					this.list.push({
						id:item.person_id,
						testRoomName1: item.name,
						roomNumber: item.room_no,
						out: item.inorout === "1" ? "出" : "入",
						time: item.record_time,
					})
				})
				this.listsum=[]
				this.list.forEach((item,index) => {
					this.listsum.push(item)
				})
				const {
					data,
					totalCount
				} = await getList(this.queryForm)
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
