<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px" @close="close">
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<paperForm ref="paperForm" :formData.sync="form" :type="0"></paperForm>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>

		</div>
	</el-dialog>
</template>

<script>
	import paperForm from '../form/paperForm'
	export default {
		name: 'personelPaper',
		components: {
			paperForm
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
				span: 24,
				span2: 12,
				form: {

				},

				title: '',
				dialogFormVisible: false,
				formLabelWidth: '120px',
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
				this.title += '发表论文'
				this.dialogFormVisible = true
			},
			close(event, status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}

				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},
			save() {
				let that = this

				this.$refs['paperForm'].save(async (valid) => {
					if (valid) {
						that.close(undefined, true)
					} else {
						return false
					}
				})
			},
		},


	}
</script>
