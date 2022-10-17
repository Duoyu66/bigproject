<template>
	<div>
		<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
			<el-form-item label="" label-width="0px">
				<el-input v-model="queryForm.registration_number" style="width: 100%" placeholder="车牌" clearable>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="queryForm.driver" style="border-radius: 30px,width: 100%" placeholder="司机" clearable>
				</el-input>
			</el-form-item>
			<!-- <el-form-item>
				<el-input v-model="queryForm.addr" style="border-radius: 30px,width: 100%" placeholder="地址"></el-input>
			</el-form-item> -->
			<el-form-item style="">
				<el-select v-model="queryForm.status" style="border-radius: 30px" clearable>
					<el-option v-for="data in selectData.status" :key="data.key" :label="data.value"
						:value="data.key">
					</el-option>
				</el-select>
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
							<el-form-item label="" label-width="0px">
								<el-input v-model="queryForm.role_name" style="width: 100%" placeholder="角色名称">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item>
								<el-input v-model="queryForm.desc" style="border-radius: 30px,width: 100%"
									placeholder="描述信息"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item>
								<el-input v-model="queryForm.addr" style="border-radius: 30px,width: 100%"
									placeholder="地址"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="span2">
							<el-form-item style="">
								<el-select v-model="queryForm.enable" style="border-radius: 30px">
									<el-option v-for="data in selectData.enable" :key="data.value" :label="data.label"
										:value="data.value">
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
		<TruckDialog ref="TruckDialog" :is-up-data.sync="main_dialog"></TruckDialog>
	</div>

</template>

<script>
	import {
		hasPermission
	} from '@/utils/permission'
	import TruckDialog from '../dialog/TruckDialog'
	import {
		format_fob,
		pickerOptions,
		getdayEx,
		getday,
		dateFormat,
	} from '@/utils/dateHelp'
	export default {
		name: 'TrcuckManageSearch',
		model: {
			prop: 'value',
			event: 'on-change'
		},
		components: {
			TruckDialog
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
					status: [{
						key: 0,
						value: '报废'
					}, {
						key: 10,
						value: '停用'
					}, {
						key: 20,
						value: '维修'
					}, {
						key: 90,
						value: '空闲'
					}, {
						key: 91,
						value: '返程中'
					}, {
						key: 100,
						value: '使用中'
					}]
				},
				queryForm: {
					
				}
			}
		},
		created() {},
		methods: {
			ishasPermission(name) {
				let permission_name = ''
				switch (name) {
					case 'add':
						permission_name = 'TruckMangeAdd'
						break
					case 'edit':
						permission_name = 'TruckMangeDelete'
						break
					case 'delete':
						permission_name = 'TruckMangeEdit'
						break
					default:
						permission_name = name
						break
				}
				console.log(this.permission, permission_name);
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
				this.$refs['TruckDialog'].showEdit()
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
