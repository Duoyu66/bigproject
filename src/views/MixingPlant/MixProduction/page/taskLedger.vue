<template>
	<div class="definition purchase contract equipment_btn calc">
		<el-tabs type="border-card" class="box_center" style="height: calc(100vh)">
			<el-tab-pane label="新增任务" class="center">
				<div class="usage" style="padding: 20px;">
					<taskLedgerForm ref="taskLedgerForm"></taskLedgerForm>
					<div>
						<el-button class="purchase_btn" type="primary" @click="taskLedgerFormAdd()">确 定</el-button>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="任务管理">
				<el-row>
					<el-col :span="24" style="text-align: right;">
						<el-form ref="form" :model="search.main" :inline="true" @submit.native.prevent>
							<el-form-item label="">
								<el-input style="border-radius: 30px" v-model="search.main.task_no"
									placeholder="请输入任务编号" clearable></el-input>
							</el-form-item>
							<el-form-item label="">
								<el-input style="border-radius: 30px" v-model="search.main.project_name"
									placeholder="请输入工程名称" clearable></el-input>
							</el-form-item>
							<el-form-item label="">
								<el-input style="border-radius: 30px" v-model="search.main.mileage" placeholder="请输入里程"
									clearable></el-input>
							</el-form-item>
							<el-form-item label="">
								<el-select v-model="search.main.strength" placeholder="请选择强度" style="width:100%">
									</el-input>
									<el-option v-for="data in selectData.strength" :key="data.item_name"
										:label="data.item_name" :value="data.item_name"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="">
								<el-button icon="el-icon-search" type="primary" @click="searchMain"></el-button>
							</el-form-item>
						</el-form>
					</el-col>
					<el-col :span="24">
						<taskLedgerTable style="height: calc(35vh); min-height: 300px" ref="taskLedgerTable" :type="0"
							:primary_key.sync="primary_key" :permission="permission"></taskLedgerTable>
					</el-col>
					<el-col :span="24">
						<el-tabs type="border-card" style="height: calc(50%)">
							<el-tab-pane label="流程">
								<el-row>
									<el-col :span="24">
										<msFlowStateTable style="height: calc(35vh); min-height: 300px"
											ref="msFlowStateTable" :type="2" :primary_key.sync="primary_key"
											:permission="permission"></msFlowStateTable>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane label="方量分配">
								<el-row>
									<el-col :span="24">
										<msAssignVolumeTable style="height: calc(35vh); min-height: 300px"
											ref="msAssignVolumeTable" :type="2" :primary_key.sync="primary_key"
											:permission="permission"></msAssignVolumeTable>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane label="配比单">
								<el-row>
									<el-col :span="24">
										<ratioLedgerTable style="height: calc(35vh); min-height: 300px"
											ref="ratioLedgerTable" :type="1" :primary_key.sync="primary_key"
											:permission="permission"></ratioLedgerTable>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane label="生产盘次">
								<el-row>
									<el-col :span="24">
										<productionReelTable style="height: calc(35vh); min-height: 300px"
											ref="productionReelTable" :type="1" :primary_key.sync="primary_key"
											:permission="permission"></productionReelTable>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane label="车次">
								<el-row>
									<el-col :span="24">
										<productionCarTable style="height: calc(35vh); min-height: 300px"
											ref="productionCarTable" :type="1" :primary_key.sync="primary_key"
											:permission="permission"></productionCarTable>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane label="问题记录">
								<el-row>
									<el-col :span="24">
										<riskSlaveLedgerTable style="height: calc(35vh); min-height: 300px"
											ref="riskSlaveLedgerTable" :type="12" :primary_key.sync="primary_key"
											:permission="permission"></riskSlaveLedgerTable>
									</el-col>
								</el-row>
							</el-tab-pane>
						</el-tabs>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>


<script>
	import {
		GetGroupData,
		GetGroupDataEx,
	} from '@/utils/htmlDataGroup'
	import taskLedgerTable from '../table/taskLedgerTable.vue'
	import ratioLedgerTable from '../table/ratioLedgerTable.vue'
	import productionReelTable from '../table/productionReelTable.vue'
	import productionCarTable from '../table/productionCarTable.vue'
	import riskSlaveLedgerTable from '../table/riskTable.vue'
	import msFlowStateTable from '../table/msFlowStateTable'
	import msAssignVolumeTable from '../table/msAssignVolumeTable'
	import taskLedgerForm from '../form/taskLedgerForm.vue'
	export default {
		name: 'taskLedger',
		components: {
			taskLedgerTable,
			ratioLedgerTable,
			productionReelTable,
			productionCarTable,
			riskSlaveLedgerTable,
			msFlowStateTable,
			msAssignVolumeTable,
			taskLedgerForm
		},
		data() {
			return {
				primary_key: -1,
				search: {
					main: {
						task_no: '',
						project_name: '',
						mileage: '',
						strength: '',
						state: '',
					},
				},
				selectData: {
					strength: []
				},
				permission: {
					person_role: false,
					self: false,
				},
			}
		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {},
		methods: {
			async init() {
				let permissionList = ['productionCar'];
				let permission = '';
				for (let i = 0; i < permissionList.length; i++) {
					permission = await this.$store.dispatch(
						'permission/GetALLPermissionByModel',
						permissionList[i],
					)
					if (permission) {
						this.permission = Object.assign(this.permission, permission)
					}
				}
				await this.fetchData()
				await this.GetGroup()
			},
			async GetGroup() {
				let list = [{
					data: 'strength',
					group_id: 1005
				}, ];
				await GetGroupDataEx(this, list);
			},
			searchMain() {
				this.$refs['taskLedgerTable'].search(this.search.main)
			},
			taskLedgerFormAdd() {
				this.$refs["taskLedgerForm"].save()
			},
			async fetchData() {
				this.$refs['taskLedgerTable'].fetchData()
				this.$refs['ratioLedgerTable'].fetchData()
				this.$refs['productionReelTable'].fetchData()
				this.$refs['productionCarTable'].fetchData()
				this.$refs['riskSlaveLedgerTable'].fetchData()
			},
		},
	}
</script>
