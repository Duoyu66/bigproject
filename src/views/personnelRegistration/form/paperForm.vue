<template>
	<el-form ref="form" :model="form" :rules="rules" style="max-height: calc(100vh - 200px); overflow-y: auto;">
		<el-row>
			<el-col :span="span">
				<el-form-item label="论文名称" :label-width="formLabelWidth" prop="papername">
					<el-input v-model="form.papername" :placeholder="isReadOnly('请输入论文名称')" style="width: 100%"
						maxlength="16" :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="发表期刊名称" :label-width="formLabelWidth" prop="periodical_name"
					style="margin-top: 10px">
					<el-input v-model="form.periodical_name" :placeholder="isReadOnly('请输入期刊名称')" style="width: 100%"
						maxlength="16" :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span2">
				<el-form-item label="年号" :label-width="formLabelWidth" style="margin-top: 10px">
					<el-input :placeholder="isReadOnly('请输入年号')" v-model.trim="form.year_number" maxlength="4"
						:readonly="readonly">
						<template slot="append">年</template>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span2">
				<el-form-item label="期号" :label-width="formLabelWidth" style="margin-top: 10px">
					<el-input :placeholder="isReadOnly('请输入期号')" v-model.trim="form.issue_number" maxlength="5"
						:readonly="readonly">
						<template slot="append">期</template>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="发表日期" prop="publish_date" :label-width="formLabelWidth" style="margin-top: 10px">
					<el-date-picker style="width: 100%" :placeholder="isReadOnly('选择日期')" v-model="form.publish_date"
						type="date" :readonly="readonly" :picker-options="pickerOptionsDisable.before"
						:format="dateFormat" :value-format="dateFormat">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="是否第一作者" :label-width="formLabelWidth" style="margin-top: 10px">
					<el-radio v-model="form.author_info" label="1" :disabled="readonly">是</el-radio>
					<el-radio v-model="form.author_info" label="2" :disabled="readonly">否</el-radio>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="获奖情况" prop="awards" :label-width="formLabelWidth" style="margin-top: 10px">
					<el-input style="width: 100%" type="textarea" :rows="6" :placeholder="isReadOnly('请输入内容')"
						v-model="form.awards" maxlength="64" show-word-limit :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>

		</el-row>

	</el-form>
</template>

<script>
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
	} from '@/utils/dateHelp'
	import {
		GetGroupData,
		GetGroupDataEx
	} from '@/utils/htmlDataGroup'
	import {
		isNumEx,
		isTel,
		isPhone
	} from '@/utils/validate'
	// import { doEdit } from '@/api/table'
	export default {
		name: 'paperForm',
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
					this.init(newVal)
				}
			},
		},
		data() {
			let that = this
			return {
				dateFormat: dateFormat(),
				span: 24,
				span2: 12,
				readonly: false,
				form: {
					paper_id: -1,
					org_id: -1,
					person_id: -1,
					papername: '',
					periodical_name: '',
					paper_time: '',
					year_number: '',
					issue_number: '',
					publish_date: getToday(),
					awards: '',
					author_info: '1',
				},
				rules: {},
				rules_temp: {
					papername: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入论文名称'
					}],
					publish_date: [{
						required: true,
						trigger: 'blur',
						message: '请输入发布日期'
					}],
					periodical_name: [{
						required: true,
						trigger: 'blur',
						message: '请输入期刊名称'
					}],
					year_number: [{
						type: 'number',
						trigger: 'blur',
						message: '只能输入数字'
					}],
					issue_number: [{
						type: 'number',
						trigger: 'blur',
						message: '只能输入数字'
					}]
				},
				formLabelWidth: '120px',
				pickerOptionsDisable: {
					before: pickerOptions({
						disabledDate: true,
						type_disable: 2
					}),
					after: pickerOptions({
						disabledDate: true,
						type_disable: 3,
						shortcuts_type: 'after'
					}),
				}
			}

		},
		created() {
			this.init()
		},
		methods: {
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},
			form_update(form) {
				try {
					if (form.paper_time) {
						let paper_time = JSON.parse(form.paper_time)
						let that = this
						for (let key in paper_time) {
							if (paper_time[key]) {
								form[key] = paper_time[key]
							}
						}
					}
					this.form = Object.assign(this.form, form)
				} catch (e) {
					console.log(e)
				}
			},
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
				if (this.formData) {
					this.form_update(this.formData)
				}
				this.$nextTick(() => {
					this.clearValidate()
				})
			},
			clearValidate(object_id) {
				if (this.$refs['form']) {
					this.$refs['form'].clearValidate()
				}

			},
			close() {
				this.$refs['form'].resetFields()
				this.form = this.$options.data().form
			},
			save(callback) {
				let that = this
				async function submit(callback) {
					try {
						let data = JSON.parse(JSON.stringify(that.form));
						let list = [{
								field: "publish_date",
								level: 3
							},
							{
								field: "papername",
								level: 4
							},
							{
								field: "periodical_name",
								level: 5
							},
							{
								field: "paper_time",
								level: 6
							},
							{
								field: "awards",
								level: 7
							},
							{
								field: "author_info",
								level: 8
							},
						]
						data.paper_time = JSON.stringify({
							year_number: data.year_number,
							issue_number: data.issue_number,
						})
						let fob = '';
						let sqlcode = -1;
						let msg = ''
						if (data.paper_id && data.paper_id > 0) { //更新
							sqlcode = 107
							fob = that.update_fob;
							msg = '更新'
							list.push({
								field: "paper_id",
								level: 9
							})
						} else { //添加
							msg = '添加'
							sqlcode = 105
							fob = that.insert_fob;
							list.push({
								field: "org_id",
								level: 1
							}, {
								field: "person_id",
								level: 2
							}, )
						}
						const {
							code,
							influence
						} = await fob(list, data, sqlcode)
						if (code != 200) {
							that.$baseMessage(msg + '失败', 'error')
							return false
						}
						if (influence > 0) {
							that.$baseMessage(msg + '成功', 'success')
							that.dialogFormVisible = false
							that.close()
							if (callback) {
								callback(true)
							}
						} else {
							that.$baseMessage(msg + '失败', 'error')
						}
					} catch (e) {
						console.log(e)
					}
				}
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							submit(function(status) {
								if (status && callback) {
									callback(true)
								}
							})
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
