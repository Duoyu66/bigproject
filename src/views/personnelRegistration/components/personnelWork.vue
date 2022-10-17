<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<WorkForm ref="WorkForm" :formData.sync="formData" :type="0"></WorkForm>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import WorkForm from '../form/WorkForm'

	export default {
		name: 'TableEdit',
		components: {
			WorkForm,
		},
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
		data() {
			let that = this
			return {
				formData: {

				},
				title: '',
				dialogFormVisible: false,
			}

		},

		created() {},
		methods: {
			showEdit(row, person_info) {
				this.formData = {}
				let form = {}
				if (row) {
					this.title = '编辑'
					form = Object.assign(form, row)
				} else {
					this.title = '添加'
				}
				if (person_info) {
					form = Object.assign(form, person_info)
				}
				this.formData = Object.assign(this.formData, form)
				this.title += '工作经历'
				this.dialogFormVisible = true
			},
			close() {
				
				this.$refs['WorkForm'].close()
				//this.$refs['form'].resetFields()
				//this.details = this.$options.data().details
				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},

			save() {
				let that = this
				that.$refs['WorkForm'].save(function(status) {
					if (status) {
						that.$emit('update:isUpData', !that.isUpData);
						that.$emit('on-change', !that.isUpData);
						that.close()
					}
				})
			},
		},


	}
</script>
