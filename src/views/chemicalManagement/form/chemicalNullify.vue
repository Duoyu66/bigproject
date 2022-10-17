<template>
	<span>
		<el-form ref="purchase_from" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="name" label="化学品名称" :label-width="formLabelWidth">
						<el-input v-model="form.name" :placeholder="isReadOnly('')" readonly style="width: 100%">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="nullify_date" label="作废时间" :label-width="formLabelWidth">
						<el-date-picker v-model="form.nullify_date" align="right" type="date"
							:placeholder="isReadOnly('作废时间')" :picker-options="pickerOptions.before" style="width: 100%"
							:format='dateFormat' :value-format="dateFormat" :readonly="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="nullify_person" label="作废人" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.nullify_person"
							:fetch-suggestions="querySearchPerson" :placeholder="isReadOnly('请输入作废人...')" :maxlength='8'
							style="width: 100%;" :readonly="readonly" @select="handleSelect">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="nullify_quantity" :label="chemical.unit ?'作废数量('+chemical.unit+')': '作废数量'"
						:label-width="formLabelWidth">
						<el-input v-model="form.nullify_quantity" :placeholder="isReadOnly('请输入作废数量...')" type="number"
							step="0.001" style="width: 100%" min="0" :readonly="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="作废原因" :label-width="formLabelWidth" prop="nullify_reason">
						<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="64"
							:placeholder="isReadOnly('请输入作废原因...')" v-model="form.nullify_reason" show-word-limit
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
		name: 'PurchaseForm',
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
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						cert_image: file_about.upload.cert_image,
						material_list: file_about.upload.material_list
					},
					type_str: 'jpg/pdf/png/jpeg',
					type_array: ['image/jpeg', 'image/png', 'application/pdf'],
					file_size: '4',
					size_unit: 'MB',
					original_name: {
						cert_image: {},
						material_list: {},
					},
					success: {
						cert_image: false,
						material_list: false
					},
					old_delete: {
						cert_image: false,
						material_list: false
					}
				},
				form_old: {
					nullify_quantity: 0,
				},
				form: {
					store_id: -1,
					chemical_id: '',
					name: '',
					nullify_id: '',
					nullify_date: getToday(),
					nullify_mode: '',
					nullify_person: '',
					nullify_reason: '',
					nullify_quantity: 0,

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
					nullify_date: [{
						required: true,
						message: '请输入作废时间',
						trigger: 'blur',
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							if (!value) {
								callback()
								return
							}
							let min_buy_date = await GetChemicalBuyMinDate(undefined, that.form.store_id)
							if (!min_buy_date) {
								callback()
								return
							}
							min_buy_date = new Date(min_buy_date)
							let nullify_date = new Date(value)
							if (nullify_date < min_buy_date) {
								callback(new Error('作废时间应晚于最早购买时间（' + format_fob(min_buy_date) + ')'))
								return
							}
							callback()
						}
					}],
					nullify_person: [{
						required: true,
						message: '请输入作废人',
						trigger: 'blur',
					}],
					nullify_quantity: [{
						required: true,
						message: '请输入作废数量',
						trigger: 'blur',
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							if (typeof value == 'undefined') {
								callback()
								return
							}
							if (value < 0) {
								callback(new Error('作废数量应该大于0'))
								return
							}
							let list = await GetChemicalStore(await GetOrgId(), that.form.chemical_id)
							if (list && list.length > 0) {
								let item = list[0]
								let form_old = that.form_old
								if (!form_old.nullify_quantity) {
									form_old.nullify_quantity = 0
								}
								let quantity = 0
								if (form_old.store_id == that.form.store_id) {
									quantity = parseFloat(item.quantity) - parseFloat(value) + parseFloat(
										form_old.nullify_quantity)

								} else {
									quantity = parseFloat(item.quantity) - parseFloat(value)
								}
								if (quantity < 0) {
									//format_fob
									callback(new Error('作废数量需小于库存数量，现有库存' + item.quantity))
									return
								}
								callback()
							} else {
								callback(new Error('未找到对应的库存记录，请刷新重试'))
							}
						}
					}, ],
					nullify_reason: [{
						required: true,
						message: '请输入作废原因',
						trigger: 'blur',
					}, ],
				},
			}
		},
		watch: {
			formData: {
				handler: function(newVal, b) {
					if (newVal) {
						this.form = Object.assign(this.form, newVal)
						this.form_old = JSON.parse(JSON.stringify(newVal))
						this.file_default()
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
				this.form.nullify_person = item.value
				this.clearValidate('nullify_person')
			},
			clearValidate(prop) {
				this.$refs['purchase_from'].clearValidate(prop)
			},
			async init() {
				this.rules = this.rules_temp
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.form_old = JSON.parse(JSON.stringify(this.formData))
					this.file_default()
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
			file_default() {
				const form = JSON.parse(JSON.stringify(this.form))
				let that = this

			},
			fileUploadRefs() {
				return []
			},
			fileUpload(callback) {
				try {
					let that = this
					const refs = that.fileUploadRefs()
					let check_list = []
					const length = refs.length
					that.loading = true
					that.loadingText = '上传文件中'
					for (let i = 0; i < length; i++) {
						try {
							if (that.$refs[refs[i]].submitUpload() === 1) {
								check_list.push(refs[i]);
							}
						} catch (e) {
							console.log(e)
						}
					}
					let index = setInterval(function() {
						let flag = true
						let length = check_list.length
						while (--length > -1) {
							if (!that.upload.success[check_list[length]] && !that.$refs[check_list[length]].error) {
								flag = false
								break
							}

						}
						if (flag) {
							flag = true
							length = check_list.length
							while (--length > -1) {
								if (that.$refs[check_list[length]].error) {
									flag = false
								}
							}
							if (flag) {
								that.upload.delte_service = true
							}
							clearInterval(index)
							exec()
						}
					}, 500)

					function exec() {
						let flag = true
						let length = check_list.length
						while (--length > -1) {
							if (that.$refs[check_list[i]].error) {
								flag = false
							}
						}
						if (flag) {
							that.upload.delte_service = true
						}
						that.loading = false
						callback(flag)

					}
				} catch (e) {
					console.log(e)
				}
			},
			close() {
				let that = this
				that.$refs['purchase_from'].resetFields()
				const refs = this.fileUploadRefs()
				const length = refs.length
				for (let i = 0; i < length; i++) {
					try {
						that.$refs[refs[i]].clear()
					} catch (e) {
						console.log(e)
					}
				}
				this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
				that.form = that.$options.data().form
				that.form = JSON.parse(JSON.stringify(that.formdefalut))
			},
			resetForm() {
				this.$nextTick(() => {
					this.$refs['purchase_from'].resetFields()
					const refs = this.fileUploadRefs()
					const length = refs.length
					for (let i = 0; i < length; i++) {
						try {
							this.$refs[refs[i]].clear()
						} catch (e) {
							console.log(e)
						}
					}
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
							field: 'store_id',
							type: 3,
							level: 1
						},
						{
							field: 'org_id',
							type: 3,
							level: 2
						}, {
							field: 'nullify_date',
							type: 3,
							level: 3
						}, {
							field: 'nullify_mode',
							type: 3,
							level: 4
						}, {
							field: 'nullify_person',
							type: 3,
							level: 5
						}, {
							field: 'nullify_reason',
							type: 3,
							level: 6
						}, {
							field: 'nullify_quantity',
							type: 3,
							level: 7
						}, {
							field: 'chemical_id',
							type: 3,
							level: 8
						}, {
							field: 'nullify_id',
							type: 3,
							level: 9
						},
					]

					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.nullify_id && form.nullify_id > 0) {
						//更新
						sqlcode = 537
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 537
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
				that.$refs['purchase_from'].validate((valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							that.fileUpload(async function(
								status) {
								if (status) {
									const
										flag =
										await submit()
									callback(
										flag
									)
								}
							})
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
