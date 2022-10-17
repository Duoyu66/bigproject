<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" top="3vh" destroy-on-close >
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<materiaExamineAndVerifyCheckHistoryForm ref="materiaExamineAndVerifyCheckHistoryForm" :formData="form" type="show">
			</materiaExamineAndVerifyCheckHistoryForm>
		</div>
<!-- 		<div slot="footer">
			<div style="width: 100%">{{ ghost }}</div>
			<el-button type="primary" @click="close">关闭</el-button>
		</div> -->
	</el-dialog>
</template>
<script>

	import materiaExamineAndVerifyCheckHistoryForm from '../form/materiaExamineAndVerifyCheckHistoryForm.vue'

	export default {
		name: 'materiaExamineAndVerifyCheckDialog',
		components: {
			materiaExamineAndVerifyCheckHistoryForm,
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
				this.title += '核查记录'
				this.dialogFormVisible = true
				if (this.$refs['materiaExamineAndVerifyCheckHistoryForm']) {
					this.$refs['materiaExamineAndVerifyCheckHistoryForm'].init()
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
				if (this.$refs['materiaExamineAndVerifyCheckHistoryForm']) {
					this.$refs['materiaExamineAndVerifyCheckHistoryForm'].resetForm()
				}
				this.dialogFormVisible = false
			},
			handleUpdate() {
				let that = this
				this.$refs['materiaExamineAndVerifyCheckHistoryForm'].save(function(status) {
					if (status) {
						that.close(undefined, true)
					}
				})
			},
		},
	}
</script>
