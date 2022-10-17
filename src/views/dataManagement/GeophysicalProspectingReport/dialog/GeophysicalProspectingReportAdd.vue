<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" top="3vh" destroy-on-close>
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<GeophysicalProspectingReportForm ref="GeophysicalProspectingReportForm" :formData="form">
			</GeophysicalProspectingReportForm>
		</div>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<!-- <div style="width: 100%">{{ ghost }}</div> -->
			<el-button type="primary" @click="handleOnlySave">保存</el-button>
			<el-button type="primary" @click="handleSaveAndSubmit">保存并提交</el-button>
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

	export default {
		name: 'GeophysicalProspectingReportDialog',
		components: {
			GeophysicalProspectingReportForm,
		},
		data() {
			return {
				ghost: {
					inEditMode: true,
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
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
				}
				if (info) {
					form = Object.assign(form, info)
				}
				this.form = Object.assign(this.form, form)
				this.title += '物探报告记录'
				this.dialogFormVisible = true
			},
			update_ghost(a) {
				this.ghost = a
				return 'success'
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
				this.$refs['GeophysicalProspectingReportForm'].save(isSubmit, function(status) {
					if (status) {
						that.close(undefined, true)
					}
				})
			},

		},
	}
</script>
