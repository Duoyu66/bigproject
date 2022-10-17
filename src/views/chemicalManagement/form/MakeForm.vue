<template>
	<span>
		<el-form ref="purchase_from" :model="form" :rules="rules">
			<el-row>

				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="chemical_id" label="化学品" :label-width="formLabelWidth">
						<el-select v-model="form.chemical_id" value-key="store_id"
							:placeholder="isReadOnly('请选择化学品，没有请到化学品分配页面分配')" style="width: 100%"
							@change="chemical_id_change" filterable :disabled="disable.chemical_id">
							<!-- <div v-for="item in chemical_list" :key="item.store_id"> -->
							<el-option v-for="item in selectData.chemical_id" :key="item.chemical_id" :label="item.name"
								:value="item.chemical_id">
								<span style="float: left">{{ item.name }}</span>
								<span
									style="float: right; color: #8492a6; font-size: 13px">规格:{{ item.model }};单位:{{ item.unit }}</span>
							</el-option>
							<!-- </div> -->
						</el-select>
						<el-button type="primary" class="normal" @click="chemicalRefresh" v-show="!disable.chemical_id">
							刷新</el-button>
						<el-button type="primary" class="normal" @click="toChemicalAlloc" v-show="!disable.chemical_id">
							前往化学品分配页面</el-button>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="chemical_volume" :label="chemical.unit ?'消耗用量('+chemical.unit+')': '消耗用量'"
						:label-width="formLabelWidth">
						<el-input v-model="form.chemical_volume" :placeholder="isReadOnly('请输入消耗用量...')" type="number"
							step="0.001" style="width: 100%" min="0" :readonly="readonly" maxlength='53'>
						</el-input>
					</el-form-item>
				</el-col>

				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="mat_id" label="标准物质类别" :label-width="formLabelWidth">
						<el-select v-model="form.mat_id" value-key="store_id"
							:placeholder="isReadOnly('请选择标准物质，没有请到标准物质分配页面分配')" style="width: 100%"
							@change="mat_id_change" filterable :disabled="disable.mat_id">
							<!-- <div v-for="item in chemical_list" :key="item.store_id"> -->
							<el-option v-for="item in selectData.mat_id" :key="item.mat_id" :label="item.name"
								:value="item.mat_id">
								<span style="float: left">{{ item.name }}</span>
								<span
									style="float: right; color: #8492a6; font-size: 13px">规格:{{ item.model }};单位:{{ item.unit }}</span>
							</el-option>
							<!-- </div> -->
						</el-select>
						<el-button type="primary" class="normal" @click="RmRefresh" v-show="!disable.mat_id">
							刷新</el-button>
						<el-button type="primary" class="normal" @click="toRmAlloc" v-show="!disable.mat_id">
							前往标准物质分配页面</el-button>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="rm_store_name" label="标准物质名称" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.rm_store_name"
							:fetch-suggestions="querySearchRmStore" :placeholder="isReadOnly('请输入标准物质名称...')"
							:maxlength='8' style="width: 100%;" :readonly="readonly" @select="handleSelectRmStore">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="rm_volume" :label="rmMaterial.unit ?'制作数量('+rmMaterial.unit+')': '制作数量'"
						:label-width="formLabelWidth">
						<el-input v-model="form.rm_volume" :placeholder="isReadOnly('请输入制作数量...')" type="number"
							step="0.001" style="width: 100%" min="0" :readonly="readonly" maxlength='53'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="make_person" label="制作人" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.make_person"
							:fetch-suggestions="querySearchPerson" :placeholder="isReadOnly('请输入制作人...')" :maxlength='8'
							style="width: 100%;" :readonly="readonly" @select="handleSelect">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="make_date" label="制作时间" :label-width="formLabelWidth">
						<el-date-picker v-model="form.make_date" align="left" type="date"
							:placeholder="isReadOnly('请选择制作时间')" :picker-options="pickerOptions.before"
							style="width: 100%" :format='dateFormat' :value-format="dateFormat" :readonly="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="主要成分" :label-width="formLabelWidth" prop="component">
						<el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" maxlength="100"
							:placeholder="isReadOnly('请输入主要成分...')" v-model="form.component" show-word-limit
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
		isNumEx
	} from '@/utils/validate'
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

	import {
		GetRmBuyMinDate,
		GetRmAlloc,
		GetRmStore
	} from '../../substanceCategory/commonJs/common.substanceCategory.js'

	import upload from '@/components/Upload/upload'
	export default {
		name: 'MakeForm',
		components: {
			upload,
		},
		props: {
			formData: {
				type: Object,
				required: false,
			},
			chemicalSelectStatus: {
				type: Boolean,
				required: false,
				default: true
			},
			rmSelectStatus: {
				type: Boolean,
				required: false,
				default: false
			}
		},
		data() {
			let that = this
			return {
				disable: {
					chemical_id: true,
					mat_id: false,
				},
				rmMaterial: {
					unit: '',
				},
				chemical: {
					unit: '',
				},


				uploadDeault: {

				},
				formdefalut: {

				},
				date_is_valid: undefined,
				isAlloc: false,
				inEditMode: false,
				isEmptyList: true,
				readonly: false,


				form_old: {
					chemical_volume: 0,
				},
				form: {
					chemical_id: '',
					make_id: '',
					org_id: '',
					store_id: -1,
					mat_id: '',
					chemical_volume: 0,
					rm_volume: 0,
					make_date: getToday(),
					rm_store_id: -1,
					component: '',
					make_person: '',
					rm_store_name: ''
				},
				selectData: {
					chemical_id: [],
					mat_id: []
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
					chemical_id: [{
						required: true,
						message: '请选择化学品',
						trigger: ['blur', 'change'],
					}],
					rm_store_name: [{
						required: true,
						message: '请输入标准物质名称',
						trigger: ['blur', 'change'],
					}],
					chemical_volume: [{
						required: true,
						message: '请输入消耗用量',
						trigger: 'blur',
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (typeof value == 'undefined') {
								callback()
								return
							}
							if (!isNumEx(value)) {
								callback(new Error('请输入数字'))
								return
							}
							if (value < 0) {
								callback('不能为负数')
								return
							}
							let store_id = that.form.store_id
							if (store_id < 1) {
								store_id = undefined
							}
							let list = await GetChemicalStore(undefined, that.form.chemical_id, undefined,
								store_id)

							if (list && list.length > 0) {
								let item = list[0]
								let form_old = that.form_old
								if (!form_old.chemical_volume) {
									form_old.chemical_volume = 0
								}
								if (parseFloat(item.quantity) - parseFloat(value) + parseFloat(form_old
										.chemical_volume) < 0) {
									//format_fob
									callback(new Error('用量需小于库存数量，现有库存' + item.quantity))
									return
								}
								callback()
							} else {
								callback(new Error('未找到对应的库存记录，请刷新重试'))
							}
						}
					}, ],
					mat_id: [{
						required: true,
						message: '请选择标准物质',
						trigger: 'blur',
					}],
					rm_volume: [{
						required: true,
						message: '请输入制作量',
						trigger: 'blur',
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (typeof value == 'undefined') {
								callback()
								return
							}
							if (!isNumEx(value)) {
								callback(new Error('请输入数字'))
								return
							}
							if (value <= 0) {
								callback(new Error('制作量请大于0'))
								return
							}
							callback()
						}
					}, ],
					make_date: [{
						required: true,
						message: '请选择制作时间',
						trigger: 'blur',
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							if (!value) {
								callback()
								return
							}
							let use_date = new Date(value)
							let min_buy_date = await GetChemicalBuyMinDate(undefined, that.form.store_id)
							if (min_buy_date) {
								min_buy_date = new Date(min_buy_date)
								if (use_date < min_buy_date) {
									callback(new Error('制作时间应早于最晚购买时间（' + format_fob(min_buy_date) + ')'))
									return
								}
							}
							callback()
						}
					}]

				},
			}
		},
		watch: {
			formData: {
				handler: function(newVal, b) {
					if (newVal) {
						this.form = Object.assign(this.form, newVal)
						this.form_old = JSON.parse(JSON.stringify(newVal))
						console.log('watch', this.form_old)
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
			async init() {
				this.rules = this.rules_temp

				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				await this.getData()
				this.stautsSet()
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.form_old = JSON.parse(JSON.stringify(this.formData))
					this.GetChemicalBaseInfoByStoreId(this.formData.store_id)
				}

			},
			stautsSet() {
				this.$set(this.disable, 'chemical_id', this.chemicalSelectStatus)
				this.$set(this.disable, 'mat_id', this.rmSelectStatus)
			},
			toRmAlloc(event) {
				this.$router.push({
					path: '/standardManagement/materialCustomizations',
				})
				//this.$router.push('standardManagement/materialCustomizations')
			},
			toChemicalAlloc(event) {
				this.$router.push('/chemicalManagement/chemicalDistribution')
			},
			async getData() {
				await this.chemicalRefresh()
				await this.RmRefresh()
			},
			async chemicalRefresh() {
				let data = await GetChemicalStore()
				this.selectData.chemical_id = data
				return data
			},
			async RmRefresh() {
				let data = await GetRmAlloc()
				this.selectData.mat_id = data
				return data
			},
			handleSelectRmStore(item, e) {
				if (!item || !item.name) {
					return
				}
				this.form.rm_store_name = item.name
				this.clearValidate('rm_store_name')
			},
			handleSelect(item, e) {
				if (!item || !item.value) {
					return
				}
				this.form.make_person = item.value
				this.clearValidate('make_person')
			},
			clearValidate(prop) {
				this.$refs['purchase_from'].clearValidate(prop)
			},

			async mat_id_change(value) {
				let list = this.selectData.mat_id.filter((e) => {
					if (e.mat_id == value) {
						return e
					}
				})
				if (!list || list.length == 0) {
					return
				}
				this.rmMaterial = list[0]
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
			async querySearchRmStore(queryString, cb) {
				let data = await GetRmStore(undefined, this.form.mat_id, queryString)

				cb(data)
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


			close() {
				let that = this
				that.$refs['purchase_from'].resetFields()

				that.form = that.$options.data().form
				that.form = JSON.parse(JSON.stringify(that.formdefalut))
			},
			resetForm() {
				this.$nextTick(() => {
					this.$refs['purchase_from'].resetFields()

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
							field: 'rm_store_name',
							type: 3,
							level: 0
						}, {
							field: 'mat_id',
							type: 3,
							level: 1
						},
						{
							field: 'org_id',
							type: 3,
							level: 2
						},
						{
							field: 'chemical_volume',
							type: 3,
							level: 3
						},
						{
							field: 'rm_volume',
							type: 3,
							level: 4
						},
						{
							field: 'make_date',
							type: 3,
							level: 5
						},
						{
							field: 'rm_store_id',
							type: 3,
							level: 6
						},
						{
							field: 'component',
							type: 3,
							level: 7
						},
						{
							field: 'make_person',
							type: 3,
							level: 8
						},
						{
							field: 'chemical_id',
							type: 3,
							level: 9
						},
						{
							field: 'store_id',
							type: 3,
							level: 10
						},
						{
							field: 'make_id',
							type: 3,
							level: 11
						},
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.make_id && form.make_id > 0) {
						//更新
						sqlcode = 569
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 569
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
						let tips = '确定提交？'
						if (that.form.isEditStore == '1') {
							tips = tips + '提交后将按照实际库存修改系统库存数量'
						}
						that.$baseConfirm(tips, null, async () => {
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
