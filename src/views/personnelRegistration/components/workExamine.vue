<template>
	<el-dialog width="500px" :title="title" :visible.sync="dialogFormVisible" v-loading="loading"
		:element-loading-text="loadingText" top="10vh">
		<el-row>
			<el-col :span="24">
				<div style="max-height: calc(100vh - 220px); overflow-y: auto">
					<WorkForm ref="WorkForm" :formData.sync="form" :type="1"></WorkForm>
				</div>
			</el-col>
			<el-col :span="24">
				<div style="max-height: calc(100vh - 220px); overflow-y: auto">
					<examineForm ref="examineForm" :formData.sync="examineForm" :type="0"></examineForm>
				</div>
			</el-col>
		</el-row>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save" style="width: 100px; margin-left: 100px">
				确 定
			</el-button>
			<el-button @click="close" style="width: 100px; margin-left: 100px">
				取 消
			</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import WorkForm from '../form/WorkForm'
	import examineForm from '../form/examineForm'
	export default {
		name: 'personnelFrom',
		components: {
			WorkForm,
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
				this.form = {}
				this.examineForm = {}
				if (!row) {
					return
				} else {
					this.title = '审核工作经历'
					this.form = Object.assign(this.form, row)
					this.examineForm = {
						exp_id: row.exp_id
					}
				}
				this.dialogFormVisible = true
			},
			close(status) {

				this.$refs['WorkForm'].close()
				this.$refs['examineForm'].close()
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}
				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},
			async save() {
				let that = this
				that.$refs['examineForm'].save(async function(form) {
					if (!form) {
						return
					}

					//this.loading = true
					that.loadingText = '提交表单中'
					let data = JSON.parse(JSON.stringify(form))
					let list = [{
							field: 'approver',
							type: 3,
							level: 1,
						},
						{
							field: 'approve',
							type: 3,
							level: 2,
						},
						{
							field: 'reason',
							type: 3,
							level: 3,
						},
						{
							field: 'exp_id',
							type: 3,
							level: 4,
						},
					]
					let fob = ''
					let sqlcode = 116
					let msg = '提交'
					const {
						code,
						influence
					} = await that.update_fob(list, data, sqlcode)
					if (code != 200) {
						that.$baseMessage(msg + '失败', 'error')
						return false
					}
					if (influence > 0) {
						that.$baseMessage(msg + '成功', 'success')
						//重载表格
						that.$refs['examineForm'].close()
						that.close(true)
					} else {
						that.$baseMessage(msg + '失败', 'error')
					}
				})

			},
		},
	}
</script>

<style>
</style>
