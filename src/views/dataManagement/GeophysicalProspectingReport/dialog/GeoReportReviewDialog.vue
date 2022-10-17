<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" top="3vh" destroy-on-close :width="Width">

		<el-row>
			<el-col :span="12">
				<div style="max-height: calc(100vh - 220px); overflow-y: auto">
					<GeophysicalProspectingReportForm ref="GeophysicalProspectingReportForm" :formData="form"
						:type='10'>
					</GeophysicalProspectingReportForm>
				</div>
			</el-col>
			<el-col :span="12">
				<div style="max-height: calc(100vh - 290px); overflow-y: auto">
					<GeoExaminationProcessForm ref="examineForm" :formData.sync="examineForm" :type="0" :status="10">
					</GeoExaminationProcessForm>
				</div>
			</el-col>
		</el-row>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<!-- <div style="width: 100%">{{ ghost }}</div> -->
			<el-button type="primary" @click="handleOnlySave">保存</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import zcm_date from '@/api/date'
	import {
		update_fob
	} from '@/global/form.helper'
	import {
		doEdit
	} from '@/api/table'
	import GeophysicalProspectingReportForm from '../form/GeophysicalProspectingReportForm'
	import GeoExaminationProcessForm from '../form/GeoExaminationProcessForm'
	export default {
		name: 'GeoReportExamineDialog',
		components: {
			GeophysicalProspectingReportForm,
			GeoExaminationProcessForm
		},
		computed: {
			Width() {
				let width = window.innerWidth;
				let result = '70%';
				if (width > 800) {
					result = '70%';
				} else {
					result = width * 0.7;
					if (result < 600) {
						result = width;
					}
					result = result + 'px';
				}
				return result;
			}
		},
		data() {
			return {
				examineForm: {
					report_id: ''
				},
				dialogFormVisible: false,
				form: {},
				title: '',
			}
		},
		created() {},
		methods: {
			showEdit(row, info) {
				let form = {}
				this.form = {}
				this.title = '';
				if (!row) {
					//this.title = '添加'
				} else {
					//this.title = '编辑'
					form = Object.assign(form, row)
				}
				if (info) {
					form = Object.assign(form, info)
				}
				this.form = Object.assign(this.form, form)
				let temp = {
					report_id: form.report_id
				}
				this.examineForm = Object.assign(this.examineForm, temp)
				this.title += '物探报告记录复核'
				this.dialogFormVisible = true
			},
			close(event, stauts) {
				if (stauts) {
					this.$emit('reloadChildren');
					this.$emit('reload');
				}
				this.dialogFormVisible = false
			},
			handleOnlySave() {
				this.HandleSave(false);
			},
			handleSaveAndSubmit() {
				this.HandleSave(true);
			},
			HandleSave(isSubmit) {
				let that = this
				this.$refs['examineForm'].save(isSubmit, function(status) {
					if (status) {
						that.close(undefined, true)
					}
				})
			},

		},
	}
</script>
