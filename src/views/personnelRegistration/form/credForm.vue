<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row class="" style="margin-top: 5px">
			<el-col :span="span">
				<el-form-item label="证书名称" :label-width="formLabelWidth" prop="cert_name">
					<el-input v-model="form.cert_name" style="width: 100%" maxlength="25"
						:placeholder="isReadOnly('请输入')" :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="证书类型" :label-width="formLabelWidth" prop="cert_type">
					<el-select v-model="form.cert_type" style="width: 100%" :disabled="readonly">
						<el-option v-for="data in selectData.cert_type" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="证书编号" :label-width="formLabelWidth" prop="cert_id">
					<el-input v-model="form.cert_id" style="width: 100%" maxlength="25" :placeholder="isReadOnly('请输入')"
						:readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="发证单位" :label-width="formLabelWidth" prop="auth_org">
					<el-input v-model="form.auth_org" style="width: 100%" maxlength="25"
						:placeholder="isReadOnly('请输入')" :readonly="readonly">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="有效日期" :label-width="formLabelWidth" prop="auth_date_range">
					<el-date-picker v-model="form.auth_date_range" type="daterange" range-separator="至"
						:start-placeholder="isReadOnly('开始日期')" :picker-options="pickerOptions" :format='dateFormat'
						:value-format="dateFormat" :end-placeholder="isReadOnly('结束日期')" style="width: 100%"
						:readonly="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="扫描件" :label-width="formLabelWidth">
					<certimageupload ref="cert_image" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.cert_image" :original_name="upload.original_name.cert_image"
						:type_str="upload.type_str" :type_array="upload.type_array"
						:success_status.sync="upload.success.cert_image" v-model="form.cert_image"
						:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.cert_image"
						listtype="picture" :only_show="readonly">
					</certimageupload>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
	import certimageupload from '@/components/Upload/upload'
	import {
		format_fob,
		pickerOptionsrange,
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
					this.form = JSON.parse(JSON.stringify(this.formdefalut))
					this.form = Object.assign(this.form, newVal)
					this.file_default()
					if (newVal.validate_from) {
						this.form.auth_date_range[0] = newVal.validate_from
					}
					if (newVal.validate_to) {
						this.form.auth_date_range[1] = newVal.validate_to
					}
				}
			},
		},
		data() {
			let that = this
			return {
				span: 24,
				readonly: false,
				pickerOptions: pickerOptionsrange(),
				dateFormat: dateFormat(),
				selectData: {
					cert_type: []
				},
				formdefalut: {},
				form: {
					person_id: -1,
					auth_org: '',
					cert_name: '',
					cert_id: '',
					cert_image: '',
					auth_date_range: [getToday(), getToday()],
					cert_type: ''
				},
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						cert_image: 12
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
				rules_temp: {
					cert_name: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入证书名称'
					}],
					cert_type: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择证书类型'
					}],
					cert_id: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入证书编号'
					}],
					auth_org: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入发证机关'
					}],
					auth_date_range: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入证书有效期'
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
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				if (this.formData) {

					if (this.formData.validate_from) {
						this.form.auth_date_range[0] = this.formData.validate_from
					}
					if (this.formData.validate_to) {
						this.form.auth_date_range[1] = this.formData.validate_to
					}
					this.form = Object.assign(this.form, this.formData)
					this.file_default()
				}
				this.GetGroup()
			},
			async GetGroup() {
				let list = [{
					data: "cert_type",
					group_id: 1024
				}];
				await GetGroupDataEx(this, list)
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
				that.upload.original_name.cert_image[form.cert_image] = '证书'
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
							that.loading = false
							clearInterval(index)
							callback(flag)
						}
					}, 500)
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
				that.form = that.$options.data().form
				that.form = JSON.parse(JSON.stringify(that.formdefalut))
				that.uploadDeault = JSON.parse(JSON.stringify(that.upload))
			},
			async save(callback) {
				let that = this
				async function submit() {
					let data = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: "person_id",
							level: 1
						},
						{
							field: "cert_name",
							level: 2
						},
						{
							field: "cert_id",
							level: 3
						},
						{
							field: "auth_org",
							level: 4
						},
						{
							field: "auth_date_range",
							type: '1-2',
							level: 5
						},
						{
							field: "cert_image",
							level: 6
						},
						{
							field: "cert_type",
							level: 6
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (data.hold_id && data.hold_id > 0) { //更新
						sqlcode = 314
						fob = that.update_fob;
						msg = '更新'
						list.push({
							field: "hold_id",
							level: 7
						})
					} else { //添加
						msg = '添加'
						sqlcode = 125
						fob = that.insert_fob;
					}
					const {
						code,
						influence
					} = await fob(list, that.form, sqlcode)
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
