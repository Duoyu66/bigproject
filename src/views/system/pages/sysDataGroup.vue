<template>
	<div class="table-container purchase">
		<el-row :gutter="20">
			<el-col :xs="10" :sm="10" :md="12" :lg="10" :xl="8" class="baseBox">
				<vab-query-form>
					<div style="float: left;">
						<el-button type="primary" @click="handleAdd">添加字典分组</el-button>
					</div>
					<vab-query-form-right-panel style="width: 60%;float: right;">
						<el-form ref="form" :model="search.main" :inline="true" @submit.native.prevent>
							<el-form-item>
								<el-input style="border-radius: 30px" v-model="search.main.item_name"
									placeholder="按字典名称搜索" clearable>
									<el-button slot="append" icon="el-icon-search" type="primary" @click="searchMain">
									</el-button>
								</el-input>
							</el-form-item>
						</el-form>
					</vab-query-form-right-panel>
				</vab-query-form>
				<sysDataGroupTable style="height: calc(100vh - 211px); min-height: 300px" :group_id.sync="group_id"
					:permission="permission" type="main_table" ref="main_table"></sysDataGroupTable>
			</el-col>
			<el-col :xs="14" :sm="14" :md="12" :lg="14" :xl="16" style="padding-left:10px;">
				<div class="baseBox">
					<div v-if="group_id>0">
						<vab-query-form>

							<vab-query-form-right-panel style="width: 100%">
								<el-form ref="form" :model="search.side" :inline="true" @submit.native.prevent>
									<el-form-item>
										<el-input style="border-radius: 30px" v-model="search.side.item_name"
											placeholder="按字典名称搜索" clearable>
											<el-button slot="append" icon="el-icon-search" @click="searchSide">
											</el-button>
										</el-input>
									</el-form-item>
								</el-form>
							</vab-query-form-right-panel>
						</vab-query-form>

						<sysDataGroupTable style="height: calc(100vh - 211px); min-height: 300px"
							:group_id.sync="group_id" :permission="permission" type="side_table" ref="side_table">
						</sysDataGroupTable>
					</div>
					<el-empty v-else description="请选择分组"></el-empty>
				</div>
			</el-col>
		</el-row>

		<sysDataGroupDialog ref="sysDataGroupDialog" @fencthRelod="fencthRelod"></sysDataGroupDialog>
		<!-- <table-edit1 ref="edit1"></table-edit1> -->
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
	import {
		TreeDataDeal,
		TreeDataDealEx
	} from '@/global/tree_deal'
	import sysDataGroupDialog from '../component/sysDataGroupDialog'
	// import TableEdit1 from '../components/dataDictionary1.vue'
	import sysDataGroupTable from '../table/sysDataGroupTable.vue'
	export default {
		name: 'sysDataGroup',
		components: {
			sysDataGroupDialog,
			sysDataGroupTable
		},

		data() {
			return {
				group_id: -1,
				search: {
					main: {
						item_name: ''
					},
					side: {
						item_name: ''
					}
				},
				permission: {

				}
			}
		},
		computed: {
			height() {
				return this.$baseTableHeight() + 100
			},
		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {

		},
		methods: {
			async init() {
				let permissionList = ['sysDataGroup'];
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
				console.log(this.permission)
			},
			fencthRelod() {
				this.searchMain()
			},
			searchMain() {
				this.$refs['main_table'].search(this.search.main)
			},
			searchSide() {
				this.$refs['side_table'].search(this.search.side)
			},
			handleAdd() {
				this.$refs['sysDataGroupDialog'].showEdit()
			}
		},
	}
</script>
<style>
	.el-row {
		margin-left: 0px !important;
		margin-right: 0px !important;
	}
</style>
