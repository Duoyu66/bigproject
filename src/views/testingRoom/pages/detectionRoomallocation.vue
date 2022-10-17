<template>
  <!-- 检测室台账 -->
	<div class="table-container definition">
		<vab-query-form>
			<template>
				<el-tabs v-model="activeName">
					<el-tab-pane label="检测室分配" name="first">
						<el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"
						 highlight-current-row :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange"
						 :header-cell-style="{ background: '#e8f0ff' }">
							<el-table-column prop="checked" show-overflow-tooltip label="选择列">
								<template slot-scope="scope">
									<el-checkbox v-model="scope.row.checkout" @change="checkConfirm(index1)" key="index1"></el-checkbox>
								</template>
							</el-table-column>
							<el-table-column show-overflow-tooltip prop="name" label="检测室名称"></el-table-column>
							<el-table-column show-overflow-tooltip label="检测室介绍" prop="introduction"></el-table-column>
							<el-table-column show-overflow-tooltip label="操作">
								<template #default="{ row }">
									<el-button type="primary" class="normal" @click="dialogFormVisible = true">修改</el-button>
									<el-button @click="handleDelete(row)" class="danger">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="检测室台账" name="second">
						<el-container style="height: calc(100vh - 46px - 174px)">
							<el-main style="height: calc(65%); min-height: 275px">
								<el-table ref="tableSort" v-loading="listLoading" :data="list2" border :element-loading-text="elementLoadingText"
								 highlight-current-row @selection-change="setSelectRows" @sort-change="tableSortChange" height="calc(80%)"
								 :header-cell-style="{ background: '#e8f0ff' }">
									<el-table-column show-overflow-tooltip prop="testRoomName" label="检测室名称"></el-table-column>
									<el-table-column show-overflow-tooltip prop="doorNumber" label="门禁编号"></el-table-column>
									<el-table-column show-overflow-tooltip prop="cameraNumber" label="摄像头编号"></el-table-column>
									<el-table-column show-overflow-tooltip prop="instrumentNumber" label="温湿度仪器编号"></el-table-column>
									<el-table-column show-overflow-tooltip label="操作">
										<template>
											<el-dropdown trigger="click" placement="left-start">
												<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
												<el-dropdown-menu slot="dropdown" class="more">
													<el-button type="text" @click="dialogFormVisible1 = true">映射检测设备</el-button>
													<el-button type="text" @click="dialogFormVisible2 = true">配置仪器</el-button>
												</el-dropdown-menu>
											</el-dropdown>
										</template>
									</el-table-column>
								</el-table>
								<el-dialog title="检测映射" :visible.sync="dialogFormVisible1" width="30%" :before-close="handleClose">
									<el-form :model="form" style="margin-right: 15px">
										<el-form-item :label-width="formLabelWidth" style="margin-top: 20px">
											<label style="margin-left: 65px">门禁选择：</label>

											<el-select v-model="value" placeholder="请选择">
												<el-option v-for="item in options1" :key="item.value1" :label="item.label1" :value="item.value1"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item :label-width="formLabelWidth">
											<label style="margin-left: 50px">摄像头选择：</label>

											<el-select v-model="value2" placeholder="请选择">
												<el-option v-for="item in options2" :key="item.value2" :label="item.label2" :value2="item.value2"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item :label-width="formLabelWidth">
											<label style="margin-left: 20px">温湿度仪器选择：</label>

											<el-select v-model="value3" placeholder="请选择">
												<el-option v-for="item in options3" :key="item.value3" :label="item.label3" :value="item.value3"></el-option>
											</el-select>
										</el-form-item>
									</el-form>
									<span slot="footer" class="dialog-footer">
										<el-button @click="dialogFormVisible1 = false" type="primary">确 定</el-button>

										<el-button @click="dialogFormVisible1 = false">取 消</el-button>
									</span>
								</el-dialog>
								<el-dialog title="仪器配备" :visible.sync="dialogFormVisible2" width="30%" :before-close="handleClose">
									<el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"
									 highlight-current-row @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{ background: '#e8f0ff' }">
										<el-table-column prop="checked" show-overflow-tooltip label="选择列" min-width="20%">
											<template slot-scope="scope">
												<el-checkbox v-model="scope.row.checkout" @change="userSateChanged(scope.row)"></el-checkbox>
											</template>
										</el-table-column>
										<el-table-column show-overflow-tooltip prop="name" label="仪器名称" min-width="50%"></el-table-column>
									</el-table>
									<span slot="footer" class="dialog-footer">
										<el-button @click="dialogFormVisible2 = false" type="primary">确 定</el-button>
										<el-button @click="dialogFormVisible2 = false">取 消</el-button>
									</span>
								</el-dialog>
								<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
								 :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
								<table-edit ref="edit"></table-edit>
							</el-main>
							<el-footer style="height: calc(34%); min-height: 188px" class="table_auto">
								<el-tabs type="border-card" style="height: calc(100%)">
									<el-tab-pane label="门禁记录">
										<el-table ref="tableSort" v-loading="listLoading" :data="list3" border :element-loading-text="elementLoadingText"
										 highlight-current-row style="height: calc(18vh)" @selection-change="setSelectRows" @sort-change="tableSortChange"
										 :header-cell-style="{ background: '#e8f0ff' }">
											<el-table-column show-overflow-tooltip label="出入员工" prop="doorName"></el-table-column>
											<el-table-column show-overflow-tooltip label="日期时间" prop="doorDate"></el-table-column>
											<el-table-column show-overflow-tooltip label="出入" prop="doorOut"></el-table-column>

											<el-table-column show-overflow-tooltip label="湿度超标" prop="excessHumidity"></el-table-column>
										</el-table>
									</el-tab-pane>
									<el-tab-pane label="温湿度记录">
										<el-table ref="tableSort" v-loading="listLoading" :data="list4" border :element-loading-text="elementLoadingText"
										 highlight-current-row style="height: calc(18vh)" @selection-change="setSelectRows" @sort-change="tableSortChange"
										 :header-cell-style="{ background: '#e8f0ff' }">
											<el-table-column show-overflow-tooltip label="日期时间" prop="humitureDate"></el-table-column>
											<el-table-column show-overflow-tooltip label="温度" prop="temperature"></el-table-column>
											<el-table-column show-overflow-tooltip label="湿度" prop="dampness"></el-table-column>
											<el-table-column show-overflow-tooltip label="温度超标" prop="exceedTemperature"></el-table-column>
											<el-table-column show-overflow-tooltip label="湿度超标" prop="excessHumidity"></el-table-column>
										</el-table>
									</el-tab-pane>
									<el-tab-pane label="报警记录">
										<el-table ref="tableSort" v-loading="listLoading" :data="list5" border :element-loading-text="elementLoadingText"
										 highlight-current-row style="height: calc(18vh)" @selection-change="setSelectRows" @sort-change="tableSortChange"
										 :header-cell-style="{ background: '#e8f0ff' }">
											<el-table-column show-overflow-tooltip label="日期时间" prop="alarmDate"></el-table-column>
											<el-table-column show-overflow-tooltip label="报警内容" prop="alarmContent"></el-table-column>
											<el-table-column show-overflow-tooltip label="报警来源" prop="alarmFrom"></el-table-column>
										</el-table>
									</el-tab-pane>
									<el-tab-pane label="设备配备">
										<el-table ref="tableSort" v-loading="listLoading" :data="list6" border :element-loading-text="elementLoadingText"
										 highlight-current-row style="height: calc(18vh)" @selection-change="setSelectRows" @sort-change="tableSortChange"
										 :header-cell-style="{ background: '#e8f0ff' }">
											<el-table-column show-overflow-tooltip label="管理编号" prop="toolNumber"></el-table-column>
											<el-table-column show-overflow-tooltip label="设备名称" prop="toolName"></el-table-column>
											<el-table-column show-overflow-tooltip label="测量范围" prop="toolRange"></el-table-column>
											<el-table-column show-overflow-tooltip label="测量精度" prop="toolAccuracy"></el-table-column>
										</el-table>
									</el-tab-pane>
								</el-tabs>
							</el-footer>
							<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
							 :total="total" @current-change="handleCurrentChange2" @size-change="handleSizeChange2"></el-pagination>
							<table-edit ref="edit2"></table-edit>
						</el-container>
					</el-tab-pane>
				</el-tabs>
			</template>
		</vab-query-form>
	</div>
