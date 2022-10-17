<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span">
				<el-form-item label="角色名称" :label-width="formLabelWidth" prop="role_name">
					<el-input v-model="form.role_name" :placeholder="isReadOnly('请输入角色名称')" style="width:100%"
						:readonly="readonly" maxlength="32">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="是否启用" :label-width="formLabelWidth" prop="enable">
					<el-switch v-model="form.enable" active-text="启用" inactive-text="禁用">
					</el-switch>
				</el-form-item>
			</el-col>

			<el-col :span="span">
				<el-form-item label="等级" :label-width="formLabelWidth" prop="level">
					<el-input v-model.number="form.level" :placeholder="isReadOnly('请输入等级')" style="width:100%"
						:readonly="readonly" maxlength="32">
					</el-input>
				</el-form-item>
			</el-col>

			<el-col :span="span">
				<el-form-item label="角色描述" :label-width="formLabelWidth" prop="desc">
					<el-input v-model="form.desc" :placeholder="isReadOnly('请输入角色描述')" style="width:100%"
						:readonly="readonly" maxlength="25" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
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
		name: 'credForm',
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
					role_id: -1,
					role_name: '',
					ext_org_id: -1,
					enable: true,
					level: 1,
					desc: '',
					remarks: ''
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
					role_name: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入角色名称'
					}],
					enable: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择启用状态'
					}],
					level: [{
						required: true,
						trigger: 'blur',
						message: '请输入角色等级'
					}, {
						type: 'number',
						trigger: 'blur',
						message: '等级必须为数字值'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {

							if (!isNumEx(value)) {
								callback(new Error('等级必须为数字值'))
								return
							}
							if (Number(value) < 1) {
								callback(new Error('等级必须大于等于1'))
								return
							}
							callback()
						}
					}],
					desc: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入角色描述'
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
				switch (this.form.enable) {
					case '1':
						this.form.enable = true
						break
					case '0':
						this.form.enable = false
						break
					default:
						this.form.enable = this.form.enable
						break
				}
				if (this.form.level && isNumEx(this.form.level)) {
					this.form.level =Number(this.form.level)
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
							field: "role_name",
							level: 1
						},
						{
							field: "enable",
							level: 2
						},
						{
							field: "level",
							level: 3
						},
						{
							field: "desc",
							level: 4
						},
						{
							field: "remarks",
							level: 5
						}, {
							field: "role_id",
							level: 6
						},
					]
					let fob = '';
					let sqlcode = -1
					let msg = ''
					if (form.role_id && form.role_id > 0) {
						//更新
						sqlcode = 319
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 319
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
