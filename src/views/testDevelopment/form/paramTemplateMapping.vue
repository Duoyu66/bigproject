<template>
	<div style="height:calc(78vh)" id="paramTemplateMapping" ref="paramTemplateMapping">
		<el-form ref="form" :model="form" :rules="rules">
			<el-row>
				<el-col :span="span.full">
					<el-form-item label="参数名称" :label-width="formLabelWidth" prop="param">
						<el-input v-model="form.param" :placeholder="isReadOnly('')" style="width:100%"
							:readonly="true">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="span.full">
					<el-form-item label="" :label-width="formLabelWidth" prop="">
						<el-alert title="提示" description="只显示模板的前10条数据,如没有需要的请在下拉框中输入关键词进行搜索,表格仅做展示" type="info"
							:closable="false" center show-icon> </el-alert>
					</el-form-item>
				</el-col>
				<el-col :span="span.full">
					<el-form-item label="模板" :label-width="formLabelWidth" prop="template_id">
						<el-select v-model="form.template_id" style="width: 100%" :disabled="readonly"
							:multiple="select.template_id.multiple" clearable filterable remote
							:remote-method="stdIdremoteMethod" @focus="stdIdFocus" @change="selectChangeTemplateId">
							<el-option v-for="data in selectData.template_id" :key="data.template_id"
								:label="data.template_name" :value="data.template_id">
								<span style="float: left">{{ data.template_name }}</span>
								<span
									style="float: right; color: #8492a6; font-size: 13px">版本[{{ data.template_version }}]</span>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>

			</el-row>
		</el-form>
		<iframe src="/paramTemplateMappingLuckysheet.html" ref="iframeTemplate" :id="iframe.domid"
			class="iframeTemplate TemplateLuckySheet" :style="iframeStyle" v-if="iframe.IsrefreshIframe"></iframe>
	</div>

</template>

