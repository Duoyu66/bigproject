<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span.full">
				<el-form-item label="发文机构" :label-width="formLabelWidth" prop="org_name">
					<el-input v-model="form.org_name" :placeholder="isReadOnly('')" style="width:100%" :readonly="true">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="发文记录" :label-width="formLabelWidth" prop="send_id">
					<el-select v-model="form.send_id" style="width: 100%" filterable default-first-option
						:disabled="sendReadonly" @change="sendIdChange">
						<el-option v-for="data in selectData.send_id" :key="data.item_name" :label="data.item_name"
							:value="data.item_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="收文单位" :label-width="formLabelWidth" prop="receiver_org_name">
					<el-autocomplete class="inline-input" v-model="form.receiver_org_name"
						:fetch-suggestions="fetchSuggestionReceiver_org_name" @change="ReceiverOrgNamechange"
						@select="ReceiverOrgNamechange" :placeholder="isReadOnly('请输入收文单位，多个部门用英文的分号分割')"
						style="width: 100%" :disabled="readonly" :debounce='50' :maxlength="100" clearable>
						<template slot-scope="{ item }">
							<div class="name">{{ item.item_name }}</div>
						</template>
					</el-autocomplete>

				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="接收类型" :label-width="formLabelWidth" prop="target_post_type">
					<el-select v-model="form.target_post_type" style="width: 100%" filterable default-first-option
						:disabled="readonly">
						<el-option v-for="data in selectData.target_post_type" :key="data.item_name"
							:label="data.item_name" :value="data.item_id">
						</el-option>
					</el-select>

				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="发送方式" :label-width="formLabelWidth" prop="post_mode">
					<el-select v-model="form.post_mode" style="width: 100%" allow-create filterable default-first-option
						:disabled="readonly">
						<el-option v-for="data in selectData.post_mode" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>


			<el-col v-for="data in  post_mode.infoList" :key="data.field" :span="span.full">
				<el-form-item :label="data.label" :label-width="formLabelWidth" :prop="data.field"
					v-if="data.type =='input'||!data.type">
					<el-input v-model="form[data.field]" :placeholder="isReadOnly('请输入'+data.label)" style="width:100%"
						:readonly="readonly" :maxlength="data.maxlength?data.maxlength:30" clearable>
					</el-input>
				</el-form-item>
				<el-form-item :label="data.label" :label-width="formLabelWidth" :prop="data.field"
					v-if="data.type =='select'">
					<el-select v-model="form[data.field]" style="width: 100%" clearable :allow-create="data.data"
						filterable default-first-option :disabled="readonly">
						<el-option v-for="data in selectData[data.field]" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="data.label" :label-width="formLabelWidth" :prop="data.field"
					v-if="data.type =='textarea'">
					<el-input v-model="form[data.field]" :placeholder="isReadOnly('请输入'+data.label)" style="width:100%"
						:readonly="readonly" :maxlength="data.maxlength?data.maxlength:200" type="textarea"
						:autosize="{ minRows: 6}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>


			<!-- 			<el-col :span="span.full" v-show="post_mode.express.isShow">
				<el-form-item label="快递公司" :label-width="formLabelWidth" prop="express_company">
					<el-select v-model="form.express_company" style="width: 100%" clearable allow-create filterable
						default-first-option>
						<el-option v-for="data in selectData.express_company" :key="data.item_name"
							:label="data.item_name" :value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>

			<el-col :span="span.full" v-show="post_mode.express.isShow">
				<el-form-item label="快递单号" :label-width="formLabelWidth" prop="express_no">
					<el-input v-model="form.express_no" :placeholder="isReadOnly('请输入快递单号')" style="width:100%"
						:readonly="readonly" maxlength="16">
					</el-input>
				</el-form-item>
			</el-col> -->
			<el-col :span="span.full">
				<el-form-item label="发送时间" :label-width="formLabelWidth" prop="post_time">
					<el-date-picker v-model="form.post_time" align="left" type="datetime"
						:placeholder="isReadOnly('选择发送时间')" :picker-options="pickerOptions" style="width: 100%"
						:format='dateFormat' :value-format="dateFormat" :disabled="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="接收人/签收人" :label-width="formLabelWidth" prop="receiver"
					:required="required.sign.receiver">
					<el-input v-model="form.receiver" :placeholder="isReadOnly('请输入接收人/签收人')" style="width:100%"
						:readonly="readonly" maxlength="16" clearable>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="签收时间" :label-width="formLabelWidth" prop="sign_time"
					:required="required.sign.sign_time">
					<el-date-picker v-model="form.sign_time" align="left" type="datetime"
						:placeholder="isReadOnly('选择签收时间')" :picker-options="pickerOptions" style="width: 100%"
						:format='dateFormat' :value-format="dateFormat" :disabled="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="发送人" :label-width="formLabelWidth" prop="sender">
					<el-input v-model="form.sender" :placeholder="isReadOnly('')" style="width:100%" :readonly="true"
						maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
					<el-input v-model="form.remarks" :placeholder="isReadOnly('请输入备注')" style="width:100%"
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
		isPhone,
		isEmail
	} from '@/utils/validate'
	export default {
		name: 'docPostHistoryForm',
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
				sendReadonly: true,
				readonlyOrgId: true,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(1),
				screenWidth: document.body.clientWidth,
				formdefalut: {},
				extraIsShow: false,
				maxHeight: 200,
				selectData: {
					send_id: [],
					target_post_type: [],
					post_mode: [],
					express_company: [],
				},
				required: {
					sign: {
						sign_time: false,
						receiver: false
					}
				},
				post_mode: {
					express: {
						isShow: false
					},
					email: {
						isShow: false
					},
					infoList: []
				},
				form: {
					post_history_id: -1,
					send_id: '',
					target_post_type: '',
					receiver_org_name: '',
					post_time: getdayEx(undefined, undefined, dateFormat(1)),
					receiver: '',
					sign_time: '',
					post_mode: '',
					sender: '',
					sender_id: '',
					org_id: '',
					remarks: ''
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
					send_id: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择发文记录'
					}],
					target_post_type: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择接收类型'
					}],
					receiver_org_name: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入接收机构'
					}],
					post_time: [{
						required: false,
						trigger: ["blur", "change"],
						message: '请选择发送时间'
					}, {
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {
							try {
								if (!value) {
									callback()
									return
								}

								let post_time = new Date(value);
								if (that.form.sign_time) {
									let sign_time = new Date(that.form.sign_time)
									if (send_item > sign_time) {
										callback('发送时间应早于签收时间[' + that.form.post_time + ']')
										return
									}
								}
								let send_item = that.GetSendItem()
								if (!send_item) {
									callback()
									return
								}
								let revieweDate = new Date(send_item.revieweDate)

								if (revieweDate > post_time) {
									callback('发送时间应晚于审核时间[' + send_item.revieweDate + ']')
									return
								}

							} catch (e) {
								console.log(e)
							}
							callback()
						}
					}],
					post_mode: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择发送方式'
					}, {
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {
							if (value.length > 25) {
								callback(new Error('发送方式长度应小于25'))
								return
							}
							let list = that.selectData.post_mode.filter(function(o) {
								return o.item_name == value;
							});

							if (!list || list.length == 0) {
								callback()
								return
							}
							let item = list[0]
							try {
								let temp = []
								if (item.custom) {
									temp = JSON.parse(item.custom)
								}
								temp.forEach(function(item) {
									if (!that.form[item.field]) {
										that.dataDynamicBind(that.form, item.field, '');
										console.log(that.form['get ' + item.field])
										//that.form[item.field] = ''
									}
								})
								that.post_mode.infoList = temp;
							} catch (ex) {
								console.log(ex)
							}
							// for (let key in that.post_mode) {
							// 	if (key != item.custom) {
							// 		that.post_mode[key].isShow = false
							// 		continue
							// 	}
							// 	that.post_mode[key].isShow = true
							// }
							callback()
						}
					}],
					receiver: [{
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {
							try {
								if (!value) {
									that.required.sign.sign_time = false
									that.clearValidate('sign_time');
									if (that.required.sign.receiver) {
										callback(new Error('请输入接收人/签收人'));
										return
									}
									callback()
									return
								}
								that.required.sign.sign_time = true
								console.log(that.required)
							} catch (e) {
								console.log(e)
							}
							callback()
						}
					}],
					sign_time: [{
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {
							try {
								if (!value) {
									that.required.sign.receiver = false
									that.clearValidate('receiver');
									if (that.required.sign.sign_time) {
										callback(new Error('请选择签收时间'));
										return
									}
									callback()
									return
								}
								console.log(that.GetSendItem())
								let sign_time = new Date(value);
								if (that.form.post_time) {
									let post_time = new Date(that.form.post_time)
									if (post_time > sign_time) {
										callback('签收时间应晚于发送时间[' + that.form.post_time + ']')
										return
									}
								}
								that.required.sign.receiver = true
								let send_item = that.GetSendItem()
								if (!send_item) {
									callback()
									return
								}
								let revieweDate = new Date(send_item.revieweDate)

								if (revieweDate > sign_time) {
									callback('签收时间应晚于审核时间[' + send_item.revieweDate + ']')
									return
								}


							} catch (e) {
								console.log(e)
							}
							callback()
						}
					}],
					email: [{
						trigger: ["blur"],
						validator: async function(rule, value, callback) {
							if (!value) {
								callback()
							}
							let mobile = isEmail(value)
							if (mobile) {
								callback()
								return
							}
							callback(new Error('请输入正确的电子邮箱'))
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
			dataDynamicBind(filed, name, value) {
				let that = this
				this.$set(filed, name, value)
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
					case 4:
						this.readonly = false
						this.sendReadonly = false
						this.rules = this.rules_temp
						break;
					case 0:
						this.readonly = false
						this.sendReadonly = true
						this.rules = this.rules_temp
						break;
					case 2:
						this.readonly = false
						this.sendReadonly = true
						this.rules = this.rules_temp
						break;
						//详情
					case 1:
						this.readonly = true
						this.sendReadonly = true
						this.rules = {}
						//审核
					case 3:
						this.readonly = true
						this.sendReadonly = true
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

				if (!this.form.sender) {
					this.form.sender = this.username
					this.form.sender_id = this.person_id
				}
				if (this.role_max == 'super_admin') {
					// if (!this.form.org_id || this.form.org_id < 1) {
					// 	this.form.org_id = this.current_org_id
					// }
					if (!this.readonly) {
						this.readonlyOrgId = false
					} else {
						this.readonlyOrgId = true
					}
				} else {
					// if (!this.form.org_id || this.form.org_id < 1) {
					// 	this.form.org_id = this.org_id
					// }
					this.readonlyOrgId = true
					//this.form.parent_id = this.org_id
				}
				await this.GetOrgName(this.form.org_id);
				await this.GetGroup()
				this.ParseInfo()
				this.$nextTick(() => {
					this.clearValidate()
				})
			},
			clearValidate(object_id) {
				if (this.$refs['form']) {
					this.$refs['form'].clearValidate()
				}

			},
			async GetOrgName(org_id) {
				let orgName = await this.$store.dispatch('org/GetOrgNameByOrgId', org_id)
				this.form.org_name = orgName
			},
			sendIdChange(value) {
				this.SetTargetPostType(value, this.form.receiver_org_name)
				this.elemenetValiDateFiled('sign_time')
				this.elemenetValiDateFiled('post_time')
			},
			//设置主送 抄送 
			SetTargetPostType(send_id, value) {
				let org = this.DealOrg(send_id)
				if (!org || !org[value]) {
					return
				}
				let item = org[value]
				this.form.target_post_type = item.target_post_type
			},
			//收文单位输入值变化监听
			ReceiverOrgNamechange(value) {
				let type = (typeof value).toLowerCase()
				switch (type) {
					case 'object':
						value = value.value
						break
					case 'string':
						break
					case 'number':
						value = value.toString()
						break
					default:
						break
				}
				this.SetTargetPostType(this.form.send_id, value);
			},
			//获取发文记录信息
			GetSendItem(send_id) {
				if (!send_id) {
					send_id = this.form.send_id
				}
				
				let array = this.selectData.send_id.filter((item) => {
					if (item.send_id == send_id) {
						return item
					}
				})
				//let send_item = this.selectData.send_id[send_id]
				let send_item = {};
				if (array && array.length > 0) {
					send_item = array[0]
				}
				return send_item
			},
			//处理抄送和主送机构
			DealOrg(send_id) {
				let that = this
				if (!send_id) {
					send_id = that.form.send_id
				}
				let send_item = this.GetSendItem(send_id)
				if (!send_item) {
					return -1
				}
				let org = {

				}
				try {
					let fieldList = [{
						field: 'outgoing_org',
						target_post_type: '主送'
					}, {
						field: 'makeCopyForUnit',
						target_post_type: '抄送'
					}]
					let length = fieldList.length
					for (let i = 0; i < length; i++) {
						let item = fieldList[i]
						let field = item.field
						let target_post_type = item.target_post_type
						if (!send_item[field]) {
							continue
						}
						let value = send_item[field].split(';')
						let length2 = value.length
						for (let j = 0; j < length2; j++) {
							org[value[j]] = {
								target_post_type: target_post_type
							}
						}
					}
				} catch (e) {
					console.log(e)
				}
				return org
			},
			//按照输入过滤
			fetchSuggestionReceiver_org_name(queryString, cb) {
				let org = this.DealOrg()
				let orgList = Object.keys(org)
				if (queryString) {
					orgList = orgList.filter(function(o) {
						return o.indexOf(queryString) >= 0;
					});
				}
				let length = orgList.length
				let aResult = []
				for (let i = 0; i < length; i++) {
					aResult.push({
						item_name: orgList[i],
						value: orgList[i]
					})
				}
				cb(aResult)
			},
			clearValidate(field) {
				this.$nextTick(() => {
					this.$refs['form'].clearValidate(field)
				})
			},
			//element手动验证
			elemenetValiDateFiled(field) {
				let type = (typeof value).toLowerCase()
				switch (type) {
					case 'object':
						field.forEach(function(e) {
							this.$nextTick(() => {
								this.$refs['form'].validateField(e)
							})
						});
						break
					case 'string':
						this.$nextTick(() => {
							this.$refs['form'].validateField(field)
						})
						break
					case 'number':
						this.$nextTick(() => {
							this.$refs['form'].validateField(field)
						})
						break
					default:
						this.$nextTick(() => {
							this.$refs['form'].validateField(field)
						})
						break
				}
			},
			GetOrgBase() {
				return this.form.org_id;
			},
			async GetGroup() {
				let that = this
				//this.selectData.org_id = await this.$store.dispatch('org/GetOrgAllCache')
				let org_id = that.GetOrgBase()
				let list = [{
					data: "target_post_type",
					group_id: 1018
				}, {
					data: "post_mode",
					group_id: 1019
				}, {
					data: "express_company",
					group_id: 1020
				}];
				await GetGroupDataEx(this, list)
				let send_id = undefined;
				switch (this.type) {
					case 4:
						break
				}
				let customList = [{
					data: 'send_id',
					sqlcode: 383,
					list: [{
						field: "org_id",
						type: 3,
						level: 1
					}, {
						field: "send_id",
						type: 3,
						level: 1
					}],
					form: {
						org_id: org_id,
						send_id: send_id
					}
				}]
				console.log('GetGroup customList', customList)
				await GetGroupDataCustomEx(this, customList);
				console.log('this.selectData', this.selectData)
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
			//转义info
			ParseInfo(form) {
				let that = this
				try {
					if (!form) {
						form = this.form
					}
					if (!form.post_mode_info) {
						return
					}

					let temp = JSON.parse(form.post_mode_info)
					for (let key in temp) {
						this.dataDynamicBind(this.form, key, temp[key])
					}
					let list = this.selectData.post_mode.filter(function(o) {
						return o.item_name == that.form.post_mode;
					});
					if (!list || list.length == 0) {
						return
					}
					let item = list[0]
					if (item.custom) {
						temp = JSON.parse(item.custom)
					}
					temp.forEach(function(item) {
						if (!that.form[item.field]) {
							that.dataDynamicBind(that.form, item.field, '');
						}
					})
					this.post_mode.infoList = temp;

					//this.form = Object.assign(this.form, temp)
				} catch (e) {
					console.log(e)
				}
			},
			//处理发送信息
			DealInfo() {
				let info = {};
				try {
					let that = this
					let form = that.form
					let list = that.selectData.post_mode.filter(function(o) {
						return o.item_name == form.post_mode;
					});
					if (!list || list.length == 0) {
						return ''
					}
					let item = list[0]
					console.log('DealInfo item', item)
					if (!item || !item.custom) {
						return ''
					}
					let custom = JSON.parse(item.custom)
					console.log('DealInfo custom', custom)
					custom.forEach(function(e) {
						if (form[e.field]) {
							info[e.field] = form[e.field]
						}
					})

				} catch (e) {
					console.log(e)
				}
				return JSON.stringify(info)
			},
			async save(callback) {
				let that = this
				async function submit() {
					that.loading = true
					that.loadingText = '提交表单中...'
					let form = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: "send_id",
							level: 1
						},
						{
							field: "target_post_type",
							level: 2
						},
						{
							field: "receiver_org_name",
							level: 3
						},
						{
							field: "inside_receiver_org_id",
							level: 4
						},
						{
							field: "post_time",
							level: 5
						},
						{
							field: "receiver",
							level: 6
						},
						{
							field: "receiver_id",
							level: 7
						},
						{
							field: "post_mode",
							level: 8
						},
						{
							field: "post_mode_info",
							level: 9
						},
						{
							field: "sign_time",
							level: 10
						},
						{
							field: "sender_id",
							level: 11
						},
						{
							field: "remarks",
							level: 12
						},
						{
							field: "post_history_id",
							level: 13
						}
					]
					that.form.post_mode_info = that.DealInfo()
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.use_id && form.use_id > 0) {
						//更新
						sqlcode = 387
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 387
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
