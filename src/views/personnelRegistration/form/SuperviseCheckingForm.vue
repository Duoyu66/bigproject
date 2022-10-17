<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row class="" style="margin-top: 5px">
			<el-col :span="span">
				<el-form-item label="被检查人" :label-width="formLabelWidth" prop="supervisee">
					<el-select v-model="form.supervisee" v-loadmore="getPersonListMore" filterable remote
						:remote-method="getPersonListRemoteMethod" style="width: 100%" @focus="getPersonList"
						:disabled="readonly">
						<el-option v-for="data in selectData.supervisee" :key="data.item_id" :label="data.item_name"
							:value="data.item_id"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="监督内容" :label-width="formLabelWidth" prop="supervision_content">
					<el-input v-model="form.supervision_content" style="width: 100%" type="textarea" maxlength="50"
						:placeholder="isReadOnly('请输入监督内容')" :readonly="readonly" show-word-limit
						:autosize="{ minRows: 4}"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="监督结果" :label-width="formLabelWidth" prop="supervision_results">
					<el-input v-model="form.supervision_results" style="width: 100%" maxlength="100" type="textarea"
						:placeholder="isReadOnly('请输入监督结果')" :readonly="readonly" show-word-limit
						:autosize="{ minRows: 4}"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="监督时间" :label-width="formLabelWidth" prop="supervision_date">
					<el-date-picker v-model="form.supervision_date" align="right" type="datetime"
						:placeholder="isReadOnly('选择日期')" :picker-options="pickerOptions" style="width: 100%"
						:format="dateFormat" :value-format="dateFormat" :readonly="readonly"></el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="是否合格" :label-width="formLabelWidth" prop="supervision_isPass">
					<el-select v-model="form.supervision_isPass" style="width: 100%" @change="supervision_isPassChange"
						:disabled="readonly">
						<el-option v-for="data in selectData.supervision_isPass" :key="data.item_name"
							:label="data.item_name" :value="data.item_name"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="纠正/纠正措施" :label-width="formLabelWidth" prop="corrective_action"
					:required="isRequire.corrective_action">
					<el-input v-model="form.corrective_action" style="width: 100%" maxlength="100" type="textarea"
						:placeholder="isReadOnly('请输入纠正措施')" :readonly="readonly" show-word-limit
						:autosize="{ minRows: 4}"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="监督附件" :label-width="formLabelWidth">
					<supervisionenclosureupload ref="supervision_enclosure" v-model="form.supervision_enclosure"
						:tip_show="upload.tip_show" :upload_type="upload.upload_type.supervision_enclosure"
						:original_name="upload.original_name.supervision_enclosure" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.supervision_enclosure"
						:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.supervision_enclosure"
						listtype="picture" :only_show="readonly"></supervisionenclosureupload>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="监督人" :label-width="formLabelWidth" prop="supervision_name">
					<el-input v-model="form.supervision_name" style="width: 100%" type="text" maxlength="50"
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
				pickerOptions: pickerOptions({
					disabledDate: true,
					type_disable: 2,
				}),
				dateFormat: dateFormat(1),
				formdefalut: {},
				selectQuery: {
					supervisee: {
						query: '',
						page: 0,
						set: new Set(),
					},
				},
				isRequire: {
					corrective_action: true
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
					supervisee: '',
					supervision_person: -1,
					supervision_name: '',
					supervision_content: '',
					supervision_results: '',
					supervision_date: getTodayDatetime(),
					supervision_isPass: '不合格',
					supervision_enclosure: '',
					corrective_action: '',
				},
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
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
						supervision_enclosure: {},
					},
					success: {
						supervision_enclosure: false,
					},
					old_delete: {
						supervision_enclosure: false,
					},
				},
				rules_temp: {
					supervision_content: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请输入监督内容',
					}, ],
					supervisee: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请选择被检查人',
					}, ],
					supervision_results: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请输入监督结果',
					}, {
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {


							callback()
						},
					}],
					supervision_date: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请输入监督时间',
					}, ],
					corrective_action: [{
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							if (that.form.supervision_isPass == '不合格' && !value) {
								callback(new Error('请输入纠正措施'))
							} else {
								callback()
							}
						},
					}, ],
					supervision_isPass: [{
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
					this.getPersonListMore()
				}
				this.selectQuery = {
					supervisee: {
						query: '',
						page: 0,
						set: new Set(),
					},
				}
				this.selectData.supervisee = []
				if (!this.form.supervision_person || this.form.supervision_person < 0) {
					this.form.supervision_person = this.person_id
					this.form.supervision_name = this.person_name
				}
			},
		},

		created() {
			this.init()
		},
		methods: {
			supervision_isPassChange() {
				if (this.form.supervision_isPass == '不合格' && !this.readonly) {
					this.$nextTick(() => {
						this.isRequire.corrective_action = true
					})
				} else {
					this.$nextTick(() => {
						this.isRequire.corrective_action = false

					})
				}
			},
			async init() {
				switch (this.type) {
					case 0:
						this.readonly = false
						this.rules = this.rules_temp
						break
					case 1:
						this.readonly = true
						this.rules = {}
						break
				}
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					if (this.formData.validate_from) {
						this.form.auth_date_range[0] = this.formData.validate_from
					}
					if (this.formData.validate_to) {
						this.form.auth_date_range[1] = this.formData.validate_to
					}
					this.file_default()
					this.selectQuery.supervisee.set = new Set()
					this.getPersonListMore()
				}
				if (!this.form.supervision_person || this.form.supervision_person < 0) {
					this.form.supervision_person = this.person_id
					this.form.supervision_name = this.person_name
				}
				this.supervision_isPassChange()
			},
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},
			getPersonListMore() {
				this.getPersonList(undefined,
					this.selectQuery.supervisee.query,
					this.selectQuery.supervisee.page
				)
			},
			getPersonListRemoteMethod(query) {
				this.getPersonList(undefined, query, this.selectQuery.supervisee.page)
			},
			//被监督人数组 ，搜索和懒加载
			async getPersonList(event, query, page) {
				let form = {}
				//机构
				form.org_pid = this.current_and_chrilren_org
				//人员
				form.person_id = this.form.supervisee
				if (typeof query == 'undefined') {
					query = ''
				} else {}
				if (!page) {
					this.selectQuery.supervisee.page = 0
					page = 0
				}
				//姓名
				form.name = query
				form.page = page
				//监督人员
				form.supervision_person = this.person_id
				let list = [{
						field: 'org_pid',
						type: 3,
						level: 1,
					},
					{
						field: 'name',
						type: 2,
						level: 2,
					},
					{
						field: 'person_id',
						type: 3,
						level: 3,
					},
					{
						field: 'person_id',
						type: 3,
						level: 4,
					},
					{
						field: 'supervision_person',
						type: 3,
						level: 5,
					},
					{
						field: 'page',
						type: 3,
						level: 6,
					},
				]
				const {
					code,
					data
				} = await this.QueryExec_fob(297, list, form)
				console.log(data)
				//if (typeof query != 'undefined') {
				//	this.selectData.supervisee = data
				//} else {
				if (page == 0) {
					this.selectData.supervisee = []
					this.selectQuery.supervisee.set = new Set()
					for (let i = 0; i < data.length; i++) {
						if (!this.selectQuery.supervisee.set.has(data[i].item_id)) {
							this.selectData.supervisee.push(data[i])
							this.selectQuery.supervisee.set.add(data[i].item_id)
						}
					}
				} else {
					for (let i = 0; i < data.length; i++) {
						if (!this.selectQuery.supervisee.set.has(data[i].item_id)) {
							this.selectData.supervisee.push(data[i])
							this.selectQuery.supervisee.set.add(data[i].item_id)
						}
					}
				}
				//this.$set(this.selectData,'supervisee',this.selectData.supervisee)
				this.selectQuery.supervisee.page++
				//}
				console.log(this.selectData.supervisee)
			},
			file_default() {
				const form = JSON.parse(JSON.stringify(this.form))
				let that = this
				that.upload.original_name.supervision_enclosure[
					form.supervision_enclosure
				] = '附件'
			},
			fileUploadRefs() {
				return ['supervision_enclosure']
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
								check_list.push(refs[i])
							}
						} catch (e) {
							console.log(e)
						}
					}
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
							field: 'supervision_person',
							level: 1,
						},
						{
							field: 'supervision_content',
							level: 2,
						},
						{
							field: 'supervision_results',
							level: 3,
						},
						{
							field: 'supervision_date',
							level: 4,
						},
						{
							field: 'supervision_isPass',
							level: 5,
						},
						{
							field: 'corrective_action',
							level: 6,
						}, {
							field: 'supervision_enclosure',
							level: 7,
						}, {
							field: 'supervisee',
							level: 8,
						}, {
							field: 'reward_id',
							level: 9,
						},
					]
					let fob = ''
					let sqlcode = -1
					let msg = ''
					if (form.reward_id && form.reward_id > 0) {
						//更新
						sqlcode = 300
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 300
						fob = that.QueryExec_fob_custom;
					}
					const {
						code,
						influence,
						data
					} = await fob(list, that.form, sqlcode)
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
