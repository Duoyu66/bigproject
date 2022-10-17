<template>

	<el-form ref="form" :model="form" :rules="rules" style="max-height: calc(100vh - 200px); overflow-y: auto;">
		<el-row>
			<el-col :span="span">
				<el-form-item label="成果名称" :label-width="formLabelWidth" prop="awards_name">
					<el-input v-model="form.awards_name" style="width: 100%" maxlength="25"
						:placeholder="isReadOnly('请输入')" :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="完成日期" :label-width="formLabelWidth" prop="finish_date">
					<el-date-picker v-model="form.finish_date" align="right" type="date" :picker-options="pickerOptions"
						style="width: 100%" :format='dateFormat' :value-format="dateFormat"
						:placeholder="isReadOnly('选择日期')" :readonly="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="奖励单位" :label-width="formLabelWidth" prop="revard_unit">
					<el-input v-model="form.revard_unit" style="width: 100%" maxlength="25"
						:placeholder="isReadOnly('请输入')" :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="获奖日期" :label-width="formLabelWidth" prop="reward_date">
					<el-date-picker v-model="form.reward_date" align="right" type="date" :picker-options="pickerOptionsDisable.before"
						style="width: 100%" :format='dateFormat' :value-format="dateFormat"
						:placeholder="isReadOnly('选择日期')" :readonly="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="等级" :label-width="formLabelWidth" prop="awards_class">
					<el-input v-model="form.awards_class" maxlength="25" style="width: 100%"
						:placeholder="isReadOnly('请输入')" :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="参与情况" :label-width="formLabelWidth">
					<el-radio v-model="form.partake" label="1" :disabled="readonly">主持</el-radio>
					<el-radio v-model="form.partake" label="2" :disabled="readonly">参与</el-radio>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="备注" :label-width="formLabelWidth">
					<el-input v-model="form.remarks" type="textarea" :row="6" show-word-limit style="width: 100%"
						maxlength="100" :placeholder="isReadOnly('请输入')" :readonly="readonly">
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
	export default {
		name: 'TechForm',
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
					this.form = JSON.parse(JSON.stringify(this.formDefault))
					this.form = Object.assign(this.form, newVal)
				}
			},
		},
		data() {
			let that = this
			return {
				span: 24,
				readonly: false,
				pickerOptions: pickerOptions(),
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
				},
				dateFormat: dateFormat(),
				form: {
					reward_id: -1,
					org_id: -1,
					person_id: -1,
					awards_name: '',
					finish_date: getToday(),
					revard_unit: '',
					reward_date: getToday(),
					awards_class: '',
					partake: '1',
					remarks: ''

				},
				rules: {},
				rules_temp: {
					awards_name: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入成果名称'
					}],
					finish_date: [{
						required: true,
						trigger: 'blur',
						message: '请输入完成时间'
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							const finish_date = new Date(value)
							const reward_date = new Date(that.form.reward_date)
							if (finish_date > reward_date) {
								callback(new Error('完成时间要晚与或等于获奖时间'));
							} else {
								callback();
							}
						}
					}],
					reward_date: [{
						required: true,
						trigger: 'blur',
						message: '请输入获奖日期'
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							const reward_date = new Date(value)
							const finish_date = new Date(that.form.finish_date)
							if (finish_date > reward_date) {
								callback(new Error('获奖时间要早与或者等于完成时间'));
							} else {
								callback();
							}
						}
					}],
				},
				formLabelWidth: '120px',
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
				this.formDefault = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
				}
			},
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},
			close() {
				this.$refs['form'].resetFields()
				this.form = this.$options.data().form
				this.form = JSON.parse(JSON.stringify(this.formDefault))
				//this.$emit('fetch-data')
			},
			save(callback) {
				let that = this
				async function submit(callback) {
					let data = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: "awards_name",
							level: 3
						},
						{
							field: "finish_date",
							level: 4
						},
						{
							field: "revard_unit",
							level: 5
						},
						{
							field: "reward_date",
							level: 6
						},
						{
							field: "awards_class",
							level: 7
						},
						{
							field: "partake",
							level: 8
						},
						{
							field: "remarks",
							level: 9
						},
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (data.reward_id && data.reward_id > 0) { //更新
						sqlcode = 111
						fob = that.update_fob;
						msg = '更新'
						list.push({
							field: "reward_id",
							level: list.length
						})
					} else { //添加
						msg = '添加'
						sqlcode = 109
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
					} = await fob(list, that.form, sqlcode)
					if (code != 200) {
						that.$baseMessage(msg + '失败', 'error')
						return false
					}
					if (influence > 0) {
						that.$baseMessage(msg + '成功', 'success')
						that.close()
						if (callback) {
							callback(true)
						}
					} else {
						that.$baseMessage(msg + '失败', 'error')
					}
				}
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							submit(function() {
								if (callback) {
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
