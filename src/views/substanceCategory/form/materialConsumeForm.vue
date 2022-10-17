<template>
	<span>
		<el-form ref="purchase_from" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="store_id" label="标准物质库存" :label-width="formLabelWidth">
						<el-select v-model="form.store_id" value-key="store_id"
							:placeholder="isReadOnly('请选择标准物质，找不到请确认库存中有所需要的标准物质...')" style="width: 100%"
							@change="store_id_change" filterable>
							<!-- <div v-for="item in chemical_list" :key="item.store_id"> -->
							<el-option v-for="item in selectData.store_id" :key="item.store_id" :label="item.name"
								:value="item.store_id">
								<span style="float: left">{{ item.name }}</span>
								<span
									style="float: right; color: #8492a6; font-size: 13px">类型:{{ item.mat_name }};单位:{{ item.unit }}</span>
							</el-option>
							<!-- </div> -->
						</el-select>
						<el-button type="primary" class="normal" @click="RmRefresh">
							刷新</el-button>
					</el-form-item>
				</el-col>
				<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="form.name">
					<el-form-item prop="name" label="化学品名称" :label-width="formLabelWidth">
						<el-input v-model="form.name" :placeholder="isReadOnly('')" readonly style="width: 100%">
						</el-input>
					</el-form-item>
				</el-col> -->
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="user" label="使用人" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.user" :fetch-suggestions="querySearchPerson"
							:placeholder="isReadOnly('请输入使用人...')" :maxlength='8' style="width: 100%;"
							:readonly="readonly" @select="handleSelect">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="volume" :label="material.unit ?'用量('+material.unit+')': '用量'"
						:label-width="formLabelWidth">
						<el-input v-model="form.volume" :placeholder="isReadOnly('请输入用量...')" type="number" step="0.001"
							style="width: 100%" min="0" :readonly="readonly" maxlength="53">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="消耗原因" :label-width="formLabelWidth" prop="usage">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" maxlength="32"
							:placeholder="isReadOnly('请输入消耗原因...')" v-model="form.usage" show-word-limit
							style="width: 100%" :readonly="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="use_date" label="使用时间" :label-width="formLabelWidth">
						<el-date-picker v-model="form.use_date" align="left" type="date"
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
						<el-date-picker v-model="form.record_date" align="left" type="date"
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
		GetRmAlloc,
		GetOrgId,
		GetPersonRoleMax,
		getOrgNameByselect,
		GetPersonList,
		file_about,
		GetRmStore,
		GetRmBuyMinDate,
		GetRmBaseInfoByStoreId
	} from '../commonJs/common.substanceCategory.js'
	import upload from '@/components/Upload/upload'
	export default {
		name: 'materialConsumeForm',
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
				material: {
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
					store_id: '',
					user: '',
					volume: 0,
					usage: '',
					use_date: getToday(),
					recorder: '',
					record_date: '',
					name: '',

				},
				selectData: {
					store_id: [],
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
					store_id: [{
						required: true,
						message: '请选择标准物质',
						trigger: 'blur',
					}],
					user: [{
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
							let min_buy_date = await GetRmBuyMinDate(undefined, that.form.store_id)
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
							let list = await GetRmStore(undefined, undefined, undefined, that.form
								.store_id)
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
									callback(new Error('消耗数量需小于库存数量，现有库存' + item.quantity))
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
				//this.form.check_person = item.value
				this.clearValidate('user')
			},
			clearValidate(prop) {
				this.$refs['purchase_from'].clearValidate(prop)
			},
			async init() {
				this.rules = this.rules_temp
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				this.RmRefresh()
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.form_old = JSON.parse(JSON.stringify(this.formData))
					this.file_default()
					this.GetRmBaseInfoByStoreId(this.formData.store_id)
				}

			},
			async RmRefresh() {
				let data = await GetRmStore()
				this.selectData.store_id = data
				return data
			},
			async store_id_change(value) {
				let list = this.selectData.store_id.filter((e) => {
					if (e.store_id == value) {
						return e
					}
				})
				if (!list || list.length == 0) {
					return
				}
				this.material = list[0]
				this.form.rm_store_name = list[0].name
				this.form.mat_id = list[0].mat_id
			},
			async GetRmBaseInfoByStoreId(store_id) {
				if (!store_id) {
					store_id = this.form.store_id
				}
				if (!store_id) {
					return
				}
				let material = await GetRmBaseInfoByStoreId(undefined, store_id)
				this.material = material
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
							if (that.$refs[check_list[length]].error) {
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
							field: 'rm_store_name',
							type: 3,
							level: 1
						},
						{
							field: 'org_id',
							type: 3,
							level: 2
						},
						{
							field: 'store_id',
							type: 3,
							level: 3
						},
						{
							field: 'user',
							type: 3,
							level: 4
						},
						{
							field: 'volume',
							type: 3,
							level: 5
						},
						{
							field: 'usage',
							type: 3,
							level: 6
						},
						{
							field: 'use_date',
							type: 3,
							level: 7
						},
						{
							field: 'recorder',
							type: 3,
							level: 8
						},
						{
							field: 'record_date',
							type: 3,
							level: 9
						},
						{
							field: 'mat_id',
							type: 3,
							level: 10
						},
						{
							field: 'consume_id',
							type: 3,
							level: 11
						},
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.consume_id && form.consume_id > 0) {
						//更新
						sqlcode = 582
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 582
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
