<template>
	<el-dialog width="85%" :title="title" :visible.sync="dialogFormVisible" v-loading="loading"
		:element-loading-text="loadingText" center top="5vh">
		<el-row>
			<el-col :span="15" style="max-height: calc(100vh - 220px); overflow-y: auto">
				<el-row>
					<el-col :span="24">
						<div style="max-height: calc(100vh - 220px); overflow-y: auto">
							<sealApplyForm ref="sealApplyForm" :formData.sync="form" :type="1">
							</sealApplyForm>
						</div>
					</el-col>
					<el-col :span="24">
						<div style="max-height: calc(100vh - 220px); overflow-y: auto">
							<sealProcForm ref="sealProcForm" :formData.sync="form" :type="1">
							</sealProcForm>
						</div>
					</el-col>
					<el-col :span="24">
						<div style="max-height: calc(100vh - 220px); overflow-y: auto">
							<el-form ref="form" :model="form" v-if="form.confirmer">
								<el-col :span="24" v-for="data in demotableexpand.mainTable" :key="data.field"
									v-if="data.isShow">
									<el-form-item :label="data.label" :label-width="formLabelWidth" :prop="data.field">
										<el-input v-if="data.type=='input'" v-model="form[data.field]" placeholder=""
											style="width:100%" :readonly="true">
										</el-input>
										<el-input v-if="data.type=='textarea'" v-model="form[data.field]" placeholder=""
											style="width:100%" :readonly="true" type="textarea"
											:autosize="{ minRows: 6}">
										</el-input>
										<el-input v-if="!data.type" v-model="form[data.field]" placeholder=""
											style="width:100%" :readonly="true">
										</el-input>
									</el-form-item>
								</el-col>
							</el-form>
						</div>
					</el-col>
				</el-row>

			</el-col>
			<el-col :span="9">
				<div style="max-height: calc(100vh - 220px); overflow-y: auto">
					<examineForm ref="examineForm" :formData.sync="examineForm" :type="3"></examineForm>
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
	import sealApplyForm from '../form/sealApplyForm'
	import examineForm from '../form/examineForm'
	import sealProcForm from '../form/sealProcForm'
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
		name: 'sealApplyViewDialog',
		components: {
			sealApplyForm,
			examineForm,
			sealProcForm
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
				formLabelWidth: '120px',
				loading: false,
				loadingText: '',
				title: '',
				dialogFormVisible: false,
				form: {},
				selectData: {
					source: []
				},
				examineForm: {

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
				demotableexpand: {
					mainTable: [{
						field: 'confirmer',
						label: '确认人',
						isShow: true,
					}, {
						field: 'confirm_date',
						label: '确认时间',
						isShow: true,
					}]
				},
			}
		},

		created() {},
		methods: {
			async showEdit(row) {
				this.examineForm = {}
				this.form = {}
				if (!row) {
					return
				} else {
					this.title = '查看用印申请'
					this.form = Object.assign(this.form, row)
					let stauts = -1;
					if (row.nApproverResult == -1) {
						stauts = -1;
					} else if (row.nApproverResult == -2) {
						stauts = -2;
					} else if (row.nApproverResult == 0 && row.nApproverResult) {
						stauts = -1;
					} else {
						stauts = 1;
					}
					this.examineForm = {
						apply_id: row.apply_id,
						approve: stauts,
						reason: row.ApproverResult,
						revieweDate: row.approve_time
					}
				}
				await this.GetGroup()
				this.dialogFormVisible = true
			},
			async GetGroup() {

			},
			close() {
				this.$refs['sealApplyForm'].close()
				this.$refs['examineForm'].close()
				this.$refs['sealProcForm'].close()
				//this.$emit('update:isUpData', !this.isUpData);
				//this.$emit('on-change', !this.isUpData);
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
