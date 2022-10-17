<template>
	<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
		<el-form-item style="">
			<el-select v-model="queryForm.org_type" style="border-radius: 30px,width: 100%">
				<el-option v-for="data in selectData.org_type" :key="data.value" :label="data.label"
					:value="data.value">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item style="">
			<el-select v-model="queryForm.approve" style="border-radius: 30px,width: 100%">
				<el-option v-for="data in selectData.approve" :key="data.value" :label="data.label"
					:value="data.value">
				</el-option>
			</el-select>
		</el-form-item>
		
		<el-form-item>
			<el-input v-model="queryForm.name" style="border-radius: 30px,width: 100%" placeholder="姓名">
			</el-input>
		</el-form-item>
		<el-form-item>
			<el-input v-model="queryForm.approver" style="border-radius: 30px,width: 100%"
				placeholder="审批人">
			</el-input>
		</el-form-item>
		<el-form-item style="">
			<el-date-picker v-model="queryForm.change_date" type="datetimerange"
				start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" :format='dateFormat'
				:value-format="dateFormat">
			</el-date-picker>
		</el-form-item>
		<el-form-item style="margin-right: 0px;">
			<el-button icon="el-icon-search" type="primary" @click="search">
		
			</el-button>
		</el-form-item>
		
		
	<!-- 	<el-row class="" style="">
			<el-col :span="span">
				<el-row class="" style="">
					<el-col :span="span2">
						<el-form-item style="">
							<el-select v-model="queryForm.org_type" style="border-radius: 30px,width: 100%">
								<el-option v-for="data in selectData.org_type" :key="data.value" :label="data.label"
									:value="data.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="span2">
						<el-form-item style="">
							<el-select v-model="queryForm.approve" style="border-radius: 30px,width: 100%">
								<el-option v-for="data in selectData.approve" :key="data.value" :label="data.label"
									:value="data.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="span2">
						<el-form-item style="">
							<el-date-picker v-model="queryForm.change_date" type="datetimerange"
								start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" :format='dateFormat'
								:value-format="dateFormat">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="span2">
						<el-form-item>
							<el-input v-model="queryForm.name" style="border-radius: 30px,width: 100%" placeholder="姓名">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="span2">
						<el-form-item>
							<el-input v-model="queryForm.approver" style="border-radius: 30px,width: 100%"
								placeholder="审批人">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="span4">
						<el-form-item>
							<el-button icon="el-icon-search" type="primary" @click="search">

							</el-button>
						</el-form-item>
					</el-col>
					<el-col :span="span3" v-if="false">
	
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
</template>

<script>
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
			}
		},
		data() {
			return {
				span: 24,
				span3: 2,
				span2: 6,
				span4: 2,
				dateFormat: dateFormat(1),
				selectData: {
					org_type: [{
						value: 1,
						label: '调出机构'
					}, {
						value: 2,
						label: '调入机构'
					}],
					approve: [{
						value: '',
						label: '请选择调动状态',
					}, {
						value: 0,
						label: '未审核'
					}, {
						value: 1,
						label: '已通过'
					}, {
						value: -1,
						label: '退回'
					}, {
						value: -2,
						label: '重审中'
					}, {
						value: -3,
						label: '作废'
					}]
				},
				queryForm: {
					change_date: '',
					org_type: 2,
					name: '',
					approve: '',
					approver: ''
				}
			}
		},
		created() {},
		methods: {
			handlExport() {

			},
			search() {
				if (typeof this.search_fob != 'undefined') {
					console.log(JSON.stringify(this.queryForm))
					this.search_fob(this.queryForm)
					console.log(JSON.stringify(this.queryForm))
				}
			}
		},
	}
</script>

<style>
</style>
