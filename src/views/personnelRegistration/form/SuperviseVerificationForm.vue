<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row class="" style="margin-top: 5px">
			<el-col :span="span" v-show="baseInfoIsShow">
				<el-form-item label="监督内容" :label-width="formLabelWidth" prop="supervision_content">
					<el-input v-model="form.supervision_content" style="width: 100%" type="textarea" maxlength="50"
						readonly="readonly" show-word-limit :autosize="{ minRows: 4}"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="baseInfoIsShow">
				<el-form-item label="监督结果" :label-width="formLabelWidth" prop="supervision_results">
					<el-input v-model="form.supervision_results" style="width: 100%" maxlength="100" type="textarea"
						readonly="readonly" show-word-limit :autosize="{ minRows: 4}"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="baseInfoIsShow">
				<el-form-item label="监督时间" :label-width="formLabelWidth" prop="supervision_date">
					<el-date-picker v-model="form.supervision_date" align="right" type="datetime"
						:picker-options="pickerOptions" style="width: 100%" :format="dateFormat"
						:value-format="dateFormat" readonly="readonly"></el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="baseInfoIsShow">
				<el-form-item label="监督是否合格" :label-width="formLabelWidth" prop="supervision_isPass">
					<el-select v-model="form.supervision_isPass" style="width: 100%" :disabled="readonly">
						<el-option v-for="data in selectData.supervision_isPass" :key="data.item_name"
							:label="data.item_name" :value="data.item_name"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="baseInfoIsShow">
				<el-form-item label="纠正/纠正措施" :label-width="formLabelWidth" prop="corrective_action">
					<el-input v-model="form.corrective_action" style="width: 100%" maxlength="100" type="textarea"
						:readonly="readonly" show-word-limit :autosize="{ minRows: 4}"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="baseInfoIsShow">
				<el-form-item label="监督附件" :label-width="formLabelWidth">
					<supervisionenclosureupload ref="supervision_enclosure" v-model="form.supervision_enclosure"
						:tip_show="upload.tip_show" :upload_type="upload.upload_type.supervision_enclosure"
						:original_name="upload.original_name.supervision_enclosure" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.supervision_enclosure"
						:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.supervision_enclosure"
						listtype="picture" :only_show="true"></supervisionenclosureupload>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="baseInfoIsShow">
				<el-form-item label="改正说明" :label-width="formLabelWidth" prop="supervisee_content">
					<el-input v-model="form.supervisee_content" style="width: 100%" maxlength="100" type="textarea"
						readonly="readonly" show-word-limit :autosize="{ minRows: 4}"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="baseInfoIsShow">
				<el-form-item label="改正时间" :label-width="formLabelWidth" prop="supervisee_date">
					<el-date-picker v-model="form.supervisee_date" align="right" type="datetime"
						:picker-options="pickerOptions" style="width: 100%" :format='dateFormat'
						:value-format="dateFormat" readonly="readonly">
					</el-date-picker>
				</el-form-item>

			</el-col>
			<el-col :span="span" v-show="baseInfoIsShow">
				<el-form-item label="改正附件" :label-width="formLabelWidth">
					<superviseeUpload ref="supervisee_enclosure" v-model="form.supervisee_enclosure"
						:tip_show="upload.tip_show" :upload_type="upload.upload_type.supervisee_enclosure"
						:original_name="upload.original_name.supervisee_enclosure" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.supervisee_enclosure"
						:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.supervisee_enclosure"
						listtype="picture" :only_show="true"></superviseeUpload>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="验证时间" :label-width="formLabelWidth" prop="verification_date">
					<el-date-picker v-model="form.verification_date" align="right" type="datetime"
						:placeholder="isReadOnly('选择日期')" :picker-options="pickerOptions" style="width: 100%"
						:format="dateFormat" :value-format="dateFormat" :readonly="readonly"></el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="验证情况" :label-width="formLabelWidth" prop="verification">
					<el-input v-model="form.verification" style="width: 100%" maxlength="100" type="textarea"
						:placeholder="isReadOnly('请输入验证情况')" :readonly="readonly" show-word-limit
						:autosize="{ minRows: 4}"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="验证是否合格" :label-width="formLabelWidth" prop="verification_isPass">
					<el-select v-model="form.verification_isPass" style="width: 100%" :disabled="readonly">
						<el-option v-for="data in selectData.supervision_isPass" :key="data.item_name"
							:label="data.item_name" :value="data.item_name"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="验证附件" :label-width="formLabelWidth">
					<verificationUpload ref="verification_enclosure" v-model="form.verification_enclosure"
						:tip_show="upload.tip_show" :upload_type="upload.upload_type.verification_enclosure"
						:original_name="upload.original_name.verification_enclosure" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.verification_enclosure"
						:delte_service="upload.delte_service"
						:old_delete.sync="upload.old_delete.verification_enclosure" listtype="picture"
						:only_show="readonly"></verificationUpload>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="验证" :label-width="formLabelWidth" prop="verifier_name">
					<el-input v-model="form.verifier_name" style="width: 100%" type="text" maxlength="50"
						readonly="readonly"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import supervisionenclosureupload from '@/components/Upload/upload'
	import verificationUpload from '@/components/Upload/upload'
	import superviseeUpload from '@/components/Upload/upload'
	import {
		getTodayDatetime,
		format_fob,
		pickerOptions,
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
		name: 'SuperviseCheckingForm',
		components: {
			superviseeUpload,
			verificationUpload,
			supervisionenclosureupload,
		},
		model: {
			prop: 'formData',
			event: 'on-change',
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
				person_name: 'user/username',
				current_and_chrilren_org: 'org/current_and_chrilren_org',

			}),
		},
		props: {
			//.sync同步
			formData: {
				type: Object,
				default: function() {
					return {}
				},
			},
			type: {
				type: Number,
				default: 0, //0 正常表单 1 详情表单
			},
		},
		data() {
			let that = this
			return {
				span: 24,
				readonly: false,
				baseInfoIsShow: true,
				pickerOptions: pickerOptions({
					disabledDate: true,
					type_disable: 2,
				}),
				dateFormat: dateFormat(1),
				formdefalut: {},
				selectQuery: {

				},
				selectData: {
					supervision_isPass: [{
							item_name: '合格',
						},
						{
							item_name: '不合格',
						},
					],
					supervisee: [],
				},
				form: {
					reward_id: -1,
					verifier: -1,
					verifier_name: '',
					verification_date: getTodayDatetime(),
					verification: '',
					verification_isPass: '',
					verification_enclosure: '',
				},
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						verification_enclosure: 12,
						supervisee_enclosure: 12,
						supervision_enclosure: 12,
					},
					type_str: 'jpg/pdf/png/jpeg/zip/rar/7z/xlsx/xls/docx/doc/mp4',
					type_array: [
						'image/jpeg',
						'image/png',
						'application/pdf',
						'application/x-zip-compressed',
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
						'audio/x-m4a',
						'video/mp4',
					],
					file_size: '15',
					size_unit: 'MB',
					original_name: {
						supervisee_enclosure: {},
						supervision_enclosure: {},
						verification_enclosure: {},
					},
					success: {
						verification_enclosure: false,
					},
					old_delete: {
						verification_enclosure: false,
					},
				},
				rules_temp: {
					verification: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请输入验证情况',
					}, ],
					verification_date: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请输入验证时间',
					}, ],
					verification_isPass: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请选择是否通过',
					}, ],
				},
				rules: {},
				formLabelWidth: '120px',
			}
		},
		watch: {
			formData(newVal, oldVal) {
				if (newVal) {
					this.init()
					this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
					this.form = JSON.parse(JSON.stringify(this.formdefalut))
					this.form = Object.assign(this.form, newVal)
					this.file_default()
				}
				if (!this.form.verifier || this.form.verifier < 0) {
					this.form.verifier = this.person_id
					this.form.verifier_name = this.person_name
				}
			},
		},

		created() {
			this.init()
		},
		methods: {
			async init() {
				switch (this.type) {
					case 0:
						this.readonly = false
						this.rules = this.rules_temp
						this.baseInfoIsShow = true
						break
					case 1:
						this.readonly = true
						this.baseInfoIsShow = false
						this.rules = {}
						break
				}
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.file_default()
				}
				if (!this.form.verifier || this.form.verifier < 0) {
					this.form.verifier = this.person_id
					this.form.verifier_name = this.person_name
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
				that.upload.original_name.verification_enclosure[
					form.verification_enclosure
				] = '附件'
			},
			fileUploadRefs() {
				return ['verification_enclosure']
			},
			async fileUpload(callback) {
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
								check_list.push(refs[i])
							}
						} catch (e) {
							console.log(e)
						}
					}
					console.log(check_list)
					let index = setInterval(function() {
						let flag = true
						let length = check_list.length
						while (--length > -1) {
							if (
								!that.upload.success[check_list[length]] &&
								!that.$refs[check_list[length]].error
							) {
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
			async QueryExec_fob_custom(list, form, sqlcode) {
				return await this.QueryExec_fob(sqlcode, list, form)
			},
			async save(callback) {
				let that = this
				async function submit() {
					let form = JSON.parse(JSON.stringify(that.form))
					let list = [{
							field: 'verification',
							level: 1,
						},
						{
							field: 'verification_date',
							level: 2,
						},
						{
							field: 'verification_enclosure',
							level: 3,
						},
						{
							field: 'verification_isPass',
							level: 4,
						},
						{
							field: 'verifier',
							level: 5,
						},
						{
							field: 'reward_id',
							level: 6,
						}
					]
					let fob = ''
					let sqlcode = -1
					let msg = ''
					if (form.reward_id && form.reward_id > 0) {
						//更新
						sqlcode = 304
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 304
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

<style></style>
