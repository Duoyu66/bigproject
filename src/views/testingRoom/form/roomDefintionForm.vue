<template>
	<span>
		<el-form ref="standradForm" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="form.room_no">
					<el-form-item prop="room_no" label="检测室编码" :label-width="formLabelWidth">
						<el-input v-model="form.room_no" :placeholder="isReadOnly('')" :readonly="true"
							style="width: 100%" :disabled="true">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="name" label="检测室名称" :label-width="formLabelWidth">
						<el-input v-model="form.name" :placeholder="isReadOnly('请输入检测室名称')" :readonly="readonly"
							style="width: 100%" maxlength="16">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="description" label="介绍" :label-width="formLabelWidth">
						<el-input v-model="form.description" :placeholder="isReadOnly('请输入介绍')" :readonly="readonly"
							style="width: 100%" maxlength="128" show-word-limit type="textarea" :autosize='{ minRows: 4,
							maxRows: 10 }'>
						</el-input>
					</el-form-item>
				</el-col>

			</el-row>
		</el-form>
	</span>
</template>
<script>
	let g_this
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
	} from '@/utils/dateHelp'
	import {
		sql_helper
	} from '@/global/sql_helper'
	export default {
		name: 'roomDefintionForm',
		components: {

		},
		props: {
			formData: {
				type: Object,
				required: false,
			},
		},
		data() {
			let that = this
			return {
				uploadDeault: {

				},
				formdefalut: {

				},
				date_is_valid: undefined,
				isAlloc: false,
				inEditMode: false,
				isEmptyList: true,
				readonly: false,
				chemical: {
					unit: '',
				},

				form_old: {
					nullify_quantity: 0,
				},
				form: {
					room_no: '',
					name: '',
					room_id: '',
					description: '',
				},
				selectData: {
					chemical_id: '',
				},
				formLabelWidth: '120px',
				pickerOptions: {
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
				organization: {
					org_name: ''
				},
				title: '',
				rules: {

				},
				rules_temp: {
					name: [{
						required: true,
						message: '请输入检测室名称',
						trigger: 'blur',
					}],
					description: [{
						required: false,
						message: '请输入计量单位',
						trigger: 'blur',
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (value && value.length >= 128) {
								callback('请在128个字以内')
								return
							}
							callback()
						}
					}],
				},
			}
		},
		watch: {
			formData: {
				handler: function(newVal, b) {
					if (newVal) {
						this.form = Object.assign(this.form, newVal)
						this.form_old = JSON.parse(JSON.stringify(newVal))
					}
				},
				deep: true,
			},
		},
		created() {
			this.init()
		},
		methods: {
			clearValidate(prop) {
				this.$refs['standradForm'].clearValidate(prop)
			},
			async init() {
				this.rules = this.rules_temp
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.form_old = JSON.parse(JSON.stringify(this.formData))
				}

			},

			isReadOnly(txt) {
				if (this.readonly) {
					return ''
				}
				return txt
			},

			close() {
				let that = this
				that.$refs['standradForm'].resetFields()

				that.form = that.$options.data().form
			},
			resetForm() {
				this.$nextTick(() => {
					this.$refs['standradForm'].resetFields()

				})
			},
			async QueryExec_fob_custom(list, form, sqlcode) {
				return await this.QueryExec_fob(sqlcode, list, form)
			},
			save(callback) {
				let that = this
				async function submit() {
					that.loading = true
					that.loadingText = '提交表单中...'
					let form = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: 'name',
							type: 3,
							level: 1
						},
						{
							field: 'description',
							type: 3,
							level: 2
						}, {
							field: 'room_no',
							type: 3,
							level: 3
						}, {
							field: 'room_id',
							type: 3,
							level: 4
						}
					]

					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.room_no && form.room_no > 0) {
						//更新
						sqlcode = 624
						fob = that.update_fob;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 624
						fob = that.update_fob;
					}

					const {
						code,
						influence,
						data
					} = await fob(list, that.form, sqlcode)
					console.log(code, influence, data);
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
				that.$refs['standradForm'].validate((valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {

							const flag = await submit()
							callback(flag)

						})

					} else {
						that.$baseMessage('表单校验失败，请更正后重新提交', 'error')
						return false
					}
				})
			},
		},
	}
</script>
<style scoped>

</style>
