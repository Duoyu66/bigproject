<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="60%" @close="close" top="5vh">
		<div style="max-height: calc(100vh - 250px); overflow-y: auto">
			<ExOrganization ref="ExOrganization" :formData.sync="form" :type="0"></ExOrganization>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import ExOrganization from '../form/ExOrganization'
	export default {
		name: 'ExOrganizationDialog',
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
			ExOrganization
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
				this.title += '外委机构'
				this.dialogFormVisible = true
			},
			close(status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}
				this.$refs['ExOrganization'].close()
				this.dialogFormVisible = false
			},
			save() {
				let that = this
				this.$refs['ExOrganization'].save(async (valid) => {
					if (valid) {
						that.close(true)
					}
				})
			},
		},


	}
</script>
