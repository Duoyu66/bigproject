<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">

			<el-form ref="form" :model="form" :rules="rules">
				<el-row>
					<el-col :span="span">
						<el-form-item label="" :label-width="formLabelWidth">
							<span>如果需要修改绑定角色请删除后重新添加</span>
						</el-form-item>
					</el-col>
					<el-col :span="span">
						<el-form-item label="角色" :label-width="formLabelWidth" prop="role_id">
							<el-select v-model="form.role_id">
								<el-option v-for="data in selectData.role_id" :key="data.role_id"
									:label="data.role_name" :value="data.role_id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="span">
						<el-form-item label="" :label-width="formLabelWidth" prop="enable">
							<el-switch v-model="form.enable" active-color="#13ce66" inactive-color="#ff4949"
								active-text="启用" inactive-text="禁用">
							</el-switch>
						</el-form-item>
					</el-col>
				</el-row>

			</el-form>
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
		GetGroupDataEx2,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'

	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'roleComonent',
		components: {

		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				org_pid: 'user/org_pid',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id'
			}),
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
			let that = this
			return {
				span: 24,
				selectData: {
					role_id: [],
				},
				form: {
					person_id: '',
					role_id: '',
					enable: true,
				},
				rules: {
					role_id: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择角色'
					}],
					enable: [],
				},
				title: '',
				dialogFormVisible: false,
				formLabelWidth: '120px'
			}

		},

		created() {
			this.init()
		},
		methods: {
			async showEdit(row, person_info) {
				this.init()
				//this.form = {}
				//this.$refs['form'].resetFields()

				let form = {}
				if (row) {
					this.title = '编辑'
					form = Object.assign(form, row)
				} else {
					this.title = '添加'
				}
				if (person_info) {
					form = Object.assign(form, person_info)
				}
				this.form = Object.assign(this.form, form)
				this.form = this.showDataDeal(form)
				await this.GetGroupEx();
				this.title += '角色'
				this.dialogFormVisible = true
			},
			showDataDeal(form) {
				if (form.enable == '1') {
					form.enable = true
				} else {
					form.enable = false
				}
				return form;
			},
			init() {
				//this.GetGroupEx();
			},
			async GetGroupEx() {
				let list = [{
					data: "role_id",
					sqlcode: 245,
					list: [{
						field: 'person_id',
						type: 3,
						level: 1,
					}],
					form: {
						//person_id: this.form.person_id
						person_id: this.person_id
					}
				}];
				await GetGroupDataCustomEx(this, list)
			},
			close(status) {
				this.dialogFormVisible = false
				this.$refs['form'].resetFields()
				this.details = this.$options.data().details
				if (status) {
					this.$emit('update:isUpData', !this.isUpData)
					this.$emit('on-change', !this.isUpData)
				}
			},
			submitDeal(data) {
				if (!data) {
					return data
				}
				if (data.enable) {
					data.enable_int = 1
				} else {
					data.enable_int = 0
				}
				return data
			},
			save() {
				let that = this
				async function submit() {
					let form = JSON.parse(JSON.stringify(that.form));
					form = that.submitDeal(form)
					let list = [{
							field: "person_id",
							level: 1
						},
						{
							field: "role_id",
							level: 2
						},
						{
							field: "enable_int",
							level: 3
						},
					]
					let fob = '';
					let sqlcode = 246;
					let msg = '提交'
					const {
						data
					} = await that.QueryExec_fob(sqlcode, list, form)
					if (!data || data.length == 0) {
						that.$baseMessage('提交失败', 'error')
						return false
					}
					try {
						const json = JSON.parse(data[0].info)
						if (Number(json.code) > 0) {
							that.$baseMessage('提交成功', 'success')
							return true
						} else {
							that.$baseMessage('提交失败' + json.msg, 'error')
						}
						return false
					} catch (e) {
						console.error(e)
						that.$baseMessage('提交失败', 'error')
					}
					return false
				}
				that.$refs['form'].validate(function(valid) {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							let status = await submit()
							console.log(status)
							if (status) {
								that.close(true)
							}
						})
						// that.$emit('update:isUpData', !that.isUpData);
						// that.$emit('on-change', !that.isUpData);
						// that.close()
					}
				})
			},
		},


	}
</script>
