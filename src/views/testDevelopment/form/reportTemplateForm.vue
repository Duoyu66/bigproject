<template>
	<div style="height:calc(78vh)">
		<el-form ref="form" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
					<el-form-item label="模板名称" :label-width="formLabelWidth" prop="template_name">
						<el-input v-model="form.template_name" style="width: 100%;" v-if="templateold"></el-input>
            <el-select v-model="form.template_name" filterable remote placeholder="请输入关键词" v-else @change="templatechange"
            	:remote-method="getPersonList" v-loadmore="getPersonListMore">
            	<el-option v-for="item in selectData.supervisee" :key="item.item_id" :label="item.item_name"
            		:value="item.item_name">
            	</el-option>
            </el-select>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
					<el-form-item label="模板版本" :label-width="formLabelWidth" prop="template_version">
						<el-input v-model="form.template_version" style="width: 100%;"></el-input>
					</el-form-item>
				</el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        	<el-form-item label="模板说明" :label-width="formLabelWidth" prop="template_version">
        		<el-input v-model="form.template_class" style="width: 100%;"></el-input>
        	</el-form-item>
        </el-col>
				<el-col :xs="24" :sm="24" :md="21" :lg="22" :xl="22">
					<el-form-item label="模板" :label-width="formLabelWidth">
						<el-input placeholder="" v-model="form.template_json" class="input-with-select"
							readonly="readonly" disabled>
							<el-tooltip slot="append" class="item" effect="dark" content="查看所选模板" placement="top-start">
								<el-button icon="el-icon-view" @click="unzipTemplate">
									查看所选模板</el-button>
							</el-tooltip>
							<el-tooltip slot="append" class="item" effect="dark" content="重载表格" placement="top-start">
								<el-button icon="el-icon-refresh" @click="refreshIframe">重载表格</el-button>
							</el-tooltip>
							<el-tooltip slot="append" class="item" effect="dark" content="选择文件,仅支持xlsx"
								placement="top-start">
								<el-button icon="el-icon-folder-opened" @click="folderOpen">选择文件</el-button>
							</el-tooltip>
							<el-tooltip slot="append" class="item" effect="dark" content="手动选择区域后获取模板"
								placement="top-start">
								<el-button icon="fa fa-save" @click="confirmSelect">手动获取</el-button>
							</el-tooltip>
							<el-tooltip slot="append" class="item" effect="dark" content="自动获取选择区域后获取模板"
								placement="top-start">
								<el-button icon="fa fa-save" @click="autoSelect">自动获取</el-button>
							</el-tooltip>
							<el-tooltip slot="append" class="item" effect="dark" :content="button.tips.txt"
								placement="top-start">
								<el-button :icon="button.tips.isShow?'fa fa-eye-slash':'el-icon-view' "
									@click="tipsIsShow">{{button.tips.txt}}
								</el-button>
							</el-tooltip>

						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="3" :sm="3" :md="3" :lg="2" :xl="2">
					<!-- <el-button icon="el-icon-view" :disabled="!form.template_json" @click="unzipTemplate">查看所选模板
					</el-button>
					<el-button icon="el-icon-refresh" @click="refreshIframe">重载表格</el-button>
					<el-button icon="el-icon-folder-opened" @click="folderOpen">选择文件</el-button>
					<el-button icon="fa fa-save" @click="confirmSelect">手动获取</el-button>
					<el-button icon="fa fa-save" @click="autoSelect">自动获取</el-button>
					<el-button icon="el-icon-view" @click="tipsIsShow">{{button.tips.txt}}
					</el-button> -->
					<el-tooltip content="自动获取" placement="top">
						<el-form-item label="自动获取" label-width="69px">
							<el-switch v-model="button.isAutoSelect.status" @change="isAutoSelectChange">
							</el-switch>
						</el-form-item>
					</el-tooltip>

				</el-col>
				<el-col :span="24" v-show="button.tips.isShow">
					<el-form-item label="" label-width="0px">
						<el-alert center type="info" :closable="false" show-icon>
							<template slot='title'>
								<div class="iconSize">提示:</div>
								<div class="iconSize">1、添加请先选择对应的文件载入网页表格中,默认会以有数据和边框的区域获取参数模板.</div>
								<div class="iconSize">2、如有需要可以手动关闭自动选择,关闭后载入文件后将不自动获取,需要手动选择区域后点击手动获取</div>
								<div class="iconSize">3、如果自动获取到的模板有问题可以手动选择区域范围后点击手动选择</div>
							</template>
						</el-alert style="width: 100%;">
					</el-form-item>
				</el-col>
			</el-row>

		</el-form>
		<!-- <iframe src="#/luckSheetTemplate" ref="iframeTemplate" :style="iframeStyle" v-if="IsrefreshIframe"></iframe> -->
		<iframe src="/TemplateLuckySheet.html" ref="iframeTemplate" :style="iframeStyle"
			v-if="IsrefreshIframe"></iframe>
		<input style="font-size:16px;" type="file" ref="fileSelect" @change="uploadExcel" v-show="false" />
		<!-- <div style="position: absolute;height: 100%;width:80%;top:35%;bottom: 0px">
			<div id="luckysheet" ref="luckysheet"
				style="margin:0px;padding:0px;position:absolute;width:100%;height: 100%;left: 0px;top:0px;bottom:0px">
			</div>
		</div> -->
		<el-dialog title="查看模板" :visible.sync="dialog.Visible" width="80%" append-to-body top="3vh" center>

			<el-row>
				<div :style="dialog.richstyle.style">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" justify="center">
						<el-container>
							<el-main>
								<div v-html="dialog.form.template" class="rich"
									style="margin-left: auto;margin-right: auto;text-align: center;width: 50%;">
								</div>
							</el-main>
						</el-container>

					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<el-tooltip class="item" effect="dark" content="隐藏模板代码" placement="top-start"
							v-if="dialog.hidetextarea">
							<i class="fa fa-arrow-down" aria-hidden="true"
								style="float: right;margin-right: 25px; padding-bottom: 5px;color: blue;"
								@click="hidetextarea"></i>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="显示模板代码" placement="top-start" v-else>
							<i class="fa fa-arrow-up" aria-hidden="true"
								style="float: right;margin-right: 25px; padding-bottom: 5px;color: blue;"
								@click="hidetextarea"></i>
						</el-tooltip>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="dialog.hidetextarea">
						<!-- 引用插件 -->
						<VueDataEditor @input="codeChange" :value="dialog.form.template" :disable="false"
							:width="'100%'" :height="'300px'" type="HTML">
						</VueDataEditor>
						<!-- <el-input type="textarea" placeholder="请输入内容" v-model="dialog.form.template"
							:autosize="{ maxRows: 10}">
						</el-input> -->
					</el-col>
				</div>
			</el-row>



			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialog.Visible = false">关闭</el-button>
			</span>
		</el-dialog>
	</div>


