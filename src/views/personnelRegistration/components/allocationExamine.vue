<template>
	<el-dialog width="60%" :title="title" :visible.sync="dialogFormVisible" v-loading="loading"
		:element-loading-text="loadingText" center top="8vh">
		<el-row>
			<el-col :span="12">
				<div style="max-height: calc(100vh - 220px); overflow-y: auto">
					<AllocationForm ref="AllocationForm" :formData.sync="form" :type="1"></AllocationForm>
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
	import AllocationForm from '../form/AllocationForm'
	import examineForm from '../form/examineForm'
	export default {
		name: 'allocationExamine',
		components: {
			AllocationForm,
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
					this.title = '审核调动记录'
					this.form = Object.assign(this.form, row)
					this.examineForm = {
						allocation_id: row.allocation_id
					}
				}
				this.dialogFormVisible = true
			},
			close() {

				this.$refs['AllocationForm'].close()
				this.$refs['examineForm'].close()
				this.$emit('update:isUpData', !this.isUpData);
				this.$emit('on-change', !this.isUpData);
				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},
			async QueryExec_fob_custom(list, form, sqlcode) {
				return await this.QueryExec_fob(sqlcode, list, form)
			},
			async save() {
				let that = this
				that.$refs['examineForm'].save(async function(form) {
					if (!form) {
						return
					}
					//this.loading = true
					that.loadingText = '提交表单中'
					let formdata = JSON.parse(JSON.stringify(form))
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
							field: 'allocation_id',
							type: 3,
							level: 4,
						},
					]
					let fob = ''
					let sqlcode = 170
					let msg = '提交'
					const {
						code,
						influence,
						data
					} = await that.QueryExec_fob_custom(list, formdata, sqlcode)
					if (!data || data.length == 0) {
						that.$baseMessage(msg + '失败', 'error')
						return
					}
					let json = JSON.parse(data[0].info)
					if (json.code > 0) {
						switch (json.code) {
							case 1:
								that.$baseMessage(json.msg, 'success')
								that.close()
								return true
								break
							case 2:
								that.$baseMessage(json.msg, 'error')
								break
							default:
								that.$baseMessage(json.msg, 'error')
								break
						}
						return false
					} else {
						that.$baseMessage(json.msg, 'error')
						return false
					}
				})

			},
		},
	}
</script>

<style>
</style>
