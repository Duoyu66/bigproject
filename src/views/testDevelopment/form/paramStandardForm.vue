<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>

			<el-col :span="span.full">
				<el-form-item label="参数名称" :label-width="formLabelWidth" prop="param">
					<el-input v-model="form.param" :placeholder="isReadOnly('')" style="width:100%" :readonly="true">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="" :label-width="formLabelWidth" prop="">
					<el-alert title="提示" description="请先选择行业,选中后自动更新标准规范的前50条数据,如没有需要的请在下拉框中输入关键词进行搜索" type="info"
						:closable="false" center show-icon> </el-alert>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="所属行业" :label-width="formLabelWidth" prop="tpl_id">
					<el-select v-model="form.tpl_id" style="width: 100%" :disabled="readonly" value-key="item_id"
						@change="tplChange">
						<el-option v-for="data in selectData.tpl_id" :key="data.item_id" :label="data.item_name"
							:value="data.item_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>

			<el-col :span="span.full">
				<el-form-item label="标准规范" :label-width="formLabelWidth" prop="std_id">
					<el-select v-model="form.std_id" style="width: 100%" :disabled="readonly"
						:multiple="select.std_id.multiple" clearable filterable remote
						:remote-method="stdIdremoteMethod">
						<el-option v-for="data in selectData.std_id" :key="data.item_id" :label="data.item_name"
							:value="data.item_id">
						</el-option>
					</el-select>
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
		name: 'paramStandardForm',
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
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(1),
				screenWidth: document.body.clientWidth,
				formdefalut: {},
				maxHeight: 200,
				select: {
					std_id: {
						multiple: false,
					}
				},
				selectData: {
					std_id: [],
					tpl_id: [],
				},
				form: {
					map_id: -1,
					param_id: -1,
					param: '',
					std_id: '',
					tpl_id: '',
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
				rules_temp: {
					std_id: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择标准规范'
					}],
					tpl_id: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入行业类型'
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
					//添加
					case 0:
						this.readonly = false
						this.form.std_id = []
						this.select.std_id.multiple = true
						this.rules = this.rules_temp
						break;
						//编辑
					case 10:
						this.readonly = false
						this.form.std_id = ''
						this.select.std_id.multiple = false
						this.rules = this.rules_temp
					case 2:
						this.readonly = false
						this.rules = this.rules_temp
						break;
						//详情
					case 1:
						this.readonly = true
						this.form.std_id = ''
						this.select.std_id.multiple = false
						this.rules = {}
						//审核
					case 3:
						this.readonly = true
						this.rules = {}
						break
				}

				this.setSpan()
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.$refs['form'].clearValidate()
					console.log(this.form)
					this.file_default()
				}
				await this.GetGroup()
				this.$nextTick(() => {
					this.clearValidate()
				})
			},
			clearValidate(prop) {
				if (this.$refs['form']) {
					this.$refs['form'].clearValidate(prop)
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

				return this.form.org_id;
			},
			tplChange(selection) {
				this.GetStdId()
			},
			stdIdremoteMethod(query) {
				console.log('stdIdremoteMethod', query)
				this.GetStdId(query)
			},
			async GetGroup() {
				let that = this
				// await GetGroupDataEx(this, list)
				let customList = [{
					data: 'tpl_id',
					sqlcode: 428,
					list: [{
						field: "param_id",
						type: 3,
						level: 1
					}],
					form: {
						param_id: that.form.param_id,
					}
				}]
				await GetGroupDataCustomEx(this, customList);
				await this.GetStdId()
			},
			async GetStdId(searchKey) {
				let std_id = this.form.std_id
				let tpl_id = this.form.tpl_id
				let param_id = this.form.param_id
				let std_id_typeof = (typeof std_id).toLowerCase()
				if (isNumEx(std_id)) {
					std_id = Number(std_id)
				}
				switch (std_id_typeof) {
					case 'object':
						try {
							std_id = std_id.join(',')
						} catch (e) {
							console.log(e)
						}
						break
					default:
						std_id = Number(std_id)
						break
				}
				let list = [{
					field: "tpl_id",
					type: 3,
					level: 1
				}, {
					field: "param_id",
					type: 3,
					level: 2
				}, {
					field: "std_id",
					type: 3,
					level: 3
				}, {
					field: "searchKey",
					type: 2,
					level: 4
				}];
				let form = {
					tpl_id: tpl_id,
					param_id: param_id,
					std_id: std_id,
					searchKey: searchKey
				}
				let customList = [{
					data: 'std_id',
					sqlcode: 429,
					list: list,
					form: form
				}]
				await GetGroupDataCustomEx(this, customList);
				console.log(new Date(), this.selectData)
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
							field: "opertion_type",
							level: 1
						},
						{
							field: "param_id",
							level: 2
						},
						{
							field: "std_id",
							level: 3
						},
						{
							field: "tpl_id",
							level: 4
						},
						{
							field: "map_id",
							level: 5
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.map_id && form.map_id > 0) {
						//更新
						sqlcode = 430
						form.opertion_type = 1
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 430
						form.opertion_type = 0
						fob = that.QueryExec_fob_custom;
					}
					that.form.operator = that.person_id
					const {
						code,
						influence,
						data
					} = await fob(list, form, sqlcode)
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
