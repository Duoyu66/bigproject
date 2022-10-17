<template>
	<span>
		<el-form ref="chemicalStore_from" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="name" label="化学品名称" :label-width="formLabelWidth">
						<el-input v-model="form.name" :placeholder="isReadOnly('')" readonly disabled
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
							style="width: 100%" maxlength='53'>
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
					<el-form-item label="存放地" :label-width="formLabelWidth" prop="storage_place">
						<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="16"
							:placeholder="isReadOnly('请输入存放地...')" v-model="form.storage_place" show-word-limit
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
		getOrgNameByselect,
		GetPersonList,
		file_about,
		GetChemicalStore,
		GetChemicalBuyMinDate,
		GetChemicalBaseInfoByStoreId
	} from '../commonjs/common.chemical'
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
					store_id: -1,
					chemical_id: '',
					name: '',
					manage_id: '',
					quantity: 0,
					keeper: '',
					usage: '',
					storage_place: '',



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
					keeper: [{
						required: true,
						message: '请输入保管人',
						trigger: 'blur',
					}],

					storage_place: [{
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
							} = await that.QueryExec_fob(555, list, form)
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
						this.GetChemicalBaseInfoByStoreId(this.formData.store_id)
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
					this.GetChemicalBaseInfoByStoreId(this.formData.store_id)
				}

			},
			async GetChemicalBaseInfoByStoreId(store_id) {
				if (!store_id) {
					store_id = this.form.store_id
				}
				if (!store_id) {
					return
				}
				let chemical = await GetChemicalBaseInfoByStoreId(undefined, store_id)
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
			async chemicalInit() {
				let data = await this.chemicalRefresh()
				if (!data || data.length == 0) {
					if (!this.form.store_id || this.form.store_id < 0) {
						this.isAlloc = false
					}
				} else {
					this.isAlloc = true
				}
			},
			toChemicalAlloc(event) {
				this.$router.push('chemicalDistribution')
			},
			async chemicalRefresh() {
				let data = await GetChemicalAlloc()
				this.selectData.chemical_id = data
				return data
			},
			async chemical_id_change(value) {
				let list = this.selectData.chemical_id.filter((e) => {
					if (e.chemical_id == value) {
						return e
					}
				})
				if (!list || list.length == 0) {
					return
				}
				this.chemical = list[0]
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
							field: 'storage_place',
							type: 3,
							level: 4
						}
					]

					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.store_id && form.store_id > 0) {
						//更新
						sqlcode = 556
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
