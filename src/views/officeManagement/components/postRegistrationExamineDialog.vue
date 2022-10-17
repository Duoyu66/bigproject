<template>
	<el-dialog width="90%" :title="title" :visible.sync="dialogFormVisible" v-loading="loading"
		:element-loading-text="loadingText" center top="5vh">
		<el-row>
			<el-col :span="15">
				<div style="max-height: calc(100vh - 220px); overflow-y: auto">
					<postRegistrationForm ref="postRegistrationForm" :formData.sync="form" :type="3">
					</postRegistrationForm>
				</div>
			</el-col>
			<el-col :span="9">
				<div style="max-height: calc(100vh - 220px); overflow-y: auto">
					<examineWithFileForm ref="examineWithFileForm" :formData.sync="examineWithFileForm" :type="0"
						:isNeedFile="true"></examineWithFileForm>
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
	import postRegistrationForm from '../form/postRegistrationForm'
	import examineWithFileForm from '../form/examineWithFileForm'
	import {
		docRegisterProcess,
		GetProcessData
	} from '../js/common'
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'
	export default {
		name: 'postRegistrationExamineDialog',
		components: {
			postRegistrationForm,
			examineWithFileForm
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
				selectData: {
					source: []
				},
				examineWithFileForm: {

				},
				process: {
					outgoingOrg: {
						label: '发文',
						isrequired: false,
					},
					sign: {
						isrequired: false,
						label: '签收'
					},
					register: {
						label: '登记'
					},
					examine: {
						label: '审核'
					},
					end: {
						label: '完成'
					}
				},
			}
		},

		created() {},
		methods: {
			async showEdit(row) {
				this.examineWithFileForm = {}
				this.form = {}
				if (!row) {
					return
				} else {
					this.title = '审核发文'
					this.form = Object.assign(this.form, row)
					this.examineWithFileForm = {
						send_id: row.send_id
					}
				}
				await this.GetGroup()
				this.dialogFormVisible = true
			},
			async GetGroup() {
				let processData = await GetProcessData()
				this.process = Object.assign(this.process, processData)
				let that = this
				let list = [{
					data: "source",
					group_id: 1016
				}];
				await GetGroupDataEx(this, list)
				//起草
				that.selectData.source = that.selectData.source.filter(function(s) {
					console.log('that.selectData.source', s)
					return s.remarks === '0' || !s.remarks // 注：IE9(不包含IE9)以下的版本没有trim()方法
				})
			},
			close() {
				this.$refs['postRegistrationForm'].close()
				this.$refs['examineWithFileForm'].close()
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
				that.$refs['examineWithFileForm'].save(async function(form) {
					if (!form) {
						return
					}
					//this.loading = true
					that.loadingText = '提交表单中'
					let formdata = JSON.parse(JSON.stringify(form))
					let list = [{
							field: 'approver_id',
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
						}, {
							field: 'processingStatus',
							type: 3,
							level: 4,
						}, {
							field: 'nextStatus',
							type: 3,
							level: 5,
						}, {
							field: 'revieweEnclosure',
							type: 3,
							level: 6,
						},
						{
							field: 'send_id',
							type: 3,
							level: 7,
						},
					]
					console.log(that)
					let formTemp = JSON.parse(JSON.stringify(that.form))
					formTemp.processingStatus= that.process.examine.label
					let isrequired = docRegisterProcess(formTemp.source, that.process, that
						.selectData
						.source, formTemp, undefined)
					let processingStatus = that.process.examine.label
					let nextStatus = formTemp.nextStatus
					formdata.processingStatus = processingStatus
					formdata.nextStatus = nextStatus
					let fob = ''
					let sqlcode = 350
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
