<template>
	<el-form ref="form" :model="form" :rules="rules" v-loading="loading" :element-loading-text="loadingText">
		<el-row>
			<el-col :span="span">
				<el-form-item label="培训组织" :label-width="formLabelWidth" prop="tain_org">
					<el-input v-model="form.tain_org" :placeholder="isReadOnly('请输入培训组织')" :readonly="readonly"
						style="width: 100%" maxlength="25"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="培训老师" :label-width="formLabelWidth">
					<el-input v-model="form.teacher" :placeholder="isReadOnly('请输入培训老师')" :readonly="readonly"
						style="width: 100%" maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="培训内容" :label-width="formLabelWidth" prop="edu_course">
					<el-input type="textarea" :rows="3" :placeholder="isReadOnly('请输入培训内容')" style="width: 100%"
						v-model="form.edu_course" maxlength="100" show-word-limit :readonly="readonly"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="培训开始日期" :label-width="formLabelWidth" prop="start_date">
					<el-date-picker v-model="form.start_date" align="right" type="date"
						:placeholder="isReadOnly('请选择日期')" :picker-options="pickerOptions" style="width: 100%"
						:format='dateFormat' :value-format="dateFormat" :readonly="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="培训结束日期" :label-width="formLabelWidth" prop="end_date">
					<el-date-picker v-model="form.end_date" align="right" type="date" :placeholder="isReadOnly('请选择日期')"
						:picker-options="pickerOptions" style="width: 100%" :format='dateFormat'
						:value-format="dateFormat" :readonly="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="学时(h)" :label-width="formLabelWidth" prop="hours">
					<el-input v-model="form.hours" :placeholder="isReadOnly('请输入学时')" maxlength="10" style="width: 100%"
						:readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="证书名称" :label-width="formLabelWidth">
					<el-input v-model="form.cert_name" :placeholder="isReadOnly('请输入证书名称')" style="width: 100%"
						maxlength="50" :readonly="readonly"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="证书编号" :label-width="formLabelWidth">
					<el-input v-model="form.cert_no" :placeholder="isReadOnly('请输入证书编号')" style="width: 100%"
						maxlength="50" :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="培训结果" :label-width="formLabelWidth" prop="result">
					<el-input type="textarea" :rows="3" :placeholder="isReadOnly('请输入培训结果')" style="width: 100%"
						v-model="form.result" maxlength="50" :readonly="readonly"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="毕业证扫描件" :label-width="formLabelWidth">
					<certimageupload ref="cert_image" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.cert_image" :original_name="upload.original_name.cert_image"
						:type_str="upload.type_str" :type_array="upload.type_array"
						:success_status.sync="upload.success.cert_image" v-model="form.cert_image"
						:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.cert_image"
						:only_show="readonly">
					</certimageupload>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
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
		isNumEx
	} from '@/utils/validate'
	import certimageupload from '@/components/Upload/upload'
	export default {
		name: 'trainForm',
		components: {
			certimageupload,
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
		watch: {
			formData(newVal, oldVal) {
				if (newVal) {
					this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
					this.form = JSON.parse(JSON.stringify(this.formDefault))
					this.form = Object.assign(this.form, newVal)
					this.file_default()
				}
			},
		},
		data() {
			let that = this
			return {
				readonly: false,
				loading: false,
				span: 24,
				loadingText: '上传文件中',
				dateFormat: dateFormat(),
				pickerOptions: pickerOptions(),
				formdefault: {},
				form: {
					cert_name: '',
					org_id: -1,
					person_id: -1,
					edu_course: '',
					hours: '',
					start_date: getToday(),
					end_date: getToday(),
					teacher: '',
					tain_org: '',
					result: '',
					cert_image: '',
					cert_no: '',
				},
				upload: {
					tip_show: true,
					delte_service: false,
					upload_type: {
						cert_image: 14,
					},
					type_str: 'jpg/pdf/png/jpeg',
					type_array: ['image/jpeg', 'image/png', 'application/pdf'],
					file_size: '4',
					size_unit: 'MB',
					original_name: {
						cert_image: {},
					},
					success: {
						cert_image: false,
					},
					old_delete: {
						cert_image: false,
					}
				},
				rules: {},
				rules_temp: {
					tain_org: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入培训组织'
					}],
					edu_course: [{
						required: true,
						trigger: 'blur',
						message: '请输入培训内容'
					}],
					start_date: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请输入开始时间'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							const end = new Date(that.form.end_date)
							const start = new Date(value)
							if (start > end) {
								callback(new Error('开始时间不能晚与结束时间'))
								return
							} else {
								callback()
							}
						}
					}],
					end_date: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请输入结束时间'
					}, {
						trigger: ['blur'],
						validator: async function(rule, value, callback) {
							const end = new Date(value)
							const start = new Date(that.form.start_date)
							if (start > end) {
								callback(new Error('结束时间不能早与开始时间'))
								return
							} else {
								callback()
							}

						}
					}],
					hours: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请输入培训时长'
					}, {
						trigger: ['blur'],
						validator: async function(rule, value, callback) {
							const falg = isNumEx(value)
							if (falg && value > 0) {
								callback()
								return
							} else {
								callback(new Error('请输入正数'))
							}
						}
					}],
					result: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请输入培训结果'
					}]

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
				this.formDefault = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.file_default()
				}
			},
			file_default() {
				const form = JSON.parse(JSON.stringify(this.form))
				let that = this
				that.upload.original_name.cert_image[form.cert_image] = '毕业证'
			},
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},

			close() {
				let that = this
				const refs = this.fileUploadRefs()
				const length = refs.length
				for (let i = 0; i < length; i++) {
					try {
						that.$refs[refs[i]].clear()
					} catch (e) {
						console.log(e)
					}
				}
				this.$refs['form'].resetFields()
				this.form = this.$options.data().form
				this.form = JSON.parse(JSON.stringify(this.formDefault))
			},
			fileUploadRefs() {
				return ["cert_image"]
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
							clearInterval(index)
							exce()
						}
					}, 500)

					function exce() {
						let flag = true
						let length = check_list.length
						while (--length > -1) {
							if (that.$refs[check_list[length]].error) {
								flag = false
							}
						}
						if (flag) {
							that.upload.delte_service = true
						} else {
							that.$baseMessage('文件上传失败', 'error')
						}
						that.loading = false
						callback(flag)
					}
				} catch (e) {
					console.log(e)
				}
			},
			save(callback) {
				let that = this
				async function submit() {
					that.loading = true
					that.loadingText = '提交表单中'
					let data = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: "edu_course",
							level: 1
						},
						{
							field: "hours",
							level: 2
						},
						{
							field: "start_date",
							level: 3
						},
						{
							field: "end_date",
							level: 4
						},
						{
							field: "teacher",
							level: 5
						},
						{
							field: "tain_org",
							level: 6
						},
						{
							field: "result",
							level: 7
						},
						{
							field: "cert_image",
							level: 8
						},
						{
							field: "cert_name",
							level: 12
						},
						{
							field: "cert_no",
							level: 9
						},
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (data.train_id) { //更新
						sqlcode = 83
						fob = that.update_fob;
						msg = '更新'
						list.push({
							field: "train_id",
							level: 13
						})
					} else { //添加
						msg = '添加'
						sqlcode = 82
						fob = that.insert_fob;

						list.push({
							field: "person_id",
							level: 10
						}, {
							field: "org_id",
							level: 11
						})
					}
					const {
						code,
						influence
					} = await fob(list, that.form, sqlcode)
					console.log(that.form);
					that.loading = false
					if (code != 200) {
						that.$baseMessage(msg + '失败', 'error')
						return false
					}
					if (influence > 0) {
						that.$baseMessage(msg + '成功', 'success')
						const refs = that.fileUploadRefs()
						let index = setInterval(
							function() {
								let flag = true
								let length = refs.length
								while (--length > -1) {
									if (!that.upload.old_delete[refs[length]]) {
										flag = false
										break
									}

								}
								if (flag) {
									clearInterval(index)
									that.close(true)
									if (callback) {
										callback(true)
									}
								}
							})
					} else {
						that.$baseMessage(msg + '失败', 'error')
					}
				}
				that.$refs['form'].validate(async (valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							that.fileUpload(function(status) {
								if (status) {
									submit()
								} else {
									that.loading = false
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
