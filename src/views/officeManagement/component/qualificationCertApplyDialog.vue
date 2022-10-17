<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="80%" @close="close" top="5vh">
		<div style="max-height: calc(100vh - 250px); overflow-y: auto">
			<qualificationCertApplyForm ref="qualificationCertApplyForm" :formData.sync="form" :type="0">
			</qualificationCertApplyForm>
		</div>
		<div slot="footer" class=" dialog-footer-center-custom">
			<el-button type="primary" @click="saveAndApplicant">保存并提交</el-button>
			<el-button type="primary" @click="OnlySave">保 存</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import qualificationCertApplyForm from '../form/qualificationCertApplyForm'
	export default {
		name: 'qualificationCertApplyDialog',
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
			qualificationCertApplyForm
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
				console.log(row)
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
				this.title += '资质证书下载申请'
				this.dialogFormVisible = true
			},
			close(status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}
				this.$refs['qualificationCertApplyForm'].close()
				this.dialogFormVisible = false
			},
			OnlySave() {
				this.save(0);
			},
			saveAndApplicant() {
				this.save(1);
			},
			save(action) {
				let that = this
				this.$refs['qualificationCertApplyForm'].saveAndStatus(action, async (valid) => {
					if (valid) {
						that.close(true)
					}
				})
			},
		},


	}
</script>
