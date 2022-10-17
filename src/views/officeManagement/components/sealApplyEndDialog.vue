<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="700px" @close="close" top="5vh">
		<div style="max-height: calc(100vh - 250px); overflow-y: auto">
			<sealApplyEndForm ref="sealApplyEndForm" :formData.sync="form" :type="0"></sealApplyEndForm>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import sealApplyEndForm from '../form/sealApplyEndForm'
	export default {
		name: 'sealApplyEndDialog',
		model: {
			prop: 'isUpData',
			event: 'on-change'
		},
		props: {
			//.sync同步
			isUpData: {
				type: Boolean,
				default: false
				//required: true,
			},
		},
		components: {
			sealApplyEndForm
		},
		data() {
			let that = this
			return {
				form: {

				},
				title: '',
				dialogFormVisible: false,
				formLabelWidth: '120px',
			}

		},
		created() {},
		methods: {
			showEdit(row, other_info) {
				console.log(row, other_info)
				let form = {}
				this.form = {}
				if (!row) {
					this.title = '登记'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
				}
				if (other_info) {
					form = Object.assign(form, other_info)
				}
				this.form = Object.assign(this.form, form)
				this.title = '确认用印记录'
				this.dialogFormVisible = true
			},
			close(status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}
				this.$refs['sealApplyEndForm'].close()
				this.dialogFormVisible = false
			},
			save() {
				let that = this
				this.$refs['sealApplyEndForm'].save(async (valid) => {
					if (valid) {
						that.close(true)
					}
				})
			},
		},


	}
</script>
