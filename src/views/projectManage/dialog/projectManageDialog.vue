<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="50%" @close="close" top="5vh">
		<div style="max-height: calc(100vh - 250px); overflow-y: auto">
			<projectManageForm ref="projectManageForm" :formData.sync="form" :type="0"></projectManageForm>
		</div>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import projectManageForm from '../form/projectManageForm'
	export default {
		name: 'projectManageDialog',
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
			projectManageForm
		},
		data() {
			let that = this
			return {
				form: {

				},
				title: '',
				dialogFormVisible: false,
			}

		},
		created() {},
		methods: {
			showEdit(row, person_info) {
				let form = {}
				this.form = {}
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
				}
				if (person_info) {
					form = Object.assign(form, person_info)
				}
				this.form = Object.assign(this.form, form)
				this.title += '项目'
				this.dialogFormVisible = true
			},
			close(event, status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}
				this.$refs['projectManageForm'].close()
				this.dialogFormVisible = false
			},
			save() {
				let that = this
				this.$refs['projectManageForm'].save(async (valid) => {
					if (valid) {
						that.close(undefined, true)
					}
				})
			},
		},


	}
</script>