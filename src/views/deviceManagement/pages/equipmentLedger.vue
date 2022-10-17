<template>
	<!-- 设备台账 -->
	<div class="definition purchase equipment_btn">

		<el-container style="height: calc(100%)">
			<div class="baseBox" style="margin-bottom:10px;">
				<vab-query-form>
					<vab-query-form-left-panel style="width:100px">
						<el-button type="primary" @click="handleAddAllot">验收新设备</el-button>
					</vab-query-form-left-panel>
					<vab-query-form-right-panel style="width: 50%;float: right;">
						<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent
							class="demo-form-inline">
							<el-form-item style="padding-right: 10px;">
								<el-input style="border-radius: 30px" v-model="queryForm.device_name"
									placeholder="按设备名称搜索">
								</el-input>
							</el-form-item>
							<el-form-item style="padding-right: 10px;">
								<el-input style="border-radius: 30px" v-model="queryForm.manage_pid"
									placeholder="按管理编号搜索">
								</el-input>
							</el-form-item>
							<el-form-item style="padding-right: 10px;">
								<el-button type="primary" icon="el-icon-search" @click="searchbutton"></el-button>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="deviceExport">导出</el-button>
							</el-form-item>
						</el-form>
					</vab-query-form-right-panel>
				</vab-query-form>



				<el-main style="height: calc(65%); margin-bottom: 20px" class="box1">
					<el-table ref="tableSort" v-loading="listLoading" :data="list" border
						:element-loading-text="elementLoadingText" :height="height" highlight-current-row
						@selection-change="setSelectRows" @row-click="selectrow" @sort-change="tableSortChange"
						style="he" :header-cell-style="{ background: '#e8f0ff' }">
						<el-table-column show-overflow-tooltip label="所属机构" prop="org_name"></el-table-column>
						<el-table-column show-overflow-tooltip label="管理编号" prop="manage_pid"></el-table-column>
						<el-table-column show-overflow-tooltip label="设备名称" prop="device_name"></el-table-column>
						<el-table-column show-overflow-tooltip prop="model" label="规格型号"></el-table-column>
						<el-table-column show-overflow-tooltip label="生产厂家" prop="factory"></el-table-column>
						<el-table-column show-overflow-tooltip prop="scope" label="测量范围"></el-table-column>
						<el-table-column show-overflow-tooltip label="精度" prop="precision"></el-table-column>
						<el-table-column show-overflow-tooltip label="出厂日期" prop="produce_date"></el-table-column>
						<el-table-column show-overflow-tooltip label="购置日期" prop="purchase_date"></el-table-column>
						<el-table-column show-overflow-tooltip prop="devicename" label="设备类型"></el-table-column>
						<el-table-column show-overflow-tooltip label="所属检测室" prop="room_name"></el-table-column>
						<el-table-column show-overflow-tooltip prop="device_state" label="存放状态">
							<template slot-scope="scope">
								<span v-if="scope.row.device_state==0">启用</span>
								<span v-else-if="scope.row.device_state==1">封停</span>
								<span v-else-if="scope.row.device_state==2">报废</span>
								<span v-else-if="scope.row.device_state==3">寄出</span>
								<span v-else-if="scope.row.device_state==4">未验收</span>
							</template>
						</el-table-column>
						<el-table-column show-overflow-tooltip label="操作" width="100px">
							<template #default="{ row }">
								<el-dropdown trigger="click" placement="left-start">
									<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary">
									</el-button>
									<el-dropdown-menu slot="dropdown" class="more">
										<!--                  <el-button @click="handleAddPurchase(row)">添加购入记录</el-button>
                  <el-button @click="handleAddAccept(row)">添加验收记录</el-button> -->
										<!--                  <el-button @click="handleAddCalibration">添加校检记录</el-button>
                  <el-button @click="handleAddPeriodcheck">添加核查记录</el-button> -->
										<el-button v-if="row.displaymenu" @click="handleAddMaintenance(row)">维护保养
										</el-button>
										<el-button v-if="row.displaymenu" @click="handleAddAllocation(row)">设备调拨
										</el-button>
										<el-button v-if="row.displaymenu" @click="handleAddAccident(row)">事故记录
										</el-button>
										<el-button v-if="row.displaymenu" @click="handleAddMaintenance1(row)">维修记录
										</el-button>
										<el-button v-if="row.displaymenu" @click="handleExecuteCalibration(row)">校检
										</el-button>
										<el-button v-if="row.displaymenu" @click="handleExecutePeriodcheck(row)">期间核查
										</el-button>
										<el-button v-if="row.displaymenu" @click="deviceExportLedger(row)">导出履历书
										</el-button>
										<el-button @click="handleDeleteDevice(row)">删除设备</el-button>
										<!--                  <el-button @click="deviceDetail(row)">设备详情</el-button> -->
									</el-dropdown-menu>
								</el-dropdown>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
						:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
						@size-change="handleSizeChange"></el-pagination>
				</el-main>
			</div>

			<el-footer style="height: calc(34%)" class="table_auto">
				<el-tabs type="border-card" style="height: calc(100%)">
					<el-tab-pane label="设备购入记录">
						<el-table ref="tableSort" v-loading="listChildLoading" :data="listPurchase" border
							:element-loading-text="elementLoadingText" highlight-current-row :height="height"
							@sort-change="tableSortChange" :header-cell-style="{ background: '#e8f0ff' }">
							<el-table-column show-overflow-tooltip prop="factory" label="生产厂家"></el-table-column>
							<el-table-column show-overflow-tooltip label="生产日期" prop="product_date"></el-table-column>
							<el-table-column show-overflow-tooltip label="购置费用" prop="purchase_cost"></el-table-column>
							<el-table-column show-overflow-tooltip label="是否验收" :formatter="formatJudge"
								prop="is_accept"></el-table-column>
							<el-table-column width="100px" show-overflow-tooltip label="发票扫描件">
								<template #default="{ row }">
									<el-button type="primary" size="mini" @click="pdfdetail1(row)">
										查看文件
									</el-button>
								</template>
							</el-table-column>
							<el-table-column width="100px" show-overflow-tooltip label="合同扫描件">
								<template #default="{ row }">
									<el-button type="primary" size="mini" @click="pdfdetail(row)">
										查看文件
									</el-button>
								</template>
							</el-table-column>
							<el-table-column show-overflow-tooltip label="操作" fixed="right" width="80px">
								<template #default="{ row }">
									<el-dropdown trigger="click" placement="left-start">
										<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary">
										</el-button>
										<el-dropdown-menu slot="dropdown" class="more">
											<el-button @click="handleEditPurchase(row)">修改</el-button>
											<el-button @click="handleDeletePurchase(row)">删除</el-button>
											<el-button @click="handleAcceptPurchase(row)">验收设备</el-button>
										</el-dropdown-menu>
									</el-dropdown>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>

					<el-tab-pane label="设备验收记录">
						<el-table ref="tableSort" v-loading="listChildLoading" :data="list8" border
							:element-loading-text="elementLoadingText" highlight-current-row :height="height"
							@sort-change="tableSortChange" :header-cell-style="{ background: '#e8f0ff' }">
							<el-table-column show-overflow-tooltip label="生产厂家" prop="factory"></el-table-column>
							<el-table-column show-overflow-tooltip label="出厂编号" prop="serial_no"></el-table-column>
							<el-table-column show-overflow-tooltip prop="accept_org" label="验收单位"></el-table-column>
							<el-table-column show-overflow-tooltip label="验收结论" prop="accept_conclusion">
							</el-table-column>
							<el-table-column show-overflow-tooltip label="验收人员" prop="acceptance_member">
							</el-table-column>
							<el-table-column show-overflow-tooltip label="操作" width="116px">
								<template #default="{ row }">
									<el-button type="primary" class="normal" @click="handleEditAccept(row)">
										修改
									</el-button>
									<el-button @click="handleDeleteAccept(row)" class="danger">
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="设备校检记录">
						<el-table ref="tableSort" v-loading="listChildLoading" :data="listCalibration" border
							:element-loading-text="elementLoadingText" highlight-current-row :height="height"
							@sort-change="tableSortChange" :header-cell-style="{ background: '#e8f0ff' }">
							<el-table-column show-overflow-tooltip label="校检单位" prop="verify_org"></el-table-column>
							<el-table-column show-overflow-tooltip label="校检日期" prop="verify_date"></el-table-column>
							<el-table-column show-overflow-tooltip label="送检人" prop="sender"></el-table-column>
							<el-table-column show-overflow-tooltip label="证书确认情况" prop="cert_situation">
							</el-table-column>
							<el-table-column show-overflow-tooltip label="校检结果" prop="verify_result"></el-table-column>
							<el-table-column show-overflow-tooltip label="证书编号" prop="cert_id"></el-table-column>
							<el-table-column show-overflow-tooltip label="证书扫描件">
								<template #default="{ row }">
									<div class="demo-image__preview">
										<el-image v-if="imgShow" :src="row.cert_filename_table"
											:preview-src-list="[row.cert_filename_table]"></el-image>
									</div>
								</template>
							</el-table-column>
							<el-table-column show-overflow-tooltip label="操作" width="120px">
								<template #default="{ row }">
									<el-button type="primary" class="normal" @click="handleCaliChange(row)">
										修改
									</el-button>
									<el-button @click="handleCaliDelete(row)" class="danger">
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="期间核查记录">
						<el-table ref="tableSort" v-loading="listChildLoading" :data="listPerCheck" border
							:element-loading-text="elementLoadingText" highlight-current-row :height="height"
							@sort-change="tableSortChange" :header-cell-style="{ background: '#e8f0ff' }">
							<el-table-column show-overflow-tooltip prop="check_date" label="核查日期"></el-table-column>
							<el-table-column show-overflow-tooltip prop="check_method" label="核查方式"></el-table-column>
							<el-table-column show-overflow-tooltip label="核查实施人" prop="check_person"></el-table-column>
							<el-table-column show-overflow-tooltip label="核查结果" prop="check_result"></el-table-column>
							<el-table-column show-overflow-tooltip label="备注" prop="remark"></el-table-column>
							<el-table-column show-overflow-tooltip label="操作" width="100px">
								<template #default="{ row }">
									<el-dropdown trigger="click" placement="left-start">
										<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary">
										</el-button>
										<el-dropdown-menu slot="dropdown" class="more">
											<el-button @click="handleAdd41(row)">修改</el-button>
											<el-button @click="">核查详情</el-button>
										</el-dropdown-menu>
									</el-dropdown>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="设备维护记录">
						<el-table ref="tableSort" v-loading="listChildLoading" :data="listMT" border
							:element-loading-text="elementLoadingText" highlight-current-row :height="height"
							@sort-change="tableSortChange" :header-cell-style="{ background: '#e8f0ff' }">
							<el-table-column show-overflow-tooltip label="维护日期" prop="maintain_date"></el-table-column>
							<el-table-column show-overflow-tooltip prop="maintain_content" label="维护措施">
							</el-table-column>
							<el-table-column show-overflow-tooltip label="维护效果" prop="result"></el-table-column>
							<el-table-column show-overflow-tooltip label="维护人" prop="charge_person"></el-table-column>
							<el-table-column show-overflow-tooltip label="操作" width="116px">
								<template #default="{ row }">
									<el-button type="primary" class="normal" @click="handleMTEdit(row)">
										修改
									</el-button>
									<el-button @click="handleMTDelete(row)" class="danger">
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination :background="background" :current-page="queryFormMT.pageNo" :layout="layoutMT"
							:page-size="queryFormMT.pageSize" :total="totalMT" @current-change="handleCurrentChangeMT"
							@size-change="handleSizeChangeMT"></el-pagination>
					</el-tab-pane>
					<el-tab-pane label="设备调拨记录">
						<el-table ref="tableSort" v-loading="listChildLoading" :data="listAllot" border
							:element-loading-text="elementLoadingText" highlight-current-row :height="height"
							@sort-change="tableSortChange" :header-cell-style="{ background: '#e8f0ff' }">
							<el-table-column show-overflow-tooltip prop="achieve_time" label="调拨日期"></el-table-column>
							<el-table-column show-overflow-tooltip prop="from_org_name" label="起始机构"></el-table-column>
							<el-table-column show-overflow-tooltip label="目标机构" prop="to_org_name"></el-table-column>
							<el-table-column show-overflow-tooltip label="目标经手人" prop="apply_people"></el-table-column>
							<el-table-column show-overflow-tooltip label="调拨原因" prop="reason"></el-table-column>
							<el-table-column show-overflow-tooltip label="操作" width="100px">
								<template #default="{ row }">
									<el-dropdown trigger="click" placement="left-start">
										<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary">
										</el-button>
										<el-dropdown-menu slot="dropdown" class="more">
											<el-button @click="handleEditAllot(row)">修改记录</el-button>
											<el-button @click="handleDeleteAllot(row)">删除记录</el-button>
											<!--                      <el-button>调拨详情</el-button> -->
										</el-dropdown-menu>
									</el-dropdown>
								</template>
							</el-table-column>
							<el-pagination :background="background" :current-page="queryFormAllot.pageNo"
								:layout="layoutAllot" :page-size="queryFormAllot.pageSize" :total="totalAllot"
								@current-change="handleCurrentChangeAllot" @size-change="handleSizeChangeAllot">
							</el-pagination>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="设备事故记录">
						<el-table ref="tableSort" v-loading="listChildLoading" :data="listAccident" border
							:element-loading-text="elementLoadingText" highlight-current-row :height="height"
							@sort-change="tableSortChange" :header-cell-style="{ background: '#e8f0ff' }">
							<el-table-column show-overflow-tooltip label="事故时间" prop="acc_date"></el-table-column>
							<el-table-column show-overflow-tooltip prop="situation" label="破损情况"></el-table-column>
							<el-table-column show-overflow-tooltip label="事故原因" prop="reason"></el-table-column>
							<el-table-column show-overflow-tooltip label="停工天数" prop="stop_days"></el-table-column>
							<el-table-column show-overflow-tooltip prop="leader" label="项目负责人"></el-table-column>
							<el-table-column show-overflow-tooltip label="事故负责人" prop="liable_person"></el-table-column>
							<el-table-column show-overflow-tooltip label="操作" width="116px">
								<template #default="{ row }">
									<el-button type="primary" class="normal" @click="handleAccidentEdit(row)">
										修改
									</el-button>
									<el-button @click="handleAccidentDelete(row)" class="danger">
										删除
									</el-button>
								</template>
							</el-table-column>
							<el-pagination :background="background" :current-page="queryFormAccident.pageNo"
								:layout="layoutAccident" :page-size="queryFormAccident.pageSize" :total="totalAccident"
								@current-change="handleCurrentChangeAccident" @size-change="handleSizeChangeAccident">
							</el-pagination>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="设备维修记录">
						<el-table ref="tableSort" v-loading="listChildLoading" :data="listRepair" border
							:element-loading-text="elementLoadingText" highlight-current-row :height="height"
							@sort-change="tableSortChange" :header-cell-style="{ background: '#e8f0ff' }">
							<el-table-column show-overflow-tooltip label="维修日期" prop="repair_date"></el-table-column>
							<el-table-column show-overflow-tooltip prop="repair_type" label="修理类别"></el-table-column>
							<el-table-column show-overflow-tooltip label="修理主要部分" prop="repair_main"></el-table-column>
							<el-table-column show-overflow-tooltip label="维修方法" prop="repair_method"></el-table-column>
							<el-table-column show-overflow-tooltip prop="repair_situation" label="维修后情况">
							</el-table-column>
							<el-table-column show-overflow-tooltip label="承修单位" prop="repair_org"></el-table-column>
							<el-table-column show-overflow-tooltip prop="completed_date" label="竣工时间"></el-table-column>
							<el-table-column show-overflow-tooltip label="操作" width="116px">
								<template #default="{ row }">
									<el-button type="primary" class="normal" @click="handleEditRepair(row)">
										修改
									</el-button>
									<el-button @click="handleDeleteRepair(row)" class="danger">
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination :background="background" :current-page="queryFormRepair.pageNo"
							:layout="layoutRepair" :page-size="queryFormRepair.pageSize" :total="totalRepair"
							@current-change="handleCurrentChangeRepair" @size-change="handleSizeChangeRepair">
						</el-pagination>
					</el-tab-pane>
					<el-tab-pane label="设备使用记录">
						<el-table ref="tableSort" v-loading="listChildLoading" :data="listDeviceUsed" border
							:element-loading-text="elementLoadingText" highlight-current-row :height="height"
							@sort-change="tableSortChange" :header-cell-style="{ background: '#e8f0ff' }">
							<el-table-column show-overflow-tooltip label="使用日期" prop="start_time"></el-table-column>
							<el-table-column show-overflow-tooltip prop="object_name" label="试验名称"></el-table-column>
							<el-table-column show-overflow-tooltip label="委托编号" prop="order_id"></el-table-column>
							<el-table-column show-overflow-tooltip label="使用人" prop="user_name"></el-table-column>
							<el-table-column show-overflow-tooltip label="操作" width="116px">
								<template #default="{ row }">
									<el-button type="primary" class="normal" @click="handleEditRepair(row)">
										修改
									</el-button>
									<el-button @click="handleDeleteRepair(row)" class="danger">
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination :background="background" :current-page="queryFormDeviceUsed.pageNo"
							:layout="layoutRepair" :page-size="queryFormDeviceUsed.pageSize" :total="totalDeviceUsed"
							@current-change="handleCurrentChangeDeviceUsed" @size-change="handleSizeChangeDeviceUsed">
						</el-pagination>
					</el-tab-pane>
				</el-tabs>
			</el-footer>
		</el-container>
		<table-edit ref="edit"></table-edit>
		<!-- <table-edit1 ref="edit1"></table-edit1> -->
		<table-edit11 ref="edit11"></table-edit11>
		<!-- <table-edit2 ref="edit2"></table-edit2> -->
		<equipmentAcceptance ref="equipmentAcceptance" @fetchDataChild="selectrowauto"></equipmentAcceptance>
		<equipmentAcceptanceEdit ref="equipmentAcceptanceEdit" @fetchDataChild="selectrowauto">
		</equipmentAcceptanceEdit>
		<CalibrationRecord ref="CalibrationRecord" @fetchDataChild="selectrowauto"></CalibrationRecord>
		<equipmentPeriodcheck ref="equipmentPeriodcheck"></equipmentPeriodcheck>
		<table-edit31 ref="edit31"></table-edit31>
		<table-edit41 ref="edit41"></table-edit41>
		<MaintenanceEdit ref="MaintenanceEdit" @fetchDataChild="selectrowauto"></MaintenanceEdit>
		<table-edit61 ref="edit61"></table-edit61>
		<equipmentAccident ref="equipmentAccident" @fetchDataChild="selectrowauto"></equipmentAccident>
		<equipmentMaintenance ref="equipmentMaintenance" @fetchDataChild="selectrowauto"></equipmentMaintenance>
		<equipmentAllocation ref="equipmentAllocation" @fetchDataChild="selectrowauto"></equipmentAllocation>
		<CalibrationExecute ref="CalibrationExecute"></CalibrationExecute>
		<deviceExport ref="deviceExport"></deviceExport>
	</div>
