<template>

	<el-form ref='form' :model="form" :label-width="formLabelWidth" :rules="rules" v-loading="loading"
		:element-loading-text="loadingText">
		<el-form-item label="毕业学校" prop="school">
			<el-input v-model.trim="form.school" :placeholder="readonly?'':'请输入学校名称'" :readonly="readonly"
				style="width: 100%" :maxlength="16"></el-input>
		</el-form-item>
		<el-form-item label="学历层次" style="margin-top: 10px" prop="education">
			<el-select v-model="form.education" style="width: 100%" :disabled="readonly"
				:placeholder="readonly?'':'请选择学历'">
				<el-option v-for="data in selectData.education" :key="data.item_name" :label="data.item_name"
					:value="data.item_name">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="专业" style="margin-top: 10px">
			<el-input v-model="form.major" :placeholder="readonly?'':'请输入专业'" :readonly="readonly" style="width: 100%"
				:maxlength="16">
			</el-input>
		</el-form-item>
		<el-form-item label="证书编号" style="margin-top: 10px">
			<el-input v-model="form.cert_no" :placeholder="readonly?'':'请输入证书编号'" :readonly="readonly"
				style="width: 100%" :maxlength="16"></el-input>
		</el-form-item>

		<el-form-item label="开始日期" style="margin-top: 10px" prop="start_date">
			<el-date-picker v-model="form.start_date" align="right" type="date" placeholder="选择日期" :readonly="readonly"
				:picker-options="pickerOptions" style="width: 100%" :format='dateFormat' :value-format="dateFormat">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="毕业日期" style="margin-top: 10px" prop="end_date">
			<el-date-picker v-model="form.end_date" align="right" type="date" placeholder="选择日期" :readonly="readonly"
				:picker-options="pickerOptions" style="width: 100%" :format='dateFormat' :value-format="dateFormat">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="毕业证扫描件">
			<certimageupload ref="cert_image" :tip_show="upload.tip_show" :downLoad_Fn="downLoadFn"
				:upload_type="upload.upload_type.cert_image" :original_name="upload.original_name.cert_image"
				:type_str="upload.type_str" :type_array="upload.type_array"
				:success_status.sync="upload.success.cert_image" v-model="form.cert_image"
				:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.cert_image"
				:only_show="readonly">
			</certimageupload>
		</el-form-item>
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
	import certimageupload from '@/components/Upload/upload'
	export default {
		name: 'educationalExperienceForm',
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
				default: 0 //0 正常表单 1 审核表单
			}
		},
		watch: {
			formData(newVal, oldVal) {
				if (this.formData) {
					this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
					this.form = JSON.parse(JSON.stringify(this.formDefault))
					this.form = Object.assign(this.form, newVal)
					this.file_default()
				}
			},
			type(newVal, oldVal) {
				switch (newVal) {
					case 0:
						this.readonly = false
						this.rules = this.rules_temp
						break;
					case 1:
						this.readonly = true
						this.rules = {}
						break
				}
			}
		},
		data() {
			let that = this
			return {
				loading: false,
				loadingText: '',
				formLabelWidth: '120px',
				selectData: {
					education: [],
				},
				readonly: false,
				formDefault: {},
				form: {
					edu_id: -1,
					person_id: -1,
					education: '',
					major: '',
					school: '',
					cert_no: '',
					start_date: getToday(),
					end_date: getToday(),
					cert_image: '',
				},
				upload: {
					tip_show: true,
					delte_service: false,
					//如果要修改注意一起修改删除
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
					school: [{
						required: true,
						trigger: 'blur',
						message: '请输入毕业学校'
					}],
					education: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请选择学历层次'
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
					}]
				},
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(),
			}
		},
		created() {
			this.init()
		},

		methods: {
			downLoadFn(fileName, src) {
				console.log(fileName, src);
			},
			resetForm() {
				const refs = this.fileUploadRefs()
				const length = refs.length
				let that = this
				for (let i = 0; i < length; i++) {
					try {
						that.$refs[refs[i]].clear()
					} catch (e) {
						console.log(e)
					}
				}
				this.$refs['form'].resetFields()
				this.details = this.$options.data().details
				this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
				this.form = JSON.parse(JSON.stringify(this.formDefault))
				console.log(that.form)
			},
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
				this.GetGroup()
				//保存默认值
				this.formDefault = JSON.parse(JSON.stringify(this.form))
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.file_default()
				}
			},
			async GetGroup() {
				let list = [{
					data: "education",
					group_id: 1000
				}];
				await GetGroupDataEx(this, list)
			},
			file_default() {
				const form = JSON.parse(JSON.stringify(this.form))
				let that = this

				that.upload.original_name.cert_image[form.cert_image] = '毕业证'
				console.log(that.upload.original_name)
			},
			dateformt() {
				return format_fob(new Date())
			},

			fileUploadRefs() {
				return ["cert_image"]
			},
			async fileUpload(callback) {
				try {
					let that = this
					const refs = that.fileUploadRefs()
					let check_list = []
					let length = refs.length
					that.loading = true
					that.loadingText = '上传文件中'
					for (let i = 0; i < length; i++) {
						try {
							let temp = await that.$refs[refs[i]].submitUpload()
							//console.log('上传文件中', temp)
							if (temp === 1) {
								check_list.push(refs[i]);
							}
						} catch (e) {
							console.log(e)
						}
					}
					//console.log('check_list', check_list)
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
			save(callback) {
				let that = this
				async function submit(form, callback) {
					that.loading = true
					that.loadingText = '提交表单中'
					let data = JSON.parse(JSON.stringify(form))
					let list = [{
							field: 'person_id',
							type: 3,
							level: 1,
						},
						{
							field: 'school',
							type: 3,
							level: 2,
						},
						{
							field: 'education',
							type: 3,
							level: 3,
						},
						{
							field: 'major',
							type: 3,
							level: 4,
						},
						{
							field: 'cert_image',
							type: 3,
							level: 5,
						},
						{
							field: 'cert_no',
							type: 3,
							level: 6,
						},
						{
							field: 'start_date',
							type: 3,
							level: 7,
						},
						{
							field: 'end_date',
							type: 3,
							level: 8,
						},
					]
					let fob = ''
					let sqlcode = -1
					let msg = ''
					if (data.edu_id && data.edu_id > 0) {
						//更新
						sqlcode = 76
						fob = that.update_fob
						msg = '更新'
						list.push({
							field: 'edu_id',
							level: 9,
						})
					} else {
						//添加
						msg = '添加'
						sqlcode = 74
						fob = that.insert_fob
					}
					const {
						code,
						influence
					} = await fob(list, that.form, sqlcode)
					that.loading = false
					if (code != 200) {
						that.$baseMessage(msg + '失败', 'error')
						return false
					}
					if (influence > 0) {
						that.$baseMessage(msg + '成功', 'success')
						//重载表格
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
									if (callback) {
										callback(true)
									}
								}
							})
					} else {
						that.$baseMessage(msg + '失败', 'error')
						callback(false)
					}
				}
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							that.fileUpload(function(status) {
								if (status) {
									console.log(that.form)
									submit(that.form, function(stauts) {
										if (stauts) {
											that.resetForm()
										}
										if (callback) {
											callback(stauts)
										}
									})
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
