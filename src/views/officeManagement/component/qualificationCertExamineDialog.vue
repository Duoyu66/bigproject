<template>
	<el-dialog width="80%" :title="title" :visible.sync="dialogFormVisible" v-loading="loading"
		:element-loading-text="loadingText" center top="8vh">
		<el-row>
			<el-col :span="12">
				<div style="max-height: calc(100vh - 220px); overflow-y: auto">
					<qualificationCertApplyForm ref="qualificationCertApplyForm" :formData.sync="form" :type="3">
					</qualificationCertApplyForm>
				</div>
			</el-col>
			<el-col :span="12">
				<div style="max-height: calc(100vh - 290px); overflow-y: auto">
					<examineForm ref="examineForm" :formData.sync="examineForm" :type="0"></examineForm>
				</div>
			</el-col>
		</el-row>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<el-button type="primary" @click="save">
				确 定
			</el-button>
			<el-button @click="close">
				取 消
			</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import qualificationCertApplyForm from '../form/qualificationCertApplyForm'
	import examineForm from '../form/qualificationCertExamineForm'
	export default {
		name: 'divisionExamine',
		components: {
			qualificationCertApplyForm,
			examineForm
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
			return {
				loading: false,
				loadingText: '',
				title: '',
				dialogFormVisible: false,
				form: {},
				examineForm: {

				}
			}
		},

		created() {},
		methods: {
			showEdit(row) {
				let form = {}
				this.form = {}
				this.examineForm = {}
				if (!row) {
					return
				} else {
					this.title = '审批资质证书下载申请'
					form = Object.assign(form, row)
					this.examineForm = Object.assign({}, form)
				}
				this.form = Object.assign(this.form, form)
				this.dialogFormVisible = true
			},
			close(event, stauts) {
				this.$refs['qualificationCertApplyForm'].close()
				this.$refs['examineForm'].close()
				if (stauts) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}
				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},
			async save() {
				let that = this
				that.$refs['examineForm'].save(async function(flag) {
					if (flag) {
						that.close(undefined, true)
					}

				})

			},
		},
	}
</script>

<style>
</style>
