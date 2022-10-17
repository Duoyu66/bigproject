<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" top="3vh" destroy-on-close>
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<MakeForm ref="MakeForm" :formData="form" :chemicalSelectStatus="chemicalSelectStatus"
				:rmSelectStatus="rmSelectStatus"></MakeForm>
		</div>
		<div slot="footer" class="dialog-footer">
			<!-- <div style="width: 100%">{{ ghost }}</div> -->
			<el-button type="primary" @click="handleUpdate">确 定</el-button>
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
	import MakeForm from '../form/MakeForm.vue'

	export default {
		name: 'RmMakeDialog',
		components: {
			MakeForm,
		},
		props: {
			chemicalSelectStatus: {
				type: Boolean,
				required: false,
				default: true
			},
			rmSelectStatus: {
				type: Boolean,
				required: false,
				default: false
			}
		},
		data() {
			return {
				ghost: {
					inEditMode: true,
				},
				dialogFormVisible: false,
				form: {},
				formLabelWidth: '120px',
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
				this.title += '标准物质制作记录'
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
			handleUpdate() {
				let that = this
				this.$refs['MakeForm'].save(function(status) {
					if (status) {
						that.close(undefined, true)
					}
				})
			},
		},
	}
</script>
