<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span">
				<el-form-item label="工作单位" :label-width="formLabelWidth" prop="company">
					<el-input v-model="form.company" :placeholder="placeholder('请输入单位名称')" style="width: 100%"
						maxlength='50' :readonly="readonly"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="工作内容" :label-width="formLabelWidth" prop="job_content">
					<el-input v-model="form.job_content" :placeholder="placeholder('请输入工作内容')" style="width: 100%"
						type="textarea" :autosize="{ minRows: 4, maxRows: 10}" maxlength='100' show-word-limit
						:readonly="readonly"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="职位" :label-width="formLabelWidth">
					<el-input v-model="form.duty" :placeholder="placeholder('请输入职位')" style="width: 100%" maxlength='25'
						:readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="职称" :label-width="formLabelWidth">
					<el-input v-model="form.professional_title" :placeholder="placeholder('请输入职称')" style="width: 100%"
						maxlength='25' :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="开始日期" :label-width="formLabelWidth" prop="start_date">
					<el-date-picker v-model="form.start_date" align="right" type="date"
						:placeholder="placeholder('选择日期')" :readonly="readonly" :picker-options="pickerOptions"
						style="width: 100%" :format='dateFormat' :value-format="dateFormat">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="结束日期" :label-width="formLabelWidth" prop="end_date">
					<el-date-picker v-model="form.end_date" align="right" type="date" :placeholder="placeholder('选择日期')"
						:readonly="readonly" :picker-options="pickerOptions" style="width: 100%" :format='dateFormat'
						:value-format="dateFormat">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="证明人" :label-width="formLabelWidth" prop="witness_person">
					<el-input v-model="form.witness_person" :placeholder="placeholder('请输入证明人姓名')" style="width: 100%"
						maxlength='8' :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="证明人电话" :label-width="formLabelWidth" prop="witness_mobile">
					<el-input v-model="form.witness_mobile" :placeholder="placeholder('请输入证明人电话')" style="width: 100%"
						maxlength='16' :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
	import {
		isTel,
		isPhone
	} from '@/utils/validate'
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
	export default {
		name: 'WorkForm',
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
					this.form = Object.assign(this.form, newVal)
				}
			},
		},
		data() {
			let that = this
			return {
				span: 24,
				readonly: false,
				dateFormat: dateFormat(),
				pickerOptions: pickerOptions(),
				form: {
					org_id: '',
					person_id: '',
					company: '',
					job_content: '',
					duty: '',
					professional_title: '',
					start_date: getToday(),
					end_date: getToday(),
					witness_person: '',
					witness_mobile: '',
				},
				rules: {},
				rules_temp: {
					company: [{
						required: true,
						trigger: ["blur"],
						message: '请输入工作单位'
					}],
					job_content: [{
						required: true,
						trigger: 'blur',
						message: '请输入工作内容'
					}],
					witness_person: [{
						required: true,
						trigger: 'blur',
						message: '请输入见证人'
					}],
					witness_mobile: [{
						required: true,
						trigger: 'blur',
						message: '请输入证明人电话'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							const flag = isTel(rule) || isPhone(value)
							if (!flag) {
								callback(new Error('请输入正确的手机号或者固话'))
								return
							} else {
								callback()
							}

						}
					}],
					start_date: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请输入开始时间'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							const end = new Date(that.form.end_date)
							const start = new Date(value)
							if (start > end) {
								callback(new Error('开始时间不能晚与结束时间'))
								return
							} else {
								callback()
							}
						}
					}],
					end_date: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请输入结束时间'
					}, {
						trigger: ['blur'],
						validator: async function(rule, value, callback) {

							const end = new Date(value)
							const start = new Date(that.form.start_date)
							if (start > end) {
								callback(new Error('结束时间不能早与开始时间'))
								return
							} else {
								callback()
							}

						}
					}]
				},
				formLabelWidth: '120px',
			}

		},

		created() {
			this.init()
		},
		methods: {
			placeholder(text) {
				if (this.readonly) {
					return ''
				}
				return text
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
				this.formDefault = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
				}
			},
			close() {
				this.$refs['form'].resetFields()
				this.details = this.$options.data().details
				this.form = JSON.parse(JSON.stringify(this.formDefault))
				//this.$emit('fetch-data')
			},

			save(callback) {
				let that = this
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							let data = JSON.parse(JSON.stringify(that.form));
							let list = [{
									field: "company",
									level: 3
								},
								{
									field: "job_content",
									level: 4
								},
								{
									field: "duty",
									level: 5
								},
								{
									field: "professional_title",
									level: 6
								},
								{
									field: "start_date",
									level: 7
								},
								{
									field: "end_date",
									level: 8
								},
								{
									field: "witness_person",
									level: 9
								},
								{
									field: "witness_mobile",
									level: 10
								}
							]
							let fob = '';
							let sqlcode = -1;
							let msg = ''
							if (data.exp_id) { //更新
								sqlcode = 79
								fob = that.update_fob;
								msg = '更新'
								list.push({
									field: "exp_id",
									level: 13
								})
							} else { //添加
								msg = '添加'
								sqlcode = 78
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
