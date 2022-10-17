<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" top="3vh" destroy-on-close>
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<verificationPlanCheckHistoryForm ref="verificationPlanCheckHistoryForm" :formData="form" type="show">
			</verificationPlanCheckHistoryForm>
		</div>
		<div slot="footer" class="dialog-footer">
			<!-- <div style="width: 100%">{{ ghost }}</div> -->
			<el-button type="primary" @click="handleUpdate">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import verificationPlanCheckHistoryForm from '../form/verificationPlanCheckHistoryForm.vue'

	export default {
		name: 'verificationPlanCheckHistoryDialog',
		components: {
			verificationPlanCheckHistoryForm,
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
					this.title = '查看'
					form = Object.assign(form, row)
				}
				if (info) {
					form = Object.assign(form, info)
				}
				this.form = Object.assign(this.form, form)
				this.title += '校验记录'
				this.dialogFormVisible = true
				if (this.$refs['verificationPlanCheckHistoryForm']) {
					this.$refs['verificationPlanCheckHistoryForm'].init()
				}
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
				this.$refs['verificationPlanCheckHistoryForm'].save(function(status) {
					if (status) {
						that.close(undefined, true)
					}
				})
			},
		},
	}
</script>