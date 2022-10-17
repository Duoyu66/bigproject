<template>
	<span>
		<el-form ref="examination_process_form" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item v-if="status==10" :label="GetLabelPrefix+'人'" :label-width="formLabelWidth"
						prop="review_person">
						<el-input maxlength="25" :placeholder="isReadOnly('请刷新重试...')" v-model="form.review_person"
							show-word-limit style="width: 100%" :readonly="true">
						</el-input>

					</el-form-item>
					<el-form-item v-else-if="status==20" :label="GetLabelPrefix+'人'" :label-width="formLabelWidth"
						prop="examine_person">
						<el-input maxlength="25" :placeholder="isReadOnly('请刷新重试...')" v-model="form.examine_person"
							show-word-limit style="width: 100%" :readonly="true">
						</el-input>
					</el-form-item>
					<el-form-item v-else-if="status==30" :label="GetLabelPrefix+'人'" :label-width="formLabelWidth"
						prop="approve_person">
						<el-input maxlength="25" :placeholder="isReadOnly('请刷新重试...')" v-model="form.approve_person"
							show-word-limit style="width: 100%" :readonly="true">
						</el-input>
					</el-form-item>
					<el-form-item v-else :label="GetLabelPrefix+'人'" :label-width="formLabelWidth" prop="review_person">
						<el-input maxlength="25" :placeholder="isReadOnly('请刷新重试...')" v-model="form.review_person"
							show-word-limit style="width: 100%" :readonly="true">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="是否通过" style="margin-top: 10px" prop="op_status" :label-width="formLabelWidth">
						<el-select v-model="form.op_status" style="width: 100%" :disabled="readonly"
							:placeholder="isReadOnly('请选择...')">
							<el-option v-for="data in selectData.approveData" :key="data.item_id"
								:label="data.item_name" :value="data.item_id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"
					v-show="form.examine_time||form.approve_time||form.review_time">
					<el-form-item v-if="status==10" :label="GetLabelPrefix+'时间'" :label-width="formLabelWidth"
						prop="review_time">
						<el-date-picker v-model="form.review_time" align="right" type="datetime"
							:placeholder="isReadOnly('选择日期')" :picker-options="pickerOptions.before" style="width: 100%"
							:format='dateFormat' :value-format="dateFormat" :disabled="true">
						</el-date-picker>
					</el-form-item>
					<el-form-item v-else-if="status==20" :label="GetLabelPrefix+'时间'" :label-width="formLabelWidth"
						prop="examine_time">
						<el-date-picker v-model="form.examine_time" align="right" type="datetime"
							:placeholder="isReadOnly('选择日期')" :picker-options="pickerOptions.before" style="width: 100%"
							:format='dateFormat' :value-format="dateFormat" :disabled="readonly">
						</el-date-picker>
					</el-form-item>
					<el-form-item v-else-if="status==30" :label="GetLabelPrefix+'时间'" :label-width="formLabelWidth"
						prop="approve_time">
						<el-date-picker v-model="form.approve_time" align="right" type="datetime"
							:placeholder="isReadOnly('approve_time')" :picker-options="pickerOptions.before"
							style="width: 100%" :format='dateFormat' :value-format="dateFormat" :disabled="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item v-if="status==10" :label="GetLabelPrefix+'意见'" :required="required.opinion"
						:label-width="formLabelWidth" prop="review_opinion">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" maxlength="150"
							:placeholder="isReadOnly('请输入意见...')" v-model="form.review_opinion" show-word-limit
							style="width: 100%" :readonly="readonly">
						</el-input>
					</el-form-item>
					<el-form-item v-else-if="status==20" :label="GetLabelPrefix+'意见'" :required="required.opinion"
						:label-width="formLabelWidth" prop="examine_opinion">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" maxlength="150"
							:placeholder="isReadOnly('请输入意见...')" v-model="form.examine_opinion" show-word-limit
							style="width: 100%" :readonly="readonly">
						</el-input>
					</el-form-item>
					<el-form-item v-else-if="status==30" :label="GetLabelPrefix+'意见'" :required="required.opinion"
						:label-width="formLabelWidth" prop="approve_opinion">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" maxlength="150"
							:placeholder="isReadOnly('请输入意见...')" v-model="form.approve_opinion" show-word-limit
							style="width: 100%" :readonly="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item v-if="status==10" :label="GetLabelPrefix+'备注'" :label-width="formLabelWidth"
						prop="review_remarks">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" maxlength="150"
							:placeholder="isReadOnly('请输入备注...')" v-model="form.review_remarks" show-word-limit
							style="width: 100%" :readonly="readonly">
						</el-input>
					</el-form-item>
					<el-form-item v-else-if="status==20" :label="GetLabelPrefix+'备注'" :label-width="formLabelWidth"
						prop="examine_remarks">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" maxlength="150"
							:placeholder="isReadOnly('请输入备注...')" v-model="form.examine_remarks" show-word-limit
							style="width: 100%" :readonly="readonly">
						</el-input>
					</el-form-item>
					<el-form-item v-else-if="status==30" :label="GetLabelPrefix+'备注'" :label-width="formLabelWidth"
						prop="approve_remarks">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" maxlength="150"
							:placeholder="isReadOnly('请输入备注...')" v-model="form.approve_remarks" show-word-limit
							style="width: 100%" :readonly="readonly">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item v-if="status==10" :label="GetLabelPrefix+'附件'" :label-width="formLabelWidth">
						<upload ref="review_enclosure" :tip_show="upload.tip_show"
							:upload_type="upload.upload_type.review_enclosure" :file_size="upload.file_size"
							:size_unit="upload.size_unit" :original_name="upload.original_name.review_enclosure"
							:type_str="upload.type_str" :type_array="upload.type_array"
							:success_status.sync="upload.success.review_enclosure" v-model="form.review_enclosure"
							:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.review_enclosure"
							:only_show="readonly" @updateFileName="updateFileNameReview">
						</upload>
					</el-form-item>
					<el-form-item v-else-if="status==20" :label="GetLabelPrefix+'附件'" :label-width="formLabelWidth">
						<upload ref="examine_enclosure" :tip_show="upload.tip_show"
							:upload_type="upload.upload_type.examine_enclosure" :file_size="upload.file_size"
							:size_unit="upload.size_unit" :original_name="upload.original_name.examine_enclosure"
							:type_str="upload.type_str" :type_array="upload.type_array"
							:success_status.sync="upload.success.examine_enclosure" v-model="form.examine_enclosure"
							:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.examine_enclosure"
							:only_show="readonly" @updateFileName="updateFileNameExamine">
						</upload>
					</el-form-item>
					<el-form-item v-else-if="status==30" :label="GetLabelPrefix+'附件'" :label-width="formLabelWidth">
						<upload ref="approve_enclosure" :tip_show="upload.tip_show"
							:upload_type="upload.upload_type.approve_enclosure" :file_size="upload.file_size"
							:size_unit="upload.size_unit" :original_name="upload.original_name.approve_enclosure"
							:type_str="upload.type_str" :type_array="upload.type_array"
							:success_status.sync="upload.success.approve_enclosure" v-model="form.approve_enclosure"
							:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.approve_enclosure"
							:only_show="readonly" @updateFileName="updateFileNameApprove">
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
		name: 'GeoExaminationProcessForm',
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
				default: 10
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
			GetLabelPrefix() {
				//状态  10 复核  20 审核  30 审定 
				let status = this.status;
				let label = '';
				switch (status) {
					case 10:
						label = '复核';
						break;
					case 20:
						label = '审核';
						break;
					case 30:
						label = '审定';
						break;
				}
				return label;
			}
		},
		data() {
			let that = this

			function optionValidator(value, type) {
				if (!type) {
					type = 10;
				}
				let tips = '';
				if (!that.required.opinion) {
					return tips;
				}
				if (value) {
					return tips;
				}
				switch (type) {
					case 10:
						tips = '请填写复核意见';
						break;
					case 20:
						tips = '请填写审核意见';
						break;
					case 30:
						tips = '请填写审定意见';
						break;
				}
				return tips;
			}
			return {
				uploadDeault: {

				},
				formdefalut: {

				},
				required: {
					opinion: false
				},
				readonly: false,
				material: {
					unit: '',
				},
				upload: {
					tip_show: true,
					delte_service: false,
					upload_type: {
						review_enclosure: file_upload_type,
						examine_enclosure: file_upload_type,
						approve_enclosure: file_upload_type,
					},
					type_str: type_str,
					type_array: type_array,
					file_size: 15,
					size_unit: 'MB',
					original_name: {
						review_enclosure: {},
						examine_enclosure: {},
						approve_enclosure: {},
					},
					success: {
						review_enclosure: false,
						examine_enclosure: false,
						approve_enclosure: false,
					},
					old_delete: {
						review_enclosure: false,
						examine_enclosure: false,
						approve_enclosure: false
					}
				},
				form_old: {


				},
				form: {
					report_id: -1,
					org_id: '',
					status: 0,
					review_person_id: '',
					review_person: '',
					review_time: '',
					review_opinion: '',
					review_remarks: '',
					review_enclosure: '',
					review_enclosure_name: '',

					examine_person_id: '',
					examine_person: '',
					examine_time: '',
					examine_opinion: '',
					examine_remarks: '',
					examine_enclosure: '',
					examine_enclosure_name: '',

					approve_person_id: '',
					approve_person: '',
					approve_time: '',
					approve_opinion: '',
					approve_remarks: '',
					approve_enclosure: '',
					approve_enclosure_name: '',
					writingTime: getToday(),

				},
				selectData: {
					approveData: [{
						item_id: 1,
						item_name: '通过'
					}, {
						item_id: -1,
						item_name: '退回'
					}]
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
					review_person: [{
						required: true,
						message: '请刷新重试',
						trigger: 'blur',
					}],
					examine_person: [{
						required: true,
						message: '请刷新重试',
						trigger: 'blur',
					}],
					approve_person: [{
						required: true,
						message: '请刷新重试',
						trigger: 'blur',
					}],
					op_status: [{
						required: true,
						message: '请选择是否通过',
						trigger: ['blur', 'change'],
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							that.$nextTick(() => {
								console.log('op_status', value)
								if (value == -1) {
									that.required.opinion = true;
								} else {
									that.required.opinion = false;
									that.clearValidate('review_opinion');
									that.clearValidate('examine_opinion');
									that.clearValidate('approve_opinion');
								}
							})

						}
					}],
					review_opinion: [{
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							let tips = optionValidator(value, 10);
							if (tips) {
								callback(new Error(tips));
								return;
							}
							callback();
						}
					}],
					examine_opinion: [{
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							let tips = optionValidator(value, 20);
							if (tips) {
								callback(new Error(tips));
								return;
							}
							callback();
						}
					}],
					approve_opinion: [{
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							let tips = optionValidator(value, 30);
							if (tips) {
								callback(new Error(tips));
								return;
							}
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
				this.$refs['examination_process_form'].clearValidate(prop)
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
				if (!this.form.review_person) {
					this.form.review_person_id = this.person_id;
					this.form.review_person = this.username;
				}
				if (!this.form.examine_person) {
					this.form.examine_person_id = this.person_id;
					this.form.examine_person = this.username;
				}
				if (!this.form.approve_person) {
					this.form.approve_person_id = this.person_id;
					this.form.approve_person = this.username;
				}

			},
			updateFileName(field, fileName) {
				if (!field) {
					return '';
				}
				this.form[field] = fileName;
			},
			updateFileNameExamine(fileName) {
				this.updateFileName('examine_enclosure_name', fileName);
			},
			updateFileNameApprove(fileName) {
				this.updateFileName('approve_enclosure_name', fileName);
			},
			updateFileNameReview(fileName) {
				this.updateFileName('review_enclosure_name', fileName);
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
				if (this.form.review_enclosure) {
					this.upload.original_name.review_enclosure[this.form.review_enclosure] = this.form
						.review_enclosure_name;
				}
				if (this.form.examine_enclosure) {
					this.upload.original_name.examine_enclosure[this.form.examine_enclosure] = this.form
						.examine_enclosure_name;
				}
				if (this.form.approve_enclosure) {
					this.upload.original_name.approve_enclosure[this.form.approve_enclosure] = this.form
						.approve_enclosure_name;
				}
			},
			fileUploadRefs() {
				return ['review_enclosure', 'examine_enclosure', 'approve_enclosure']
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
							if (that.$refs[refs[i]] && that.$refs[refs[i]].submitUpload() === 1) {
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
				that.$refs['examination_process_form'].resetFields()
				const refs = this.fileUploadRefs()
				const length = refs.length
				for (let i = 0; i < length; i++) {
					try {
						if (this.$refs[refs[i]]) {
							that.$refs[refs[i]].clear()
						}

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
					this.$refs['examination_process_form'].resetFields()
					const refs = this.fileUploadRefs()
					const length = refs.length
					for (let i = 0; i < length; i++) {
						try {
							if (this.$refs[refs[i]]) {
								this.$refs[refs[i]].clear()
							}
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
					that.loadingText = '提交表单中...';
					let form = JSON.parse(JSON.stringify(that.form));
					form.max_role = await that.$store.dispatch('user/getRoleMax');
					form.type = that.status;
					let list = [];
					switch (that.status) {
						case 10:
							list = [{
									field: 'review_person_id',
									type: 3,
									level: 1
								},
								{
									field: 'review_opinion',
									type: 3,
									level: 2
								},
								{
									field: 'review_remarks',
									type: 3,
									level: 3
								},
								{
									field: 'review_enclosure',
									type: 3,
									level: 4
								},
								{
									field: 'review_enclosure_name',
									type: 3,
									level: 5
								},
								{
									field: 'type',
									type: 3,
									level: 6
								},
								{
									field: 'op_status',
									type: 3,
									level: 7
								}, {
									field: 'max_role',
									type: 3,
									level: 8
								},
								{
									field: 'report_id',
									type: 3,
									level: 9
								}
							];
							break;
						case 20:
							list = [{
									field: 'examine_person_id',
									type: 3,
									level: 1
								},
								{
									field: 'examine_opinion',
									type: 3,
									level: 2
								},
								{
									field: 'examine_remarks',
									type: 3,
									level: 3
								},
								{
									field: 'examine_enclosure',
									type: 3,
									level: 4
								},
								{
									field: 'examine_enclosure_name',
									type: 3,
									level: 5
								},
								{
									field: 'type',
									type: 3,
									level: 6
								},
								{
									field: 'op_status',
									type: 3,
									level: 7
								}, {
									field: 'max_role',
									type: 3,
									level: 8
								}, {
									field: 'report_id',
									type: 3,
									level: 9
								}
							];
							break;
						case 30:
							list = [{
									field: 'approve_person_id',
									type: 3,
									level: 1
								},
								{
									field: 'approve_opinion',
									type: 3,
									level: 2
								},
								{
									field: 'approve_remarks',
									type: 3,
									level: 3
								},
								{
									field: 'approve_enclosure',
									type: 3,
									level: 4
								},
								{
									field: 'approve_enclosure_name',
									type: 3,
									level: 5
								},
								{
									field: 'type',
									type: 3,
									level: 6
								},
								{
									field: 'op_status',
									type: 3,
									level: 7
								}, {
									field: 'max_role',
									type: 3,
									level: 8
								},
								{
									field: 'report_id',
									type: 3,
									level: 9
								}
							];
							break;
					}

					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.report_id && form.report_id > 0) {
						//更新
						sqlcode = 859
						//fob = that.QueryExec_fob_custom;
						fob = that.update_fob;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 859
						//fob = that.QueryExec_fob_custom;
						fob = that.update_fob;
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
						that.$baseMessage(msg + '失败,页面数据可能已经失效,请刷新重试', 'error');

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
				that.$refs['examination_process_form'].validate((valid) => {
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
