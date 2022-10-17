<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<SuperviseSuperviseeForm ref="SuperviseSuperviseeForm" :form-data.sync="formData" :type="0">
			</SuperviseSuperviseeForm>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import SuperviseSuperviseeForm from '../form/SuperviseSuperviseeForm'

	export default {
		name: 'SuperviseSuperviseeDialog',
		components: {
			SuperviseSuperviseeForm,
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
					this.title = '编辑改正记录'
				}else{
					this.title = '添加改正记录'
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
				this.$refs['SuperviseSuperviseeForm'].close()
				//this.$refs['form'].resetFields()
				//this.details = this.$options.data().details
				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},

			save() {
				let that = this
				that.$refs['SuperviseSuperviseeForm'].save(function(status) {
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
