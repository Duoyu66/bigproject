<template>
	<div>
		<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>

			<el-form-item label="" label-width="0px">
				<el-input v-model="queryForm.ext_name" style="width: 100%" placeholder="外委机构名称">
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="queryForm.ext_item" style="border-radius: 30px,width: 100%"
					placeholder="检测项目"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="queryForm.addr" style="border-radius: 30px,width: 100%"
					placeholder="地址"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="queryForm.contacts" style="border-radius: 30px,width: 100%"
					placeholder="联系人"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="queryForm.tel" style="border-radius: 30px,width: 100%"
					placeholder="联系电话"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="queryForm.contract_no" style="border-radius: 30px,width: 100%"
					placeholder="合同编号"></el-input>
			</el-form-item>
			<el-form-item style="">
				<el-date-picker v-model="queryForm.start_date" type="datetimerange"
					start-placeholder="生效日期" end-placeholder="生效日期" style="width: 100%"
					:format='dateFormat' :value-format="dateFormat">
				</el-date-picker>
			</el-form-item>
			<el-form-item style="">
				<el-date-picker v-model="queryForm.end_date" type="datetimerange"
					start-placeholder="失效日期" end-placeholder="失效日期" style="width: 100%"
					:format='dateFormat' :value-format="dateFormat">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button icon="el-icon-search" type="primary" @click="search">
			
				</el-button>
			</el-form-item>
			<el-form-item v-show="ishasPermission('add')">
				<el-button icon="el-icon-plus" type="primary" @click="handlAdd">
				</el-button>
			</el-form-item>
			<el-form-item v-if="false">
				<el-button icon="el-icon-document-add" type="primary" @click="handlExport">
					导出
				</el-button>
			</el-form-item>
			
			
			<!-- <el-row class="" style="">
				<el-col :span="span">
					<el-row class="" style="">
						<el-col :span="span2">
							<el-form-item style="">
								<el-date-picker v-model="queryForm.start_date" type="datetimerange"
									start-placeholder="生效日期" end-placeholder="生效日期" style="width: 100%"
									:format='dateFormat' :value-format="dateFormat">
								</el-date-picker>
							</el-form-item>
						</el-col>

						<el-col :span="span2">
							<el-form-item style="">
								<el-date-picker v-model="queryForm.end_date" type="datetimerange"
									start-placeholder="失效日期" end-placeholder="失效日期" style="width: 100%"
									:format='dateFormat' :value-format="dateFormat">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item label="" label-width="0px">
								<el-input v-model="queryForm.ext_name" style="width: 100%" placeholder="外委机构名称">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item>
								<el-input v-model="queryForm.ext_item" style="border-radius: 30px,width: 100%"
									placeholder="检测项目"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item>
								<el-input v-model="queryForm.addr" style="border-radius: 30px,width: 100%"
									placeholder="地址"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item>
								<el-input v-model="queryForm.contacts" style="border-radius: 30px,width: 100%"
									placeholder="联系人"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item>
								<el-input v-model="queryForm.tel" style="border-radius: 30px,width: 100%"
									placeholder="联系电话"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item>
								<el-input v-model="queryForm.contract_no" style="border-radius: 30px,width: 100%"
									placeholder="合同编号"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span4">
							<el-form-item>
								<el-button icon="el-icon-search" type="primary" @click="search">

								</el-button>
							</el-form-item>
						</el-col>
						<el-col :span="span3" v-show="ishasPermission('add')">
							<el-form-item>
								<el-button icon="el-icon-plus" type="primary" @click="handlAdd">
								</el-button>
							</el-form-item>
						</el-col>
						<el-col :span="span3" v-show="false">
							<el-form-item>
								<el-button icon="el-icon-document-add" type="primary" @click="handlExport">
									导出
								</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-col>
			</el-row> -->
		</el-form>
		<ExOrganizationDialog ref="ExOrganizationDialog" :is-up-data.sync="main_dialog"></ExOrganizationDialog>
	</div>

</template>

<script>
	import {
		hasPermission
	} from '@/utils/permission'
	import ExOrganizationDialog from '../components/ExOrganizationDialog'
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
			ExOrganizationDialog
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
				selectData: {
					reward_status: [{
							value: '',
							label: '请选择'
						}, {
							value: 0,
							label: '待整改'
						}, {
							value: 1,
							label: '待重新改正'
						}, {
							value: 10,
							label: '待验证'
						}, {
							value: 11,
							label: '待重新验证'
						}, {
							value: 20,
							label: '整改完毕'
						},

					]
				},
				queryForm: {
					ext_name: '',
					ext_item: '',
					addr: '',
					contacts: '',
					tel: '',
					start_date: '',
					end_date: '',
					contract_no: '',

				}
			}
		},
		created() {},
		methods: {
			ishasPermission(name) {
				let permission_name = ''
				switch (name) {
					case 'add':
						permission_name = 'outsourcingOrganizatioAdd'
						break
					case 'edit':
						permission_name = 'outsourcingOrganizationEdit'
						break
					case 'delete':
						permission_name = 'outsourcingOrganizationDelete'
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
			handlExport() {

			},
			handlAdd() {
				this.$refs['ExOrganizationDialog'].showEdit()
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
