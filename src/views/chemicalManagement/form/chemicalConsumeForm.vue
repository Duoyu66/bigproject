<template>
	<span>
		<el-form ref="purchase_from" :model="form" :rules="rules">
			<el-row>

				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="form.name">
					<el-form-item prop="name" label="化学品名称" :label-width="formLabelWidth">
						<el-input v-model="form.name" :placeholder="isReadOnly('')" readonly style="width: 100%">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="person_id" label="使用人" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.person_id"
							:fetch-suggestions="querySearchPerson" :placeholder="isReadOnly('请输入使用人...')" :maxlength='8'
							style="width: 100%;" :readonly="readonly" @select="handleSelect">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="volume" :label="chemical.unit ?'用量('+chemical.unit+')': '用量'"
						:label-width="formLabelWidth">
						<el-input v-model="form.volume" :placeholder="isReadOnly('请输入用量...')" type="number" step="0.001"
							style="width: 100%" min="0" :readonly="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="消耗原因" :label-width="formLabelWidth" prop="usage">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" maxlength="100"
							:placeholder="isReadOnly('请输入消耗原因...')" v-model="form.usage" show-word-limit
							style="width: 100%" :readonly="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="use_date" label="使用时间" :label-width="formLabelWidth">
						<el-date-picker v-model="form.use_date" align="right" type="date"
							:placeholder="isReadOnly('请选择使用时间')" :picker-options="pickerOptions.before"
							style="width: 100%" :format='dateFormat' :value-format="dateFormat" :readonly="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="recorder" label="记录人" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.recorder"
							:fetch-suggestions="querySearchPerson" :placeholder="isReadOnly('请输入记录人...')" :maxlength='8'
							style="width: 100%;" :readonly="readonly" @select="handleSelect">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="record_date" label="记录时间" :label-width="formLabelWidth">
						<el-date-picker v-model="form.record_date" align="right" type="date"
							:placeholder="isReadOnly('请选择记录时间')" :picker-options="pickerOptions.before"
							style="width: 100%" :format='dateFormat' :value-format="dateFormat" :readonly="readonly">
						</el-date-picker>
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
		name: 'chemicalConsumeForm',
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
					volume: 0,
				},
				form: {
					consume_id: -1,
					org_id: '',
					store_id: -1,
					person_id: '',
					volume: 0,
					usage: '',
					use_date: getToday(),
					recorder: '',
					record_date: '',
					name: '',

				},
				selectData: {
					check_type: [],
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
					person_id: [{
						required: true,
						message: '请输入使用人',
						trigger: 'blur',
					}],
					use_date: [{
						required: true,
						message: '请选择使用时间',
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
									callback(new Error('使用时间应早于最晚购买时间（' + format_fob(min_buy_date) + ')'))
									return
								}
							}

							let date_temp = ''
							if (that.form.record_date) {
								date_temp = new Date(that.form.record_date)
								if (date_temp < use_date) {
									callback(new Error('使用时间应早于或等于记录时间'))
									return
								}
							}
							callback()
						}
					}],
					volume: [{
						required: true,
						message: '请输入用量',
						trigger: 'blur',
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (typeof value == 'undefined') {
								callback()
								return
							}
							if (value < 0) {
								callback(new Error('用量应该大于0'))
								return
							}
							let list = await GetChemicalStore(undefined, undefined, undefined, that.form
								.store_id)
							if (list && list.length > 0) {
								let item = list[0]
								let form_old = that.form_old
								if (!form_old.volume) {
									form_old.volume = 0
								}
								let quantity = 0;
								item.quantity = parseFloat(item.quantity);
								form_old.volume = parseFloat(form_old.volume);
								value = parseFloat(value);
								console.log(form_old.store_id, that.form.store_id)
								if (form_old.store_id == that.form.store_id) {
									quantity = item.quantity - value + form_old.volume

								} else {
									quantity = item.quantity - value
								}
								if (quantity < 0) {
									//format_fob
									callback(new Error('消耗数量需小于库存数量，最大数量' + (item.quantity + form_old
										.volume)))
									return
								}
								callback()
							} else {
								callback(new Error('未找到对应的库存记录，请刷新重试'))
							}
						}
					}, ],
					record_date: [{
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							if (!value) {
								callback()
								return
							}

							let record_date = new Date(value)
							let date_temp = ''
							if (that.form.use_date) {
								date_temp = new Date(that.form.use_date)
								if (date_temp > record_date) {
									callback(new Error('记录时间应晚于或等于使用时间'))
									return
								}
							}
							callback()
						}
					}],
					usage: [{
						required: true,
						message: '请输入消耗原因',
						trigger: 'blur',
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
						console.log('watch', this.form_old)
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
				//this.form.check_person = item.value
				this.clearValidate('person_id')
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
							if (!that.upload.success[check_list[length]] && !that.$refs[check_list[length]]
								.error) {
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
							field: 'org_id',
							type: 3,
							level: 1
						},
						{
							field: 'store_id',
							type: 3,
							level: 2
						},
						{
							field: 'person_id',
							type: 3,
							level: 3
						},
						{
							field: 'volume',
							type: 3,
							level: 4
						},
						{
							field: 'usage',
							type: 3,
							level: 5
						},
						{
							field: 'use_date',
							type: 3,
							level: 6
						},
						{
							field: 'recorder',
							type: 3,
							level: 7
						},
						{
							field: 'record_date',
							type: 3,
							level: 8
						},
						{
							field: 'chemical_id',
							type: 3,
							level: 9
						},
						{
							field: 'consume_id',
							type: 3,
							level: 10
						},
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.consume_id && form.consume_id > 0) {
						//更新
						sqlcode = 543
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 543
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
						that.$baseConfirm(tips, null, async () => {
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

</style>
