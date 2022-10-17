<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span.full">
				<!-- 系统管理员跟随所选单位 其他用登录人所在单位 -->
				<el-form-item label="所属单位" :label-width="formLabelWidth" prop="org_id">
					<tree-select :options="selectData.org_id" :max-height="maxHeight" :multiple="false"
						@input='chang_org_id' @close='chang_org_id' :placeholder="isReadOnly('请选择所属单位...')"
						:disabled="readonlyOrgId" v-model="form.org_id" />
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="证书名称" :label-width="formLabelWidth" prop="name">
					<el-input v-model="form.name" :placeholder="isReadOnly('请输入证书名称')" style="width:100%"
						:readonly="readonly" maxlength="50">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="证书类型" :label-width="formLabelWidth" prop="type">
					<el-select v-model="form.type" style="width: 100%" filterable default-first-option
						:disabled="readonly">
						<el-option v-for="data in selectData.type" :key="data.item_id" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="证书编号" :label-width="formLabelWidth" prop="cert_no">
					<el-input v-model="form.cert_no" :placeholder="isReadOnly('请输入证书编号')" style="width:100%"
						:readonly="readonly" maxlength="50">
					</el-input>
				</el-form-item>
			</el-col>

			<el-col :span="span.full">
				<el-form-item label="发证机构" :label-width="formLabelWidth" prop="cert_org">
					<el-input v-model="form.cert_org" :placeholder="isReadOnly('请输入发证机构')" style="width:100%"
						:readonly="readonly" maxlength="75">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.span12">
				<el-form-item label="发证时间" :label-width="formLabelWidth" prop="issuing_time">
					<el-date-picker v-model="form.issuing_time" align="left" type="datetime"
						:placeholder="isReadOnly('发证时间')" :picker-options="pickerOptions" style="width: 100%"
						:format='dateFormat' :value-format="dateFormat" :disabled="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span.span12">
				<el-form-item label="有效期至" :label-width="formLabelWidth" prop="deadline">
					<el-date-picker v-model="form.deadline" align="left" type="datetime"
						:placeholder="isReadOnly('有效期至')" :picker-options="pickerOptionsAfter" style="width: 100%"
						:format='dateFormat' :value-format="dateFormat" :disabled="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span.span6">
				<el-form-item label="是否提示" :label-width="formLabelWidth" prop="isPrompt">
					<el-switch v-model="form.isPrompt" active-text="是" inactive-text="否" :disabled="readonly">
					</el-switch>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="提示文字" :label-width="formLabelWidth" prop="prompt_txt">
					<el-input v-model="form.prompt_txt" :placeholder="isReadOnly('请输入提示文字')" style="width:100%"
						:readonly="readonly" maxlength="300" type="textarea" :autosize="{ minRows: 6}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
					<el-input v-model="form.remarks" :placeholder="isReadOnly('请输入备注')" style="width:100%"
						:readonly="readonly" maxlength="300" type="textarea" :autosize="{ minRows: 6}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="附件" :label-width="formLabelWidth">
					<procabstract ref="enclosure" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.enclosure" :original_name="upload.original_name.enclosure"
						:type_str="upload.type_str" :type_array="upload.type_array"
						:success_status.sync="upload.success.enclosure" v-model="form.enclosure"
						:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.enclosure"
						:only_show="readonly" :img_max_height="upload.img_size.max.img_max_height"
						:img_max_width="upload.img_size.max.img_max_width">
					</procabstract>
				</el-form-item>
			</el-col>


		</el-row>
	</el-form>
</template>

