<template>
	<span>
		<el-form ref="chemicalStore_from" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="name" label="标准物质名称" :label-width="formLabelWidth">
						<el-input v-model="form.name" :placeholder="isReadOnly('请输入标准物质名称')" :readonly="readonly"
							:disabled="readonly" style="width: 100%" maxlength='20'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="mat_name" label="类别" :label-width="formLabelWidth">
						<el-input v-model="form.mat_name" :placeholder="isReadOnly('')" readonly disabled
							style="width: 100%">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="manage_id" label="管理编号" :label-width="formLabelWidth">
						<el-input v-model="form.manage_id" :placeholder="isReadOnly('请输入管理编号')" :readonly="readonly"
							style="width: 100%" maxlength='16'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="name" label="数量" :label-width="formLabelWidth">
						<el-input v-model="form.quantity" :placeholder="isReadOnly('')" readonly disabled
							style="width: 100%">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="keeper" label="保管人" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.keeper"
							:fetch-suggestions="querySearchPerson" :placeholder="isReadOnly('请输入保管人...')" :maxlength='8'
							style="width: 100%;" :readonly="readonly" @select="handleSelect">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>

				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="存放地" :label-width="formLabelWidth" prop="position">
						<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="16"
							:placeholder="isReadOnly('请输入存放地...')" v-model="form.position" show-word-limit
							style="width: 100%" :readonly="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="用途" :label-width="formLabelWidth" prop="usage">
						<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="32"
							:placeholder="isReadOnly('请输入用途...')" v-model="form.usage" show-word-limit
							style="width: 100%" :readonly="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
					<el-form-item prop="check_cycle" label="校验周期(天)" :label-width="formLabelWidth2">
						<el-input v-model="form.check_cycle" :placeholder="isReadOnly('请输入校验周期')" :readonly="readonly"
							type="number" style="width: 100%" maxlength='53'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
					<el-form-item prop="advance_check_day" label="校验过期提前提醒天数(天)" :label-width="formLabelWidth2">
						<el-input v-model="form.advance_check_day" :placeholder="isReadOnly('请输入校验过期提前提醒天数...')"
							:readonly="readonly" type="number" style="width: 100%" maxlength='53'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
					<el-form-item prop="period_cycle" label="核查周期(天)" :label-width="formLabelWidth2">
						<el-input v-model="form.period_cycle" :placeholder="isReadOnly('请输入核查周期')" :readonly="readonly"
							type="number" style="width: 100%" maxlength='53'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
					<el-form-item prop="advance_period_day" label="核查过期提前提醒天数" :label-width="formLabelWidth2">
						<el-input v-model="form.advance_period_day" :placeholder="isReadOnly('请输入核查过期提前提醒天数...')"
							:readonly="readonly" type="number" style="width: 100%" maxlength='53'>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</span>
