<template>
	<el-form ref='form' :model="form" :label-width="formLabelWidth" :rules="rules" v-loading="loading"
		:element-loading-text="loadingText">
		<el-form-item label="审核人">
			<el-input v-model="form.approver" :readonly="true" style="width: 100%" maxlength="8"></el-input>
		</el-form-item>
		<el-form-item label="是否通过" style="margin-top: 10px" prop="approve">
			<el-select v-model="form.approve" style="width: 100%" :disabled="readonly" :placeholder="readonly?'':'请选择'">
				<el-option v-for="data in selectData.approveData" :key="data.item_id" :label="data.item_name"
					:value="data.item_id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="审核时间" v-show="readonly">
			<el-input v-model="form.approve_date" :readonly="true" style="width: 100%" maxlength="8"></el-input>
		</el-form-item>
		<el-form-item label="原因" style="margin-top: 10px" :required="ruleForm.reason" prop="reason">
			<el-input v-model="form.reason" type="textarea" :rows="6" :placeholder="readonly?'':'请输入原因'"
				:readonly="readonly" style="width: 100%" maxlength="100"></el-input>
		</el-form-item>
		<el-form-item label="附件" :label-width="formLabelWidth" v-show="isNeedFile">
			<revieweEnclosure ref="revieweEnclosure" :downLoad_Fn="downLoadFn" :tip_show="upload.tip_show"
				:upload_type="upload.upload_type.revieweEnclosure"
				:original_name="upload.original_name.revieweEnclosure" :type_str="upload.type_str"
				:type_array="upload.type_array" :success_status.sync="upload.success.revieweEnclosure"
				v-model="form.revieweEnclosure" :delte_service="upload.delte_service"
				:old_delete.sync="upload.old_delete.revieweEnclosure" :fileName.sync="form.doc_name"
				:only_show="readonly">
			</revieweEnclosure>
		</el-form-item>
	</el-form>
</template>

<script>
	import revieweEnclosure from '@/components/Upload/upload'
	import store from '@/store/index'
	export default {
		name: 'examineWithFileForm',
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
			},
			downLoadFn: {
				type: Function,
				default: function(fileName, src, action) {

				}
			},
			isNeedFile: {
				type: Boolean,
				default: false
			}
		},
		components: {
			revieweEnclosure,
		},
		watch: {
			formData(newVal, oldVal) {
				if (this.formData) {
					this.form = Object.assign(this.form, newVal)
				}
			},
		},
		data() {
			let that = this
			return {
				formLabelWidth: '120px',
				selectData: {
					approveData: [{
						item_id: 1,
						item_name: '通过'
					}, {
						item_id: -1,
						item_name: '退回'
					}]
				},
				readonly: false,
				loading: false,
				loadingText: '提交表单中...',
				form: {
					approver: store.getters['user/username'],
					approver_id: store.getters['user/person_id'],
					approve: '',
					approve_date: '',
					reason: '',
				},
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						revieweEnclosure: 12,
					},
					type_str: 'jpg/pdf/png/jpeg/docx/doc/xlsx/xls',
					type_array: ['image/jpeg', 'image/png', 'application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/msword','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel'],
					file_size: '15',
					size_unit: 'MB',
					original_name: {
						revieweEnclosure: {},
					},
					success: {
						revieweEnclosure: false,
					},
					old_delete: {
						revieweEnclosure: false,
					}
				},
				ruleForm: {
					reason: false
				},
				rules: {},
				rules_temp: {
					approve: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请选择审核状态'
					}, {
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							switch (value) {
								case 0:
									break;
								case 1:
									that.ruleForm.reason = false
									break
								case -1:
									that.ruleForm.reason = true
									break
							}
							callback()
						}
					}],
					reason: [{
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							if (that.ruleForm.reason && !value) {
								callback(new Error('请填写退回原因'))
							} else {
								callback()
							}

						}
					}]
				}
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
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.file_default()
				}
			},
			file_default() {
				const form = JSON.parse(JSON.stringify(this.form))
				let that = this
				if (that.form.revieweEnclosure) {
					that.upload.original_name.revieweEnclosure[form.revieweEnclosure] = '审核附件'
				}


			},
			fileUploadRefs() {
				return ['revieweEnclosure']
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
				this.$refs['form'].resetFields()
				this.details = this.$options.data().details
				this.$emit('fetch-data')
			},
			async save(callback) {
				let that = this
				const valid = await that.$refs['form'].validate()
				if (valid) {
					that.$baseConfirm('确定提交？', null, async () => {
						if (that.isNeedFile) {
							that.fileUpload(function(status) {
								if (status) {
									callback(that.form)
								} else {
									that.$baseMessage('文件上传失败', 'error')
								}
							})
						} else {
							callback(that.form)
						}

						return true
					})
					return false
				}
				callback(false)
				return true
			},
		},
	}
</script>

<style>
</style>
