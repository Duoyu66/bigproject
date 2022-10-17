<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span">
				<el-form-item label="车牌号" :label-width="formLabelWidth" prop="registration_number">
					<el-input v-model="form.registration_number" :placeholder="isReadOnly('请输入车牌号')" style="width:100%"
						:readonly="readonly" maxlength="10">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="内部编号" :label-width="formLabelWidth" prop="org_in_number">
					<el-input v-model="form.org_in_number" :placeholder="isReadOnly('请输入内部编号')" style="width:100%"
						:readonly="readonly" maxlength="20">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="机构名称" :label-width="formLabelWidth" prop="org_name">
					<el-input v-model="GetOrgName" :placeholder="isReadOnly('')" style="width:100%" :readonly="true">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="状态" :label-width="formLabelWidth" prop="status">
					<el-select v-model="form.status" :placeholder="isReadOnly('请选择车辆状态')" style="width: 100%">
						<el-option v-for="ower in selectData.status" :key="ower.key" :label="ower.value"
							:value="ower.key">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="gps编号" :label-width="formLabelWidth" prop="gps_device_id">
					<el-input v-model="form.gps_device_id" :placeholder="isReadOnly('gps编号')" style="width:100%"
						:readonly="readonly" maxlength="10">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="司机" :label-width="formLabelWidth" prop="driver">
					<el-input v-model="form.driver" :placeholder="isReadOnly('请输入司机')" style="width:100%"
						:readonly="readonly" maxlength="10">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="司机电话" :label-width="formLabelWidth" prop="phone">
					<el-input v-model="form.phone" :placeholder="isReadOnly('请输入司机电话')" style="width:100%"
						:readonly="readonly" maxlength="15">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="型号" :label-width="formLabelWidth" prop="model">
					<el-input v-model="form.model" :placeholder="isReadOnly('请输入型号')" style="width:100%"
						:readonly="readonly" maxlength="50">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="规格" :label-width="formLabelWidth" prop="spec">
					<el-input v-model="form.spec" :placeholder="isReadOnly('请输入规格')" style="width:100%"
						:readonly="readonly" maxlength="50">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="备注" :label-width="formLabelWidth" prop="memo">
					<el-input v-model="form.memo" :placeholder="isReadOnly('请输入备注')" style="width:100%"
						:readonly="readonly" maxlength="100" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
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
		name: 'TruckForm',
		components: {
			extfileupload,
			contractFileupload,
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
			GetOrgName() {
				return this.form.org_name;
			}
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
				selectData: {
					status: [{
						key: 0,
						value: '报废'
					}, {
						key: 10,
						value: '停用'
					}, {
						key: 20,
						value: '维修'
					}, {
						key: 90,
						value: '空闲'
					}, {
						key: 91,
						value: '返程中'
					}, {
						key: 100,
						value: '使用中'
					}]
				},
				span: 24,
				readonly: false,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(),
				formdefalut: {},
				form: {
					registration_number: '',
					org_in_number: '',
					driver: '',
					phone: '',
					model: '',
					spec: '',
					memo: '',
					org_id: '',
					gps_device_id: '',
					status: 100,
					org_name: '',
					truck_id: -1
				},
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						contract_file: 12,
						ext_file: 11
					},
					type_str: 'jpg/pdf/png/jpeg',
					type_array: ['image/jpeg', 'image/png', 'application/pdf'],
					file_size: '15',
					size_unit: 'MB',
					original_name: {
						contract_file: {},
						ext_file: {},
					},
					success: {
						contract_file: false,
						ext_file: false,
					},
					old_delete: {
						contract_file: false,
						ext_file: false,
					}
				},
				rules_temp: {
					registration_number: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入类型名称'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (!value) {
								callback(new Error('请输入类型名称'))
								return
							}
							if (value.length > 16) {
								callback(new Error('类型名称最长16位'))
								return
							}
							callback()
						}
					}],
					phone: [{
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (!value) {
								callback()
								return;
							}
							if (!isPhone(value)) {
								callback('请输入正确的手机号')
								return;
							}
							callback()
						}
					}],
					memo: [{
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (value && value.length > 100) {
								callback(new Error('备注最长100位'))
								return
							}
							callback()
						}
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
					if (typeof this.formData.status != 'undefined') {
						this.formData.status = parseInt(this.formData.status);
					}
					this.form = Object.assign(this.form, this.formData)
					this.file_default()

				}



				this.getOrgNameByselect();

			},
			async getOrgNameByselect() {
				//this.$nextTick(async () => {
				let index = setInterval(async () => {
					let org_id = this.form.org_id ? this.form.org_id : this.org_id;
					let org_name = await this.getOrgName(org_id);
					if (org_name.trim()) {
						this.$set(this.form, "org_name", org_name.trim());
						clearInterval(index);
						//this.$set(this.load.status.orgName, 'isShow', true)
					}
				}, 500);
			},
			async getOrgName(value) {
				let orgName = await this.$store.dispatch("org/GetOrgNameByOrgId", value);
				return orgName;
			},
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},
			file_default() {
				// const form = JSON.parse(JSON.stringify(this.form))
				// let that = this
				// that.upload.original_name.contract_file[form.contract_file] = '外委合同'
				// that.upload.original_name.ext_file[form.ext_file] = '外委资质'
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
							field: "gps_device_id",
							level: 1
						},
						{
							field: "registration_number",
							level: 2
						},
						{
							field: "org_in_number",
							level: 3
						}, {
							field: "driver",
							level: 4
						}, {
							field: "phone",
							level: 5
						}, {
							field: "status",
							level: 6
						}, {
							field: "model",
							level: 7
						}, {
							field: "spec",
							level: 8
						}, {
							field: "memo",
							level: 9
						}, {
							field: "org_id",
							level: 10
						}
					]
					let fob = '';
					let sqlcode = -1
					let msg = ''
					if (form.truck_id && form.truck_id > 0) {
						//更新
						sqlcode = 953;

						fob = that.update_fob;
						msg = '更新';
						list.push({
							field: "truck_id",
							level: 11
						})
					} else {
						//添加
						msg = '添加'
						sqlcode = 952
						fob = that.insert_fob;
						that.form.org_id = that.org_id;
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
					// if (!data || data.length == 0) {
					// 	that.$baseMessage(msg + '失败', 'error')
					// 	return false;
					// }
					if (influence > 0) {
						that.$baseMessage(msg + '成功', 'success');
						that.close();
						return true;
					} else {
						that.$baseMessage(msg + '失败', 'error');
						return false;
					}
				}
				console.log(that.form)
				that.$refs['form'].validate((valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							const flag = await submit()
							callback(flag)
							// that.fileUpload(async function(status) {
							// 	if (status) {
							// 		const flag = await submit()
							// 		callback(flag)
							// 	}
							// })
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
