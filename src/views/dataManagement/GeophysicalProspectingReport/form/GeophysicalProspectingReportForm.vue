<template>
	<span>
		<el-form ref="report_from" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="编写人" :label-width="formLabelWidth" prop="compiler">
						<el-input maxlength="25" :placeholder="isReadOnly('请刷新重试...')" v-model="form.compiler"
							show-word-limit style="width: 100%" :readonly="true">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="编写时间" :label-width="formLabelWidth" prop="writingTime">
						<el-date-picker v-model="form.writingTime" align="right" type="datetime"
							:placeholder="isReadOnly('选择日期')" :picker-options="pickerOptions.before" style="width: 100%"
							:format='dateFormat' :value-format="dateFormat" :disabled="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="备注" :label-width="formLabelWidth" prop="compile_remarks">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" maxlength="150"
							:placeholder="isReadOnly('请输入备注...')" v-model="form.compile_remarks" show-word-limit
							style="width: 100%" :readonly="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="成果文件" :label-width="formLabelWidth">
						<upload ref="achievement_file" :tip_show="upload.tip_show"
							:upload_type="upload.upload_type.achievement_file" :file_size="upload.file_size"
							:size_unit="upload.size_unit" :original_name="upload.original_name.achievement_file"
							:type_str="upload.type_str" :type_array="upload.type_array"
							:success_status.sync="upload.success.achievement_file" v-model="form.achievement_file"
							:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.achievement_file"
							:only_show="readonly" @updateFileName="updateFileName_achievement">
						</upload>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="报告文件" :label-width="formLabelWidth">
						<upload ref="report_file" :tip_show="upload.tip_show"
							:upload_type="upload.upload_type.report_file" :file_size="upload.file_size"
							:size_unit="upload.size_unit" :original_name="upload.original_name.report_file"
							:type_str="upload.type_str" :type_array="upload.type_array"
							:success_status.sync="upload.success.report_file" v-model="form.report_file"
							:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.report_file"
							:only_show="readonly" @updateFileName="updateFileName_report">
						</upload>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="附件" :label-width="formLabelWidth">
						<upload ref="compile_enclosure" :tip_show="upload.tip_show"
							:upload_type="upload.upload_type.compile_enclosure" :file_size="upload.file_size"
							:size_unit="upload.size_unit" :original_name="upload.original_name.compile_enclosure"
							:type_str="upload.type_str" :type_array="upload.type_array"
							:success_status.sync="upload.success.compile_enclosure" v-model="form.compile_enclosure"
							:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.compile_enclosure"
							:only_show="readonly" @updateFileName="updateFileName_enclosure">
						</upload>
					</el-form-item>
				</el-col>

			</el-row>
		</el-form>
	</span>
