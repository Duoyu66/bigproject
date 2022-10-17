<template>
	<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
		<el-form-item style="">
			<el-input style="border-radius: 30px" v-model="queryForm.name" placeholder="人员名称" />
		</el-form-item>
		
		<el-form-item style="">
			<el-input style="border-radius: 30px" v-model="queryForm.cert_name" placeholder="证书名称" />
		</el-form-item>
		
<!-- 		<el-form-item style="">
			<el-input style="border-radius: 30px" v-model="queryForm.cert_name" placeholder="证书名称" />
		</el-form-item> -->
		<el-form-item style="">
			<el-input style="border-radius: 30px" v-model="queryForm.cert_id" placeholder="证书编号" />
		</el-form-item>
		<el-form-item>
			<el-date-picker v-model="queryForm.validate_from" type="daterange" start-placeholder="有效开始日期范围"
				end-placeholder="有效开始日期范围" style="width: 100%">
			</el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-date-picker v-model="queryForm.validate_to" type="daterange" start-placeholder="有效结束日期范围"
				end-placeholder="有效结束日期范围" style="width: 100%"></el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-button icon="el-icon-search" type="primary" @click="search">

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
							<el-input style="border-radius: 30px" v-model="queryForm.name" placeholder="人员名称" />
						</el-form-item>
					</el-col>
					<el-col :span="span2">
						<el-form-item>
							<el-date-picker v-model="queryForm.validate_from" type="daterange"
								start-placeholder="有效开始日期" end-placeholder="有效开始日期" style="width: 100%">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="span2">
						<el-form-item>
							<el-date-picker v-model="queryForm.validate_to" type="daterange" start-placeholder="有效结束日期"
								end-placeholder="有效结束日期" style="width: 100%"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="span2">
						<el-form-item style="">
							<el-input style="border-radius: 30px" v-model="queryForm.cert_name" placeholder="证书名称" />
						</el-form-item>
					</el-col>
					<el-col :span="span2">
						<el-form-item style="">
							<el-input style="border-radius: 30px" v-model="queryForm.cert_id" placeholder="证书编号" />
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
					name: '',
					cert_name: '',
					cert_id: '',
					validate_to: '',
					validate_from: ''
				}
			}
		},
		created() {},
		methods: {
			handlExport() {

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
