<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" top="3vh" destroy-on-close>
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<roomDefintionForm ref="roomDefintionForm" :formData="form"></roomDefintionForm>
		</div>
		<div slot="footer" class="dialog-footer">
			<!-- <div style="width: 100%">{{ ghost }}</div> -->
			<el-button type="primary" @click="handleUpdate">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import roomDefintionForm from '../form/roomDefintionForm.vue'

	export default {
		name: 'roomDefintionFormDialog',
		components: {
			roomDefintionForm,
		},
		data() {
			return {
				dialogFormVisible: false,
				form: {},
				formLabelWidth: '120px',
				title: '',
			}
		},
		created() {},
		methods: {
			showEdit(row, info) {
				console.log(row, info)
				let form = {}
				//this.form = {}
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
				}
				if (info) {
					form = Object.assign(form, info)
				}
				this.form = Object.assign({}, this.form, form)
				this.title += '检测室定义'
				this.dialogFormVisible = true
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
				this.$refs['roomDefintionForm'].save(function(status) {
					if (status) {
						that.close(undefined, true)
					}
				})
			},
		},
	}
</script>