</template>
<script>
	import {
		doEdit,
		ExecSql,
		QueryExec
	} from '@/api/table'
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		ViewfileUrl,
		UploadFileNameUrl
	} from '@/utils/servicefile'
	import {
		TreeDataDeal,
		TreeDataDealEx
	} from '@/global/tree_deal'
	import {
		judgeVariableType,
		variableInfo,
		judgeVariableIsEmptyOrNull
	} from '@/utils/base.helper'
	import {
		ZlibHelper
	} from '@/global/zlibHelper'
	import {
		isNumEx
	} from '@/utils/validate'
	import VueDataEditor from '@/components/editor/vue_data_editor/vue_data_editor'
	import tempupload from '@/components/Upload/uploadNameDivide'
	export default {
		name: 'TableEdit',
		components: {
			tempupload,
			VueDataEditor,
		},
		computed: {
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
		props: { //props列表
			father: {
				type: Object,
				required: false
			}
		},
		data() {
			return {
				IsrefreshIframe: true,
				selectFileJson: '',
				iframe: {
					addEventListener: false,
					style: {
						height: '85%',
						width: '99%'
					}
				},
				button: {
					tips: {
						isShow: true,
						txt: '隐藏提示',
						txtList: ['隐藏提示', '查看提示']
					},
					isAutoSelect: {
						status: true,
					}
				},
				dialog: {
					Visible: false,
					hidetextarea: false,
					richstyle: {
						style: 'max-height: calc(84vh - 100px); overflow-y: auto;',
						style70: 'max-height: calc(84vh - 100px); overflow-y: auto;',
						style60: 'max-height: calc(84vh - 100px); overflow-y: auto;',
					},
					form: {
						template: '',
					}
				},
				form: {
					param_id: '',
					file_name: '',
					file_version: '',
					temp_file: '',
					template_name: '',
					template_version: '',
					entry_sheet: '',
					mixed_sheet: '',
					order_sheet: '',
					record_sheet: '',
					report_sheet: '',
					code_prefix: '',
					check_sheet: '',
					update_version: '',
					script_version: '',
					template_json: '',
					template_class: '',
					object_id: '',
					template_id: '',
          tpl_class: ''
				},
				formLabelWidth: '85px',
				formloading: true,
        templateold: true,
				title: '',
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						temp_file: 21
					},
					type_str: 'jpg/pdf/png/jpeg/json/xlsx',
					type_array: ['image/jpeg', 'image/png', 'application/pdf', 'application/json', 'application/xlsx'],
					file_size: '4',
					size_unit: 'MB',
					original_name: {
						temp_file: {}
					},
					success: {
						temp_file: false
					},
					old_delete: {
						temp_file: false
					},
					fill_data: {
						temp_file: []
					},
					fileName: {
						temp_file: ''
					}
				},
        selectData: {
        	supervisee: [],
        },
        selectQuery: {
        	supervisee: {
        		query: '',
        		page: 0,
        		set: new Set(),
        	},
        },
				rules: {
					template_name: [{
						required: true,
						trigger: 'blur',
						message: '请输入模板名称'
					}],
					template_version: [{
							required: true,
							trigger: 'blur',
							message: '请输入版本'
						},
						{
							trigger: ['blur', 'change'],
							validator: function(rule, value, callback) {
								if (!isNumEx(value)) {
									callback(new Error('版本只能为数字'))
								} else {
									callback()
								}
							}

						}
					]
				},
				selectData: {
					supervisee: [],
				},
				selectQuery: {
					supervisee: {
						query: '',
						page: 0,
						set: new Set(),
					},
				},
			}
		},
		created() {
			this.init()

		},
		methods: {
			init() {
				if (this.father) {
					this.form = Object.assign({}, this.father)
				}
				this.getPostMessage()
				this.isAutoSelectChange()
				this.tipsIsShow(undefined, this.button.tips.isShow)
				this.ManualPaste()
			},
      async templatechange(row) {
        this.formloading = true
        let sData
        sData = '[Q]483{'+row.template_id+'}|^SYS'
        const res = await QueryExec(sData)
        this.form.template_json=res.data[0].template_json
        this.form.template_version=res.data[0].template_version
        setTimeout(() => {
        	this.formloading = false
        }, 500)
      },
			fileUploadRefs() {
				return ["temp_file"]
			},
			SetIframeStyle(key, value) {
				if (!key) {
					return -1
				}
				this.iframe.style[key] = value
			},
			hidetextarea() {
				this.$set(this.dialog, 'hidetextarea', !this.dialog.hidetextarea)

				if (this.dialog.hidetextarea) {
					this.dialog.richstyle.style = this.dialog.richstyle.style60
				} else {
					this.dialog.richstyle.style = this.dialog.richstyle.style70
				}
			},
      getPersonListMore() {
      	this.getPersonList(
      		this.selectQuery.supervisee.query,
      		this.selectQuery.supervisee.page
      	)
      },
      //被监督人数组 ，搜索和懒加载
      async getPersonList(query, page) {
      	let that = this
      	console.log(query, page)
      	if (typeof query == 'undefined') {
      		query = ''
      	} else {
      		that.selectQuery.supervisee.query = query
      	}
      	if (!page) {
      		that.selectQuery.supervisee.page = 0
      		page = 0
      	}
      	let sData
      	sData = '[Q]479{%' + query + '%$`' + ((Number(page)) * 10).toString() + '$`10}|^SYS'
      	const res = await QueryExec(sData)
      	const data = res.data

      	console.log(sData)
      	//if (typeof query != 'undefined') {
      	//	this.selectData.supervisee = data
      	//} else {
      	if (page === 0) {
      		that.selectData.supervisee = []
      		that.selectQuery.supervisee.set = new Set()
      		// console.log(that.selectQuery.supervisee)
      		for (let i = 0; i < data.length; i++) {
      			if (!that.selectQuery.supervisee.set.has(data[i].item_id)) {
      				that.selectData.supervisee.push(data[i])
      				that.selectQuery.supervisee.set.add(data[i].item_id)
      			}
      		}
      		// console.log(that.selectData.supervisee)
      	} else {
      		// console.log(data)
      		for (let i = 0; i < data.length; i++) {

      			if (!that.selectQuery.supervisee.set.has(data[i].item_id)) {
      				that.selectData.supervisee.push(data[i])
      				that.selectQuery.supervisee.set.add(data[i].item_id)
      			}
      		}
      	}

      	that.selectQuery.supervisee.page++
      	//}
      	console.log(that.selectQuery.supervisee)
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

							clearInterval(index)
							callback(flag)
						}
					}, 500)
				} catch (e) {
					console.log(e)
				}
			},
			tipsIsShow(event, isShow) {

				if (typeof isShow == 'undefined') {
					isShow = !this.button.tips.isShow
				}
				if (typeof isShow != 'boolean') {
					if (isShow) {
						isShow = true
					} else {
						isShow = false
					}
				}
				this.$nextTick(() => {
					this.$set(this.button.tips, 'isShow', isShow)
				})

				if (isShow) {
					this.SetIframeStyle('height', '71%')
					this.button.tips.txt = this.button.tips.txtList[0]
				} else {
					this.SetIframeStyle('height', '85%')
					this.button.tips.txt = this.button.tips.txtList[1]
				}
				this.postMessage('resizeLuckSheet')

			},
			isAutoSelectChange(isAutoSelect) {
				if (typeof isAutoSelect == 'undefined') {
					isAutoSelect = this.button.isAutoSelect.status
				}
				if (typeof isAutoSelect != 'boolean') {
					if (isAutoSelect) {
						isAutoSelect = true
					} else {
						isAutoSelect = false
					}
				}
				this.postMessage('isAutoSelect', isAutoSelect)
			},
			codeChange(val) {
				this.dialog.form.template = val
			},
			unzipTemplate() {
				let unzip = ''
				try {
					if (this.form.template_json) {
						unzip = luckysheet.unzip(this.form.template_json)
					}
				} catch (e) {
					console.log(e)
				}
				if (!unzip) {
					this.$notify.error({
						title: '错误',
						message: '解密失败或模板内容为空'
					});
					return
				}
				this.dialog.form.template = unzip
				this.dialog.Visible = true
			},
      displayold(row) {
				let that = this
				that.formloading = true
				that.form.object_id = row.object_id
				console.log(row)
				setTimeout(() => {
					that.formloading = false
				}, 500)
			},
			displayadd(row) {
				let that = this
				that.formloading = true
				that.form.object_id = row.object_id
				console.log(row)
				setTimeout(() => {
					that.formloading = false
				}, 500)
			},
			display(row) {
				let that = this
				that.formloading = true
				that.form = row
				that.form.object_id = row.object_id
				that.ManualPaste(row.template_json)
				setTimeout(() => {
					that.formloading = false
				}, 500)
			},
			refreshIframe() {
				let that = this
				this.$baseConfirm('确定重载表格？', null, async () => {
					that.iframe.addEventListener = false
					this.$set(this, 'IsrefreshIframe', !this.IsrefreshIframe)
					this.$nextTick(() => {
						this.$set(this, 'IsrefreshIframe', !this.IsrefreshIframe)
						if (this.selectFileJson && !this.iframe.error) {
							setTimeout(() => {
								that.postMessage('file', that.selectFileJson)
							}, 500)

						}
					})
				})

			},
			folderOpen() {
				this.$refs['fileSelect'].click()
			},
			autoSelect() {
				this.postMessage('autoSelect', true)
			},
			confirmSelect() {
				this.postMessage('ManualCopy', true)
			},
			uploadExcel(event) {
				const files = event.target.files;
				if (files == null || files.length == 0) {
					this.$notify({
						title: '提示',
						message: '没有文件需要导入',
						type: 'warning'
					});
					return;
				}
				let name = files[0].name;
				let suffixArr = name.split("."),
					suffix = suffixArr[suffixArr.length - 1];
				if (suffix != "xlsx") {
					this.$notify({
						title: '提示',
						message: '当前只支持 xlsx文件',
						type: 'warning'
					});
					return;
				}
				this.selectFileJson = files
				this.postMessage('file', files)
			},
			ManualPaste(txt) {
				if (!txt) {
					txt = this.form.template_json
				}
				if (!txt) {
					return
				}
				this.postMessage('ManualPaste', txt)
			},
			postMessage(messageTpye, postData) {
				let that = this
				return new Promise((resolve, reject) => {
					try {
						let index = setInterval(function() {
							if (that.$refs.iframeTemplate && that.iframe.addEventListener) {
								clearInterval(index)
								console.log('postMessage', messageTpye, postData)
								// 只有在 iframe 加载时传递数据给子组件，$refs 才是非空的
								that.$refs.iframeTemplate.contentWindow.postMessage({
									messageTpye: messageTpye,
									postData: postData
								}, '*');
								resolve(true)
							}
						})
					} catch (e) {
						reject(false, e)
					}

				})

			},
			updateTemplateJson(json) {
				this.form.template_json = json
				this.$notify({
					title: '提示',
					message: '获取所选模板成功',
					type: 'success'
				});
			},
			notify(message, type) {
				if (!message) {
					return
				}
				if (!type) {
					type = 'success'
				}

				this.$notify({
					title: '提示',
					message: message,
					type: type
				});
			},
			getPostMessage() {
				let _this = this
				window.addEventListener('message', function(e) {
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
							}
							break
						case variableInfo.function.name:

							break
						case variableInfo.boolean.name:

							break
					}
				})
			},
			save() {
				let that = this
				console.log(that.form)
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						// await that.$refs['temp_file'].setFileName(that.form.template_name + '-' + that.form
						// 	.template_version)
						// that.fileUpload(async function(status) {
						let sData = '[Q]436{' + that.form.template_name + '$`' +
							that.form.entry_sheet + '$`' + that.form.mixed_sheet + '$`' + that.form
							.order_sheet + '$`' + that.form.record_sheet + '$`' +
							that.form.report_sheet + '$`' + that.form.code_prefix + '$`' + that.form
							.temp_file + '$`' + that.form.check_sheet + '$`' +
							that.form.template_version + '$`' + that.form.update_version +
							'$`' + that.form.script_version + '$`' + that.form.template_json +
							'$`0$`0$`'+that.form.template_class+'}|^2|^SYS'
						console.log(sData)
						const res = await ExecSql(sData)
						if (res > 0) {
							let sData1 = '[Q]492{' + that.form.object_id + '$`' + res + '$`' + that.form.tpl_class +
								'}|^2|^SYS'
							console.log(sData1)
							const res1 = await ExecSql(sData1)
							if (res1 > 0) {
								that.$baseMessage('模板添加成功', 'success')
								that.$refs['form'].resetFields()
								that.$emit('close_comp')
							} else {
								that.$baseMessage('模板添加失败', 'error')
							}
						} else {
							that.$baseMessage('模板添加失败', 'error')
						}
						// })
					} else {
						return false
					}
				})
			},
			editsave() {
				let that = this
				this.$refs['form'].validate(async (valid) => {

					if (valid) {
						// await that.$refs['temp_file'].setFileName(that.form.template_name + '-' + that.form
						// 	.template_version)
						// that.fileUpload(async function(status) {
						let sData = '[Q]475{' + that.form.template_name + '$`' +
							that.form.template_version + '$`' + that.form.template_json + '$`' + that.form
							.template_id +
							'}|^1|^SYS'
						console.log(sData)
						const res = await ExecSql(sData)

						if (res > 0) {
							that.$baseMessage('模板修改成功', 'success')
							that.$refs['form'].resetFields()
							that.$emit('close_comp')
						} else {
							that.$baseMessage('模板修改失败', 'error')
						}
						// })
					} else {
						that.$baseMessage('校验失败', 'error')
						return false
					}
				})
			}
		},
	}
</script>
<style>
	.luckysheet-cols-menu {
		z-index: 9004;
	}

	.luckysheet-input-box {
		z-index: 3000
	}
</style>
