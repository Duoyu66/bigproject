<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<hostForm ref="hostForm" :formData.sync="form" :type="0"></hostForm>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import hostForm from '../form/hostForm'
	export default {
		name: 'personnelHost',
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
			hostForm
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
				this.title += '主持项目'
				this.dialogFormVisible = true
			},
			close(status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}
				this.$refs['hostForm'].close()
				this.dialogFormVisible = false
				this.$emit('fetch-data')
			},
			save() {
				let that = this

				that.$refs['hostForm'].save(async (valid) => {
					if (valid) {
						that.close(true)
					}
				})
			},
		},
	}
</script>
