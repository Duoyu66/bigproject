<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span">
				<el-form-item label="委外单位名称" :label-width="formLabelWidth" prop="ext_name">
					<el-input v-model="form.ext_name" :placeholder="isReadOnly('请输入委外单位名称')" style="width:100%"
						:readonly="readonly" maxlength="32">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="社会信用统一代码" :label-width="formLabelWidth" prop="CFUSocialCode">
					<el-input v-model="form.CFUSocialCode" :placeholder="isReadOnly('请输入社会信用统一代码')" style="width:100%"
						:readonly="readonly" maxlength="30">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="法人代表" :label-width="formLabelWidth" prop="LegaLrepresentative">
					<el-input v-model="form.LegaLrepresentative" :placeholder="isReadOnly('请输入法人代表')" style="width:100%"
						:readonly="readonly" maxlength="25">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="注册地址" :label-width="formLabelWidth" prop="registeredAddress">
					<el-input v-model="form.registeredAddress" :placeholder="isReadOnly('请输入注册地址')" style="width:100%"
						:readonly="readonly" maxlength="10">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="邮编" :label-width="formLabelWidth" prop="postCode">
					<el-input v-model="form.postCode" :placeholder="isReadOnly('请输入邮编')" style="width:100%"
						:readonly="readonly" maxlength="10">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="传真" :label-width="formLabelWidth" prop="fax">
					<el-input v-model="form.fax" :placeholder="isReadOnly('请输入传真')" style="width:100%"
						:readonly="readonly" maxlength="10">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="送检检测项目" :label-width="formLabelWidth" prop="ext_item">
					<el-input v-model="form.ext_item" :placeholder="isReadOnly('请输入送检检测项目')" style="width:100%"
						:readonly="readonly" maxlength="100" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="是否有效" :label-width="formLabelWidth" prop="ext_status">
					<el-switch v-model="form.ext_status" active-text="启用" inactive-text="禁用">
					</el-switch>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="外委单位地址" :label-width="formLabelWidth" prop="addr">
					<el-input v-model="form.addr" :placeholder="isReadOnly('请输入外委单位地址')" style="width:100%"
						:readonly="readonly" maxlength="60" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="联系人" :label-width="formLabelWidth" prop="contacts">
					<el-input v-model="form.contacts" :placeholder="isReadOnly('请输入联系人')" style="width:100%"
						:readonly="readonly" maxlength="8">
					</el-input>
				</el-form-item>
			</el-col>
			<!-- 固定电话 分线 or 手机 -->
			<el-col :span="span">
				<el-form-item label="联系电话" :label-width="formLabelWidth" prop="tel">
					<el-input v-model="form.tel" :placeholder="isReadOnly('请输入联系电话')" style="width:100%"
						:readonly="readonly" maxlength="18">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="有效日期" :label-width="formLabelWidth" prop="validTimeRange">
					<el-date-picker v-model="form.validTimeRange" type="datetimerange" style="width:100%"
						range-separator="至" :picker-options="pickerOptions" :format='dateFormat'
						:value-format="dateFormat" :start-placeholder="isReadOnly('开始日期')"
						:end-placeholder="isReadOnly('结束日期')">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="外委合同编号" :label-width="formLabelWidth" prop="contract_no">
					<el-input v-model="form.contract_no" :placeholder="isReadOnly('请输入外委合同编号')" style="width:100%"
						:readonly="readonly" maxlength="50" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
					<el-input v-model="form.remarks" :placeholder="isReadOnly('请输入备注')" style="width:100%"
						:readonly="readonly" maxlength="100" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="委外资质文件" :label-width="formLabelWidth" prop="">
					<extfileupload ref="ext_file" :tip_show="upload.tip_show" :upload_type="upload.upload_type.ext_file"
						:original_name="upload.original_name.ext_file" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.ext_file"
						v-model="form.ext_file" :delte_service="upload.delte_service"
						:old_delete.sync="upload.old_delete.ext_file" :only_show="readonly">
					</extfileupload>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="外委合同文件" :label-width="formLabelWidth" prop="">
					<contractFileupload ref="contract_file" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.contract_file"
						:original_name="upload.original_name.contract_file" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.contract_file"
						v-model="form.contract_file" :delte_service="upload.delte_service"
						:old_delete.sync="upload.old_delete.contract_file" :only_show="readonly">
					</contractFileupload>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="工商信息文件" :label-width="formLabelWidth" prop="">
					<businessFileupload ref="businessFile" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.businessFile"
						:original_name="upload.original_name.businessFile" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.businessFile"
						v-model="form.businessFile" :delte_service="upload.delte_service"
						:old_delete.sync="upload.old_delete.businessFile" :only_show="readonly">
					</businessFileupload>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import extfileupload from '@/components/Upload/upload'
	import contractFileupload from '@/components/Upload/upload'
	import businessFileupload from '@/components/Upload/upload'
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
	} from '@/utils/dateHelp'
	import {
		GetGroupData,
		GetGroupDataEx
	} from '@/utils/htmlDataGroup'
	import {
		isNumEx,
		isTel,
		isPhone
	} from '@/utils/validate'
	export default {
		name: 'credForm',
		components: {
			extfileupload,
			contractFileupload,
			businessFileupload,
		},
		model: {
			prop: 'formData',
			event: 'on-change'
		},
		props: {
			//.sync同步
			formData: {
				type: Object,
				default: function() {
					return {}
				}
			},
			type: {
				type: Number,
				default: 0 //0 正常表单 1 详情表单
			}
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id'
			}),
		},
		watch: {
			formData(newVal, oldVal) {
				if (newVal) {
					this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
					this.form = Object.assign(this.form, newVal)
					this.file_default()
					this.init()
				}
			},
		},
		data() {
			let that = this
			return {
				
				span: 24,
				readonly: false,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(),
				formdefalut: {},
				form: {
					exId: -1,
					org_id: '',
					ext_org_id: -1,
					ext_name: '',
					ext_item: '',
					ext_status: true,
					addr: '',
					contacts: '',
					tel: '',
					validTimeRange: '',
					start_date: getToday(),
					end_date: getToday(),
					ext_file: '',
					contract_file: '',
					contract_no: '',
					remarks: '',
					CFUSocialCode: '',
					LegaLrepresentative: '',
					registeredAddress: '',
					postCode: '',
					fax: '',
					businessFile: ''
				},
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						contract_file: 12,
						ext_file: 11,
						businessFile: 11,
					},
					type_str: 'jpg/pdf/png/jpeg',
					type_array: ['image/jpeg', 'image/png', 'application/pdf'],
					file_size: '15',
					size_unit: 'MB',
					original_name: {
						contract_file: {},
						ext_file: {},
						businessFile: {}
					},
					success: {
						contract_file: false,
						ext_file: false,
						businessFile: false
					},
					old_delete: {
						contract_file: false,
						ext_file: false,
						businessFile: false
					}
				},
				rules_temp: {
					ext_name: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入委外单位名称'
					}],
					ext_item: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入送检检测项目'
					}],
					addr: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入外委单位地址'
					}],

				},
				rules: {

				},
				formLabelWidth: '120px',
			}

		},

		created() {
			this.init()
		},
		methods: {
			init() {
				switch (this.type) {
					case 0:
						this.readonly = false
						this.rules = this.rules_temp
						break;
					case 1:
						this.readonly = true
						this.rules = {}
						break
				}
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.file_default()
				}
				if (!(this.form.org_id && this.form.org_id > 0)) {
					this.form.org_id = this.org_id
				}
				this.form.validTimeRange = [];
				if (this.form.start_date) {
					this.form.validTimeRange[0] = this.form.start_date
				}
				if (this.form.end_date) {
					this.form.validTimeRange[1] = this.form.end_date
				}
				switch (this.form.ext_status) {
					case '1':
						this.form.ext_status = true
						break
					case '0':
						this.form.ext_status = false
						break
					default:
						this.form.ext_status = this.form.ext_status
						break
				}

			},
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},
			file_default() {
				const form = JSON.parse(JSON.stringify(this.form))
				let that = this
				that.upload.original_name.contract_file[form.contract_file] = '外委合同'
				that.upload.original_name.ext_file[form.ext_file] = '外委资质'
				that.upload.original_name.ext_file[form.ext_file] = '工商信息'
			},
			fileUploadRefs() {
				return ["contract_file", "ext_file", "businessFile"]
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
				that.$refs['form'].resetFields()
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
			async QueryExec_fob_custom(list, form, sqlcode) {
				return await this.QueryExec_fob(sqlcode, list, form)
			},
			async save(callback) {
				let that = this
				async function submit() {
					that.loading = true
					that.loadingText = '提交表单中...'
					let form = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: "ext_org_id",
							level: 1
						},
						{
							field: "org_id",
							level: 2
						},
						{
							field: "ext_name",
							level: 3
						},
						{
							field: "ext_item",
							level: 4
						},
						{
							field: "ext_status",
							level: 5
						}, {
							field: "addr",
							level: 6
						},
						{
							field: "contacts",
							level: 7
						},
						{
							field: "tel",
							level: 8
						},
						{
							field: "validTimeRange",
							type: 5,
							level: 9,
							split: '~',
						},
						{
							field: "ext_file",
							level: 10
						},
						{
							field: "contract_file",
							level: 11
						},
						{
							field: "contract_no",
							level: 12
						},
						{
							field: "remarks",
							level: 13
						},
						{
							field: "CFUSocialCode",
							level: 14
						},
						{
							field: "LegaLrepresentative",
							level: 15
						},
						{
							field: "registeredAddress",
							level: 16
						},
						{
							field: "postCode",
							level: 17
						}, {
							field: "fax",
							level: 18
						}, {
							field: "businessFile",
							level: 19
						},
						{
							field: "exId",
							level: 20
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.exId && form.exId > 0) {
						//更新
						sqlcode = 315
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 315
						fob = that.QueryExec_fob_custom;
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
				that.$refs['form'].validate((valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							that.fileUpload(async function(status) {
								if (status) {
									const flag = await submit()
									callback(flag)
								}
							})
						})

					} else {
						return false
					}
				})
			},
		},
	}
</script>

<style>
</style>
