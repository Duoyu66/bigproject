<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span">
				<el-form-item label="设计日期" :label-width="formLabelWidth" prop="design_date">
					<el-date-picker v-model="form.design_date" align="right" type="date"
						:placeholder="isReadOnly('选择日期')" :picker-options="pickerOptions"
						style="width: 100%" :format='dateFormat' :value-format="dateFormat" :readonly="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="项目名称" :label-width="formLabelWidth" prop="prj_name">
					<el-input v-model="form.prj_name" style="100%" type="textarea" :placeholder="isReadOnly('请输入项目名称')"
						:readonly="readonly" :autosize="{ minRows: 3, maxRows: 8}" maxlength='50' show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="规模" :label-width="formLabelWidth" prop="scale">
					<el-input v-model="form.scale" style="100%" maxlength="25" type="textarea"
						:placeholder="isReadOnly('请输入规模')" :readonly="readonly" :autosize="{ minRows: 2, maxRows: 4}"
						show-word-limit></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="是否主持人" :label-width="formLabelWidth" prop="isHost">
					<el-radio v-model="form.isHost" label="是" :disabled="readonly">是</el-radio>
					<el-radio v-model="form.isHost" label="否" :disabled="readonly">否</el-radio>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="证明人" :label-width="formLabelWidth" prop="witness">
					<el-input v-model="form.witness" :placeholder="isReadOnly('请输入证明人')" :readonly="readonly"
						style="100%" maxlength="8"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="证明人电话" :label-width="formLabelWidth" prop="witness_phone">
					<el-input v-model="form.witness_phone" :placeholder="isReadOnly('请输入证明人电话')" :readonly="readonly"
						style="100%" maxlength="16"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">

				<el-form-item label="备注" :label-width="formLabelWidth">
					<el-input v-model="form.remarks" :placeholder="isReadOnly('请输入备注')" :readonly="readonly"
						style="100%" maxlength="100" type="textarea" :autosize="{ minRows: 3, maxRows: 8}"
						show-word-limit></el-input>
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
		name: 'hostForm',
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
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(),
				form: {
					host_id: -1,
					person_id: -1,
					design_date: getToday(),
					prj_name: '',
					scale: '',
					isHost: '否',
					witness: '',
					witness_phone: '',
					remarks: '',
				},
				rules: {

				},
				rules_temp: {
					design_date: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择'
					}],
					prj_name: [{
						required: true,
						trigger: 'blur',
						message: '请输入项目名称'
					}],
					scale: [{
						required: true,
						trigger: 'blur',
						message: '请输入规模'
					}],
					witness: [{
						required: true,
						trigger: 'blur',
						message: '请输入证明人'
					}],
					witness_phone: [{
						required: true,
						trigger: 'blur',
						message: '请输入证明人电话'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							const flag = isTel(value) || isPhone(value)
							if (!flag) {
								callback(new Error('请输入正确的手机号或者固话'))
								return
							} else {
								callback()
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
			close(status) {
				this.$refs['form'].resetFields()
				this.form = this.$options.data().form
				this.$emit('fetch-data')
			},
			save(callback) {
				let that = this
				async function submit() {
					let data = JSON.parse(JSON.stringify(that.form));

					let list = [{
							field: "design_date",
							level: 1
						},
						{
							field: "prj_name",
							level: 2
						},
						{
							field: "scale",
							level: 3
						},
						{
							field: "isHost",
							level: 4
						},
						{
							field: "witness",
							level: 5
						},
						{
							field: "witness_phone",
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
					if (data.host_id && data.host_id > 0) { //更新
						sqlcode = 89
						fob = that.update_fob;
						msg = '更新'
						list.push({
							field: "host_id",
							level: 8
						})
					} else { //添加
						msg = '添加'
						sqlcode = 87
						fob = that.insert_fob;
						list.push({
							field: "person_id",
							level: 8
						})
					}
					const {
						code,
						influence
					} = await fob(list, that.form, sqlcode)
					console.log(that.form);
					if (code != 200) {
						that.$baseMessage(msg + '失败', 'error')
						return false
					}
					if (influence > 0) {
						that.$baseMessage(msg + '成功', 'success')
						that.close(true)
						callback(true)
					} else {
						that.$baseMessage(msg + '失败', 'error')
					}
				}
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							submit()
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
