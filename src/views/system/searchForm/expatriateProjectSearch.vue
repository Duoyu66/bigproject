<template>
	<div>
		<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
			<el-row class="" style="">
				<el-col :span="span">
					<el-row class="" style="">



						<el-col :span="span2">
							<el-form-item label="" label-width="0px">
								<el-input v-model="queryForm.org_name" style="width: 100%" placeholder="机构名称">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item>
								<el-select v-model="queryForm.out_org_status" style="width: 100%">
									<el-option v-for="data in selectData.out_org_status" :key="data.custom"
										:label="data.item_name" :value="data.custom">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="span4">
							<el-form-item>
								<el-button icon="el-icon-search" type="primary" @click="search">

								</el-button>
							</el-form-item>
						</el-col>
						<el-col :span="span3" v-show="ishasPermission('add')">
							<!-- <vab-query-form-right-panel> -->
							<el-form-item>
								<el-button icon="el-icon-plus" type="primary" @click="handlAdd">
								</el-button>
							</el-form-item>
							<!-- </vab-query-form-right-panel> -->
						</el-col>
						<el-col :span="span3" v-show="false">
							<!-- <vab-query-form-right-panel> -->
							<el-form-item>
								<el-button icon="el-icon-document-add" type="primary" @click="handlExport">
									导出
								</el-button>
							</el-form-item>
							<!-- </vab-query-form-right-panel> -->
						</el-col>

					</el-row>
					<!-- </vab-query-form-left-panel> -->
				</el-col>
			</el-row>
		</el-form>
		<branchInstitutionsDialog ref="branchInstitutionsDialog" :is-up-data.sync="main_dialog" :type="2">
		</branchInstitutionsDialog>
	</div>

</template>

<script>
	import {
		GetGroupData,
		GetGroupDataEx
	} from '@/utils/htmlDataGroup'
	import {
		hasPermission
	} from '@/utils/permission'
	import branchInstitutionsDialog from '../components/expatriateProjectDialog'
	import {
		format_fob,
		pickerOptions,
		getdayEx,
		getday,
		dateFormat,
	} from '@/utils/dateHelp'
	export default {
		name: 'outsourcingOrganization',
		model: {
			prop: 'value',
			event: 'on-change'
		},
		components: {
			branchInstitutionsDialog
		},
		provide() {
			return {
				reload: this.search,
			}
		},
		props: {
			//.sync同步
			value: {
				type: Object,
				default: function() {
					return undefined
				},
				//required: true,
			},
			search_fob: {
				type: Function,
				default: function() {

				}
			},
			permission: {
				type: Object,
				default: function() {
					return {}
				},
			},
		},
		watch: {
			main_dialog(newVal, oldVal) {
				this.search()
			},
		},
		data() {
			return {
				span: 24,
				span3: 2,
				span2: 6,
				span4: 2,
				main_dialog: false,
				dateFormat: dateFormat(1),
				out_Org_Status: false,
				test: 'true',
				selectData: {
					out_org_status: []
				},
				queryForm: {
					org_name: '',
				}
			}
		},
		created() {
			this.GetGroup()
		},
		methods: {
			ishasPermission(name) {
				let permission_name = ''
				switch (name) {
					case 'add':
						permission_name = 'expatriateProjectAdd'
						break
					case 'edit':
						permission_name = 'expatriateProjectEdit'
						break
					case 'delete':
						permission_name = 'expatriateProjectDelete'
						break
					default:
						permission_name = name
						break
				}
				//console.log(this.permission, permission_name);
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				if (role_max == 'super_admin') {
					flag = true
					return flag
				}
				switch (name) {
					default:
						flag = flag
						break;
				}
				return flag
			},
			async GetGroup() {
				let that = this
				let list = [{
					data: "org_type",
					group_id: 1010
				}, {
					data: "out_org_status",
					group_id: 1011
				}];
				await GetGroupDataEx(this, list)
			},
			handlExport() {

			},
			handlAdd() {
				this.$refs['branchInstitutionsDialog'].showEdit(undefined, undefined, {
					outOrgStatus: true,
					table_type: "1"
				})
			},
			search() {
				this.$emit('update:value', this.queryForm);
				this.$emit('on-change', this.queryForm);
				if (this.search_fob) {
					this.search_fob(this.queryForm)
				}
			}
		},
	}
</script>

<style>
</style>