<script>
	let messageListener = '';
	let vue_that = '';
	//头像
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	import {
		mapGetters
	} from 'vuex'
	import {
		judgeVariableType,
		variableInfo,
		judgeVariableIsEmptyOrNull
	} from '@/utils/base.helper'
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
		name: 'paramTemplateMapping',
		components: {},
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
			iframeStyle() {
				let style = this.iframe.style
				let txt = ''
				for (let key in style) {
					if (!style[key]) {
						continue
					}
					txt = txt + key + ':' + style[key] + ';'
				}
				return txt
			}
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
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(1),
				screenWidth: document.body.clientWidth,
				formdefalut: {},
				maxHeight: 200,
				select: {
					template_id: {
						multiple: false,
					}
				},
				selectData: {
					template_id: [],

				},
				form: {
					paramtemp_id: -1,
					param_id: -1,
					param: '',
					template_id: '',
				},
				rules_temp: {
					template_id: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择模板'
					}],
				},
				rules: {

				},
				formLabelWidth: '120px',
				luckysheet: {
					isHasLuckSheet: false,
				},
				iframe: {
					IsrefreshIframe: true,
					addEventListener: true,
					domid: '',
					style: {
						height: '72%',
						width: '99%'
					},
				}
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
			refreshIframe(event, isTips) {
				let that = this
				if (isTips) {
					this.$baseConfirm('确定重载表格？', null, async () => {
						refresh()
					})
				} else {
					refresh()
				}
				async function refresh() {
					//await  that.postMessage('close')
					that.iframe.addEventListener = false
					if (that.$set) {
						that.$set(that.iframe, 'IsrefreshIframe', false)
					} else {
						that.iframe.IsrefreshIframe = false
					}
					that.$nextTick(async () => {
						//await that.postMessage('open')
						if (that.$set) {
							that.$set(that.iframe, 'IsrefreshIframe', true)
						} else {
							that.iframe.IsrefreshIframe = true
						}

					})
				}
			},
			async init() {
				this.getPostMessage()

				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					//添加
					case 0:
						this.readonly = false
						this.form.template_id = []
						this.select.template_id.multiple = false
						this.rules = this.rules_temp
						break;
						//编辑
					case 10:
						this.readonly = false
						this.form.template_id = ''
						this.select.template_id.multiple = false
						this.rules = this.rules_temp
					case 2:
						this.readonly = false
						this.rules = this.rules_temp
						break;
						//详情
					case 1:
						this.readonly = true
						this.form.template_id = ''
						this.select.template_id.multiple = false
						this.rules = {}
						//审核
					case 3:
						this.readonly = true
						this.rules = {}
						break
				}
				this.refreshIframe(undefined, false)
				this.setSpan()
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				if (this.formData && JSON.stringify(this.formData) != '{}') {
					this.form = Object.assign(this.form, this.formData)
					this.$refs['form'].clearValidate()
					if (this.formData.template_json) {
						this.postMessage('ManualPaste', this.formData.template_json);
					}
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
			selectChangeTemplateId(val) {
				if (!val) {
					val = this.form.template_id
				}
				let serachResult = this.selectData.template_id.filter((item) => {
					if (item.template_id == val) {
						return item
					}
				})
				if (!serachResult || serachResult.length == 0) {
					return
				}
				let item = serachResult[0]
				let template_json = item.template_json
				this.postMessage('ManualPaste', template_json);
			},
			postMessage(messageTpye, postData) {
				let that = this
				let id = this.iframe.domid
				return new Promise((resolve, reject) => {
					try {
						let index = setInterval(function() {
							if (that.$refs.iframeTemplate && that.iframe.addEventListener) {
								clearInterval(index)
								// 只有在 iframe 加载时传递数据给子组件，$refs 才是非空的
								that.$refs.iframeTemplate.contentWindow.postMessage({
									messageTpye: messageTpye,
									postData: postData,
									domid: id
								}, '*');
								resolve(true)
							}
						})
					} catch (e) {
						console.log(e)
						reject(false, e)
					}

				})

			},
			getPostMessage(option) {
				let _this = this
				let defaultoption = {
					isAddEventListener: true
				}
				if (!option) {
					option = {}
				}
				option = Object.assign(defaultoption, option)

				if (!messageListener || vue_that != this) {
					vue_that = this
					try {
						window.removeEventListener('message', messageListener)
					} catch (e) {
						console.log(e)
					}
					messageListener = function(e) {

						let data = e.data
						let IsEmptyOrNull = judgeVariableIsEmptyOrNull(data)
						if (IsEmptyOrNull) {
							return
						}
						let type = judgeVariableType(data)
						let typeofdata = typeof data
						switch (type) {
							case variableInfo.string.name:

								break
							case variableInfo.number.name:

								break
							case variableInfo.array.name:
								break
							case variableInfo.json.name:
								if (data.domid != _this.iframe.domid) {
									return
								}
								switch (data.messageTpye) {
									case 'TemplateJson':
										_this.updateTemplateJson(data.postData)
										break
									case 'addEventListener':
										_this.iframe.addEventListener = true
										_this.iframe.error = false
										break
									case 'handleError':
										_this.notify(data.postData, 'error')
										_this.iframe.error = true
										break
									case 'MultipleSelectDialog':
										_this.MultipleSelectDialog(data.postData)
										break
								}
								break
							case variableInfo.function.name:

								break
							case variableInfo.boolean.name:

								break
						}
					}
				}
				try {
					window.removeEventListener('message', messageListener)
				} catch (e) {
					console.log(e)
				}
				let index = setInterval(() => {
					if (_this.$refs['form']) {
						clearInterval(index)
						if (option.isAddEventListener) {
							window.addEventListener('message', messageListener)
							console.log('paramTemplateMapping 添加监听')
						}
					}
				}, 400)
			},
			stdIdFocus(event) {

			},
			stdIdremoteMethod(query) {
				console.log('stdIdremoteMethod', query)
				this.GetStdId(query)
			},
			async GetStdId(searchKey) {
				let template_id = this.form.template_id
				let tpl_id = this.form.tpl_id
				let object_id = this.form.object_id
				let template_id_typeof = (typeof template_id).toLowerCase()
				// if (isNumEx(template_id)) {
				// 	template_id = Number(template_id)
				// }
				switch (template_id_typeof) {
					case 'object':
						try {
							console.log(template_id)
							template_id = template_id.join(',')
						} catch (e) {
							console.log(e)
						}
						break
					default:
						template_id = Number(template_id)
						break
				}
				let list = [{
					field: "searchKey",
					type: 2,
					level: 4
				}];
				let form = {
					searchKey: searchKey
				}
				let customList = [{
					data: 'template_id',
					sqlcode: 514,
					list: list,
					form: form
				}]
				await GetGroupDataCustomEx(this, customList);
				console.log(new Date(), this.selectData)
			},
			async GetGroup() {
				this.GetStdId()
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
			close() {
				let that = this
				that.$refs['form'].resetFields()
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
							field: "param_id",
							level: 1
						},
						{
							field: "template_id",
							level: 2
						},
						{
							field: "tpl_class",
							level: 3
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.paramtemp_id && form.paramtemp_id > 0) {
						//更新
						sqlcode = 516
						form.opertion_type = 1
						fob = that.update_fob;
						msg = '更新'
						list.push({
							field: "paramtemp_id",
							level: list.length
						})
					} else {
						//添加
						msg = '添加'
						sqlcode = 515
						form.opertion_type = 0
						fob = that.insert_fob;
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
					if (influence && influence > 0) {
						that.$baseMessage(msg + '成功', 'success')
						that.close()
						return true
					} else {
						that.$baseMessage(msg + '失败', 'error')
					}
					return false
				}
				console.log(that.form)
				that.$refs['form'].validate((valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							const flag = await submit();
							callback(flag);
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

</style>
