<template>
	<!-- 环境监测记录 -->
	<div class=" definition purchase equipment baseBox">

		<vab-query-form>
			<vab-query-form-left-panel style="width: 15%">
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
					<el-form-item>
						<el-input style="border-radius: 30px" v-model="queryForm.title" placeholder="检测室名称"
							prefix-icon="el-icon-search" />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="searchByName">搜索</el-button>
					</el-form-item>
				</el-form>
			</vab-query-form-left-panel>
			<vab-query-form-right-panel style="width: 80%;float: right;">
				<el-form ref="form" :inline="true" @submit.native.prevent>
					<el-form-item style="margin-right:10px;">
						<el-date-picker v-model="value1" type="datetimerange" range-separator="至"
							start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="searchByTime">搜索</el-button>
					</el-form-item>
				</el-form>
			</vab-query-form-right-panel>
		</vab-query-form>

		<el-container>
			<el-aside width="15%">
				<el-table ref="tableSort" v-loading="listLoading" :data="list" border
					:element-loading-text="elementLoadingText" highlight-current-row :height="table.tableHeight"
					@selection-change="setSelectRows" @sort-change="tableSortChange"
					:header-cell-style="{ background: '#e8f0ff' }" @row-click="changeRoom">
					<el-table-column show-overflow-tooltip label="检测室名称" prop="author" min-width="100%">
					</el-table-column>
				</el-table>
			</el-aside>
			<el-main style="width: 80%;" class="chart_div">
				<div style="height: 40%;width: 100%;" id="chartLinep1">

					<div class="line-wrap" id="chartLine1" style="height:80%"></div>
				</div>
				<div style="height: 40%;width: 100%;margin-top: 5px;" id="chartLinep2">
					<div class="line-wrap" id="chartLine2" style="height:80%"></div>
				</div>
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
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import treeData from './../../vab/tree/index'
	import * as echarts from 'echarts'
	// import echarts from 'echarts'
	import 'echarts/lib/chart/line'
	import 'echarts/lib/chart/bar'
	//import 'echarts/lib/chart/pie'
	import 'echarts/lib/component/title'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/markPoint'
	require('echarts/theme/shine')
	export default {
		name: 'ComprehensiveTable',
		components: {
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
				chartLine1: null,
				chartLine2: null,
				imgShow: true,
				time1:'',
				time2:'',
				list: [],
				room: '',
				imageList: [],
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				value1: [],
				value2: '',
				tempature: [],
				testtime: [],
				humidity: [],
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
					tableHeight: this.$(window).height(),
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
				let exceptHeight = 142
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
			this.$nextTick(() => {
				this.drawLineChart()
			})
		},
		methods: {
			changeRoom(row) {
				this.room = row.id
				this.drawLineChart()
			},
			searchByName(){
				this.fetchData()
			},
			formatDate(date) {
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? '0' + m : m;
				var d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				var h = date.getHours() ;
				h = h < 10 ? '0' + h : h;
				var min = date.getMinutes();
				min = min < 10 ? ('0' + min) : min;
				var s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;
				return y + '-' + m + '-' + d+' '+h+':'+min+':'+s;
			},
			searchByTime() {
				this.time1=this.formatDate(this.value1[0])
				this.time2=this.formatDate(this.value1[1])
				console.log(this.time1)
				this.drawLineChart();
			},
			async drawLineChart() {
				const that = this;
				let chartLine1 = document.getElementById('chartLine1')
				let chartLine2 = document.getElementById('chartLine2')
				//that.chartssize(document.getElementById('chartLinep1'), document.getElementById('chartLine1'));
				//that.chartssize(document.getElementById('chartLinep2'), document.getElementById('chartLine2'));
				
				this.chartLine1 = echarts.init(chartLine1)
				this.chartLine2 = echarts.init(chartLine2)
				let tempdata;
				if(this.time1===''){
					tempdata = '[Q]834{' + this.current_org + '$`' + this.room + '}|^SYS'
				}
				else{
					tempdata = '[Q]836{' + this.current_org + '$`' + this.room + '$`'+ this.time1+'$`'+this.time2+'}|^SYS'
				}
				const res = await QueryExec(tempdata)
				console.log(res.data)
				this.humidity = [];
				this.tempature = [];
				this.testtime = [];
				res.data.forEach((item, index) => {
					this.humidity.push(item.humidity)
					this.tempature.push(item.tempature)
					this.testtime.push(item.record_time)
				})
				const option1 = this.getoption('温度(℃)', this.testtime, this.tempature,
				[-10, 0, 10, 20, 30, 40, 50],'温度曲线');
				const option2 = this.getoption('湿度(%RH)', this.testtime, this.humidity,
				[0, 20, 40, 60, 80, 100], '湿度曲线');
				
				// const option1 = this.getoption('温度(℃)', [
				// 		'2021-1-19 10:00:00',
				// 		'2021-1-19 10:01:00',
				// 		'2021-1-19 10:00:00',
				// 		'2021-1-19 10:02:00',
				// 		'2021-1-19 10:03:00',
				// 		'2021-1-19 10:04:00',
				// 		'2021-1-19 10:05:00',
				// 		'2021-1-19 10:06:00',
				// 		'2021-1-19 10:07:00',
				// 		'2021-1-19 10:08:00',
				// 		'2021-1-19 10:09:00',
				// 		'2021-1-19 10:10:00',
				// 		'2021-1-19 10:11:00',
				// 		'2021-1-19 10:12:00',
				// 		'2021-1-19 10:13:00',
				// 		'2021-1-19 10:14:00',
				// 	], [22.1, 22.3, 22.0, 22.2, 21.9, 22.3, 22.6, 21, 23, 22, 24, 21, 24, 23, 22], [-10, 0, 10, 20, 30, 40, 50],
				// 	'温度曲线');
				// const option2 = this.getoption('湿度（%RH）', [
				// 		'2021-1-19 10:00:00',
				// 		'2021-1-19 10:01:00',
				// 		'2021-1-19 10:00:00',
				// 		'2021-1-19 10:02:00',
				// 		'2021-1-19 10:03:00',
				// 		'2021-1-19 10:04:00',
				// 		'2021-1-19 10:05:00',
				// 		'2021-1-19 10:06:00',
				// 		'2021-1-19 10:07:00',
				// 		'2021-1-19 10:08:00',
				// 		'2021-1-19 10:09:00',
				// 		'2021-1-19 10:10:00',
				// 		'2021-1-19 10:11:00',
				// 		'2021-1-19 10:12:00',
				// 		'2021-1-19 10:13:00',
				// 		'2021-1-19 10:14:00',
				// 	], [33.1, 34.3, 32.0, 33.2, 30.9, 32.3, 31.6, 32, 34, 36, 38, 35, 34, 36, 32],
				// 	[0, 20, 40, 60, 80, 100], '湿度曲线');
				this.chartLine1.setOption(option1)
				this.chartLine2.setOption(option2)
				//监听窗口调整

				window.addEventListener('resize', function() {
					//that.chartssize(document.getElementById('chartLinep1'), document.getElementById('chartLine1'));
					//that.chartssize(document.getElementById('chartLinep2'), document.getElementById('chartLine2'));
					that.chartLine1.resize()
					that.chartLine2.resize()
				});
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
				const {
					data,
					totalCount
				} = await getList(this.queryForm)
				this.list = []
				let sDatax;
				if (this.queryForm.title === '') {
					sDatax = '[Q]833{' + this.current_org + '}|^SYS'
				}
				else{
					sDatax = '[Q]838{' +this.queryForm.title+ '}|^SYS'
				}
				const resx = await QueryExec(sDatax)
				resx.data.forEach((item, index) => {
					this.list.push({
						'id': item.room_id,
						'author': item.name
					})
				})
				if(this.list.length>0){
					this.room = this.list[0].id;
				}
				const imageList = []

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
			chartssize(container, charts) {
				function getStyle(el, name) {
					if (window.getComputedStyle) {
						return window.getComputedStyle(el, null);
					} else {
						return el.currentStyle;
					}
				}
				let wi = getStyle(container, 'width').width;
				let hi = getStyle(container, 'height').height;
				//charts.style.height = hi * 0.75;
				//charts.style.width = wi;
			},
			getoption(yName, xData, yDATA, yAxis, title) {
				let option1 = {
					title: {
						text: title
					},
					tooltip: {
						trigger: 'axis',
					},
					grid: {
						left: '10.6%',
						right: '2%',
						bottom: '10%',
						containLabel: true
					},
					calculable: true,
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						axisTick: {
							show: false,
						},
						data: xData,
						//设置字体倾斜
						axisLabel: {
							interval: 0,
							rotate: 15,
							margin: 5,
							textStyle: {
								fontWeight: "bolder",
								color: "#000000"
							}
						},
					}, ],
					yAxis: [{
						type: 'value',
						axisTick: {
							show: false,
						},
						data: yAxis,
						name: yName,
					}, ],
					dataZoom: [{
						type: "slider",
						realtime: true, //拖动滚动条时是否动态的更新图表数据
						height: 30, //滚动条高度
						//start: 40, //滚动条开始位置（共100等份）
						//end: 65 //结束位置（共100等份）
					}],
					series: [{
						name: yName,
						type: 'line',
						stack: yName,
						data: yDATA
					}, ],
				}
				return option1;
			}
		},

	}
</script>
<style lang='scss' scope>
	.line-wrap {
		width: '90%';
		/* height: 200px; */
	}

	.chart_div {
		padding-top: 10px !important;
		border-style: outset;
		border-top-width: 5px;
		/* border-right-width: 2px; */
		border-bottom-width: 5px;
		/* border-left-width: 5px;*/

	}
</style>
