<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span2">
				<el-form-item label="处置/整改日期" :label-width="formLabelWidth" prop="improve_date">
					<el-date-picker v-model="form.improve_date" type="datetime" style="width:100%"
						:picker-options="pickerOptions" :format='dateFormat' :value-format="dateFormat"
						:placeholder="isReadOnly('处置/整改日期')">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span2">
				<el-form-item label="处置/整改人" :label-width="formLabelWidth" prop="processor">
					<el-input v-model="form.processor" :placeholder="isReadOnly('请输入处置/整改人')" style="width:100%"
						:readonly="readonly" maxlength="8" type="text" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="处置/整改部门" :label-width="formLabelWidth" prop="improvement">
					<el-input v-model="form.improvement" :placeholder="isReadOnly('请输入处置/整改部门')" style="width:100%"
						:readonly="readonly" maxlength="100" type="text" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="处置/整改措施" :label-width="formLabelWidth" prop="improve_method">
					<el-input v-model="form.improve_method" :placeholder="isReadOnly('请输入处置/整改措施')" style="width:100%"
						:readonly="readonly" maxlength="50" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="处置/整改结果" :label-width="formLabelWidth" prop="improve_result">
					<el-input v-model="form.improve_result" :placeholder="isReadOnly('请输入处置/整改结果')" style="width:100%"
						:readonly="readonly" maxlength="100" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
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
			<el-col :span="span">
				<el-form-item label="附件" :label-width="formLabelWidth" prop="image_list">
					<fileupload ref="image_list" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.image_list" :original_name="upload.original_name.image_list"
						:type_str="upload.type_str" :type_array="upload.type_array"
						:success_status.sync="upload.success.image_list" v-model="form.image_list"
						:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.image_list"
						:only_show="readonly" :file_size="upload.file_size">
					</fileupload>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import fileupload from '@/components/Upload/upload'
	//import contractFileupload from '@/components/Upload/upload'
	import {
		format_fob,
		pickerOptions,
		getToday,
		getTodayDatetime,
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
	import {
		GetImgAndWordAndCompressSuffix,
		GetImgAndWordAndCompressType,
		GetImgAndWordAndCompressAndPdfType,
		GetImgAndWordAndCompressAndPdfSuffix
	} from '@/utils/servicefile'
	export default {
		name: 'noSupervisorHandleRisksForm',
		components: {
			fileupload,
			//contractFileupload,
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
				person_id: 'user/person_id',
				username: 'user/username'
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
				span2: 12,
				readonly: false,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(1),
				formdefalut: {},
				form: {
					improve_date: getTodayDatetime(),
					processor: '',
					improvement: '',
					improve_method: '',
					improve_result: '',
					memo: '',
					image_list: '',
					id: '',
				},
				upload: {
					tip_show: true,
					delte_service: false,
					upload_type: {
						image_list: 12,
					},
					type_str: GetImgAndWordAndCompressAndPdfSuffix(),
					type_array: GetImgAndWordAndCompressAndPdfType(),
					file_size: 15,
					size_unit: 'MB',
					original_name: {
						image_list: {},
					},
					success: {
						image_list: false,
					},
					old_delete: {
						image_list: false,
					}
				},
				rules_temp: {
					improve_date: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择时间'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (!value) {
								callback(new Error('请选择时间'))
								return
							}
							callback()
						}
					}],
					processor: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入处置人'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (value && value.length > 8) {
								callback(new Error('处置人最长8位'))
								return
							}
							callback()
						}
					}],
					improvement: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入处置部门'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (value && value.length > 100) {
								callback(new Error('处置部门最长100位'))
								return
							}
							callback()
						}
					}],
					improve_method: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入处置方法'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (value && value.length > 50) {
								callback(new Error('方法部门最长50位'));
								return;
							}
							callback();
						}
					}],
					improve_result: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入处置结果'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (value && value.length > 100) {
								callback(new Error('处置结果最长100位'));
								return;
							}
							callback();
						}
					}],
					memo: [{
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (value && value.length > 100) {
								callback(new Error('备注最长100位'));
								return;
							}
							callback();
						}
					}]

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
				if (!this.form.improve_date) {
					this.form.improve_date = getTodayDatetime();
				}
				if (!this.form.processor) {
					this.form.processor = this.username;
				}

			},
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},
			file_default() {
				try {
					const form = JSON.parse(JSON.stringify(this.form))
					let that = this
					that.upload.original_name.image_list[form.image_list] = '整改附件'
				} catch (e) {
					console.log(e);
				}

			},
			fileUploadRefs() {
				return ['image_list']
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
				let that = this;
				async function submit() {
					that.loading = true
					that.loadingText = '提交表单中...'
					let form = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: "id",
							level: 1
						},
						{
							field: "improve_method",
							level: 2
						},
						{
							field: "improvement",
							level: 3
						}, {
							field: "improve_date",
							level: 4
						}, {
							field: "improve_result",
							level: 5
						}, {
							field: "processor",
							level: 6
						}, {
							field: "memo",
							level: 7
						}, {
							field: "image_list",
							level: 8
						}
					]
					let fob = '';
					let sqlcode = 1067;
					let msg = ''
					//update_fob(list, filed, sqlcode)
					if (form.type_id && form.type_id > 0) {
						//更新
						sqlcode = 1067
						fob = that.update_fob;
						msg = '提交'
					} else {
						//添加
						msg = '提交'
						sqlcode = 1067
						fob = that.update_fob;
					}
					const {
						code,
						influence,
						data
					} = await fob(list, that.form, sqlcode)
					console.log(code, influence, data);
					if (influence && influence > 0) {
						that.$baseMessage(msg + '成功', 'success');
						that.close();
						return true;
					} else {
						that.$baseMessage(msg + "失败", 'error');

						return false;
					}
					// if (code != 200) {
					// 	that.$baseMessage(msg + '失败', 'error')
					// 	return false
					// }
					// if (!data || data.length == 0) {
					// 	that.$baseMessage(msg + '失败', 'error')
					// 	return
					// }
					// let json = JSON.parse(data[0].info)

					// if (json.code > 0) {
					// 	switch (json.code) {
					// 		case 1:
					// 			that.$baseMessage(json.msg, 'success')
					// 			that.close()
					// 			return true
					// 			break
					// 		case 2:
					// 			that.$baseMessage(json.msg, 'error')
					// 			break
					// 		default:
					// 			that.$baseMessage(json.msg, 'error')
					// 			break
					// 	}
					// 	return false
					// } else {
					// 	that.$baseMessage(json.msg, 'error')
					// 	return false
					// }
				}
				that.$refs['form'].validate((valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							//const flag = await submit()
							callback(flag)
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
