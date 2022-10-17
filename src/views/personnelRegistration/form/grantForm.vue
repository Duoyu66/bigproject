<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span">
				<el-form-item label="授权名称" :label-width="formLabelWidth" prop="empower_name">
					<el-input v-model="form.empower_name" :placeholder="isReadOnly('请输入授权名称')" style="width:100%"
						:readonly="readonly" maxlength="50">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="授权日期" :label-width="formLabelWidth" prop="empower_date">
					<el-date-picker v-model="form.empower_date" align="right" type="date"
						:placeholder="isReadOnly('选择日期')" :picker-options="pickerOptions" style="width: 100%"
						:format='dateFormat' :value-format="dateFormat" :readonly="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="有效日期" :label-width="formLabelWidth" prop="validity_date">
					<el-date-picker v-model="form.validity_date" align="right" type="date"
						:placeholder="isReadOnly('选择日期')" :picker-options="pickerOptions" style="width: 100%"
						:format='dateFormat' :value-format="dateFormat" :readonly="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="授权范围" :label-width="formLabelWidth" prop="range">
					<el-input v-model="form.range" type="textarea" :placeholder="isReadOnly('请输入授权范围')"
						style="width:100%" maxlength="100" show-word-limit :readonly="readonly"
						:autosize="{ minRows: 4, maxRows: 6 }"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="扫描件" :label-width="formLabelWidth" prop="">
					<empowerimgupload ref="empower_img" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.empower_img" :original_name="upload.original_name.empower_img"
						:type_str="upload.type_str" :type_array="upload.type_array"
						:success_status.sync="upload.success.empower_img" v-model="form.empower_img"
						:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.empower_img"
						:only_show="readonly">
					</empowerimgupload>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
	import empowerimgupload from '@/components/Upload/upload'
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
			empowerimgupload,
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
					this.form = Object.assign(this.form, newVal)
					this.file_default()
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
					empower_id: -1,
					person_id: -1,
					empower_name: '',
					empower_date: getToday(),
					validity_date: getToday(),
					empower_img: '',
					range: '',
				},
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						empower_img: 12
					},
					type_str: 'jpg/pdf/png/jpeg',
					type_array: ['image/jpeg', 'image/png', 'application/pdf'],
					file_size: '4',
					size_unit: 'MB',
					original_name: {
						empower_img: {},
					},
					success: {
						empower_img: false,
					},
					old_delete: {
						empower_img: false,
					}
				},
				rules_temp: {
					empower_name: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入授权名称'
					}],
					empower_date: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入授权日期'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							const end = new Date(that.form.validity_date)
							const start = new Date(value)
							if (start > end) {
								callback(new Error('开始时间不能晚与结束时间'))
								return
							} else {
								callback()
							}
						}
					}],
					validity_date: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入有效期'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							const end = new Date(value)
							const start = new Date(that.form.empower_date)
							if (start > end) {
								callback(new Error('开始时间不能晚与结束时间'))
								return
							} else {
								callback()
							}
						}
					}],
					range: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入授权范围'
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
				that.upload.original_name.empower_img[form.empower_img] = '授权书'
				console.log(that.upload.original_name)
			},
			fileUploadRefs() {
				return ["empower_img"]
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
			async save(callback) {
				let that = this
				async function submit() {
					that.loading = true
					that.loadingText = '提交表单中...'
					let data = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: "empower_name",
							level: 1
						},
						{
							field: "empower_date",
							level: 2
						},
						{
							field: "validity_date",
							level: 3
						},
						{
							field: "empower_img",
							level: 4
						},
						{
							field: "range",
							level: 5
						},
						{
							field: "person_id",
							level: 6
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (data.empower_id && data.empower_id > 0) { //更新
						sqlcode = 129
						fob = that.update_fob;
						msg = '更新'
						list.push({
							field: "empower_id",
							level: 7
						})
					} else { //添加
						msg = '添加'
						sqlcode = 128
						fob = that.insert_fob;
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
						that.close()
						return true
					} else {
						that.$baseMessage(msg + '失败', 'error')
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