</template>

<script>
	import {
		doEdit,
		ExecSql,
		QueryExec
	} from '@/api/table'
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		ViewfileUrl,
		UploadFileNameUrl
	} from '@/utils/servicefile'
	import TableEdit from '../components/equipmentLedger.vue'
	// import TableEdit1 from '../components/equipmentPurchase1.vue'
	import TableEdit11 from '../components/equipmentPurchase.vue'
	// import TableEdit2 from '../components/equipmentAcceptance1.vue'
	import equipmentAcceptance from '../components/equipmentAcceptance.vue'
	import equipmentAcceptanceEdit from '../components/equipmentAcceptanceEdit.vue'
	import CalibrationRecord from '../components/equipmentCalibrationrecord.vue'
	import TableEdit31 from '../components/equipmentCalibration.vue'
	// import TableEdit4 from '../components/equipmentPeriodcheck2.vue'
	import TableEdit41 from '../components/equipmentPeriodcheck1.vue'
	import MaintenanceEdit from '../components/MaintenanceLedger.vue'
	// import TableEdit6 from '../components/equipmentAllocation1.vue'
	import TableEdit61 from '../components/equipmentAllocation.vue'
	import equipmentAllocation from '../components/equipmentAllocation2.vue'
	import equipmentAccident from '../components/equipmentAccidentLedger.vue'
	import CalibrationExecute from '../components/equipmentCalibration1.vue'
	import equipmentMaintenance from '../components/equipmentMaintenanceLedger.vue'
	import equipmentPeriodcheck from '../components/equipmentPeriodcheck.vue'
	import LedgerFrom from '../form/LedgerFrom.vue'
	import deviceExport from '../components/deviceExport.vue'
	import treeData from './../../vab/tree/index'
	export default {
		name: 'ComprehensiveTable',
		components: {
			TableEdit,
			TableEdit11,
			equipmentAcceptance,
			equipmentAcceptanceEdit,
			CalibrationRecord,
			TableEdit31,
			TableEdit41,
			MaintenanceEdit,
			TableEdit61,
			equipmentAllocation,
			equipmentAccident,
			equipmentMaintenance,
			LedgerFrom,
			treeData,
			CalibrationExecute,
			equipmentPeriodcheck,
			deviceExport
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
				listCalibration: [],
				listMT: [],
				listPerCheck: [],
				listAllot: [],
				listRepair: [],
				listPurchase: [],
				listAccident: [],
				list8: [],
				imageList: [],
				listDeviceUsed: [],
				listLoading: true,
				listChildLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				layoutMT: 'total, sizes, prev, pager, next, jumper',
				layoutAccident: 'total, sizes, prev, pager, next, jumper',
				layoutAllot: 'total, sizes, prev, pager, next, jumper',
				layoutRepair: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				totalMT: 0,
				totalAccident: 0,
				totalRepair: 0,
				totalAllot: 0,
				totalDeviceUsed: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					title: '',
					device_name: '',
					manage_pid: ''
				},
				queryFormMT: {
					pageNo: 1,
					pageSize: 20,
					title: '',
				},
				queryFormAccident: {
					pageNo: 1,
					pageSize: 20,
					title: '',
				},
				queryFormAllot: {
					pageNo: 1,
					pageSize: 20,
					title: '',
				},
				queryFormRepair: {
					pageNo: 1,
					pageSize: 20,
					title: '',
				},
				queryFormDeviceUsed: {
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
				listrow: {
					device_id: ''
				},
				formLabelWidth: '120px',

			}
		},
		computed: {
			height() {
				if (this.$baseTableHeight() < 700) {
					return 300
				} else {
					return (this.$baseTableHeight() * 0.40)
				}

			},
			...mapGetters({
				current_org: 'org/current_org',
			}),
		},
		created() {
			this.fetchData()
		},
		beforeDestroy() {},
		mounted: function() {


		},
		methods: {
			LedgerFromAdd() {
				console.log(this.$refs['LedgerFrom'].form);
			},
			deviceExport() {
				let row = {}
				row.template_id = 1
				row.param = '@org_id$`' + this.current_org
				console.log(row)
				this.$refs['deviceExport'].showEdit(row)
			},
			deviceExportLedger(row) {

				row.template_id = 2
				row.param = '@device_id$`' + row.device_id

				this.$refs['deviceExport'].showEdit(row)
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
			selectrow(val) {
				this.listrow.device_id = val.device_id
				this.fetchDataChild(val.device_id)
			},
			formatJudge: function(row, column) {
				return row.is_accept == '1' ? "是" : row.is_accept == '0' ? "否" : "无验收记录";
			},
			pdfdetail(row) {
				let that = this
				console.log(row)
				if (row.contract_table.name != '') {
					this.$refs['preview'].handleEdit(row.contract_table)
				} else {
					this.$message.error(
						"服务器无可预览文件"
					)
				}
			},
			handleExecuteCalibration(row) {
				this.$refs['CalibrationExecute'].showEdit(row)
			},
			handleExecutePeriodcheck(row) {
				this.$refs['equipmentPeriodcheck'].showEdit(row)
			},
			pdfdetail1(row) {
				let that = this
				console.log(row)
				if (row.receipt_table.name != '') {
					this.$refs['preview'].handleEdit(row.receipt_table)
				} else {
					this.$message.error(
						"服务器无可预览文件"
					)
				}
			},
			handleAddAllot() {
				this.$refs['edit'].showEdit()
			},
			handleAddPurchase() {
				this.$refs['edit11'].showEdit()
			},
			handleEditPurchase(row) {
				this.$refs['edit11'].showEdit(row)
			},
			handleDeletePurchase(row) {
				if (row.detail_id) {
					this.$baseConfirm('你确定要删除管理编号为' + row.manage_id + '的设备的采购记录吗?', null, async () => {
						let sData = '[Q]182{' + row.detail_id + '}|^1|^SYS'
						const res = await ExecSql(sData)
						if (res > 0) {
							this.$baseMessage("删除成功", 'success')
							this.fetchDataChild(this.listrow.device_id)
						} else {
							this.$baseMessage("删除失败", 'error')
						}
					})
				}
			},
			handleAcceptPurchase(row) {
				this.$refs['equipmentAcceptance'].showEdit(row)
			},

			handleAddMaintenance(row) {
				console.log(row)
				this.$refs['MaintenanceEdit'].showEdit(row, '0')
			},
			handleAddMaintenance1(row) {
				console.log(row)
				this.$refs['equipmentMaintenance'].showEdit(row, '0')
			},
			handleAddAccept() {
				this.$refs['equipmentAcceptance'].showEdit()
			},
			handleEditAccept(row) {
				this.$refs['equipmentAcceptanceEdit'].showEdit(row)
			},
			handleDeleteAccept(row) {
				if (row.accept_id) {
					this.$baseConfirm('你确定要删除管理编号为' + row.manage_id + '的' + row.devicename + '的验收记录吗?', null, async () => {
						let sData = '[Q]100{' + row.accept_id + '}|^1|^SYS'
						const res = await ExecSql(sData)
						if (res > 0) {
							this.$baseMessage('删除成功', 'success')
							this.fetchDataChild(this.listrow.device_id)
						} else {
							this.$baseMessage('删除失败', 'error')
						}
					})
				}
			},

			handleCaliChange(row) {
				this.$refs['CalibrationRecord'].showEdit(row)
			},
			handleCaliDelete(row) {
				console.log(row)
				if (row.adjust_id) {
					this.$baseConfirm('你确定要删除管理编号为' + row.manage_pid + '的设备的校检记录吗?', null, async () => {
						let sData = '[Q]161{' + row.adjust_id + '}|^1|^SYS'
						const res = await ExecSql(sData)
						if (res > 0) {
							this.$baseMessage("删除成功", 'success')
							this.fetchDataChild(this.listrow.device_id)
						} else {
							this.$baseMessage("删除失败", 'error')
						}
					})
				}
			},

			handleMTEdit(row) {
				this.$refs['MaintenanceEdit'].showEdit(row)
			},
			handleMTDelete(row) {
				if (row.id) {
					this.$baseConfirm('你确定要删除管理编号为' + row.manage_pid + '的设备的维护保养记录吗?', null, async () => {
						let sData = '[Q]169{' + row.id + '}|^1|^SYS'
						const res = await ExecSql(sData)
						if (res > 0) {
							this.$baseMessage("删除成功", 'success')
							this.fetchDataChild(this.listrow.device_id)
						} else {
							this.$baseMessage("删除失败", 'error')
						}
					})
				}
			},

			handleAccidentEdit(row) {
				this.$refs['equipmentAccident'].showEdit(row)
			},
			handleAccidentDelete(row) {
				if (row.trouble_id) {
					this.$baseConfirm('你确定要删除管理编号为' + row.manage_pid + '的设备的事故记录吗?', null, async () => {
						let sData = '[Q]174{' + row.trouble_id + '}|^1|^SYS'
						const res = await ExecSql(sData)
						if (res > 0) {
							this.$baseMessage("删除成功", 'success')
							this.fetchDataChild(this.listrow.device_id)
						} else {
							this.$baseMessage("删除失败", 'error')
						}
					})
				}
			},

			handleEditRepair(row) {
				this.$refs['equipmentMaintenance'].showEdit(row)
			},
			handleDeleteRepair(row) {
				if (row.repair_id) {
					this.$baseConfirm('你确定要删除管理编号为' + row.manage_pid + '的设备的维修记录吗?', null, async () => {
						let sData = '[Q]181{' + row.repair_id + '}|^1|^SYS'
						const res = await ExecSql(sData)
						if (res > 0) {
							this.$baseMessage("删除成功", 'success')
							this.fetchDataChild(this.listrow.device_id)
						} else {
							this.$baseMessage("删除失败", 'error')
						}
					})
				}
			},

			handleDeleteDevice(row) {
				if (row.device_id) {
					this.$baseConfirm('你确定要删除管理编号为' + row.manage_pid + '的设备的所有关联数据吗?', null, async () => {
						let sData = '[Q]637{' + row.device_id + '$`' + row.purchase_id + '$`' + row.allot_id +
							'}|^1|^SYS'
						const res = await ExecSql(sData)
						if (res > 0) {
							this.$baseMessage("删除成功", 'success')
							this.fetchData()
						} else {
							this.$baseMessage("删除失败", 'error')
						}
					})
				}
			},
			handleAdd4() {
				this.$refs['edit41'].showEdit()
			},
			handleAdd6() {
				this.$refs['edit61'].showEdit()
			},
			handleAdd8() {
				this.$refs['equipmentMaintenance'].showEdit()
			},
			searchbutton() {
				this.fetchData()
			},
			handleAdd41(row) {
				this.$refs['edit41'].showEdit(row)
			},
			handleEditAllot(row) {
				this.$refs['equipmentAllocation'].showEdit(row, '1')
			},
			handleAddAllocation(row) {
				this.$refs['equipmentAllocation'].showEdit(row, '0')
			},
			handleAddAccident(row) {
				this.$refs['equipmentAccident'].showEdit(row, '0')
			},

			handleDeleteAllot(row) {
				if (row.allot_id) {
					this.$baseConfirm('你确定要删除管理编号为' + row.allot_id + '的设备的调拨记录吗?', null, async () => {
						let sData = '[Q]638{' + row.allot_id + '}|^1|^SYS'
						const res = await ExecSql(sData)
						if (res > 0) {
							this.$baseMessage("删除成功", 'success')
							this.fetchDataChild(this.listrow.device_id)
						} else {
							this.$baseMessage("删除失败", 'error')
						}
					})
				}
			},
			handleSizeChangeRepair(val) {
				this.queryFormRepair.pageSize = val
				this.fetchDataChild(this.listrow.device_id)
			},
			handleSizeChangeDeviceUsed(val) {
				this.queryFormDeviceUsed.pageSize = val
				this.fetchDataChild(this.listrow.device_id)
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData()
			},
			handleSizeChangeMT(val) {
				this.queryFormMT.pageSize = val
				this.fetchDataChild(this.listrow.device_id)
			},
			handleSizeChangeAccident(val) {
				this.queryFormAccident.pageSize = val
				this.fetchDataChild(this.listrow.device_id)
			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchData()
			},
			handleCurrentChangeRepair(val) {
				this.queryFormRepair.pageNo = val
				this.fetchDataChild(this.listrow.device_id)
			},
			handleCurrentChangeDeviceUsed(val) {
				this.queryFormDeviceUsed.pageNo = val
				this.fetchDataChild(this.listrow.device_id)
			},
			handleSizeChangeAllot(val) {
				this.queryFormAllot.pageSize = val
				this.fetchDataChild(this.listrow.device_id)
			},
			handleCurrentChangeAllot(val) {
				this.queryFormAllot.pageNo = val
				this.fetchDataChild(this.listrow.device_id)
			},
			handleCurrentChangeMT(val) {
				this.queryFormMT.pageNo = val
				this.fetchDataChild(this.listrow.device_id)
			},
			handleCurrentChangeAccident(val) {
				this.queryFormAccident.pageNo = val
				this.fetchDataChild(this.listrow.device_id)
			},
			handleQuery() {
				this.queryForm.pageNo = 1
				this.fetchData()
			},
			async fetchData() {
				this.listLoading = true
				this.listChildLoading = true
				let that = this
				let sData = '[Q]101{' + this.current_org + '%$`%' + this.queryForm.device_name + '%$`%' + this
					.queryForm
					.manage_pid + '%$`' + ((Number(this.queryForm.pageNo) - 1) * Number(this.queryForm.pageSize))
					.toString() + '$`' + this.queryForm.pageSize + '}|^SYS'
				const res = await QueryExec(sData)
				console.log(res)
				res.data.forEach((item, index) => {
					if (item.curr_org_id === that.current_org) {
						item.displaymenu = true
					} else {
						item.displaymenu = false
					}
				})
				this.list = res.data
				this.total = res.totalCount
				setTimeout(() => {
					this.listLoading = false
				}, 500)
				setTimeout(() => {
					this.listChildLoading = false
				}, 500)
			},
			selectrowauto() {
				this.fetchDataChild(this.listrow.device_id)
			},
			async fetchDataChild(val) {
				let that = this
				console.log(val)
				this.listChildLoading = true
				let sDataCalibration = '[Q]187{' + val + '}|^SYS'
				console.log(sDataCalibration)
				const resCalibration = await QueryExec(sDataCalibration)
				this.listCalibration = resCalibration.data
				if (resCalibration.data != undefined) {
					resCalibration.data.forEach((item, index) => {
						const prefix = ViewfileUrl(11)
						item.cert_filename_table = prefix + item.certificate_image
					})
				}

				let sDataPC = '[Q]657{' + val +
					'}|^SYS'
				const resPC = await QueryExec(sDataPC)
				console.log(resPC)
				this.listPerCheck = resPC.data

				let sDataMT = '[Q]188{' + this.current_org + '$`' + val + '$`' + ((Number(this.queryFormMT.pageNo) -
						1) * Number(this.queryFormMT.pageSize)).toString() + '$`' + this.queryFormMT.pageSize +
					'}|^SYS'
				console.log(sDataMT)
				const resMT = await QueryExec(sDataMT)
				console.log(resMT)
				this.listMT = resMT.data
				this.totalMT = resMT.totalCount

				let sDataAllot = '[Q]381{' + val + '$`' + ((Number(this.queryFormAllot.pageNo) - 1) * Number(this
					.queryFormAllot.pageSize)).toString() + '$`' + this.queryFormAllot.pageSize + '}|^SYS'
				const resAllot = await QueryExec(sDataAllot)
				console.log(sDataAllot)
				this.listAllot = resAllot.data
				this.totalAllot = resAllot.totalCount

				let sDataRepair = '[Q]190{' + val + '$`' + ((Number(this.queryFormRepair.pageNo) - 1) * Number(this
					.queryFormRepair.pageSize)).toString() + '$`' + this.queryFormRepair.pageSize + '}|^SYS'
				const resRepair = await QueryExec(sDataRepair)
				console.log(sDataRepair)
				this.listRepair = resRepair.data
				this.totalRepair = resRepair.totalCount

				let sDataPurchase = '[Q]103{' + this.current_org + '$`' + val + '}|^SYS'
				const resPurchase = await QueryExec(sDataPurchase)
				resPurchase.data.forEach((item, index) => {
					const prefix = ViewfileUrl(18)
					item.receipt_table = {
						name: item.invoice_file,
						src: prefix + item.invoice_file
					}
					const prefix1 = ViewfileUrl(12)
					item.contract_table = {
						name: item.contract_filename,
						src: prefix1 + item.contract_filename
					}
				})
				console.log(sDataPurchase)
				this.listPurchase = resPurchase.data

				let sDataAccident = '[Q]189{' + val + '$`' + ((Number(this.queryFormAccident.pageNo) - 1) * Number(this
					.queryFormAccident.pageSize)).toString() + '$`' + this.queryFormAccident.pageSize + '}|^SYS'
				const resAccident = await QueryExec(sDataAccident)
				console.log(sDataAccident)
				this.listAccident = resAccident.data
				this.totalAccident = resAccident.totalCount

				let sDataDeviceUsed = '[Q]761{' + val + '$`' + ((Number(this.queryFormDeviceUsed.pageNo) - 1) * Number(
						this
						.queryFormDeviceUsed.pageSize)).toString() + '$`' + this.queryFormDeviceUsed.pageSize +
					'}|^SYS'
				const resDeviceUsed = await QueryExec(sDataDeviceUsed)
				console.log(sDataDeviceUsed)
				this.listDeviceUsed = resDeviceUsed.data
				this.totalDeviceUsed = resDeviceUsed.totalCount

				let sData8 = '[Q]102{' + this.current_org + '$`' + val + '}|^SYS'
				const res8 = await QueryExec(sData8)
				console.log(res8)
				this.list8 = res8.data

				setTimeout(() => {
					this.listChildLoading = false
				}, 500)
			},
		},
	}
</script>
<style>
	.baseBox {
		background: #fff;
		border-radius: 5px;
		border: 1px solid #dbe0e6;
		box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
		padding: 10px;
		box-sizing: border-box;
	}
</style>
