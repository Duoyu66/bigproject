<template>
	<!-- 起草发文、发文管理 -->
	<div class=" definition purchase equipment_btn calc" style="margin-right: 10px;">
		<div class="baseBox" style="margin-bottom:10px;">
			<vab-query-form>
				<postRegistrationSearchForm ref="postRegistrationSearchForm" v-model="searchData"
					:search_fob="search_main_fob" :permission="permission" :nextStatus="nextStatus">
				</postRegistrationSearchForm>
			</vab-query-form>
			<postRegistrationTable ref="postRegistrationTable" :type="1" style="height: calc(47%); min-height: 300px"
				:select-form.sync="searchData" :primary_key.sync="primary_key" :permission="permission"
				:nextStatus="nextStatus" :status="status">
			</postRegistrationTable>
		</div>
		<el-main class="box1">
			<el-footer style="height: calc(50%); padding: 0px" class="table_auto">
				<el-tabs type="border-card" style="height: calc(100%)">
					<el-tab-pane label="操作历史">
						<DocDispatchHistoryTable style="height: calc(30vh)" ref="DocDispatchHistoryTable" :type="0"
							:primary_key.sync="primary_key" :permission="permission">
						</DocDispatchHistoryTable>
					</el-tab-pane>
					<el-tab-pane label="用印历史">
						<sealApplyTable style="height: calc(30vh)" ref="sealApplyTable" :type="2" :apply_type="1"
							:primary_key.sync="primary_key" :permission="permission">
						</sealApplyTable>
					</el-tab-pane>
					<el-tab-pane label="发送记录">
						<docPostHistoryTable style="height: calc(30vh)" ref="docPostHistoryTable" :type="0"
							:apply_type="1" :primary_key.sync="primary_key" :permission="permission">
						</docPostHistoryTable>
					</el-tab-pane>
				</el-tabs>
			</el-footer>
			</el-container>
		</el-main>
	</div>
</template>

<script>
	import postRegistrationTable from '../table/postRegistrationTable'
	import DocDispatchHistoryTable from '../table/DocDispatchHistoryTable'
	import postRegistrationSearchForm from '../searchForm/postRegistrationSearchForm'

	import sealApplyTable from '../table/sealApplyTable'

	import docPostHistoryTable from '../table/docPostHistoryTable'
	//DocDispatchHistoryTable
	export default {
		name: 'dispatchRegister',
		components: {
			postRegistrationTable,
			DocDispatchHistoryTable,
			postRegistrationSearchForm,
			sealApplyTable,
			docPostHistoryTable,
		},
		provide() {
			return {
				reload: this.reload,
			}
		},
		props: {
			nextStatus: {
				type: String,
			},
			status: {
				type: String,
				default: '0'
			}
		},
		data() {
			return {
				searchData: undefined,
				primary_key: -1,
				permission: {

					person_role: false,
					// person_role: {
					// 	person_role_manage: false,
					// },
					self: false,
				},
			}
		},
		computed: {

		},
		created: async function() {
			await this.init()
		},
		beforeDestroy() {},
		mounted: function() {},
		methods: {
			async init() {
				let permissionList = ['postRegistration', 'postingRecord', 'examinationAndapproval', 'sealLedger'];
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
				await this.fetchData()
			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			reload() {},
			handlExport() {},
			async fetchData() {
				this.$nextTick(() => {
					this.$refs['postRegistrationSearchForm'].refreshPermissionAbout()
					this.$refs['postRegistrationTable'].fetchData()
				})

			},
			search_main_fob(data) {
				//search
				this.$refs['postRegistrationTable'].search(data)
			},
		},
	}
</script>

<style>
	.el-form-item--small.el-form-item {
		margin-bottom: 10px
	}

	.vab-query-form {
		margin-bottom: 0px !important
	}
</style>
