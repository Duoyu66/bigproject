<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" top="3vh" destroy-on-close>
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<roomVideoForm ref="roomVideoForm" :formData="form"></roomVideoForm>
		</div>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<!-- <div style="width: 100%">{{ ghost }}</div> -->
			<el-button type="primary" @click="handleUpdate">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import roomVideoForm from '../form/roomVideoForm.vue'

	export default {
		name: 'roomVideoDialog',
		components: {
			roomVideoForm,
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
				this.title += '摄像头'
				if (this.$refs['roomVideoForm']) {
					this.$refs['roomVideoForm'].init()
				}
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
				this.$refs['roomVideoForm'].save(function(status) {
					if (status) {
						that.close(undefined, true)
					}
				})
			},
		},
	}
</script>
