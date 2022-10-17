
<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="700px" @close="close" top="5vh" append-to-body>
		<div style="max-height: calc(100vh - 250px); overflow-y: auto">
			<testMonthReportForm ref="testMonthReportForm" :formData.sync="form" :type="0" :project_type="project_type"></testMonthReportForm>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
  import testMonthReportForm from '../form/testMonthReportForm.vue'
	export default {
		name: 'sealApplyDialog',
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
      project_type: {
      	type: Number,
      	default: 0,
      },
		},
		components: {
			testMonthReportForm
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
				console.log(row, person_info)
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
				this.title += '月报收入'
				this.dialogFormVisible = true
			},
			close(status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}
				this.$refs['testMonthReportForm'].close()
				this.dialogFormVisible = false
			},
			save() {
				let that = this
				this.$refs['testMonthReportForm'].save(async (valid) => {
					if (valid) {
						that.close(true)
					}
				})
			},
		},


	}
</script>
