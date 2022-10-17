<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span">
				<el-form-item label="分组id" :label-width="formLabelWidth" prop="group_id"
					v-show="form.group_id&&parseFloat(form.group_id)>0">
					<el-input v-model="form.group_id" :placeholder="isReadOnly('')" style="width:100%" :readonly="true"
						maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="字典id" :label-width="formLabelWidth" prop="item_id"
					v-show="form.item_id&&form.item_id>0">
					<el-input v-model="form.item_id" :placeholder="isReadOnly('')" style="width:100%" :readonly="true"
						maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="名称" :label-width="formLabelWidth" prop="item_name">
					<el-input v-model="form.item_name" :placeholder="isReadOnly('请输入名称')" style="width:100%"
						:readonly="readonly" maxlength="25">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="自定义属性" :label-width="formLabelWidth" prop="custom">
					<el-input v-model="form.custom" :placeholder="isReadOnly('请输入自定义属性')" style="width:100%"
						:readonly="readonly" maxlength="500" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
					<el-input v-model="form.remarks" :placeholder="isReadOnly('请输入备注')" style="width:100%"
						:readonly="readonly" maxlength="100" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
	import TreeSelect from '@riophae/vue-treeselect'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	import {
		mapGetters
	} from 'vuex'
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
		name: 'branchInstitutionsForm',
		components: {
			TreeSelect
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
				person_id: 'user/person_id'
			}),
		},
		watch: {
			formData(newVal, oldVal) {
				if (newVal) {
					console.log('formData watch', newVal, oldVal);
					//this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
					this.form = Object.assign({}, this.formdefalut)
					//this.file_default()
					this.init()
				}
			},
		},
		data() {
			let that = this
			return {
				span: 24,
				readonly: false,
				readonlyParentSelect: true,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(),
				formdefalut: {},
				extraIsShow: false,
				maxHeight: 200,
				selectData: {
					org_type: [],
					parent_id: [],
					out_org_status: [],
				},
				form: {
					item_id: -1,
					item_name: '',
					group_id: 0,
					custom: '',
					remarks: '',
					nDeep: '',

				},
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						contract_file: 12,
						ext_file: 11,
						businessFile: 11,
					},
					type_str: 'jpg/pdf/png/jpeg',
					type_array: ['image/jpeg', 'image/png', 'application/pdf'],
					file_size: '15',
					size_unit: 'MB',
					original_name: {
						contract_file: {},
						ext_file: {},
						businessFile: {}
					},
					success: {
						contract_file: false,
						ext_file: false,
						businessFile: false
					},
					old_delete: {
						contract_file: false,
						ext_file: false,
						businessFile: false
					}
				},
				rules_temp: {
					item_name: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入名称'
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
			async init(formDataS) {
				console.log(formDataS);
				switch (this.type) {
					case 0:
						this.readonly = false
						this.rules = this.rules_temp
						break;
					case 2:
						this.readonly = false
						this.rules = this.rules_temp
						break;
					case 1:
						this.readonly = true
						this.rules = {}
						break
				}
				this.form.table_type = this.table_type
				this.GetGroup()
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.file_default()
				}
				// if (!(this.form.org_id && this.form.org_id > 0)) {
				// 	console.log(this.form.org_id)
				// 	this.form.parent_id = this.org_id
				// }
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				if (this.role_max == 'super_admin') {
					this.readonlyParentSelect = false
					if (this.type == 2 && !(this.form.parent_id && this.form.parent_id > 0)) {
						this.form.parent_id = this.current_org_id
					}
				} else {
					await this.GetParentOrg()
					//this.form.parent_id = this.org_id
				}


			},
			async GetParentOrg() {
				let select_list = [{
					field: 'org_id',
					type: 3,
					level: 1,
				}, ]
				let form = {
					org_id: this.org_id
				}
				let {
					data
				} = await this.QueryExec_fob(327, select_list, form)
				if (!data) {
					return -1
				}
				if (data.length == 0) {
					return -1
				}
				this.form.parent_id = data[0].parent_id
			},
			async GetGroup() {
				let that = this
				let list = [{
					data: "org_type",
					group_id: 1010
				}, {
					data: "out_org_status",
					group_id: 1011
				}];
				await GetGroupDataEx(this, list)
				this.selectData.org_type = this.selectData.org_type.filter(function(s) {
					return s.custom == that.form.table_type
				})
				this.selectData.parent_id = await this.$store.dispatch('org/GetOrgTreeAllEx')
				this.selectData.parent_id = [{
					children: this.selectData.parent_id,
					id: 0,
					label: '根节点',
					name: '根节点'
				}]
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
				this.form = this.$options.data().form
				this.form = JSON.parse(JSON.stringify(this.formdefalut));
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
							field: "item_name",
							level: 1
						},
						{
							field: "group_id",
							level: 2
						},
						{
							field: "custom",
							level: 3
						},
						{
							field: "remarks",
							level: 4
						},
						{
							field: "item_id",
							level: 5
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.exId && form.exId > 0) {
						//更新
						sqlcode = 660
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 660
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

<style>
	.vue-treeselect--append-to-body {
		z-index: 999999 !important;
	}
</style>
