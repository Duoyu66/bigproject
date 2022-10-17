<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span.full">
				<el-form-item label="实际使用时间" :label-width="formLabelWidth" prop="use_date">
					<el-date-picker v-model="form.use_date" align="right" type="datetime"
						:placeholder="isReadOnly('选择实际使用时间')" :picker-options="pickerOptions" style="width: 100%"
						:format='dateFormat' :value-format="dateFormat" :disabled="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="实际用途" :label-width="formLabelWidth" prop="act_usage">
					<el-input v-model="form.act_usage" :placeholder="isReadOnly('请输入用途')" style="width:100%"
						:readonly="readonly" maxlength="50">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="盖章人" :label-width="formLabelWidth" prop="sealer">
					<el-input v-model="form.sealer" :placeholder="isReadOnly('')" style="width:100%" :readonly="true"
						maxlength="50">
					</el-input>
				</el-form-item>
			</el-col>

			<el-col :span="span.full">
				<el-form-item label="备注" :label-width="formLabelWidth" prop="proc_memo">
					<el-input v-model="form.proc_memo" :placeholder="isReadOnly('请输入备注')" style="width:100%"
						:readonly="readonly" maxlength="200" type="textarea" :autosize="{ minRows: 6}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
	//头像
	import procabstract from '@/components/Upload/upload'

	import TreeSelect from '@riophae/vue-treeselect'
	import {
		docRegisterProcess,
		upLoadDocReceiptHistory,
		upLoadDocDispatchHistory,
		GetProcessData
	} from '../js/common'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
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
		name: 'sealProcForm',
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
				default: 0 //0 正常表单 1 详情表单 3 审核 4 发文添加用印申请
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
				sealIs: {
					tips: '添加后找不到印章，请查看印章是否启用'
				},
				readonly: false,
				sealIsReadonly: true,
				readonlyOrgId: true,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(1),
				screenWidth: document.body.clientWidth,
				formdefalut: {},
				extraIsShow: false,
				maxHeight: 200,
				selectData: {
					seal_id: [],
					org_id: [],
					person: [],
				},
				form: {
					use_id: -1,
					apply_id: -1,
					use_date: getdayEx(undefined, undefined, dateFormat(1)),
					act_usage: '',
					sealer: '',
					sealerid: '',
					proc_memo: '',
					//审批时间
					apply_date: '',
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
					use_date: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择实际使用时间'
					}, {
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {
							if (!value) {
								callback(new Error('请选择实际使用时间'));
								return;
							}
							if (value && !that.form.apply_date) {
								callback(new Error('未找到申请时间,请刷新页面重试'));
								return;
							}
							let use_date = new Date(value)
							let apply_date = new Date(that.form.apply_date)
							if (apply_date > use_date) {
								callback(new Error('实际使用时间不能早于申请时间[' + that.form.apply_date + ']'));
								return;
							}
							callback();
						}
					}],
					act_usage: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入实际用途'
					}],

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
				switch (this.type) {
					case 0:
						this.readonly = false
						this.sealIsReadonly = true
						this.rules = this.rules_temp
						break;
					case 0:
						this.readonly = false
						this.sealIsReadonly = false
						this.rules = this.rules_temp
						break;
					case 2:
						this.readonly = false
						this.sealIsReadonly = true
						this.rules = this.rules_temp
						break;
						//详情
					case 1:
						this.readonly = true
						this.sealIsReadonly = true
						this.rules = {}
						//审核
					case 3:
						this.readonly = true
						this.sealIsReadonly = true
						this.rules = {}
						break
				}
				this.form.table_type = this.table_type

				this.setSpan()
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					console.log('init form Object.assign', this.form)
					this.$refs['form'].clearValidate()
					this.file_default()
				}

				if (!this.form.sealer) {
					this.form.sealer = this.username
					this.form.sealerid = this.person_id
				}
				if (this.role_max == 'super_admin') {
					if (!this.form.org_id || this.form.org_id < 1) {
						this.form.org_id = this.current_org_id
					}
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
				await this.GetGroup()
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

				return this.form.org_id;
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
				let enabled = undefined;
				switch (this.type) {
					case 4:
						enabled = 1;
						break
				}
				let customList = [{
					data: 'seal_id',
					sqlcode: 359,
					list: [{
						field: "org_id",
						type: 3,
						level: 1
					}, {
						field: "enabled",
						type: 3,
						level: 1
					}],
					form: {
						org_id: org_id,
						enabled: enabled
					}
				}]
				console.log('GetGroup customList', customList)
				await GetGroupDataCustomEx(this, customList);
				console.log('this.selectData', this.selectData)
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
				return []
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
							field: "apply_id",
							level: 1
						},
						{
							field: "use_date",
							level: 2
						},
						{
							field: "act_usage",
							level: 3
						},
						{
							field: "sealerid",
							level: 4
						},
						{
							field: "proc_memo",
							level: 5
						},
						{
							field: "use_id",
							level: 6
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.use_id && form.use_id > 0) {
						//更新
						sqlcode = 363
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 363
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
