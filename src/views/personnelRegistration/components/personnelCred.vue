<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="700px" @close="close">
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<credForm ref="credForm" :formData.sync="form" :type="0"></credForm>
		</div>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import credForm from '../form/credForm'
	export default {
		name: 'personnelCred',
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
			credForm
		},
		data() {
			let that = this
			return {
				form: {},
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

				this.title += '相关证书'
				this.form = Object.assign(this.form, form)
				this.dialogFormVisible = true
			},
			close(event, status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}
				this.$refs['credForm'].close()
				this.dialogFormVisible = false
			},
			save() {
				let that = this
				that.$refs['credForm'].save(async (valid) => {
					if (valid) {
						that.close(undefined, valid)
					}
				})
			},
		},


	}
</script>
