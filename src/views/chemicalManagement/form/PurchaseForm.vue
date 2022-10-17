<template>
	<span>
		<el-form v-if="isAlloc" ref="purchase_from" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<div v-if="inEditMode" style="width: 100%">
						<el-form-item label="名称" :label-width="formLabelWidth">
							<el-input v-model="form.name" readonly="readonly" disabled style="width: 100%"></el-input>
						</el-form-item>
					</div>
					<div v-else style="width: 100%">
						<el-form-item prop="chemical_id" label="化学品名称" :label-width="formLabelWidth">
							<el-select v-model="form.chemical_id" value-key="store_id"
								:placeholder="isReadOnly('请选择化学品名称，没有请到化学品分配页面分配')" style="width: 100%"
								@change="chemical_id_change" filterable>
								<!-- <div v-for="item in chemical_list" :key="item.store_id"> -->
								<el-option v-for="item in selectData.chemical_id" :key="item.chemical_id"
									:label="item.name" :value="item.chemical_id">
									<span style="float: left">{{ item.name }}</span>
									<span
										style="float: right; color: #8492a6; font-size: 13px">规格:{{ item.model }}单位:{{ item.unit }}</span>
								</el-option>
								<!-- </div> -->
							</el-select>
							<el-button type="primary" class="normal" @click="chemicalRefresh">刷新</el-button>
							<el-button type="primary" class="normal" @click="toChemicalAlloc">前往化学品分配页面</el-button>
						</el-form-item>
					</div>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
					<el-form-item prop="buyer" label="购买人" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.buyer"
							:fetch-suggestions="querySearchPerson" :placeholder="isReadOnly('请输入购买人...')" :maxlength='8'
							style="width: 100%;" :readonly="readonly">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
					<el-form-item prop="buy_date" label="采购日期" :label-width="formLabelWidth">
						<el-date-picker v-model="form.buy_date" align="right" type="date"
							:placeholder="isReadOnly('采购日期')" :picker-options="pickerOptions.before" style="width: 100%"
							:format='dateFormat' :value-format="dateFormat" :readonly="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
					<el-form-item prop="val_date" label="有效期至" :label-width="formLabelWidth">
						<el-date-picker v-model="form.val_date" align="right" type="date"
							:placeholder="isReadOnly('有效期至')" :picker-options="pickerOptions.after" style="width: 100%"
							:format='dateFormat' :value-format="dateFormat" :readonly="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
					<el-form-item prop="quantity" :label="chemical.unit ?'数量('+chemical.unit+')': '数量'"
						:label-width="formLabelWidth">
						<el-input v-model="form.quantity" :placeholder="isReadOnly('请输入数量...')" type="number"
							step="0.001" style="width: 100%" min="0">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
					<el-form-item prop="price" label="价格" :label-width="formLabelWidth">
						<el-input v-model="form.price" :placeholder="isReadOnly('请输入价格...')" type="number" step="0.001"
							style="width: 100%" min="0">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
					<el-form-item prop="factory" label="生产厂家" :label-width="formLabelWidth">
						<el-input v-model="form.factory" :placeholder="isReadOnly('请输入生产厂家...')" style="width: 100%"
							maxlength="16"></el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
					<el-form-item prop="applicant" label="申请人" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.applicant"
							:fetch-suggestions="querySearchPerson" :placeholder="isReadOnly('请输入申请人...')" :maxlength='8'
							style="width: 100%;" :readonly="readonly">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
					<el-form-item prop="apply_date" label="申请日期" :label-width="formLabelWidth">
						<el-date-picker v-model="form.apply_date" align="right" type="date"
							:placeholder="isReadOnly('请选择申请日期')" :picker-options="pickerOptions.before"
							style="width: 100%" :format='dateFormat' :value-format="dateFormat" :readonly="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
					<el-form-item label="主要成分" :label-width="formLabelWidth">
						<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="32"
							:placeholder="isReadOnly('请输入主要成分')" v-model="form.element" show-word-limit
							style="width: 100%">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
					<el-form-item label="外观形状" :label-width="formLabelWidth">
						<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="32"
							:placeholder="isReadOnly('请输入结论')" v-model="form.shape" show-word-limit style="width: 100%">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
					<el-form-item prop="approver" label="审批人" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.approver"
							:fetch-suggestions="querySearchPerson" :placeholder="isReadOnly('请输入审批人...')" :maxlength='8'
							style="width: 100%;" :readonly="readonly">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
					<el-form-item prop="approve_date" label="审批日期" :label-width="formLabelWidth">
						<el-date-picker v-model="form.approve_date" align="right" type="date"
							:placeholder="isReadOnly('请选择审批日期')" :picker-options="pickerOptions" style="width: 100%"
							:format='dateFormat' :value-format="dateFormat" :readonly="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
					<el-form-item label="结论" :label-width="formLabelWidth">
						<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="64"
							:placeholder="isReadOnly('请输入结论...')" v-model="form.conclusion" show-word-limit
							style="width: 100%">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="合格证扫描件" :label-width="formLabelWidth">
						<upload ref="cert_image" :tip_show="upload.tip_show"
							:upload_type="upload.upload_type.cert_image"
							:original_name="upload.original_name.cert_image" :type_str="upload.type_str"
							:type_array="upload.type_array" :success_status.sync="upload.success.cert_image"
							v-model="form.cert_image" :delte_service="upload.delte_service"
							:old_delete.sync="upload.old_delete.cert_image" :only_show="readonly">
						</upload>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="材质单扫描件" :label-width="formLabelWidth">
						<upload ref="material_list" :tip_show="upload.tip_show"
							:upload_type="upload.upload_type.material_list"
							:original_name="upload.original_name.material_list" :type_str="upload.type_str"
							:type_array="upload.type_array" :success_status.sync="upload.success.material_list"
							v-model="form.material_list" :delte_service="upload.delte_service"
							:old_delete.sync="upload.old_delete.material_list" :only_show="readonly">
						</upload>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div v-else class="noche">当前机构[{{organization.org_name}}]没有已分配的化学品
			<div @click="toChemicalAlloc($event)">前往化学品分配页面</div>
		</div>
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
		file_about
	} from '../commonjs/common.chemical'
	import upload from '@/components/Upload/upload'
	import {
		mapGetters
	} from 'vuex'
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
		...mapGetters({
			org_pid: 'user/org_pid',
			org_id: 'user/org_id',
			current_org_id: 'org/current_org',
			person_id: 'user/person_id',
		}),
		data() {
			let that = this
			return {
				uploadDeault: {

				},
				formdefalut: {

				},
				date_is_valid: undefined,
				isAlloc: true,
				inEditMode: false,
				isEmptyList: true,
				readonly: false,
				chemical: {
					unit: '',
				},
				upload: {
					tip_show: true,
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
					name: '',
					buy_date: getToday(),
					val_date: '',
					apply_date: '',
					approve_date: '',
					data: '',
					quantity: '',
					price: '',
					factory: '',
					buyer: '',
					approver: '',
					store_id: -1,
					chemical_id: '',
					cert_image: '',
					material_list: '',
					element: '',
					shape: '',
					conclusion: '',
					applicant: ''

				},
				selectData: {
					chemical_id: '',
				},
				formLabelWidth: '100px',
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
					quantity: [{
						required: true,
						message: '请输入数量',
						trigger: 'blur',
					}, {
						trigger: 'blur',
						validator: function(rule, value, callback) {
							if (!value) {
								callback()
								return
							}
							if (value < 0) {
								callback(new Error('数量应该不能为负数'))
								return
							}
							callback()
						}
					}, ],
					chemical_id: [{
						required: true,
						message: '请选择名称',
						trigger: 'blur',
					}, ],
					price: [{
						required: true,
						message: '请输入价格',
						trigger: 'blur',
					}, {
						trigger: 'blur',
						validator: function(rule, value, callback) {
							if (!value) {
								callback()
								return
							}
							if (value < 0) {
								callback(new Error('购入价格不能为负数'))
								return
							}
							callback()
						}
					}, ],
					factory: [{
						required: true,
						message: '请输入生产厂家',
						trigger: 'blur',
					}, ],
					buyer: [{
						required: true,
						message: '请输入购买人',
						trigger: 'blur',
					}, {
						trigger: 'blur',
						validator: function(rule, value, callback) {
							if (!value) {
								callback()
								return
							}
							if (value == that.form.approver) {
								callback(new Error('购买人和审批人不能为同一个'))
								return
							}
							callback()
						}
					}, ],
					applicant: [{
						trigger: 'blur',
						validator: function(rule, value, callback) {
							if (!value) {
								callback()
								return
							}
							if (value == that.form.approver) {
								callback(new Error('申请人和审批人不能为同一个'))
								return
							}
							callback()
						}
					}],
					approver: [{
						trigger: 'blur',
						validator: function(rule, value, callback) {
							if (!value) {
								callback()
								return
							}
							if (value == that.form.applicant) {
								callback(new Error('审批人和申请人不能为同一个'))
								return
							}
							if (value == that.form.buyer) {
								callback(new Error('审批人和购买人不能为同一个'))
								return
							}
							callback()
						}
					}],
					buy_date: [{
						trigger: 'blur',
						validator: function(rule, value, callback) {
							if (!value) {
								callback()
								return
							}
							let buy_date = new Date(value)
							let date = ''
							if (that.form.val_date) {
								date = new Date(that.form.val_date)
								if (buy_date > date) {
									callback(new Error('采购时间应早于或等于有效结束时间'))
									return
								}
							}
							if (that.form.apply_date) {
								date = new Date(that.form.apply_date)
								if (buy_date < date) {
									callback(new Error('采购时间应晚于或等于申请日期'))
									return
								}
							}
							if (that.form.approve_date) {
								date = new Date(that.form.approve_date)
								if (buy_date > date) {
									callback(new Error('采购时间应早于或等于审批时间'))
									return
								}
							}
							callback()
						}
					}],
					val_date: [{
						trigger: 'blur',
						validator: function(rule, value, callback) {
							if (!value) {
								callback()
								return
							}
							let val_date = new Date(value)
							let date = ''
							if (that.form.buy_date) {
								date = new Date(that.form.buy_date)
								if (val_date < date) {
									callback(new Error('有效结束时间应晚于或等于采购时间'))
									return
								}
							}
							callback()
						}
					}],
					apply_date: [{
						trigger: 'blur',
						validator: function(rule, value, callback) {
							if (!value) {
								callback()
								return
							}
							let apply_date = new Date(value)
							let date = ''
							if (that.form.buy_date) {
								date = new Date(that.form.buy_date)
								if (apply_date > date) {
									callback(new Error('申请日期应小于或等于采购时间'))
									return
								}
							}
							if (that.form.approve_date) {
								date = new Date(that.form.approve_date)
								if (apply_date > date) {
									callback(new Error('申请日期应小于或等于审批时间'))
									return
								}
							}
							callback()
						}
					}],
					approve_date: [{
						trigger: 'blur',
						validator: function(rule, value, callback) {
							if (!value) {
								callback()
								return
							}
							let approve_date = new Date(value)
							let date = ''
							if (that.form.apply_date) {
								date = new Date(that.form.apply_date)
								if (approve_date < date) {
									callback(new Error('审批日期应大于或等于申请时间'))
									return
								}
							}
							if (that.form.buy_date) {
								date = new Date(that.form.buy_date)
								if (approve_date < date) {
									callback(new Error('审批日期应大于或等于采购时间'))
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
						this.file_default()
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

				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				await this.chemicalInit()
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					if (this.formData.chemical_id) {
						await this.chemical_id_change(this.formData.chemical_id)
					}
					this.file_default()
				}

				await this.orgname()
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
				if (this.form.cert_image) {
					that.upload.original_name.cert_image[form.cert_image] = '合格证'
				}
				if (this.form.material_list) {
					that.upload.original_name.cert_image[form.cert_image] = '材质单'
				}
			},
			fileUploadRefs() {
				return ["cert_image", "material_list"]
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
							field: 'org_id',
							type: 3,
							level: 1
						},
						{
							field: 'buy_date',
							type: 3,
							level: 2
						},
						{
							field: 'val_date',
							type: 3,
							level: 3
						},
						{
							field: 'quantity',
							type: 3,
							level: 4
						},
						{
							field: 'factory',
							type: 3,
							level: 5
						},
						{
							field: 'cert_image',
							type: 3,
							level: 6
						},
						{
							field: 'material_list',
							type: 3,
							level: 7
						},
						{
							field: 'price',
							type: 3,
							level: 8
						},
						{
							field: 'element',
							type: 3,
							level: 9
						},
						{
							field: 'shape',
							type: 3,
							level: 10
						},
						{
							field: 'buyer',
							type: 3,
							level: 11
						},
						{
							field: 'applicant',
							type: 3,
							level: 12
						},
						{
							field: 'apply_date',
							type: 3,
							level: 13
						},
						{
							field: 'approver',
							type: 3,
							level: 14
						},
						{
							field: 'approve_date',
							type: 3,
							level: 15
						},
						{
							field: 'conclusion',
							type: 3,
							level: 16
						},
						{
							field: 'chemical_id',
							type: 3,
							level: 17
						},
						{
							field: 'store_id',
							type: 3,
							level: 18
						},
						{
							field: 'buy_id',
							type: 3,
							level: 19
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.buy_id && form.buy_id > 0) {
						//更新
						sqlcode = 526
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 526
						fob = that.QueryExec_fob_custom;
					}
					that.form.org_id = await GetOrgId()
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
				if (!this.isAlloc) {
					return false
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
