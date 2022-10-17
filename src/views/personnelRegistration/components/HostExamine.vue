<template>
	<el-dialog width="60%" :title="title" :visible.sync="dialogFormVisible" v-loading="loading"
		:element-loading-text="loadingText" center top="8vh">
		<el-row>
			<el-col :span="12">
				<div style="max-height: calc(100vh - 220px); overflow-y: auto">
					<hostForm ref="hostForm" :formData.sync="form" :type="1"></hostForm>
				</div>
			</el-col>
			<el-col :span="12">
				<div style="max-height: calc(100vh - 290px); overflow-y: auto">
					<examineForm ref="examineForm" :formData.sync="examineForm" :type="0"></examineForm>
				</div>
			</el-col>
		</el-row>
		<div slot="footer" class="dialog-footer">
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
	import hostForm from '../form/hostForm'
	import examineForm from '../form/examineForm'
	export default {
		name: 'trainExamine',
		components: {
			hostForm,
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
				this.examineForm = {}
				this.form = {}
				if (!row) {
					return
				} else {
					this.title = '审核主持项目'
					this.form = Object.assign(this.form, row)
					this.examineForm = {
						host_id: row.host_id
					}
				}
				this.dialogFormVisible = true
			},
			close() {

				this.$refs['hostForm'].close()
				this.$refs['examineForm'].close()
				this.$emit('update:isUpData', !this.isUpData);
				this.$emit('on-change', !this.isUpData);
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
							field: 'host_id',
							type: 3,
							level: 4,
						},
					]
					let fob = ''
					let sqlcode = 118
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
						that.close()
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