</template>

</vab-query-form-left-panel>
<vab-query-form-right-panel>
	<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
		<el-form-item>
			<el-input style="border-radius: 30px" v-model="queryForm.title" placeholder="按设备名称搜索" prefix-icon="el-icon-search" />
		</el-form-item>
	</el-form>
</vab-query-form-right-panel>
</vab-query-form>
</div>
</template>

<script>
	import {
		getList,
		doDelete
	} from '@/api/table'
	import TableEdit from '../components/detectionRoomallocation.vue'
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
				options1: [{
						value1: '选项1',
						label1: '100',
					},
					{
						value1: '选项2',
						label1: '101',
					},
					{
						value1: '选项3',
						label1: '102',
					},
				],
				options2: [{
						value2: '200',
						label2: '100',
					},
					{
						value2: '201',
						label2: '101',
					},
					{
						value2: '202',
						label2: '102',
					},
				],
				options3: [{
						value3: '300',
						label3: '100',
					},
					{
						value3: '301',
						label3: '101',
					},
					{
						value3: '302',
						label3: '102',
					},
				],
				value: '',
				value2: '',
				value3: '',
				dialogFormVisible1: false,
				dialogFormVisible2: false,
				checked: true,
				activeName: this.$route.query.tabs ? this.$route.query.tabs : 'second',
				imgShow: true,
				list: [],
				list1: [],
				list2: [],
				list3: [],
				list4: [],
				list5: [],
				list6: [],
				list7: [],
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
			handleDelete(row) {
				if (row.id) {
					this.$baseConfirm(
						'你确定要删除作废时间为()的记录吗',
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
						checkout: true,
						name: '力学检测室',
						introduction: '通过力学仪器来将称重物品的质量填写上去',
					},
					{
						checkout: false,
						name: '温湿度检测室',
						introduction: '检测房间内的温度和湿度',
					},
					{
						checkout: true,
						name: '光学检测室',
						introduction: '通过光学仪器来更好的观察物体',
					},
					{
						checkout: false,
						name: '耐压性检测室',
						introduction: '通过仪器来检测物质的耐压性',
					},
					{
						checkout: true,
						name: '耐久性检测室',
						introduction: '通过仪器来检测物质的耐久性',
					},
				]
				this.list2 = [{
						testRoomName: '力学检测室',
						doorNumber: '100',
						cameraNumber: '200',
						instrumentNumber: '300',
					},
					{
						testRoomName: '温湿度检测室',
						doorNumber: '101',
						cameraNumber: '201',
						instrumentNumber: '301',
					},
					{
						testRoomName: '光学检测室',
						doorNumber: '102',
						cameraNumber: '202',
						instrumentNumber: '302',
					},
					{
						testRoomName: '耐压性检测室',
						doorNumber: '103',
						cameraNumber: '203',
						instrumentNumber: '303',
					},
					{
						testRoomName: '耐久性测室',
						doorNumber: '104',
						cameraNumber: '204',
						instrumentNumber: '304',
					},
				]
				this.list3 = [{
						doorName: '王小军',
						doorDate: '2021-1-19 09:00:00',
						doorOut: '入'
					},
					{
						doorName: '王大军',
						doorDate: '2021-1-18 09:00:00',
						doorOut: '出'
					},
					{
						doorName: '薛腾飞',
						doorDate: '2021-1-17 09:00:00',
						doorOut: '入'
					},
					{
						doorName: '马增来',
						doorDate: '2021-1-16 09:00:00',
						doorOut: '出'
					},
				]
				this.list4 = [{
						humitureDate: '2021-1-19 09:00:00',
						temperature: '36.6',
						dampness: '35',
						exceedTemperature: '是',
						excessHumidity: '是',
					},
					{
						humitureDate: '2021-1-18 09:00:00',
						temperature: '37.6',
						dampness: '36',
						exceedTemperature: '否',
						excessHumidity: '否',
					},
					{
						humitureDate: '2021-1-17 09:00:00',
						temperature: '35.6',
						dampness: '34',
						exceedTemperature: '是',
						excessHumidity: '是',
					},
					{
						humitureDate: '2021-1-16 09:00:00',
						temperature: '36.6',
						dampness: '35',
						exceedTemperature: '否',
						excessHumidity: '否',
					},
				]
				this.list5 = [{
						alarmDate: '2021-1-19 09:00:00',
						alarmContent: '养护室温度超出上限',
						alarmFrom: '系统',
					},
					{
						alarmDate: '2021-1-18 09:00:00',
						alarmContent: '耐压性检测室发生故障',
						alarmFrom: '丁旭楠',
					},
					{
						alarmDate: '2021-1-17 09:00:00',
						alarmContent: '耐久性检测室发生故障',
						alarmFrom: '系统',
					},
					{
						alarmDate: '2021-1-16 09:00:00',
						alarmContent: '有人进入监控室',
						alarmFrom: '房世有',
					},
				]
				this.list6 = [{
						toolNumber: '100',
						toolName: '电子天平',
						toolRange: '0-100',
						toolAccuracy: '毫米',
					},
					{
						toolNumber: '200',
						toolName: '万能机',
						toolRange: '0-100',
						toolAccuracy: '厘米',
					},
					{
						toolNumber: '300',
						toolName: '压力机',
						toolRange: '0-100',
						toolAccuracy: '千克',
					},
					{
						toolNumber: '400',
						toolName: '筛子',
						toolRange: '0-100',
						toolAccuracy: '纳米',
					},
				]
				this.list7 = [{
						checkout: true,
						name: '电子天平',
					},
					{
						checkout: false,
						name: '万能机',
					},
					{
						checkout: true,
						name: '压力机',
					},
					{
						checkout: false,
						name: '激光仪',
					},
					{
						checkout: true,
						name: '筛子',
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
<style type="text/css">
  .el-tabs__header{margin-bottom:10px;}
</style>
