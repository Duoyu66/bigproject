<template>
	<div>
		<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
			<el-row class="" style="">
				<el-col :span="span">
					<el-row class="" style="">
						
						<el-col :span="span2">
							<el-form-item label="" label-width="0px">
								<el-input v-model="queryForm.sample_no" style="width: 100%" placeholder="样品编号"
									clearable>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item label="" label-width="0px">
								<el-input v-model="queryForm.order_id" style="width: 100%" placeholder="委托编号" clearable>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item label="" label-width="0px">
								<el-input v-model="queryForm.checkIn" style="width: 100%" placeholder="收样人"
									clearable>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="span2*2">
							<el-form-item label="" label-width="0px">
								<el-date-picker v-model="queryForm.order_date_start" type="date" placeholder="委托时间"
									style="width: 47%" :format='dateFormat' :value-format="dateFormat" clearable>
								</el-date-picker>
								-
								<el-date-picker v-model="queryForm.order_date_end" type="date" placeholder="委托时间"
									style="width: 47%" :format='dateFormat' :value-format="dateFormat" clearable>
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="span2*2">
							<el-form-item label="" label-width="0px">
								<el-date-picker v-model="queryForm.entry_time_start" type="date" placeholder="收样时间"
									style="width: 47%" :format='dateFormat' :value-format="dateFormat" clearable>
								</el-date-picker>
								-
								<el-date-picker v-model="queryForm.entry_time_end" type="date" placeholder="收样时间"
									style="width: 47%" :format='dateFormat' :value-format="dateFormat" clearable>
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="span2">
							<el-form-item label="" label-width="0px">
								<tree-select :options="selectData.object_idTree" :multiple="false" placeholder="请选择试验项目"
									:normalizer="normalizer" v-model="queryForm.object_id" :show-count="true"
									:disable-branch-nodes="true" style="width: 100%" />
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
		<!-- <dispatchRegisterDialog ref="dispatchRegisterDialog" :is-up-data.sync="main_dialog"></dispatchRegisterDialog> -->
	</div>

</template>

<script>
	import {
		hasPermission
	} from '@/utils/permission'
	// import dispatchRegisterDialog from '../components/dispatchRegisterDialog'
	import {
		format_fob,
		pickerOptions,
		getdayEx,
		getday,
		dateFormat,
	} from '@/utils/dateHelp'
	import TreeSelect from '@riophae/vue-treeselect'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	export default {
		name: 'sampleCollectSearchForm',
		model: {
			prop: 'value',
			event: 'on-change'
		},
		components: {
			TreeSelect
			//dispatchRegisterDialog
		},
		provide() {
			return {
				testDataReload: this.search,
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
			accepted: {
				type: String,
				default: '',
			},
			stage: {
				type: String,
				default: '',
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
				span2: 4,
				span4: 2,
				main_dialog: false,
				dateFormat: dateFormat(4),
				selectData: {
					object_id: [],
					object_idTree: [],
					conclusion: [{
						item_id: 0,
						item_name: '尚未评定'
					}, {
						item_id: 1,
						item_name: '合格'
					}, {
						item_id: 2,
						item_name: '不合格'
					}, {
						item_id: 3,
						item_name: '待复检'
					}],
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
				queryForm: {
					doc_id: '',
					docTitle: '',
					doc_no: '',
					degreeOfUrgency: '',
					incoming_date: ''
				}
			}
		},
		created() {
			this.init()
		},
		methods: {
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				await this.GetObjectName()
			},
			ishasPermission(name) {
				let permission_name = ''
				switch (name) {
					case 'add':
						permission_name = 'dispatchRegisterAdd'
						break
					case 'edit':
						permission_name = 'dispatchRegisterEdit'
						break
					case 'examin':
						permission_name = 'dispatchRegisterExamin'
						break
					case 'delete':
						permission_name = 'dispatchRegisterDelete'
						break
					default:
						permission_name = name
						break
				}
				//console.log(this.permission, permission_name);
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
						if (this.accepted == '0') {
							flag = true
						} else {
							flag = false
						}
						break;
					default:
						flag = flag
						break;
				}
				return flag
			},
			handlExport() {

			},
			handlAdd() {
				this.$refs['dispatchRegisterDialog'].showEdit()
			},
			search() {
				this.$emit('update:value', this.queryForm);
				this.$emit('on-change', this.queryForm);
				if (this.search_fob) {
					this.search_fob(this.queryForm)
				}
			},
			normalizer(node) {
				return {
					id: node.object_id,
					label: node.object_name,
					children: node.children,
				}
			},
			async GetObjectName() {
				let data = await this.$store.dispatch('testObject/GetList')
				this.$set(this.selectData, 'object_id', data)
				let object_idTree = await this.$store.dispatch('testObject/GetTreeAll')
				this.$set(this.selectData, 'object_idTree', object_idTree)
				return 1;
			},
		},
	}
</script>
<style>
	/* 	.el-select-dropdown {
		max-width: 243px;
	}

	.el-select-dropdown__item {
		display: inline-block;
	}

	.el-select-dropdown__item span {
		min-width: 205px;
		display: inline-block;
	} */
</style>
