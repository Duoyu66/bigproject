<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span">
				<el-form-item label="试验名称" :label-width="formLabelWidth">
					<el-input v-model="form.object_name" style="width: 100%" readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="参数名称" :label-width="formLabelWidth">
					<el-input v-model="form.param" style="width: 100%" readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="生效日期" :label-width="formLabelWidth" prop="effective_date">
					<el-date-picker v-model="form.effective_date" align="right" type="date"
						:placeholder="isReadOnly('选择日期')" :picker-options="pickerOptions" style="width: 100%"
						:format='dateFormat' :value-format="dateFormat" :readonly="readonly">
					</el-date-picker>
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
	export default {
		name: 'DivisionEdit',
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
		data() {
			return {
				formLabelWidth: '120px',
				span: 24,
				readonly: false,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(),
				formdefalut: {},
				form: {
					object_name: '',
					param: '',
					work_id: -1,
					effective_date: getToday()
				},
				rules: {},
				rules_temp: {
					effective_date: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择生效日期'
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
			uploadForm(newVal) {
				this.form = JSON.parse(JSON.stringify(this.formdefalut))
				this.form = Object.assign(this.form, newVal)
			},
			close() {
				this.$refs['form'].resetFields()
				this.details = this.$options.data().details
				this.dialogFormVisible = false
				this.form = JSON.parse(JSON.stringify(this.formdefalut))
				this.$emit('fetch-data')
			},
			save(callback) {
				let that = this
				async function submit() {
					let data = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: "object_id",
							level: 2
						},
						{
							field: "param_id",
							level: 3
						},
						{
							field: "effective_date",
							level: 4
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (data.work_id && data.work_id > 0) { //更新
						sqlcode = 152
						fob = that.update_fob;
						msg = '更新'
						list.push({
							field: "work_id",
							level: 1
						})
					} else { //添加
						msg = '添加'
						sqlcode = -1
						fob = that.insert_fob;
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
						return true
					} else {
						that.$baseMessage(msg + '失败', 'error')
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
