<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span">
				<el-form-item label="姓名" :label-width="formLabelWidth">
					<el-input v-model="form.user_name" placeholder="请输入" style="width: 100%" readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="调出机构" :label-width="formLabelWidth">
					<el-input v-model="form.orgp_name" placeholder="请输入" style="width: 100%" readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="调入机构" :label-width="formLabelWidth" prop="to_org">
					<tree-select :options="select.org" :max-height="maxHeight" :multiple="false"
						:placeholder="isReadOnly('请选择调入机构...')" :disabled="readonly" v-model="form.to_org" />
				</el-form-item>
			</el-col>
			<el-col :span="span" v-if="readonly">
				<el-form-item label="申请时间" :label-width="formLabelWidth">
					<el-date-picker v-model="form.apply_date" align="right" type="date"
						:placeholder="isReadOnly('选择日期')" :picker-options="pickerOptions" style="width: 100%"
						:format='dateFormat' :value-format="dateFormat" :readonly="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="调动时间" :label-width="formLabelWidth" prop="change_date">
					<el-date-picker v-model="form.change_date" align="right" type="datetime"
						:placeholder="isReadOnly('选择时间')" :picker-options="pickerOptions" style="width: 100%"
						:format='dateFormat' :value-format="dateFormat" :readonly="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>

			<el-col :span="span">
				<el-form-item label="经手人" :label-width="formLabelWidth" prop="handler">
					<el-input v-model="form.handler" placeholder="请输入" style="width: 100%" maxlength='16' :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="申请人" :label-width="formLabelWidth" prop="applicant">
					<el-input v-model="form.applicant" placeholder="请输入" style="width: 100%" readonly="readonly"
						maxlength='16' :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="调动原因" :label-width="formLabelWidth" prop="move_reaon">
					<el-input v-model="form.move_reaon" :placeholder="isReadOnly('请输入调动原因')" :readonly="readonly"
						style="width: 100%" :autosize="{ minRows: 3, maxRows: 8}" maxlength="100" type="textarea"
						show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="备注" :label-width="formLabelWidth">
					<el-input v-model="form.remarks" :placeholder="isReadOnly('请输入备注')" :readonly="readonly"
						style="width: 100%" maxlength="100" type="textarea" :autosize="{ minRows: 3, maxRows: 8}"
						show-word-limit></el-input>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		format_fob,
		pickerOptions,
		getdayEx,
		getday,
		dateFormat,
	} from '@/utils/dateHelp'
	import TreeSelect from '@riophae/vue-treeselect'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	export default {
		name: 'AllocationForm',
		components: {
			TreeSelect
		},
		model: {
			prop: 'formData',
			event: 'on-change'
		},
		props: {
			//.sync同步
			formData: {
				type: Object,
				default: function() {
					return {}
				}
			},
			type: {
				type: Number,
				default: 0 //0 正常表单 1 详情表单
			}
		},
		watch: {
			formData(newVal, oldVal) {
				if (newVal) {
					this.uploadForm(newVal)
				}
			},
		},
		computed: {
			...mapGetters({
				username: 'user/username',
				org_id: 'user/org_id',
				person_id: 'user/person_id'
			}),
		},
		data() {
			let that = this
			return {
				formLabelWidth: '120px',
				span: 24,
				readonly: false,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(1),
				formdefalut: {},
				props: {},
				maxHeight: 200,
				select: {
					org: []
				},
				form: {
					allocation_id: -1,
					//经手人
					handler: '',
					person_id: '',
					user_name: '',
					orgp_name: '',
					//调拨前机构
					org_pid: '',
					//申请人所在机构
					applicant_org_id: '',
					to_org: null,
					applicant: '',
					applicant_id: '',
					change_date: getdayEx(undefined, undefined, dateFormat(1)),
					change_date_old: '',
					apply_date: getdayEx(undefined, undefined, dateFormat(1)),
					move_reaon: '',
					remarks: '',
				},
				rules: {},
				rules_temp: {
					to_org: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择调入机构'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							console.log(value)
							if (!value) {
								callback()
								return
							}
							if (value === that.form.org_pid) {
								callback(new Error('调入机构和调出机构不能一致'))
								return
							}
							callback()
						}
					}],
					handler: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入经手人'
					}],
					applicant: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入申请人'
					}],
					move_reaon: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入调动原因'
					}],
					apply_date: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择申请时间'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							const end = new Date(that.form.change_date)
							const start = new Date(value)

							if (start > end) {
								callback(new Error('申请时间不能晚与调入时间'))
								return
							} else {
								callback()
							}
						}
					}],
					change_date: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择调动日期'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							const end = new Date(value)
							const start = new Date(getdayEx() + ' 00:00:00') //new Date(that.form.apply_date)
							if (start > end && that.form.change_date_old != value) {
								callback(new Error('调入时间不能早与今天'))
								return
							} else {
								callback()
							}
						}
					}]
				}
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				switch (this.type) {
					case 0:
						this.readonly = false
						this.rules = this.rules_temp
						break;
					case 1:
						this.readonly = true
						this.rules = {}
						break
				}
				this.form.applicant = this.username
				this.form.applicant_id = this.person_id
				this.formdefalut = JSON.parse(JSON.stringify(this.form))

				if (this.formData) {
					this.uploadForm(this.formData)
				}
			},
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},
			hindleChanged() {

			},
			async uploadForm(newVal) {
				this.form = JSON.parse(JSON.stringify(this.formdefalut))
				this.form = Object.assign(this.form, newVal)
				console.log(this.form)
				this.form.change_date_old = this.form.change_date
				this.select.org = await this.$store.dispatch('org/GetOrgTreeAllEx')
			},
			close() {
				this.$refs['form'].resetFields()
				this.details = this.$options.data().details
				this.dialogFormVisible = false
				this.form = JSON.parse(JSON.stringify(this.formdefalut))
				this.$emit('fetch-data')
			},
			async QueryExec_fob_custom(list, form, sqlcode) {
				return await this.QueryExec_fob(sqlcode, list, form)
			},
			save(callback) {
				let that = this
				async function submit() {
					let form = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: "person_id",
							level: 1
						},
						{
							field: "to_org",
							level: 2
						},
						{
							field: "applicant_id",
							level: 3
						},
						{
							field: "change_date",
							level: 4
						},
						{
							field: "handler",
							level: 5
						},
						{
							field: "move_reaon",
							level: 6
						},
						{
							field: "remarks",
							level: 7
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.allocation_id && form.allocation_id > 0) { //更新
						sqlcode = 168
						fob = that.QueryExec_fob_custom;
						msg = '更新'
						list.push({
							field: "allocation_id",
							level: 8
						})
					} else { //添加
						msg = '添加'
						sqlcode = 163
						fob = that.QueryExec_fob_custom;
					}
					const {
						code,
						influence,
						data
					} = await fob(list, that.form, sqlcode)
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
				}
				that.$refs['form'].validate(async (valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							const flag = await submit()
							if (flag && callback) {
								callback(flag)
							}
						})

					} else {
						return false
					}
				})
			},
		},
	}
</script>

<style>
</style>
