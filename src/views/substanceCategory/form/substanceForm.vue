<template>
	<span>
		<el-form ref="standradForm" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="name" label="标准物质名称" :label-width="formLabelWidth">
						<el-input v-model="form.name" :placeholder="isReadOnly('请输入标准物质名称')" :readonly="readonly"
							style="width: 100%" maxlength="16">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="计量单位" prop="unit" :label-width="formLabelWidth">
						<el-select v-model="form.unit" filterable allow-create style="width: 100%">
							<el-option label="g" value="g"></el-option>
							<el-option label="kg" value="kg"></el-option>
							<el-option label="ml" value="ml"></el-option>
							<el-option label="L" value="L"></el-option>
							<el-option label="mg" value="mg"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="标准物质规格" prop="model" :label-width="formLabelWidth">
						<el-input v-model="form.model" autocomplete="off" maxlength="16" style="width: 100%">
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
	import {
		ExecSql,
		QueryExec
	} from '@/api/table'
	import {
		GetChemicalAlloc,
		GetOrgId,
		GetPersonRoleMax,
	} from '../commonJs/common.substanceCategory'
	import upload from '@/components/Upload/upload'
	export default {
		name: 'chemicalStoreForm',
		components: {
			upload,
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
					mat_id: -1,
					name: '',
					model: '',
					unit: ''


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
						message: '请输入标准物质名称',
						trigger: 'blur',
					}],
					model: [{
						required: true,
						message: '请输入标准物质规格',
						trigger: 'blur',
					}],
					unit: [{
						required: true,
						message: '请输入计量单位',
						trigger: 'blur',
					}, {
						trigger: ['blur','change'],
						validator: async function(rule, value, callback) {
							if (value && value.length > 8) {
								callback('计量单位请在8个字以内')
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
							field: 'model',
							type: 3,
							level: 2
						}, {
							field: 'unit',
							type: 3,
							level: 3
						}, {
							field: 'mat_id',
							type: 3,
							level: 4
						}
					]

					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.mat_id && form.mat_id > 0) {
						//更新
						sqlcode = 558
						fob = that.update_fob;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 558
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
