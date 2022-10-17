<template>
	<div class="table-container purchase">
		<el-row :gutter="20">
			<el-col :xs="10" :sm="10" :md="12" :lg="12" :xl="12" class="baseBox">
				<vab-query-form>
					<div style="float: left;">
						<el-button type="primary" @click="handleAdd">添加项目分类</el-button>
					</div>
					<vab-query-form-right-panel style="width: 60%;float: right;">
						<el-form ref="form" :model="search.main" :inline="true" @submit.native.prevent>
							<el-form-item>
								<el-input style="border-radius: 30px" v-model="search.main.object_name"
									placeholder="按项目名称搜索" clearable>
									<el-button slot="append" icon="el-icon-search" type="primary" @click="searchMain">
									</el-button>
								</el-input>
							</el-form-item>
						</el-form>
					</vab-query-form-right-panel>
				</vab-query-form>
				<projectDataGroupTable style="height: calc(100vh - 211px); min-height: 300px; margin-top: 10px;" :group_id.sync="group_id"
					:permission="permission" type="main_table" ref="main_table"></projectDataGroupTable>
			</el-col>
			<el-col :xs="14" :sm="14" :md="12" :lg="12" :xl="12" style="padding-left:10px;">
				<div class="baseBox">
					<div v-if="group_id>0">
						<vab-query-form>

							<vab-query-form-right-panel style="width: 100%">
								<el-form ref="form" :model="search.side" :inline="true" @submit.native.prevent>
									<el-form-item>
										<el-input style="border-radius: 30px" v-model="search.side.object_name"
											placeholder="按项目名称搜索" clearable>
											<el-button slot="append" icon="el-icon-search" @click="searchSide">
											</el-button>
										</el-input>
									</el-form-item>
								</el-form>
							</vab-query-form-right-panel>
						</vab-query-form>

						<projectDataGroupTable style="height: calc(100vh - 211px); min-height: 300px;margin-top: 10px;"
							:group_id.sync="group_id" :permission="permission" type="side_table" ref="side_table">
						</projectDataGroupTable>
					</div>
					<el-empty v-else description="请选择分组"></el-empty>
				</div>
			</el-col>
		</el-row>

		<projectDataGroupDialog ref="projectDataGroupDialog" @fencthRelod="fencthRelod"></projectDataGroupDialog>
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
	import projectDataGroupDialog from '../component/projectDataGroupDialog'
	// import TableEdit1 from '../components/dataDictionary1.vue'
	import projectDataGroupTable from '../table/projectDataGroupTable.vue'
	export default {
		name: 'sysDataGroup',
		components: {
			projectDataGroupDialog,
			projectDataGroupTable
		},
    provide() {
    	return {
    		objectReload: this.MainTableRaload,
    		reload: this.fetchData,
    	}
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
				let permissionList = ['projectDataGroup'];
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
      handleAdd() {
      	this.formShow(undefined, {
      		group_id: '0',

      	})
      },
      formShow(row, info) {
      	this.$refs['projectDataGroupDialog'].showEdit(row, info)
      },
      MainTableRaload() {
      	this.$nextTick(() => {
      		this.$refs['main_table'].search(this.search.main)
      	})
      },
			searchMain() {
				this.$refs['main_table'].search(this.search.main)
			},
			searchSide() {
				this.$refs['side_table'].search(this.search.side)
			},
			// handleAdd() {
			// 	this.$refs['projectDataGroupDialog'].showEdit()
			// }
		},
	}
</script>
<style>
	.el-row {
		margin-left: 0px !important;
		margin-right: 0px !important;
	}
</style>
