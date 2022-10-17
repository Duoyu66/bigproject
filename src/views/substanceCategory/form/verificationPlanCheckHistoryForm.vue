<template>
	<span>
		<el-form ref="purchase_from" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="form.store_name">
					<el-form-item prop="store_name" label="标准物质名称" :label-width="formLabelWidth">
						<el-input v-model="form.store_name" type="text" style="width: 100%" readonly="readonly" disabled
							:maxlength='50'>
						</el-input>
					</el-form-item>
				</el-col>

				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="form.mat_name">
					<el-form-item prop="mat_name" label="类别" :label-width="formLabelWidth">
						<el-input v-model="form.mat_name" type="text" style="width: 100%" readonly="readonly" disabled
							:maxlength='50'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="handler" label="校验人" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.handler"
							:fetch-suggestions="querySearchPerson" :placeholder="isReadOnly('请输入校验人...')" :maxlength='8'
							style="width: 100%;" :readonly="readonly" @select="handleSelect" :disabled="readonly">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="calibrate_date" label="校验日期" :label-width="formLabelWidth">
						<el-date-picker v-model="form.calibrate_date" align="left" type="date"
							:placeholder="isReadOnly('请选择校验日期')" :picker-options="pickerOptions.before"
							style="width: 100%" :format='dateFormat' :value-format="dateFormat" :readonly="readonly"
							:disabled="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="result" label="校验结果" :label-width="formLabelWidth">
						<el-input v-model="form.result" :placeholder="isReadOnly('请输入校验结果...')" type="text"
							style="width: 100%" :readonly="readonly" :disabled="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="calibrate_org" label="校验机构" :label-width="formLabelWidth">
						<el-input v-model="form.calibrate_org" :placeholder="isReadOnly('请输入校验机构...')" type="textarea"
							show-word-limit style="width: 100%" :readonly="readonly" maxlength='25'
							:disabled="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="cert_id" label="证书编号" :label-width="formLabelWidth">
						<el-input v-model="form.cert_id" :placeholder="isReadOnly('请输入证书编号...')" type="textarea"
							show-word-limit style="width: 100%" :readonly="readonly" maxlength='16'
							:disabled="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="remarks" label="备注" :label-width="formLabelWidth">
						<el-input v-model="form.remarks" :placeholder="isReadOnly('请输入备注...')" type="textarea"
							show-word-limit style="width: 100%" :readonly="readonly" maxlength='100'
							:disabled="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="附件" :label-width="formLabelWidth">
						<upload ref="certificate" :tip_show="upload.tip_show"
							:upload_type="upload.upload_type.certificate"
							:original_name="upload.original_name.certificate" :type_str="upload.type_str"
							:type_array="upload.type_array" :success_status.sync="upload.success.certificate"
							v-model="form.certificate" :delte_service="upload.delte_service"
							:old_delete.sync="upload.old_delete.certificate" :only_show="readonly">
						</upload>
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
		name: 'materiaExamineAndVerifyCheckHistoryForm',
		components: {
			upload,
		},
		props: {
			formData: {
				type: Object,
				required: false,
			},
			type: {
				type: String,
				required: false,
				default: 'eidt'
			}
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
					tip_show: true,
					delte_service: false,
					upload_type: {
						certificate: file_about.upload.certificate
					},
					type_str: 'jpg/pdf/png/jpeg',
					type_array: ['image/jpeg', 'image/png', 'application/pdf'],
					file_size: '4',
					size_unit: 'MB',
					original_name: {
						certificate: {},
					},
					success: {
						certificate: false,
					},
					old_delete: {
						certificate: false,
					}
				},
				form_old: {
					volume: 0,
				},
				form: {
					check_id: -1,
					history_id: -1,
					handler: '',
					calibrate_date: getToday(),
					result: '',
					calibrate_org: '',
					remarks: '',
					store_name: '',
					mat_name: '',
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
					handler: [{
						required: true,
						message: '请输入校验人',
						trigger: 'blur',
					}],
					calibrate_date: [{
						required: true,
						message: '请选择校验日期',
						trigger: 'blur',
					}],
					result: [{
						required: true,
						message: '请输入校验结果',
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
				this.clearValidate('handler')
			},
			clearValidate(prop) {
				this.$refs['purchase_from'].clearValidate(prop)
			},
			async init() {
				this.rules = this.rules_temp
				this.$options.data().form
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				this.RmRefresh()
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.form_old = JSON.parse(JSON.stringify(this.formData))
					this.file_default()
				}
				switch (this.type) {
					case 'edit':
						this.readonly = false
						break
					case 'show':
						this.readonly = true
						break
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
				return ['certificate']
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
							field: 'cert_id',
							type: 3,
							level: 1
						},
						{
							field: 'calibrate_org',
							type: 3,
							level: 2
						}, {
							field: 'handler',
							type: 3,
							level: 3
						},
						{
							field: 'calibrate_date',
							type: 3,
							level:4
						},
						{
							field: 'result',
							type: 3,
							level: 5
						},
						{
							field: 'certificate',
							type: 3,
							level: 6
						},
						{
							field: 'remarks',
							type: 3,
							level: 7
						},
						{
							field: 'check_id',
							type: 3,
							level: 8
						},
						{
							field: 'history_id',
							type: 3,
							level: 9
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.history_id && form.history_id > 0) {
						//更新
						sqlcode = 605
						fob = that.update_fob;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 605
						fob = that.insert_fob;
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