</template>
<script>
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
		GetRmAlloc,
		GetOrgId,
		GetPersonRoleMax,
		getOrgNameByselect,
		GetPersonList,
		file_about,
		GetRmStore,
		GetRmBuyMinDate,
		GetRmBaseInfoByStoreId
	} from '../commonJs/common.substanceCategory'
	import upload from '@/components/Upload/upload'
	export default {
		name: 'rmStoreForm',
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
					store_id: -1,
					chemical_id: '',
					name: '',
					manage_id: '',
					quantity: 0,
					keeper: '',
					usage: '',
					position: '',
					check_cycle: '',
					period_cycle: '',
					advance_check_day: '',
					advance_period_day: '',
				},
				selectData: {
					chemical_id: '',
				},
				formLabelWidth: '120px',
				formLabelWidth2: '180px',
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
					keeper: [{
						required: true,
						message: '请输入保管人',
						trigger: 'blur',
					}],

					position: [{
						required: true,
						message: '请输入保存地',
						trigger: 'blur',
					}],

					manage_id: [{
						required: true,
						message: '请输入管理编号',
						trigger: 'blur',
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							let form = {}
							let list = [{
								field: 'manage_id',
								type: 3,
								level: 1,
							}, {
								field: 'org_id',
								type: 3,
								level: 2,
							}]
							form.manage_id = value;
							form.org_id = that.form.org_id
							const {
								code,
								data
							} = await that.QueryExec_fob(613, list, form)
							if (code == 200) {
								let length = data.length
								if (!that.form.store_id && length > 0) {
									callback(new Error('已存在该管理编号'))
									return
								}
								let flag = false
								while (--length > -1) {
									if (data[length].store_id != that.form.store_id) {
										flag = true
										break
									}
								}
								if (flag) {
									callback(new Error('已存在该管理编号'))
								} else {
									callback()
								}
							} else {
								callback(new Error('查询数据库异常，请刷新重试'))
							}
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
						this.GetRmBaseInfoByStoreId(this.formData.store_id)
					}
				},
				deep: true,
			},
		},
		created() {
			this.init()
		},
		methods: {
			handleSelect(item, e) {
				if (!item || !item.value) {
					return
				}
				this.form.keeper = item.value
				this.clearValidate('keeper')
			},
			clearValidate(prop) {
				this.$refs['chemicalStore_from'].clearValidate(prop)
			},
			async init() {
				this.rules = this.rules_temp
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.form_old = JSON.parse(JSON.stringify(this.formData))
					this.GetRmBaseInfoByStoreId(this.formData.store_id)
				}

			},
			async GetRmBaseInfoByStoreId(store_id) {
				if (!store_id) {
					store_id = this.form.store_id
				}
				if (!store_id) {
					return
				}
				let chemical = await GetRmBaseInfoByStoreId(undefined, store_id)
				this.chemical = chemical
			},
			isReadOnly(txt) {
				if (this.readonly) {
					return ''
				}
				return txt
			},
			async orgname() {
				this.organization.org_name = await getOrgNameByselect()
			},
			toChemicalAlloc(event) {
				this.$router.push('chemicalDistribution')
			},

			async querySearchPerson(queryString, cb) {
				let data = await GetPersonList(undefined, queryString)
				if (data) {
					let length = data.length
					for (let i = 0; i < length; i++) {
						data[i]['value'] = data[i].name
					}
				}
				cb(data)
			},

			close() {
				let that = this
				that.$refs['chemicalStore_from'].resetFields()

				that.form = that.$options.data().form
			},
			resetForm() {
				this.$nextTick(() => {
					this.$refs['chemicalStore_from'].resetFields()

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
							field: 'manage_id',
							type: 3,
							level: 1
						},
						{
							field: 'keeper',
							type: 3,
							level: 2
						}, {
							field: 'usage',
							type: 3,
							level: 3
						}, {
							field: 'position',
							type: 3,
							level: 4
						}, {
							field: 'name',
							type: 3,
							level: 5
						}, {
							field: 'check_cycle',
							type: 3,
							level: 6
						}, {
							field: 'period_cycle',
							type: 3,
							level: 7
						}, {
							field: 'advance_check_day',
							type: 3,
							level: 8
						}, {
							field: 'advance_period_day',
							type: 3,
							level: 9
						}
					]

					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.store_id && form.store_id > 0) {
						//更新
						sqlcode = 614
						fob = that.update_fob;
						msg = '更新'
						list.push({
							field: 'store_id',
							type: 3,
							level: list.length
						})
					} else {
						//添加
						msg = '添加'
						sqlcode = -1
						fob = that.QueryExec_fob_custom;
						that.form.org_id = await GetOrgId()
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
				that.$refs['chemicalStore_from'].validate((valid) => {
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
	div.noche {
		font-size: 30px;
		color: red;
		width: 100%;
		text-align: center;
		margin-top: 1px;
		margin-bottom: 1px;
	}
</style>
