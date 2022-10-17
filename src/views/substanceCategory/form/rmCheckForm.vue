<template>
	<span>
		<el-form ref="purchase_from" :model="form" :rules="rules">
			<el-row>

				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="form.store_name">
					<el-form-item prop="store_name" label="标准物质名称" :label-width="formLabelWidth">
						<el-input v-model="form.store_name" :placeholder="isReadOnly('')" readonly style="width: 100%">
						</el-input>
					</el-form-item>
				</el-col>

				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="check_date" label="盘点时间" :label-width="formLabelWidth">
						<el-date-picker v-model="form.check_date" align="right" type="date"
							:placeholder="isReadOnly('盘点时间')" :picker-options="pickerOptions.before" style="width: 100%"
							:format='dateFormat' :value-format="dateFormat" :readonly="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="sys_quantity" :label="rmManage.unit ?'系统库存('+rmManage.unit+')': '系统库存'"
						:label-width="formLabelWidth">
						<el-input v-model="form.sys_quantity" :placeholder="isReadOnly('')" type="number" step="0.001"
							style="width: 100%" min="0" readonly="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="actual_quantity" :label="rmManage.unit ?'实际库存('+rmManage.unit+')': '实际库存'"
						:label-width="formLabelWidth">
						<el-input v-model="form.actual_quantity" :placeholder="isReadOnly('请输入实际库存...')" type="number"
							step="0.001" style="width: 100%" min="0" :readonly="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="diff_quantity" :label="rmManage.unit ?'相差数量('+rmManage.unit+')': '相差数量'"
						:label-width="formLabelWidth">
						<el-input v-model="form.diff_quantity" :placeholder="isReadOnly('')" type="number"
							style="width: 100%" readonly="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="check_type" label="盘点结果" :label-width="formLabelWidth">
						<el-select v-model="form.check_type" style="width: 100%">
							<el-option v-for="data in selectData.check_type" :key="data.item_name"
								:label="data.item_name" :value="data.item_name">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="check_person" label="盘点人" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.check_person"
							:fetch-suggestions="querySearchPerson" :placeholder="isReadOnly('请输入盘点人...')" :maxlength='8'
							style="width: 100%;" :readonly="readonly" @select="handleSelect">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="name" label="是否修改库存" :label-width="formLabelWidth">
						<el-switch v-model="form.isEditStore" active-color="#13ce66" inactive-color="#ff4949"
							active-value="1" inactive-value="0">
						</el-switch>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" maxlength="100"
							:placeholder="isReadOnly('请输入备注...')" v-model="form.remarks" show-word-limit
							style="width: 100%" :readonly="readonly">
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
		name: 'rmCheckForm',
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
				rmManage: {
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
				form: {
					check_id: '',
					store_id: -1,
					check_date: getToday(),
					sys_quantity: 0,
					actual_quantity: 0,
					diff_quantity: 0,
					check_type: '',
					check_person: '',
					org_id: '',
					remarks: '',
					chemical_id: '',
					store_name: '',
					isEditStore: 0,
				},
				selectData: {
					check_type: [{
						item_name: '正常',
					}, {
						item_name: '盘亏',
					}, {
						item_name: '盘盈',
					}],
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
					check_date: [{
						required: true,
						message: '请输入盘点时间',
						trigger: 'blur',
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							if (!value) {
								callback()
								return
							}
							let min_buy_date = await GetRmBuyMinDate(undefined, that.form.store_id)
							if (!min_buy_date) {
								callback()
								return
							}
							min_buy_date = new Date(min_buy_date)
							let check_date = new Date(value)
							if (check_date < min_buy_date) {
								callback(new Error('盘点时间应早于最晚购买时间（' + format_fob(min_buy_date) + ')'))
								return
							}
							callback()
						}
					}],
					actual_quantity: [{
						required: true,
						message: '请输入实际库存',
						trigger: 'blur',
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							console.log('actual_quantity', value)
							if (typeof value == 'undefined') {
								callback()
								return
							}
							if (value < 0) {
								callback(new Error('库存不能为负数'))
								return
							}
							that.calculationCheckType()
						}
					}, ],
					check_person: [{
						required: true,
						message: '请输入盘点人',
						trigger: 'blur',
					}],
					check_type: [{
						required: true,
						message: '请选择盘点结果',
						trigger: 'blur',
					}],
				},
			}
		},
		watch: {
			formData(newVal, b) {
				this.init()
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
				this.form.check_person = item.value
				this.clearValidate('check_person')
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
					this.file_default()
					this.GetRmBaseInfoByStoreId(this.formData.store_id)
					await this.GetRmStoreQuantity()
					this.calculationCheckType()

				}

			},
			async calculationCheckType() {
				let actual_quantity = parseFloat(this.form.actual_quantity)
				if (typeof this.form.actual_quantity == 'undefined' || this.form.actual_quantity == '') {
					actual_quantity = 0
				}

				if (typeof this.form.sys_quantity == 'undefined' || this.form.sys_quantity == '') {
					await this.GetRmStoreQuantity()
				}
				let sys_quantity = parseFloat(this.form.sys_quantity)
				if (typeof this.form.sys_quantity == 'undefined' || this.form.sys_quantity == '') {
					sys_quantity = 0
				}
				let diff_quantity = actual_quantity - sys_quantity
				this.form.diff_quantity = diff_quantity
				let check_type = ''
				if (diff_quantity > 0) {
					check_type = '盘盈';
				} else if (diff_quantity < 0) {
					check_type = '盘亏';
				} else {
					check_type = '正常';
				}
				this.form.check_type = check_type
			},
			async GetRmStoreQuantity(store_id) {
				if (!store_id) {
					store_id = this.form.store_id
				}
				if (!store_id) {
					return
				}
				let rmStore = await GetRmStore(undefined, undefined, undefined, store_id)
				this.form.sys_quantity = rmStore[0].quantity
			},
			async GetRmBaseInfoByStoreId(store_id) {
				if (!store_id) {
					store_id = this.form.store_id
				}
				if (!store_id) {
					return
				}
				let rmManage = await GetRmBaseInfoByStoreId(undefined, store_id)
				this.rmManage = rmManage
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
							field: 'check_date',
							type: 3,
							level: 1
						},
						{
							field: 'sys_quantity',
							type: 3,
							level: 2
						},
						{
							field: 'actual_quantity',
							type: 3,
							level: 3
						},
						{
							field: 'diff_quantity',
							type: 3,
							level: 4
						},
						{
							field: 'check_type',
							type: 3,
							level: 5
						},
						{
							field: 'check_person',
							type: 3,
							level: 6
						},
						{
							field: 'org_id',
							type: 3,
							level: 7
						},
						{
							field: 'remarks',
							type: 3,
							level: 8
						},
						{
							field: 'chemical_id',
							type: 3,
							level: 9
						},
						{
							field: 'isEditStore',
							type: 3,
							level: 10
						},
						{
							field: 'store_id',
							type: 3,
							level: 11
						},
						{
							field: 'check_id',
							type: 3,
							level: 12
						},

					]

					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.check_id && form.check_id > 0) {
						//更新
						sqlcode = 615
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 615
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
