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
				<el-form-item label="印章名称" :label-width="formLabelWidth" prop="seal_name">
					<el-input v-model="form.seal_name" :placeholder="isReadOnly('请输入印章名称')" style="width:100%"
						:readonly="readonly" maxlength="20">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="公章编号" :label-width="formLabelWidth" prop="seal_no">
					<el-input v-model="form.seal_no" :placeholder="isReadOnly('请输入公章编号')" style="width:100%"
						:readonly="readonly" maxlength="30">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="管理编号" :label-width="formLabelWidth" prop="manage_no">
					<el-input v-model="form.manage_no" :placeholder="isReadOnly('请输入管理编号')" style="width:100%"
						:readonly="readonly" maxlength="50">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="用途" :label-width="formLabelWidth" prop="usage">
					<el-input v-model="form.usage" :placeholder="isReadOnly('请输入用途')" style="width:100%"
						:readonly="readonly" maxlength="50">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="存放位置" :label-width="formLabelWidth" prop="location">
					<el-input v-model="form.location" :placeholder="isReadOnly('请输入存放位置')" style="width:100%"
						:readonly="readonly" maxlength="50">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.span6">
				<el-form-item label="保管人" :label-width="formLabelWidth" prop="manager_id">
					<el-select v-model="form.manager_id" style="width: 100%" filterable default-first-option
						:disabled="readonly">
						<el-option v-for="data in selectData.person" :key="data.item_id" :label="data.item_name"
							:value="data.item_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>

			<el-col :span="span.span6">
				<el-form-item label="类型" :label-width="formLabelWidth" prop="type">
					<el-select v-model="form.type" style="width: 100%" allow-create filterable default-first-option
						:disabled="readonly">
						<el-option v-for="data in selectData.type" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span.span6">
				<el-form-item label="是否启用" :label-width="formLabelWidth" prop="enabled">
					<el-switch v-model="form.enabled" active-text="启用" inactive-text="禁用" :disabled="readonly">
					</el-switch>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
					<el-input v-model="form.remarks" :placeholder="isReadOnly('请输入备注')" style="width:100%"
						:readonly="readonly" maxlength="300" type="textarea" :autosize="{ minRows: 6}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>

			<el-col :span="span.full" >
				<el-form-item label="电子印章" :label-width="formLabelWidth">
					<procabstract ref="seal_image" :downLoad_Fn="downLoadFn" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.seal_image" :original_name="upload.original_name.seal_image"
						:type_str="upload.type_str" :type_array="upload.type_array"
						:success_status.sync="upload.success.seal_image" v-model="form.seal_image"
						:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.seal_image"
						:only_show="readonly">
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
		getdayEx
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
		name: 'sealLedgerForm',
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
			},
			'form.Signer'(val) {
				this.$nextTick(() => {
					this.$refs.form.validateField('Signer');
				})
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
					seal_id: -1,
					org_id: '',
					seal_name: '',
					usage: '',
					location: '',
					type: '',
					seal_no: '',
					manage_no: '',
					manager_id: '',
					remarks: '',
					enabled: true,
				},
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						seal_image: 12,
					},
					type_str: 'jpg/pdf/png/jpeg',
					type_array: ['image/jpeg', 'image/png', 'application/pdf'],
					file_size: '15',
					size_unit: 'MB',
					original_name: {
						seal_image: {},
					},
					success: {
						seal_image: false,
					},
					old_delete: {
						seal_image: false,
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
					seal_name: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入印章名称'
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							let form = {}
							let list = [{
								field: 'seal_name',
								type: 3,
								level: 1,
							}, {
								field: 'org_id',
								type: 3,
								level: 2,
							}]
							form.seal_name = value
							form.org_id = that.form.org_id
							const {
								code,
								data
							} = await that.QueryExec_fob(356, list, form)
							if (code == 200) {
								let length = data.length
								if ((!that.form.seal_id || that.form.seal_id < 0) && length > 0) {
									callback(new Error('已存在该印章名称'))
									return
								}
								let flag = false
								while (--length > -1) {
									if (data[length].seal_id != that.form.seal_id) {
										flag = true
										break
									}
								}
								if (flag) {
									callback(new Error('已存在该印章名称'))
								} else {
									callback()
								}
							} else {
								callback(new Error('查询数据库异常'))
							}
						}
					}],
					usage: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入用途'
					}],
					location: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入保存位置'
					}],
					type: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择类型'
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							if (value.length > 10) {
								callback(new Error('长度需小于10字符'));
								return
							}
							callback();
						}
					}],
					manager_id: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择保管人'
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
			downLoadFn(fileName, src, action) {
				console.log(fileName, src, action);
				if (action == 'show') {
					action = '查看'
				} else {
					action = '下载';
				}
				if (this.type == 3) {
					action = this.process.examine.label + '-' + action
				}
				action = action + '-' + fileName + '-' + this.form.doc_id
				let form = {
					send_id: this.form.send_id,
					action: action,
					person_id: this.person_id,
					person_name: this.person_id
				}

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
				let processData = await GetProcessData()
				let processTemp = JSON.parse(JSON.stringify(this.process))
				for (let key in processData) {
					if (processTemp.hasOwnProperty(key)) {
						processTemp[key] = Object.assign(processData[key], processTemp[key])
					} else {
						processTemp[key] = processData[key]
					}
				}
				this.process = processTemp

				if (this.formData) {
					console.log('this.formData', this.formData)
					if (this.formData.enabled == '1') {
						this.formData.enabled = true;
					} else {
						this.formData.enabled = false
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
					group_id: 1017
				}];
				await GetGroupDataEx(this, list)
				let customList = [{
					data: 'person',
					sqlcode: 328,
					list: [{
						field: "org_id",
						type: 3,
						level: 1
					}],
					form: {
						org_id: org_id
					}
				}]
				await GetGroupDataCustomEx(this, customList);
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
				if (form.seal_image) {
					that.upload.original_name.seal_image[form.seal_image] = form.seal_name + '电子印章'
				}

			},
			fileUploadRefs() {
				return ['seal_image']
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
							field: "org_id",
							level: 1
						},
						{
							field: "seal_name",
							level: 2
						},
						{
							field: "usage",
							level: 3
						},
						{
							field: "location",
							level: 4
						},
						{
							field: "type",
							level: 5
						},
						{
							field: "manager_id",
							level: 6
						},
						{
							field: "enabled",
							level: 7
						},
						{
							field: "seal_no",
							level: 8
						},
						{
							field: "manage_no",
							level: 9
						},
						{
							field: "seal_image",
							level: 10
						},
						{
							field: "remarks",
							level: 11
						},
						{
							field: "operator",
							level: 12
						}, {
							field: "seal_id",
							level: 12
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.seal_id && form.seal_id > 0) {
						//更新
						sqlcode = 357
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 357
						fob = that.QueryExec_fob_custom;
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
				console.log(that.form)
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
