<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="700px" @close="close" top="5vh">
		<div style="max-height: calc(100vh - 250px); overflow-y: auto">
			<paramChemicalForm ref="paramChemicalForm" :formData.sync="form" :type="formType"></paramChemicalForm>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import paramChemicalForm from '../form/paramChemicalForm'
	export default {
		name: 'paramChemicalDialog',
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
			paramChemicalForm
		},
		data() {
			let that = this
			return {
				formType: 0,
				form: {

				},
				title: '',
				dialogFormVisible: false,
				formLabelWidth: '120px',
			}

		},
		created() {},
		methods: {
			showEdit(row, info) {
				let form = {}
				this.form = {}
				if (!row) {
					this.title = '添加'
					this.formType = 0;
				} else {
					this.title = '编辑'
					this.formType = 10;
					form = Object.assign(form, row)
				}
				if (info) {
					form = Object.assign(form, info)
				}
				this.form = Object.assign(this.form, form)
				this.title += '关联化学品'
				this.dialogFormVisible = true
			},
			close(event, status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
					this.$emit('reloadChildren');
				}
				this.$refs['paramChemicalForm'].close()
				this.dialogFormVisible = false
			},
			save() {
				let that = this
				this.$refs['paramChemicalForm'].save(async (valid) => {
					console.log('save valid', valid)
					if (valid) {
						that.close(undefined, true)
					}
				})
			},
		},


	}
</script>
