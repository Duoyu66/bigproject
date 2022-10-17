<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
		<div style="max-height: calc(100vh - 250px); overflow-y: auto">
			<el-alert :title="alert.tips" :description="alert.description" type="warning" :closable="false" center
				show-icon> </el-alert>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'
	import {
		docRegisterProcess,
		GetProcessData
	} from '../js/common'
	import {
		mapGetters
	} from 'vuex'
	import sealApplyEndForm from '../form/sealApplyEndForm'
	export default {
		name: 'docPostStampComplete',
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
			sealApplyEndForm
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
				username: 'user/username'
			}),
		},
		data() {
			let that = this
			return {
				alert: {
					tips: '确定结束盖章进入下一步？',
					description: '请检查是否有审核通过未添加用印记录的数据。此操作将作废掉未通过的申请，结束添加了用印的记录，将无法编辑和删除这些用印申请和用印记录'
					
				},
				form: {

				},
				title: '',
				dialogFormVisible: false,
				formLabelWidth: '120px',
				process: {},
				selectData: {
					source: []
				}
			}

		},
		created() {},
		methods: {
			async showEdit(row, other_info) {
				console.log(row, other_info)
				let form = {}
				this.form = {}
				if (!row) {} else {
					form = Object.assign(form, row)
				}
				if (other_info) {
					form = Object.assign(form, other_info)
				}
				this.form = Object.assign(this.form, form)
				this.title = '完成盖章进入下一步'

				this.dialogFormVisible = true
				await this.GetListFormDataBase()
				this.GetNextStatus();
			},
			async GetListFormDataBase() {
				let that = this
				let processData = await GetProcessData()
				this.process = Object.assign(this.process, processData)
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
			GetNextStatus() {
				let that = this
				let formTemp = JSON.parse(JSON.stringify(that.form));
				formTemp.processingStatus = that.process.Seal.label
				let isrequired = docRegisterProcess(formTemp.source, that.process, that
					.selectData
					.source, formTemp, undefined)
				console.log('GetNextStatus', formTemp)
				return {
					processingStatus: formTemp.processingStatus,
					nextStatus: formTemp.nextStatus
				}
			},
			close(status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}
				this.dialogFormVisible = false
			},
			async submit() {
				let that = this
				try {
					let list = [{
							field: "person_id",
							level: 1
						},
						{
							field: "processingStatus",
							level: 2
						}, {
							field: "nextStatus",
							level: 3
						}, {
							field: "send_id",
							level: 4
						},
					]
					let status = that.GetNextStatus()
					let form = {
						person_id: that.person_id,
						processingStatus: status.processingStatus,
						nextStatus: status.nextStatus,
						send_id: that.form.send_id
					}
					const {
						code,
						influence,
						data
					} = await that.QueryExec_fob(382, list, form)
					console.log(code, influence, data);
					if (code != 200) {
						that.$baseMessage(msg + '失败', 'error')
						return false
					}
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
				} catch (e) {
					console.log(e)
					return false
				}
			},
			async save() {
				let that = this

				that.$baseConfirm(that.alert.tips, null, async () => {
					let status = await that.submit();
					if (status) {
						that.close(true);
					}
				})
			},
		},


	}
</script>
