<template>
	<div>
		<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
			<el-form-item label="" label-width="0px">
				<el-input v-model="queryForm.doc_id" style="width: 100%" placeholder="发文编号" clearable>
				</el-input>
			</el-form-item>
			<el-form-item label="" label-width="0px">
				<el-input v-model="queryForm.docTitle" style="width: 100%" placeholder="公文标题"clearable>
				</el-input>
			</el-form-item>
			<el-form-item label="" label-width="0px">
				<el-select v-model="queryForm.degreeOfUrgency" placeholder="紧急程度" style="width: 100%" clearable
					filterable allow-create>
					<el-option v-for="data in selectData.degreeOfUrgency" :key="data.item_name" :label="data.item_name"
						:value="data.item_name">
					</el-option>
				</el-select>
				<!-- <el-input v-model="queryForm.degreeOfUrgency" style="width: 100%" placeholder="紧急程度" clearable> -->
				</el-input>
			</el-form-item>
			<el-form-item label="" label-width="0px">
				<el-input v-model="queryForm.draftPersson" style="width: 100%" placeholder="起草人" clearable>
				</el-input>
			</el-form-item>
			<el-form-item label="" label-width="0px">
				<el-input v-model="queryForm.outgoing_org" style="width: 100%" placeholder="收文部门" clearable>
				</el-input>
			</el-form-item>
			<el-form-item label="" label-width="0px">
				<el-date-picker v-model="queryForm.draftDate" type="datetimerange" start-placeholder="起草时间"
					end-placeholder="起草时间" style="width: 100%" :format='dateFormat' :value-format="dateFormat">
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
							<el-form-item label="" label-width="0px">
								<el-input v-model="queryForm.doc_id" style="width: 100%" placeholder="发文编号">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item label="" label-width="0px">
								<el-input v-model="queryForm.docTitle" style="width: 100%" placeholder="公文标题">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item label="" label-width="0px">
								<el-input v-model="queryForm.degreeOfUrgency" style="width: 100%" placeholder="紧急程度">
								</el-input>
							</el-form-item>
						</el-col>

						<el-col :span="span2">
							<el-form-item label="" label-width="0px">
								<el-input v-model="queryForm.draftPersson" style="width: 100%" placeholder="起草人">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item label="" label-width="0px">
								<el-date-picker v-model="queryForm.draftDate" type="datetimerange"
									start-placeholder="起草时间" end-placeholder="起草时间" style="width: 100%"
									:format='dateFormat' :value-format="dateFormat">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="span4">
							<el-form-item>
								<el-button icon="el-icon-search" type="primary" @click="search">

								</el-button>
							</el-form-item>
						</el-col>
						<el-col :span="span3" v-show="permission_list.add">
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
		<postRegistrationDialog ref="postRegistrationDialog" :is-up-data.sync="main_dialog"></postRegistrationDialog>
	</div>

</template>

<script>
	import {
		GetGroupData,
		GetGroupDataEx
	} from "@/utils/htmlDataGroup";
	import {
		hasPermission
	} from '@/utils/permission'
	import postRegistrationDialog from '../components/postRegistrationDialog'
	import {
		format_fob,
		pickerOptions,
		getdayEx,
		getday,
		dateFormat,
	} from '@/utils/dateHelp'
	export default {
		name: 'postRegistrationSearchForm',
		model: {
			prop: 'value',
			event: 'on-change'
		},
		components: {
			postRegistrationDialog
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
			nextStatus: {
				type: String,
				default: '起草',
			},
			status: {
				type: String,

			}
		},
		watch: {
			main_dialog(newVal, oldVal) {
				this.search()
			},
			permission() {

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
					degreeOfUrgency:[],
					enable: [{
						value: '',
						label: '请选择'
					}, {
						value: 0,
						label: '禁用'
					}, {
						value: 1,
						label: '启用'
					}]
				},
				permission_list: {
					add: false
				},
				queryForm: {
					doc_id: '',
					docTitle: '',
					draftDate: ''
				}
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				this.refreshPermissionAbout()
				this.groupGet();
			},
			async groupGet() {
				let list = [{
					data: "degreeOfUrgency",
					group_id: 1015,
				}, ];
				await GetGroupDataEx(this, list);
			},
			refreshPermissionAbout() {
				let list = ['add']
				let that = this
				this.$nextTick(() => {
					for (let i = 0; i < list.length; i++) {
						let name = list[i]
						if (that.permission_list[name]) {
							continue
						}
						that.permission_list[name] = that.ishasPermission(name);
					}
				})
			},
			ishasPermission(name) {
				let permission_name = ''

				switch (name) {
					case 'add':
						permission_name = 'postRegistrationAdd'
						break
					case 'edit':
						permission_name = 'postRegistrationEdit'
						break
					case 'examin':
						permission_name = 'postExamine'
						break
					case 'delete':
						permission_name = 'postRegistrationDelete'
						break
					case 'draftAllPerson':
						permission_name = 'postdraftAllPerson'
						break
					case 'ExamineAllPerson':
						permission_name = 'postExamineAllPerson'
						break
					default:
						permission_name = name
						break
				}
				let flag = hasPermission(this.permission, permission_name)

				let role_max = this.role_max
				if (role_max == 'super_admin') {
					//flag = true
					//return flag
				}
				if (!flag) {
					return flag
				}
				switch (name) {
					case 'add':
						if (this.nextStatus == '起草' || !this.nextStatus) {
							flag = true
						} else {
							flag = false
						}
						break
					default:
						flag = flag
						break;
				}
				return flag
			},
			handlExport() {

			},
			handlAdd() {
				this.$refs['postRegistrationDialog'].showEdit()
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
