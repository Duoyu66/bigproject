<template>
	<!-- 检测室台账页面 -->
	<div class="cardStyle">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="检测室分配" name="roomAllocation">
				<roomAllocation ref="roomAllocation" v-if="ifShow.roomAllocation" accepted="0"
					style="height: calc(70vh)">
				</roomAllocation>
			</el-tab-pane>
			<el-tab-pane label="台账" name="roomBookTable">
				<div v-if="ifShow.roomBookTable">
					<el-main class="box1" style="height: calc(100vh - 195px); min-height: 300px">
						<div class="baseBox" style="margin-bottom:10px;">
							<vab-query-form style="margin-bottom:0px;">
								<div style="float: right;">
									<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
										<el-form-item style="">
											<el-input v-model="queryForm.name" clearable style="width: 100%;"
												placeholder="检测室名称">
											</el-input>
										</el-form-item>
										<el-form-item style="">
											<el-input v-model="queryForm.charger" clearable style="width: 100%;"
												placeholder="负责人">
											</el-input>
										</el-form-item>
										<el-form-item style="margin-right:0;">
											<el-button icon="el-icon-search" type="primary" native-type="submit"
												@click="selectData">
											</el-button>
										</el-form-item>
									</el-form>
								</div>

							</vab-query-form>
							<roomBookTable ref="roomBookTable" :type="'room_book'" style="height: calc(43%);"
								:select-form.sync="searchData" :primary_key.sync="primary_key"
								:primary_org_id.sync="primary_org_id" :permission="permission">
							</roomBookTable>
						</div>
						<el-footer style="height: calc(50%); min-height: 300px;padding-left: 0px;padding-right: 0px;"
							class="table_auto">

							<el-tabs type="border-card" style="height: calc(100%)">
								<el-tab-pane label="摄像头">
									<roomVideoTable ref="roomVideoTable" :type="'room_book'" style="height: calc(35vh);"
										:primary_key="primary_key" :primary_org_id="primary_org_id"
										:permission="permission">
									</roomVideoTable>
								</el-tab-pane>
								<el-tab-pane label="设备">
									<roomAllocDeviceTable ref="roomAllocDeviceTable" :type="'room_book'"
										style="height: calc(35vh);" :primary_key="primary_key"
										:primary_org_id="primary_org_id" :permission="permission">
									</roomAllocDeviceTable>
								</el-tab-pane>

							</el-tabs>
						</el-footer>
					</el-main>
				</div>

			</el-tab-pane>

			<el-tab-pane disabled>
				<span slot="label">
					<el-switch v-model="autoRefresh" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
					切换时自动刷新标签页内容
				</span>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import roomAllocation from '../pages/roomAllocation'
	import roomVideoTable from '../table/roomVideoTable'

	import roomAllocDeviceTable from '../table/roomAllocDeviceTable'

	import roomBookTable from '../table/roomBookTable'
	//EntrustPageHistoryTable
	export default {
		name: 'testRoomledger',
		components: {
			roomAllocation,
			roomBookTable,
			roomVideoTable,
			roomAllocDeviceTable
		},
		provide() {
			return {
				reload: this.reload,
			}
		},

		data() {
			return {
				queryForm: {
					charger: '',
					name: ''
				},

				autoRefresh: true,
				activeName: 'roomBookTable',
				searchData: undefined,
				primary_key: -1,
				primary_org_id: '',

				permission: {
					// person_role: {
					// 	person_role_manage: false,
					// },
					self: false,
				},
				ifShow: {
					roomAllocation: false,
					roomBookTable: true,

				}
			}
		},
		computed: {

		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {},
		methods: {
			async init() {
				let permissionList = ['detectionRoomallocation'];
				let permission = '';
				for (let i = 0; i < permissionList.length; i++) {
					permission = await this.$store.dispatch(
						'permission/GetALLPermissionByModel',
						permissionList[i]
					)
					if (permission) {
						this.permission = Object.assign(this.permission, permission)
					}
				}
				this.tabShowSwitch(this.activeName);
			},
			selectData() {
				this.$refs['roomBookTable'].search(this.queryForm)
			},
			tabShowSwitch(tabName) {
				if (this.ifShow[tabName]) {
					return
				}
				this.$nextTick(() => {
					this.ifShow[tabName] = true;
				});
			},
			tabShow(tab, event) {
				// 切换tab栏时,在进行一次子组件刷新
				// console.log(tab, event);
				if (this.autoRefresh) {
					for (let key in this.ifShow) {
						this.ifShow[key] = false
					}
				}

				//el-tabs栏数据缓存问题(数据过多渲染时长不够问题)
				// 点击后在进行初始化
				this.tabShowSwitch(tab.name);
			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			handleClick(VueComponent, MouseEvent) {
				//console.log(VueComponent, MouseEvent);
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
				this.tabShow(VueComponent, MouseEvent);
			},
			reload() {},
			handlExport() {},
			search_main_fob(data) {
				//search
				this.$refs['EntrustPageTable'].search(data)
			},
		},
	}
</script>


<style>
	.cardStyle .el-tabs__header:not(.el-footer .el-tabs__header) {
		margin-bottom: 10px;
		background: #fff;
		border-radius: 5px;
		border: 1px solid #dbe0e6;
		padding: 10px;
		box-sizing: border-box;
		box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
	}

	/* 检测室台账第一个表格控制高度 */
	.cardStyle .el-table {
		height: calc(78%) !important;
		overflow-y: scroll;
	}
</style>
