<template>
	<div>
		<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
			<el-form-item>
				<el-input v-model="queryForm.supervisee_name" style="border-radius: 30px,width: 100%"
					placeholder="被监管者"></el-input>
			</el-form-item>
			<el-form-item style="">
				<el-date-picker v-model="queryForm.supervisee_date" type="datetimerange" start-placeholder="改正开始日期"
					end-placeholder="改正结束日期" style="width: 100%" :format='dateFormat' :value-format="dateFormat">
				</el-date-picker>
			</el-form-item>
			<el-form-item style="">
				<el-date-picker v-model="queryForm.supervision_date" type="datetimerange" start-placeholder="监督开始日期"
					end-placeholder="监督结束日期" style="width: 100%" :format='dateFormat' :value-format="dateFormat">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-input v-model="queryForm.supervision_name" style="border-radius: 30px,width: 100%"
					placeholder="监管者">
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="queryForm.verifier_name" style="border-radius: 30px,width: 100%" placeholder="验证者">
				</el-input>
			</el-form-item>
			<el-form-item style="">
				<el-date-picker v-model="queryForm.verification_date" type="datetimerange" start-placeholder="验证开始日期"
					end-placeholder="验证结束日期" style="width: 100%" :format='dateFormat' :value-format="dateFormat">
				</el-date-picker>
			</el-form-item>
			<el-form-item style="">
				<el-select v-model="queryForm.reward_status" style="border-radius: 30px">
					<el-option v-for="data in selectData.reward_status" :key="data.value" :label="data.label"
						:value="data.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button icon="el-icon-search" type="primary" @click="search">

				</el-button>
			</el-form-item>
			<el-form-item>
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
							<el-form-item>
								<el-input v-model="queryForm.supervisee_name" style="border-radius: 30px,width: 100%"
									placeholder="被监管者"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item style="">
								<el-date-picker v-model="queryForm.supervisee_date" type="datetimerange"
									start-placeholder="改正开始日期" end-placeholder="改正结束日期" style="width: 100%"
									:format='dateFormat' :value-format="dateFormat">
								</el-date-picker>
							</el-form-item>
						</el-col>

						<el-col :span="span2">
							<el-form-item style="">
								<el-date-picker v-model="queryForm.supervision_date" type="datetimerange"
									start-placeholder="监督开始日期" end-placeholder="监督结束日期" style="width: 100%"
									:format='dateFormat' :value-format="dateFormat">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item>
								<el-input v-model="queryForm.supervision_name" style="border-radius: 30px,width: 100%"
									placeholder="监管者">
								</el-input>
							</el-form-item>
						</el-col>

						<el-col :span="span2">
							<el-form-item>
								<el-input v-model="queryForm.verifier_name" style="border-radius: 30px,width: 100%"
									placeholder="验证者">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item style="">
								<el-date-picker v-model="queryForm.verification_date" type="datetimerange"
									start-placeholder="验证开始日期" end-placeholder="验证结束日期" style="width: 100%"
									:format='dateFormat' :value-format="dateFormat">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item style="">
								<el-select v-model="queryForm.reward_status" style="border-radius: 30px">
									<el-option v-for="data in selectData.reward_status" :key="data.value"
										:label="data.label" :value="data.value">
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
						<el-col :span="span3" v-show="ishasPermission('supervise')">
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
			</el-row>-->
		</el-form>
		<SuperviseCheckingDialog ref="SuperviseCheckingDialog" :is-up-data.sync="main_dialog"></SuperviseCheckingDialog>
	</div>

</template>

<script>
	import {
		hasPermission,
		PermissionSubtableDeal
	} from '../js/permission'
	import SuperviseCheckingDialog from '../components/SuperviseCheckingDialog'
	import {
		format_fob,
		pickerOptions,
		getdayEx,
		getday,
		dateFormat,
	} from '@/utils/dateHelp'
	export default {
		name: 'personelStaffAllocationSearch',
		model: {
			prop: 'value',
			event: 'on-change'
		},
		components: {
			SuperviseCheckingDialog
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
					supervisee_name: '',
					supervision_name: '',
					verifier_name: '',
					supervision_date: '',
					reward_status: '',
				}
			}
		},
		created() {},
		methods: {
			ishasPermission(name) {
				let permission_name = ''
				switch (name) {
					case 'supervise':
						permission_name = 'person_supervise_add'
						break
					case 'check':
						permission_name = 'person_supervise_check'
						break
					case 'delete':
						permission_name = 'person_supervise_delete'
						break
					default:
						permission_name = name
						break
				}
				console.log('ishasPermission', this.permission)
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				return flag
			},
			handlExport() {

			},
			handlAdd() {
				this.$refs['SuperviseCheckingDialog'].showEdit()
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