<script>
	//头像
	import procabstract from '@/components/Upload/upload'

	import TreeSelect from '@riophae/vue-treeselect'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'

	import {
		docRegisterProcess,
		upLoadDocReceiptHistory,
		upLoadDocDispatchHistory,
		GetProcessData
	} from '../js/common'

	import {
		mapGetters
	} from 'vuex'
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
		getdayEx,
		getTodayDatetime
	} from '@/utils/dateHelp'
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'
	import {
		isNumEx,
		isTel,
		isPhone
	} from '@/utils/validate'
	export default {
		name: 'qualificationCertForm',
		components: {
			TreeSelect,
			procabstract
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
				default: 0 //0 正常表单 1 详情表单 3 审核
			},
			//显示的类型
			table_type: {
				type: String,
				default: '0',
			},
			outOrgStatus: {
				type: Boolean,
				default: false,
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
		mounted() {
			const that = this
			window.onresize = () => {
				return (() => {
					window.screenWidth = document.body.clientWidth
					that.screenWidth = window.screenWidth
				})()
			}
		},
		watch: {
			formData(newVal, oldVal) {
				if (newVal) {
					// if (newVal.doc_name && typeof newVal.doc_name == 'string') {
					// 	newVal.doc_name = [newVal.doc_name]
					// }
					//console.log('formData', newVal)
					//this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
					//this.form = Object.assign(this.form, newVal)
					//this.file_default()
					this.init()
				}
			},
			screenWidth(newVal, oldVal) {
				// 为了避免频繁触发resize函数导致页面卡顿，使用定时器
				if (!this.timer) {
					// 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
					let that = this
					that.timer = true
					setTimeout(function() {
						// 打印screenWidth变化的值
						that.setSpan()
						that.timer = false
					}, 500)
				}
			}
		},
		data() {
			let that = this
			return {
				spanDefalut: {
					full: 24,
					half: 12,
					quarter: 6,
					oneThird: 8,
					span23: 23,
					span22: 22,
					span21: 21,
					span20: 20,
					span19: 19,
					span18: 18,
					span17: 17,
					span16: 16,
					span15: 15,
					span14: 14,
					span13: 13,
					span12: 12,
					span11: 11,
					span10: 10,
					span9: 9,
					span8: 8,
					span7: 7,
					span6: 6,
					span5: 5,
					span4: 4,
					span3: 3,
					span2: 2,
					span1: 1
				},
				span: {
					full: 24,
					half: 12,
					quarter: 6,
					oneThird: 8,
					span23: 23,
					span22: 22,
					span21: 21,
					span20: 20,
					span19: 19,
					span18: 18,
					span17: 17,
					span16: 16,
					span15: 15,
					span14: 14,
					span13: 13,
					span12: 12,
					span11: 11,
					span10: 10,
					span9: 9,
					span8: 8,
					span7: 7,
					span6: 6,
					span5: 5,
					span4: 4,
					span3: 3,
					span2: 2,
					span1: 1
				},
				process: {

				},
				readonly: false,
				readonlyOrgId: true,
				pickerOptions: pickerOptions(),
				pickerOptionsAfter: pickerOptions({
					disabledDate: true,
					type_disable: 3,
					shortcuts_type: 'after'
				}),
				dateFormat: dateFormat(1),
				screenWidth: document.body.clientWidth,
				formdefalut: {},
				extraIsShow: false,
				maxHeight: 200,
				selectData: {
					org_id: [],
					type: [],
					person: [],
				},
				form: {
					id: -1,
					org_id: '',
					name: '',
					type: '',
					cert_org: '',
					issuing_time: getTodayDatetime(),
					deadline: '',
					isPrompt: false,
					prompt_txt: '',
					remarks: '',
					enclosure: '',
					add_person: '',
					add_time: '',
					cert_no: '',
				},
				upload: {
					tip_show: true,
					delte_service: false,
					upload_type: {
						enclosure: 12,
					},
					img_size: {
						max: {
							img_max_width: 3840,
							img_max_height: 2160
						}
					},
					type_str: 'jpg/png/jpeg/pdf',
					type_array: ['image/jpeg', 'image/png', 'application/pdf'], //'application/pdf'
					file_size: '256',
					size_unit: 'MB',
					original_name: {
						enclosure: {},
					},
					success: {
						enclosure: false,
					},
					old_delete: {
						enclosure: false,
					}
				},
				rulesSign: {


				},
				rules_temp: {
					org_id: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择所属机构'
					}],
					name: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入证书名称'
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							let form = {}
							let list = [{
								field: 'name',
								type: 3,
								level: 1,
							}, {
								field: 'org_id',
								type: 3,
								level: 2,
							}]
							form.name = value
							form.org_id = that.form.org_id
							const {
								code,
								data
							} = await that.QueryExec_fob(671, list, form)
							if (code == 200) {
								let length = data.length
								if ((!that.form.id || that.form.id < 0) && length > 0) {
									callback(new Error('已存在该证书名称'))
									return
								}
								let flag = false
								while (--length > -1) {
									if (data[length].id != that.form.id) {
										flag = true
										break
									}
								}
								if (flag) {
									callback(new Error('已存在该证书名称'))
								} else {
									callback()
								}
							} else {
								callback(new Error('查询数据库异常'))
							}
						}
					}],
					type: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择类型'
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							if (value.length > 50) {
								callback(new Error('长度需小于50字符'));
								return
							}
							callback();
						}
					}],
					isPrompt: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择是否提示'
					}],
					issuing_time: [{
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							if (!value) {
								callback();
								return
							}
							let issuing_time = new Date(value)
							if (that.form.deadline) {
								let deadline = new Date(that.form.deadline)
								if (issuing_time > deadline) {
									callback(new Error('发证时间应早于有效结束时间'))
									return
								}
							}
							callback();

						}
					}],
					deadline: [{
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							if (!value) {
								callback();
								return
							}
							let deadline = new Date(value)
							if (that.form.issuing_time) {
								let issuing_time = new Date(that.form.issuing_time)
								if (issuing_time > deadline) {
									callback(new Error('有效结束时间应晚于发证时间'))
									return
								}
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
			changeswitch(value, value2, value3) {
				console.log(value, value2, value3);
			},
			setSpan() {
				let that = this
				let index = setInterval(function() {
					if (that.$refs['form'] && that.$refs['form'].$el) {
						clearInterval(index)
						let clientWidth = that.$refs['form'].$el.clientWidth
						let temp = JSON.parse(JSON.stringify(that.spanDefalut))
						if (clientWidth > 900) {
							temp = temp
						} else if (clientWidth > 600) {
							for (let key in temp) {
								if (temp[key] * 2 >= 20) {
									temp[key] = 24
								} else {
									temp[key] = temp[key] * 2
								}

							}
						} else {
							for (let key in temp) {
								if (temp[key] * 4 >= 24) {
									temp[key] = 24
								} else {
									temp[key] = temp[key] * 4
								}

							}
						}
						that.span = temp
					}
				}, 500)

			},
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				console.log('init outOrgStatus ')
				switch (this.type) {
					case 0:
						this.readonly = false
						this.rules = this.rules_temp
						break;
					case 2:
						this.readonly = false
						this.rules = this.rules_temp
						break;
						//详情
					case 1:
						this.readonly = true
						this.rules = {}
						//审核
					case 3:
						this.readonly = true
						this.rules = {}
						break
				}
				this.form.table_type = this.table_type
				await this.GetGroup()
				this.setSpan()
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				this.formdefalut = JSON.parse(JSON.stringify(this.form))

				if (this.formData) {
					if (this.formData.isPrompt == '1') {
						this.formData.isPrompt = true;
					} else {
						this.formData.isPrompt = false
					}
					this.form = Object.assign(this.form, this.formData)
					this.$refs['form'].clearValidate()
					console.log('init form Object.assign', this.form)
					this.file_default()
				}


				if (this.role_max == 'super_admin') {
					if (!this.form.org_id || this.form.org_id < 1) {
						this.form.org_id = this.current_org_id
					}
					console.log(this.readonly)
					if (!this.readonly) {
						this.readonlyOrgId = false
					} else {
						this.readonlyOrgId = true
					}
				} else {
					if (!this.form.org_id || this.form.org_id < 1) {
						this.form.org_id = this.org_id
					}
					this.readonlyOrgId = true
					//this.form.parent_id = this.org_id
				}

			},
			chang_org_id() {
				this.elemenetValiDateFiled('org_id');
			},
			elemenetValiDateFiled(field) {
				this.$nextTick(() => {
					this.$refs['form'].validateField(field)
				})
			},
			GetOrgBase() {
				let that = this
				let org_id = '';
				if (that.form.org_id && that.form.org_id > 0) {
					org_id = that.form.org_id
				} else {
					org_id = that.org_id
				}
				return org_id;
			},
			async GetGroup() {
				let that = this
				this.selectData.org_id = await this.$store.dispatch('org/GetOrgAllCache')
				let org_id = that.GetOrgBase()
				let list = [{
					data: "type",
					group_id: 1031
				}];
				await GetGroupDataEx(this, list)
				// let customList = [{
				// 	data: 'person',
				// 	sqlcode: 328,
				// 	list: [{
				// 		field: "org_id",
				// 		type: 3,
				// 		level: 1
				// 	}],
				// 	form: {
				// 		org_id: org_id
				// 	}
				// }]
				// await GetGroupDataCustomEx(this, customList);
				console.log(this.selectData)
			},
			changemakeCopyForUnit_org_id() {
				this.vueSelect('makeCopyForUnit_org_id')
			},
			changoutgoing_org_id() {
				this.vueSelect('outgoing_org_id')
			},
			vueSelect(field) {
				this.$nextTick(() => {
					this.$refs['form'].validateField(field)
				})
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
				if (form.enclosure) {
					that.upload.original_name.enclosure[form.enclosure] = form.name
				}

			},
			fileUploadRefs() {
				return ['enclosure']
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
							if (!that.upload.success[check_list[length]] && !that
								.$refs[check_list[length]].error) {
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
				let that = this
				async function submit() {
					that.loading = true
					that.loadingText = '提交表单中...'
					let form = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: 'name',
							level: 1
						},
						{
							field: 'type',
							level: 2
						},
						{
							field: 'cert_org',
							level: 3
						},
						{
							field: 'issuing_time',
							level: 4
						},
						{
							field: 'deadline',
							level: 5
						},
						{
							field: 'isPrompt',
							level: 6
						},
						{
							field: 'prompt_txt',
							level: 7
						},
						{
							field: 'remarks',
							level: 8
						},
						{
							field: 'enclosure',
							level: 9
						},
						{
							field: 'add_person_id',
							level: 10
						},
						{
							field: 'org_id',
							level: 11
						},
						{
							field: 'cert_no',
							level: 12
						},
						{
							field: 'check_type',
							level: 13
						},
						{
							field: 'check_day',
							level: 14
						},
						{
							field: 'check_person',
							level: 15
						},
						{
							field: 'id',
							level: 16
						},
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.id && form.id > 0) {
						//更新
						sqlcode = 672
						//fob = that.QueryExec_fob_custom;
						fob = that.update_fob;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 672
						fob = that.insert_fob;
						that.form.add_person_id = that.person_id
					}
					that.form.operator = that.person_id
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
					if (influence > 0) {
						that.$baseMessage(msg + '成功', 'success')
						that.close()
						return true
					}
					that.$baseMessage(msg + '失败', 'error')
					return false
				}
				that.$refs['form'].validate((valid) => {
					if (valid) {
						console.log(that.form)
						that.$baseConfirm('确定提交？', null, async () => {
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
						return false
					}
				})
			},
		},
	}
</script>

<style>
	.vue-treeselect--append-to-body {
		z-index: 999999 !important;
	}
</style>
