<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close" top="8vh">
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<SuperviseVerificationForm ref="SuperviseVerificationForm" :form-data.sync="formData" :type="0">
			</SuperviseVerificationForm>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import SuperviseVerificationForm from '../form/SuperviseVerificationForm'

	export default {
		name: 'SuperviseVerificationDialog',
		components: {
			SuperviseVerificationForm,
		},
		model: {
			prop: 'isUpData',
			event: 'on-change',
		},
		props: {
			//.sync同步
			isUpData: {
				type: Boolean,
				default: false,
				//required: true,
			},
		},
		data() {
			let that = this
			return {
				formData: {},
				title: '',
				dialogFormVisible: false,
			}
		},

		created() {},
		methods: {
			showEdit(row, person_info) {
				this.formData = {}
				let form = {}
				if (row && row.supervisee_date) {
					this.title = '编辑验证记录'
				}else{
					this.title = '添加验证记录'
				}
				if (row) {
					form = Object.assign(form, row)
				} else {
				}
				if (person_info) {
					form = Object.assign(form, person_info)
				}
				this.formData = Object.assign(this.formData, form)
				this.dialogFormVisible = true
			},
			close() {
				this.$refs['SuperviseVerificationForm'].close()
				//this.$refs['form'].resetFields()
				//this.details = this.$options.data().details
				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},

			save() {
				let that = this
				that.$refs['SuperviseVerificationForm'].save(function(status) {
					if (status) {
						that.$emit('update:isUpData', !that.isUpData)
						that.$emit('on-change', !that.isUpData)
						that.close()
					}
				})
			},
		},
	}
</script>
