<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span.full">
				<el-form-item label="发文文号" :label-width="formLabelWidth" prop="docTitle">
					<el-select v-model="form.send_id" style="width: 100%" filterable default-first-option
						:disabled="readonly">
						<el-option v-for="data in selectData.send_id" :key="data.send_id" :label="data.doc_id"
							:value="data.send_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>



			<el-col :span="span.full">
				<el-form-item label="公文标题" :label-width="formLabelWidth" prop="docTitle">
					<el-input v-model="form.docTitle" :placeholder="isReadOnly('请输入公文标题')" style="width:100%"
						:readonly="readonly" maxlength="100">
					</el-input>
				</el-form-item>
			</el-col>


			<el-col :span="span.span14">
				<el-form-item label="公文文号" :label-width="formLabelWidth" prop="doc_no">
					<el-input v-model="form.doc_no" :placeholder="isReadOnly('请输入公文文号')" style="width:100%"
						:readonly="readonly" maxlength="50">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span.span10">
				<el-form-item label="发文编号" :label-width="formLabelWidth" prop="doc_id">
					<el-input v-model="form.doc_id" :placeholder="isReadOnly('请输入发文编号')" style="width:100%"
						:readonly="readonly" maxlength="20">
					</el-input>
				</el-form-item>
			</el-col>

			<el-col :span="span.quarter">
				<el-form-item label="密级" :label-width="formLabelWidth" prop="secretClassification">
					<el-select v-model="form.secretClassification" style="width: 100%" allow-create filterable
						default-first-option :disabled="readonly">
						<el-option v-for="data in selectData.secretClassification" :key="data.item_name"
							:label="data.item_name" :value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span.quarter">
				<el-form-item label="公文类别" :label-width="formLabelWidth" prop="IndustryCategory">
					<el-select v-model="form.IndustryCategory" style="width: 100%" allow-create filterable
						default-first-option :disabled="readonly">
						<el-option v-for="data in selectData.IndustryCategory" :key="data.item_name"
							:label="data.item_name" :value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span.quarter">
				<el-form-item label="行业类别" :label-width="formLabelWidth" prop="documentType">
					<el-select v-model="form.documentType" style="width: 100%" allow-create filterable
						default-first-option :disabled="readonly">
						<el-option v-for="data in selectData.documentType" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span.quarter">
				<el-form-item label="紧急程度" :label-width="formLabelWidth" prop="degreeOfUrgency">
					<el-select v-model="form.degreeOfUrgency" style="width: 100%" filterable default-first-option
						:disabled="readonly">
						<el-option v-for="data in selectData.degreeOfUrgency" :key="data.item_name"
							:label="data.item_name" :value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span.span14">
				<el-form-item label="发文范围" :label-width="formLabelWidth" prop="source">
					<el-select v-model="form.source" style="width: 100%" multiple allow-create filterable
						default-first-option :disabled="readonly">
						<el-option v-for="data in selectData.source" :key="data.item_id" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span.span10">
				<el-form-item label="预计发文日期" :label-width="formLabelWidth" prop="incoming_date">
					<el-date-picker v-model="form.incoming_date" align="left" type="datetime"
						:placeholder="isReadOnly('选择日期')" :picker-options="pickerOptions" style="width: 100%"
						:format='dateFormat' :value-format="dateFormat" :disabled="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span.full" v-show="process.reply.isrequired">
				<el-form-item label="收文单位" :label-width="formLabelWidth" prop="outgoing_org_id"
					:required="process.reply.isrequired">
					<tree-select :options="selectData.org_id" :max-height="maxHeight" :multiple="false"
						@input='changoutgoing_org_id' @close='changoutgoing_org_id'
						:placeholder="isReadOnly('请选择收文单位...')" :disabled="readonly" v-model="form.outgoing_org_id" />
				</el-form-item>
			</el-col>
			<el-col :span="span.full" v-show="!process.reply.isrequired">
				<el-form-item label="收文单位" :label-width="formLabelWidth" prop="outgoing_org"
					:required="process.outgoingOrg.isrequired">
					<el-autocomplete class="inline-input" v-model="form.outgoing_org"
						:fetch-suggestions="fetchSuggestionsOutgoingOrg"
						:placeholder="isReadOnly('请输入收文单位，多个部门用英文的分号分割')" style="width: 100%" :disabled="readonly"
						:debounce='50'>
						<template slot-scope="{ item }">
							<div class="name">{{ item.item_name }}</div>
						</template>
					</el-autocomplete>

				</el-form-item>
			</el-col>
			<el-col :span="span.full" v-show="process.reply.isrequired">
				<el-form-item label="抄送机构" :label-width="formLabelWidth" prop="makeCopyForUnit_org_id">
					<tree-select :options="selectData.org_id" :max-height="maxHeight" :multiple="true" :flat="true"
						@input='changemakeCopyForUnit_org_id' @close='changemakeCopyForUnit_org_id'
						:placeholder="isReadOnly('请选择收文单位...')" :disabled="readonly"
						v-model="form.makeCopyForUnit_org_id" />
				</el-form-item>
			</el-col>
			<el-col :span="span.full" v-show="!process.reply.isrequired">
				<el-form-item label="抄送机构" :label-width="formLabelWidth" prop="makeCopyForUnit">
					<el-autocomplete class="inline-input" v-model="form.makeCopyForUnit"
						:fetch-suggestions="fetchSuggestionsMakeCopyForUnit"
						:placeholder="isReadOnly('请输入抄送机构,多个部门用英文的分号分割')" style="width: 100%" :disabled="readonly">
						<template slot-scope="{ item }">
							<div class="name">{{ item.item_name }}</div>
						</template>
					</el-autocomplete>
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="拟稿部门" :label-width="formLabelWidth" prop="DraftUnit">
					<el-autocomplete class="inline-input" v-model="form.DraftUnit"
						:fetch-suggestions="fetchSuggestionsDraftUnit" :placeholder="isReadOnly('请输入拟稿部门，多个部门用英文的分号分割')"
						style="width: 100%" :disabled="readonly"></el-autocomplete>
					<!-- 					<el-select v-model="form.DraftUnit" style="width: 100%" allow-create default-first-option filterable
						remote :remote-method="remoteMethodMakeDraftUnit" :disabled="readonly"
						:placeholder="isReadOnly('请输入拟稿部门')">
						<el-option v-for="data in selectData.DraftUnit" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select> -->
				</el-form-item>
			</el-col>
			<el-col :span="span.full">
				<el-form-item label="发文单位" :label-width="formLabelWidth" prop="org_id">
					<tree-select :options="selectData.org_id" :max-height="maxHeight" :multiple="false" placeholder=""
						:disabled="readonlyParentSelect" v-model="form.org_id" />
				</el-form-item>
			</el-col>
			<el-col :span="span.span14">
				<el-form-item label="起草人" :label-width="formLabelWidth" prop="draftPersonId">
					<el-select v-model="form.draftPersonId" style="width: 100%" default-first-option
						:disabled="registrantStatus">
						<el-option v-for="data in selectData.person" :key="data.item_id" :label="data.item_name"
							:value="data.item_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span.span10">
				<el-form-item label="起草时间" :label-width="formLabelWidth" prop="draftDate">
					<el-date-picker v-model="form.draftDate" align="left" type="datetime" placeholder="选择日期"
						:picker-options="pickerOptions" style="width: 100%" :format='dateFormat'
						:value-format="dateFormat" :disabled="readonly">
					</el-date-picker>
				</el-form-item>
			</el-col>



			<el-col :span="span.full">
				<el-form-item label="内容摘要" :label-width="formLabelWidth" prop="abstract">
					<el-input v-model="form.abstract" :placeholder="isReadOnly('请输入内容摘要')" style="width:100%"
						:readonly="readonly" maxlength="200" type="textarea" :autosize="{ minRows: 6}" show-word-limit>
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
					<procabstract ref="proc_abstract" :downLoad_Fn="downLoadFn" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.proc_abstract"
						:original_name="upload.original_name.proc_abstract" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.proc_abstract"
						v-model="form.proc_abstract" :delte_service="upload.delte_service"
						:old_delete.sync="upload.old_delete.proc_abstract" :fileName.sync="form.doc_name"
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
		name: 'postSend',
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
				sfileName: 'sfileName',
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
					span4: 4,
					span3: 3,
					span2: 2,
					span1: 1
				},
				process: {
					outgoingOrg: {
						label: '发文',
						isrequired: false,
					},
					sign: {
						isrequired: false,
						label: '签收'
					},
					register: {
						label: '登记'
					},
					examine: {
						label: '审核'
					},
					end: {
						label: '完成'
					},
					reply: {
						isrequired: false,
					}
				},
				readonly: false,
				registrantStatus: true,
				readonlyParentSelect: true,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(1),
				screenWidth: document.body.clientWidth,
				formdefalut: {},
				extraIsShow: false,
				maxHeight: 200,
				selectData: {
					secretClassification: [],
					IndustryCategory: [],
					documentType: [],
					degreeOfUrgency: [],
					source: [],
					outgoing_org: [],
					makeCopyForUnit: [],
					DraftUnit: [],
					person: [],
					org_id: [],
				},
				form: {
					org_id: '',
					processingStatus: '',
					nextStatus: '',
					docTitle: '',
					doc_id: '',
					doc_name: [],
					doc_name_str: '',
					draftPersonId: '',
					secretClassification: '公开',
					documentType: '',
					IndustryCategory: '',
					degreeOfUrgency: '常规',
					outgoing_org: '',
					makeCopyForUnit_org_id: null,
					outgoing_org_id: null,
					makeCopyForUnit: '',
					DraftUnit: '',
					source: '',
					isOutSide: 0,
					registrant: '',
					draftDate: getdayEx(undefined, undefined, dateFormat(1)),
					Signer: '',
					SigneDate: '',
					incoming_date: '',
					abstract: '',
					proc_abstract: '',
					remarks: ''
				},
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						proc_abstract: 12,
					},
					type_str: 'jpg/pdf/png/jpeg',
					type_array: ['image/jpeg', 'image/png', 'application/pdf'],
					file_size: '15',
					size_unit: 'MB',
					original_name: {
						proc_abstract: {},
					},
					success: {
						proc_abstract: false,
					},
					old_delete: {
						proc_abstract: false,
					}
				},
				rulesSign: {


				},
				rules_temp: {
					outgoing_org: [{
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {
							if (that.process.outgoingOrg.isrequired && !value) {
								callback(new Error('请输入发文单位'))
							} else {
								callback()
							}
						}
					}],
					makeCopyForUnit: [{
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {
							if (value) {
								value = value.replace('；', ';')
							}
							callback()
						}
					}],

					docTitle: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入公文标题'
					}],
					doc_id: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入收文编号'
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							let form = {}
							let list = [{
								field: 'doc_id',
								type: 3,
								level: 1,
							}]
							form.doc_id = value
							const {
								code,
								data
							} = await that.QueryExec_fob(345, list, form)
							if (code == 200) {
								let length = data.length
								if ((!that.form.receive_id || that.form.receive_id < 0) && length > 0) {
									callback(new Error('已存在该收文编号'))
									return
								}
								let flag = false
								while (--length > -1) {
									if (data[length].receive_id != that.form.receive_id) {
										flag = true
										break
									}
								}
								if (flag) {
									callback(new Error('已存在该收文编号'))
								} else {
									callback()
								}
							} else {
								callback(new Error('查询数据库异常'))
							}
						}
					}],
					secretClassification: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入密级'
					}],
					source: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择来源'
					}, {
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {
							try {
								console.log('source validator', value)
								//审核存在操作回退情况
								if (that.form.reviewReason) {
									let flag = false
									// 登记后被退回
									if (that.form.processingStatus == that.process
										.examine.label && that.form.nextStatus == that.process.register.label
									) {
										flag = true
									}
									//起草后被退回
									if (that.form.processingStatus == that.process
										.examine.label && that.form.nextStatus == that.process.draft.label
									) {
										flag = true
									}
									if (flag) {
										that.form.processingStatus = that.form.nextStatus
									}

								}
								let isrequired = docRegisterProcess(value, that.process, that.selectData
									.source, that
									.form, undefined)
								console.log('source validator isrequired', isrequired)
								for (let key in isrequired) {
									if (that.process.hasOwnProperty(key)) {
										that.process[key].isrequired = isrequired[key].isrequired
									} else {
										that.process[key] = {
											isrequired: isrequired[key].isrequired
										}
									}
								}
								if (that.process['reply'].isrequired) {
									that.form.isOutSide = 1
								} else {
									that.form.isOutSide = 0
								}
								if (!that.process.sign.isrequired) {
									that.$refs['form'].clearValidate(['Signer', 'SigneDate'])
								}
								if (!that.process.outgoingOrg.isrequired) {
									that.$refs['form'].clearValidate(['outgoing_org'])
								}
							} catch (e) {
								console.log(e)

							}
							callback()

						}
					}],
					incoming_date: [{
						required: false,
						trigger: ["blur", "change"],
						message: '请选择预计发文日期'
					}, {
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {

							if (value && that.form.SigneDate) {
								let SigneDate = new Date(that.form.SigneDate)
								let incoming_date = new Date(value)
								if (incoming_date > SigneDate) {
									callback(new Error('发文时间应早于签收时间'))
									return
								}
							}
							if (value && that.form.draftDate) {
								let incoming_date = new Date(value)
								let draftDate = new Date(that.form.draftDate);
								if (draftDate > incoming_date) {
									callback(new Error('预计发文时间应晚于起草时间'))
									return
								}
							}
							callback()
						}
					}],
					abstract: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入内容摘要'
					}],
					registrant: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入登记人'
					}],
					draftDate: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入登记时间'
					}, {
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {
							if (value && that.form.SigneDate) {
								let draftDate = new Date(value);
								let SigneDate = new Date(that.form.SigneDate)
								if (SigneDate > draftDate) {
									callback(new Error('签收时间应早于登记时间'))
									return
								}
							}
							if (value && that.form.incoming_date) {
								let incoming_date = new Date(that.form.incoming_date)
								let draftDate = new Date(value);
								if (draftDate > incoming_date) {
									callback(new Error('预计发文时间应晚于登记时间'))
									return
								}
							}
							callback()
						}
					}],
					outgoing_org_id: [{
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {

							if (that.process.reply.isrequired && !value) {
								callback(new Error('请选择收文机构'))
								return
							}
							if (that.process.reply.isrequired && value) {
								let orgName = await that.$store.dispatch('org/GetOrgNameByOrgId', value)
								orgName = orgName.split(',')
								orgName = orgName.join(';')
								that.form.outgoing_org = orgName
							}
							callback()
						}
					}],
					makeCopyForUnit_org_id: [{
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {
							console.log('makeCopyForUnit_org_id begin')
							if (that.process.reply.isrequired && value) {
								let orgName = await that.$store.dispatch('org/GetOrgNameByOrgId', value)
								orgName = orgName.split(',')
								orgName = orgName.join(';')
								that.form.makeCopyForUnit = orgName
							}
							console.log('makeCopyForUnit_org_id end')
							callback()
						}
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
				upLoadDocDispatchHistory(this, form)
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
				console.log('init outOrgStatus ', this.outOrgStatus)

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
					if (this.formData.doc_name && typeof this.formData.doc_name == 'string') {
						this.formData.doc_name = [this.formData.doc_name];
					} else if (!this.formData.doc_name) {
						this.formData.doc_name = [];
					} else {
						this.formData.doc_name = [];
					}
					if (this.formData.makeCopyForUnit_org_id && typeof this.formData.makeCopyForUnit_org_id ==
						'string') {
						//this.formData.makeCopyForUnit_org_id = null
						this.formData.makeCopyForUnit_org_id = this.formData.makeCopyForUnit_org_id.split(',')
					} else {
						this.formData.makeCopyForUnit_org_id = null
					}
					if (this.formData.outgoing_org_id && typeof this.formData.outgoing_org_id == 'string') {
						this.formData.outgoing_org_id = this.formData.outgoing_org_id.split(',')
					} else {
						this.formData.outgoing_org_id = null
					}
					if (this.formData.source) {
						this.formData.source = this.formData.source.split(',')
					}

					this.form = Object.assign(this.form, this.formData)
					console.log('init form Object.assign', this.form)
					this.file_default()
				}

				if (!this.form.draftPersonId || this.form.draftPersonId < 1) {
					this.form.draftPersonId = this.person_id
				}


				if (this.role_max == 'super_admin') {
					if (!this.form.org_id || this.form.org_id < 1) {
						this.form.org_id = this.current_org_id
					}
					console.log(this.readonly)
					if (!this.readonly) {
						this.registrantStatus = false
						this.readonlyParentSelect = false
					}
				} else {
					if (!this.form.org_id || this.form.org_id < 1) {
						this.form.org_id = this.org_id
					}
					this.registrantStatus = true
					this.readonlyParentSelect = true
					//this.form.parent_id = this.org_id
				}
				this.$nextTick(() => {
					this.clearValidate()
				})
			},
			clearValidate(object_id) {
				if (this.$refs['form']) {
					this.$refs['form'].clearValidate()
				}

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
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				this.selectData.org_id = await this.$store.dispatch('org/GetOrgAllCache')
				let org_id = that.GetOrgBase()
				let list = [{
					data: "secretClassification",
					group_id: 1012
				}, {
					data: "IndustryCategory",
					group_id: 1013
				}, {
					data: "documentType",
					group_id: 1014
				}, {
					data: "degreeOfUrgency",
					group_id: 1015
				}, {
					data: "source",
					group_id: 1016
				}];
				await GetGroupDataEx(this, list)
				that.selectData.source = that.selectData.source.filter(function(s) {
					console.log('that.selectData.source', s)
					return s.remarks === '0' || !s.remarks // 注：IE9(不包含IE9)以下的版本没有trim()方法
				})
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
			async fetchSuggestionsOutgoingOrg(query, cb) {
				await this.remoteMethod(query, 'outgoing_org', cb);
			},
			async fetchSuggestionsMakeCopyForUnit(query, cb) {
				await this.remoteMethod(query, 'makeCopyForUnit', cb);
			},
			async fetchSuggestionsDraftUnit(query, cb) {
				await this.remoteMethod(query, 'DraftUnit', cb);
			},
			async remoteMethodOutgoingOrg(query) {
				await this.remoteMethod(query, 'outgoing_org');
			},
			async remoteMethodMakeCopyForUnit(query) {
				await this.remoteMethod(query, 'makeCopyForUnit');
			},
			async remoteMethodMakeDraftUnit(query) {
				await this.remoteMethod(query, 'DraftUnit');
			},
			async remoteMethod(query, dataKey, cb) {
				let array = new Array();
				let org_id = this.GetOrgBase()
				let list = [{
					field: "type",
					type: 3,
					level: 1
				}, {
					field: "org_id",
					type: 3,
					level: 1
				}, {
					field: "query",
					type: 2,
					level: 1
				}]
				let form = {
					type: dataKey,
					org_id: org_id,
					query: query
				}
				let customList = [{
					data: dataKey,
					sqlcode: 329,
					list: list,
					form: form
				}]
				console.log(customList)
				await GetGroupDataCustomEx(this, customList);
				let data = this.selectData[dataKey]
				if (!data || data.length == 0) {
					if (cb) {
						cb(array)
					}
					return 0;
				}
				let set = new Set();

				for (let i = 0; i < data.length; i++) {
					let item_name = data[i].item_name;
					if (item_name) {
						item_name = item_name.split(';')
						for (let j = 0; j < item_name.length; j++) {
							if (!set.has(item_name[j])) {
								array.push({
									item_name: item_name[j],
									value: item_name[j]
								})
								set.add(item_name[j])
							}
						}

					}
				}
				this.selectData[dataKey] = array
				if (cb) {
					console.log(array)
					cb(array)
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
				if (that.form.doc_name) {
					if (typeof that.form.doc_name == 'string') {
						that.upload.original_name.proc_abstract[form.proc_abstract] =
							that.form.doc_name
					} else if (that.form.doc_name.length > 0) {
						that.upload.original_name.proc_abstract[form.proc_abstract] =
							that.form.doc_name[0]
					} else if (that.form.doc_id) {
						that.upload.original_name.proc_abstract[form.proc_abstract] =
							that.form.doc_id
					}
				} else if (that.form.doc_id) {
					that.upload.original_name.proc_abstract[form.proc_abstract] = that
						.form.doc_id
				} else {
					that.upload.original_name.proc_abstract[form.proc_abstract] =
						'收文附件'
				}

			},
			fileUploadRefs() {
				return ['proc_abstract']
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
							field: "doc_id",
							level: 1
						},
						{
							field: "docTitle",
							level: 2
						},
						{
							field: "secretClassification",
							level: 3
						},
						{
							field: "documentType",
							level: 4
						},
						{
							field: "source",
							level: 5
						},
						{
							field: "IndustryCategory",
							level: 6
						},
						{
							field: "degreeOfUrgency",
							level: 7
						},
						{
							field: "outgoing_org",
							level: 8
						},
						{
							field: "outgoing_org_id",
							level: 9
						},
						{
							field: "makeCopyForUnit",
							level: 10
						},
						{
							field: "makeCopyForUnit_org_id",
							level: 11
						},
						{
							field: "DraftUnit",
							level: 12
						},
						{
							field: "org_id",
							level: 13
						},
						{
							field: "incoming_date",
							level: 14
						},
						{
							field: "draftPersonId",
							level: 15
						},
						{
							field: "draftDate",
							level: 16
						},
						{
							field: "doc_name",
							level: 17
						},
						{
							field: "proc_abstract",
							level: 18
						},
						{
							field: "abstract",
							level: 19
						},
						{
							field: "processingStatus",
							level: 20
						},
						{
							field: "nextStatus",
							level: 21
						},
						{
							field: "person_id",
							level: 22
						},
						{
							field: "remarks",
							level: 23
						},
						{
							field: "doc_no",
							level: 24
						},
						{
							field: "isOutSide",
							level: 25
						},
						{
							field: "send_id",
							level: 26
						},
					]

					let isrequired = docRegisterProcess(that.form.source,
						that.process, that
						.selectData
						.source, that.form, undefined)
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.send_id && form.send_id > 0) {
						//更新
						sqlcode = 344
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 344
						fob = that.QueryExec_fob_custom;
					}
					that.form.person_id = that.person_id
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
