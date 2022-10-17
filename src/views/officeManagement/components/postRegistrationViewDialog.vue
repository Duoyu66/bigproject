<template>
	<el-dialog width="90%" :title="title" :visible.sync="dialogFormVisible" v-loading="loading"
		:element-loading-text="loadingText" center top="5vh">
		<el-row>
			<el-col :span="15">
				<div style="max-height: calc(100vh - 220px); overflow-y: auto">
					<postRegistrationForm ref="postRegistrationForm" :formData.sync="form" :type="1">
					</postRegistrationForm>
				</div>
			</el-col>
			<el-col :span="9">
				<div style="max-height: calc(100vh - 220px); overflow-y: auto">
					<examineWithFileForm ref="examineWithFileForm" :formData.sync="examineWithFileForm"
						:downLoadFn="downLoadFn" :type="1" :isNeedFile="true"></examineWithFileForm>
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
		mapGetters
	} from 'vuex'
	import {
		docRegisterProcess,
		upLoadDocReceiptHistory,
		upLoadDocDispatchHistory,
		GetProcessData
	} from '../js/common'
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'
	export default {
		name: 'postRegistrationViewDialog',
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
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
				username: 'user/username'
			}),
		},
		created() {},
		methods: {
			async showEdit(row) {
				this.examineWithFileForm = {}
				this.form = {}
				await this.GetGroup()
				if (!row) {
					return
				} else {
					this.title = '查看发文'
					this.form = Object.assign(this.form, row)
					let approve = 1;
					if (row.processingStatus == this.process.examine.label && row.nextStatus == this.process.draft
						.label) {
						approve = -1
					}
					this.examineWithFileForm = {
						send_id: row.send_id,
						approve: approve,
						approver_id: row.reviewer,
						reason: row.reviewReason,
						approve_date: row.revieweDate,
						revieweEnclosure: row.revieweEnclosure
					}
				}

				this.dialogFormVisible = true
				let historyForm = {
					send_id: this.form.send_id,
					action: '查看-' + this.form.doc_id,
					person_id: this.person_id,
					person_name: this.username
				}
				console.log('upLoadDocDispatchHistory', this, historyForm)
				upLoadDocDispatchHistory(this, historyForm)
			},
			downLoadFn(fileName, src, action) {
				console.log(fileName, src, action);
				if (action == 'show') {
					action = '查看'
				} else {
					action = '下载';
				}

				action = action + '-' + fileName + '-' + this.form.doc_id
				let form = {
					send_id: this.form.send_id,
					action: action,
					person_id: this.person_id,
					person_name: this.username
				}
				upLoadDocDispatchHistory(this, form)
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
			},
			close() {
				this.$refs['postRegistrationForm'].close()
				this.$refs['examineWithFileForm'].close()
				//this.$emit('update:isUpData', !this.isUpData);
				// this.$emit('on-change', !this.isUpData);
				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},
			async QueryExec_fob_custom(list, form, sqlcode) {
				return await this.QueryExec_fob(sqlcode, list, form)
			},
			async save() {
				this.close()
			},
		},
	}
</script>

<style>
</style>