</template>
<script>
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
		mapGetters
	} from 'vuex'
	import upload from '@/components/Upload/upload'
	import {
		file_upload_type,
		type_str,
		type_array,
		GetOrgId
	} from '../common/common.js'
	export default {
		name: 'GeophysicalProspectingReportForm',
		components: {
			upload,
		},
		props: {
			formData: {
				type: Object,
				required: false,
			},
			status: {
				type: Number,
				required: false,
				default: 0
			},
			type: {
				type: Number,
				required: false,
				default: 0
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
		data() {
			let that = this
			return {
				uploadDeault: {

				},
				formdefalut: {

				},
				readonly: false,
				material: {
					unit: '',
				},
				upload: {
					tip_show: true,
					delte_service: false,
					upload_type: {
						achievement_file: file_upload_type,
						report_file: file_upload_type,
						compile_enclosure: file_upload_type,
					},
					type_str: type_str,
					type_array: type_array,
					file_size: 15,
					size_unit: 'MB',
					original_name: {
						achievement_file: {},
						report_file: {},
						compile_enclosure: {},
					},
					success: {
						achievement_file: false,
						report_file: false,
						compile_enclosure: false,
					},
					old_delete: {
						achievement_file: false,
						report_file: false,
						compile_enclosure: false
					}
				},
				form_old: {

				},
				form: {
					report_id: -1,
					compiler_id: '',
					compiler: '',
					org_id: '',
					achievement_file: '',
					achievement_file_name: '',
					report_file: '',
					report_file_name: '',
					compile_remarks: '',
					compile_enclosure: '',
					compile_enclosure_name: '',
					status: 0,
					add_time: '',
					edit_time: '',
					writingTime: getToday(),

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
					compiler: [{
						required: true,
						message: '请刷新重试',
						trigger: 'blur',
					}],
					writingTime: [{
						required: true,
						message: '请选择编写时间',
						trigger: 'blur',
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							callback();
						}
					}]
				},
			}
		},
		watch: {
			formData: {
				handler: function(newVal, b) {
					if (newVal) {
						this.init();
					}
				},
				deep: true,
			},
		},
		created() {
			this.init()
		},
		methods: {
			clearValidate(prop) {
				this.$refs['report_from'].clearValidate(prop)
			},
			async init() {
				this.rules = this.rules_temp
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.form_old = JSON.parse(JSON.stringify(this.formData))
					this.file_default()
				}
				if (!this.form.compiler_id) {
					this.form.compiler_id = this.person_id;
					this.form.compiler = this.username;
				}
				switch (this.type) {
					case 0:
						break;
					case 10:
						this.readonly = true;
						break;
				}

			},
			isHasNewData() {
				let flag = false;
				let value = '';
				for (let key in this.form) {
					console.log('isHasNewData', key, this.form[key]);
					if (typeof this.form_old[key] == 'undefined') {
						flag = true;
						break;
					}
					value = this.form[key];
					if (this.form_old[key] != value) {
						flag = true;
						break;
					}
				}
				console.log('isHasNewData', flag);
				console.log('isHasNewData', this.form, this.form_old);
				return flag;
			},
			updateFileName_achievement(fileName) {
				this.form.achievement_file_name = fileName;
			},
			updateFileName_report(fileName) {
				this.form.report_file_name = fileName;
			},
			updateFileName_enclosure(fileName) {
				this.form.compile_enclosure_name = fileName;
			},
			isReadOnly(txt) {
				if (this.readonly) {
					return ''
				}
				return txt
			},
			file_default() {
				const form = JSON.parse(JSON.stringify(this.form))
				let that = this
				if (this.form.achievement_file) {
					this.upload.original_name.achievement_file[this.form.achievement_file] = this.form
						.achievement_file_name;
				}
				if (this.form.compile_enclosure) {
					this.upload.original_name.compile_enclosure[this.form.compile_enclosure] = this.form
						.compile_enclosure_name;
				}
				if (this.form.report_file) {
					this.upload.original_name.report_file[this.form.report_file] = this.form
						.report_file_name;
				}
			},
			fileUploadRefs() {
				return ['report_file', 'achievement_file', 'compile_enclosure']
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
				that.$refs['report_from'].resetFields()
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
					this.$refs['report_from'].resetFields()
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
			save(isSubmit, callback) {
				//isSubmit 是否提交审核
				let that = this
				async function submit() {
					that.loading = true
					that.loadingText = '提交表单中...'
					let form = JSON.parse(JSON.stringify(that.form));
					if (isSubmit) {
						form.is_submit = 1;
					} else {
						form.is_submit = 0;
						if (!that.isHasNewData()) {
							return true;
						}
					}

					let list = [{
							field: 'id',
							type: 3,
							level: 1
						},
						{
							field: 'org_id',
							type: 3,
							level: 2
						},
						{
							field: 'compiler_id',
							type: 3,
							level: 3
						},
						{
							field: 'achievement_file',
							type: 3,
							level: 4
						},
						{
							field: 'achievement_file_name',
							type: 3,
							level: 5
						},
						{
							field: 'report_file',
							type: 3,
							level: 6
						},
						{
							field: 'report_file_name',
							type: 3,
							level: 7
						},
						{
							field: 'compile_enclosure',
							type: 3,
							level: 8
						},
						{
							field: 'compile_enclosure_name',
							type: 3,
							level: 9
						},
						{
							field: 'compile_remarks',
							type: 3,
							level: 10
						},
						{
							field: 'writingTime',
							type: 3,
							level: 11
						}, {
							field: 'is_submit',
							type: 3,
							level: 12
						}, {
							field: 'report_id',
							type: 3,
							level: 13
						},
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.report_id && form.report_id > 0) {
						//更新
						sqlcode = 840
						//fob = that.QueryExec_fob_custom;
						fob = that.update_fob;
						form.org_id = await GetOrgId()
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 840
						//fob = that.QueryExec_fob_custom;
						fob = that.update_fob;
						form.org_id = await GetOrgId()
					}
					//type, sqlcode, list, filed
					const {
						code,
						influence,
						data
					} = await fob(list, form, sqlcode)
					if (influence > 0) {
						that.$baseMessage(msg + '成功', 'success');
						return true;
					} else {
						that.$baseMessage(msg + '失败', 'error');

					}

					// console.log(code, influence, data);
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
				that.$refs['report_from'].validate((valid) => {
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
