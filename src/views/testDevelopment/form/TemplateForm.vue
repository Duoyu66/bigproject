<template>
	<div style="height:calc(78vh)" id="templateDiv" ref="templateDiv">
		<el-form ref="form" :model="form" :rules="rules" style="padding-right: 1%;">
			<el-row>
				<el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
					<el-form-item label="模板名称" :label-width="formLabelWidth" prop="template_name">
						<el-input v-model="form.template_name" style="width: 100%;" v-if="templateold"></el-input>
						<el-select v-model="form.template_name" style="width: 100%;" filterable remote placeholder="请输入关键词" v-else
							@change="templatechange" :remote-method="getPersonList" v-loadmore="getPersonListMore">
							<el-option v-for="item in selectData.supervisee" :key="item.item_id" :label="item.item_name"
								:value="item.item_id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
					<el-form-item label="模板行业" :label-width="formLabelWidth" prop="tpl_id">
						<el-select v-model="form.tpl_id" style="width: 100%;" placeholder="请选择行业...">
							<el-option v-for="data in selectData.tpl_id" :key="data.key" :label="data.value"
								:value="data.key">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
        	<el-form-item label="模板版本" :label-width="formLabelWidth" prop="template_version">
        		<el-input v-model="form.template_version" style="width: 100%;"></el-input>
        	</el-form-item>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
          <el-form-item label="进场页号" :label-width="formLabelWidth" prop="entry_sheet">
          	<el-select v-model="form.entry_sheet" multiple placeholder="请选择">
          	  <el-option
          	    v-for="item in numoptions"
          	    :key="item.value"
          	    :label="item.label"
          	    :value="item.value">
          	  </el-option>
          	</el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
          <el-form-item label="委托页号" :label-width="formLabelWidth" prop="order_sheet">
          	<el-select v-model="form.order_sheet" multiple placeholder="请选择">
          	  <el-option
          	    v-for="item in numoptions"
          	    :key="item.value"
          	    :label="item.label"
          	    :value="item.value">
          	  </el-option>
          	</el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
          <el-form-item label="记录页号" :label-width="formLabelWidth" prop="record_sheet">
          	<el-select v-model="form.record_sheet" multiple placeholder="请选择">
          	  <el-option
          	    v-for="item in numoptions"
          	    :key="item.value"
          	    :label="item.label"
          	    :value="item.value">
          	  </el-option>
          	</el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
          <el-form-item label="报告页号" :label-width="formLabelWidth" prop="report_sheet">
          	<el-select v-model="form.report_sheet" multiple placeholder="请选择">
          	  <el-option
          	    v-for="item in numoptions"
          	    :key="item.value"
          	    :label="item.label"
          	    :value="item.value">
          	  </el-option>
          	</el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
          <el-form-item label="报验页号" :label-width="formLabelWidth" prop="check_sheet">
          	<el-select v-model="form.check_sheet" placeholder="请选择">
          	  <el-option
          	    v-for="item in numoptions"
          	    :key="item.value"
          	    :label="item.label"
          	    :value="item.value">
          	  </el-option>
          	</el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
          <el-form-item label="配比页号" :label-width="formLabelWidth" prop="mixed_sheet">
          	<el-select v-model="form.mixed_sheet" placeholder="请选择">
          	  <el-option
          	    v-for="item in numoptions"
          	    :key="item.value"
          	    :label="item.label"
          	    :value="item.value">
          	  </el-option>
          	</el-select>
          </el-form-item>
        </el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="false">
					<el-form-item label="模板" :label-width="formLabelWidth">
						<el-input placeholder="" v-model="form.template_json" class="input-with-select"
							readonly="readonly" disabled>
						</el-input>
					</el-form-item>
				</el-col>

			</el-row>

		</el-form>
    <el-row>
      <el-col :span="16">
        <div style="width: 99%;">
          <el-row>
            <el-col :span="button.tips.isShow?6:24">
              <el-row class="toolbar">
                <el-col :span="toolbarRowSpan" style=" padding-bottom: 5px;">
                  <el-tooltip class="item" effect="dark" :content="button.tips.txt" placement="top-start">
                    <el-button :icon="button.tips.isShow?'fa fa-eye-slash':'el-icon-view' "
                      @click="tipsIsShow" class="el-custuom-button">
                      {{button.tips.txt}}
                    </el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="toolbarRowSpan" style=" padding-bottom: 5px;">
                  <el-tooltip class="item" effect="dark" content="查看所选模板" placement="top-start">
                    <el-button icon="el-icon-view" @click="unzipTemplate" class="el-custuom-button">
                      查看模板</el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="toolbarRowSpan" style=" padding-bottom: 5px;">
                  <el-tooltip class="item" effect="dark" content="重载表格" placement="top-start">
                    <el-button icon="el-icon-refresh" @click="refreshIframe" class="el-custuom-button">重载表格
                    </el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="toolbarRowSpan" style=" padding-bottom: 5px;">
                  <el-tooltip class="item" effect="dark" content="选择文件,仅支持xlsx" placement="top-start">
                    <el-button icon="el-icon-folder-opened" @click="folderOpen" class="el-custuom-button">
                      选择文件</el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="toolbarRowSpan" style=" padding-bottom: 5px;">
                  <el-tooltip class="item" effect="dark" content="手动选择区域后获取模板" placement="top-start">
                    <el-button icon="fa fa-save" @click="confirmSelect" class="el-custuom-button">手动获取
                    </el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="toolbarRowSpan" style=" padding-bottom: 5px;">
                  <el-tooltip class="item" effect="dark" content="自动获取选择区域后获取模板" placement="top-start">
                    <el-button icon="fa fa-save" @click="autoSelect" class="el-custuom-button">自动获取
                    </el-button>
                  </el-tooltip>
                </el-col>

                <el-col :span="toolbarRowSpan" style=" padding-bottom: 5px;margin-top: 4px;">
                  <el-tooltip content="自动获取" placement="top">
                    <el-switch v-model="button.isAutoSelect.status" active-text="自动获取"
                      @change="isAutoSelectChange">
                    </el-switch>
                  </el-tooltip>
                </el-col>
                <el-col :span="toolbarRowSpan" style=" padding-bottom: 5px;margin-top: 4px;">
                  <el-tooltip content="多sheet获取" placement="top">
                    <el-switch v-model="button.isMultipleSelect.status" active-text="多sheet获取"
                      @change="isMultipleSelectChange">
                    </el-switch>
                  </el-tooltip>
                </el-col>
              </el-row>
              <!-- 					<div id="toolbar" style="padding-bottom: 5px;">
                <div class="el-custuom-button">

                </div>
              </div> -->
            </el-col>
            <el-col :span="button.tips.isShow?18:0" v-show="button.tips.isShow">
              <div style="padding-bottom: 5px;">
                <el-alert center type="info" :closable="false" show-icon style="width: 100%;">
                  <template slot='title'>
                    <div class="iconSize">提示:</div>
                    <div class="iconSize">1、添加请先选择对应的文件载入网页表格中,默认会以有数据和边框的区域获取参数模板.</div>
                    <div class="iconSize">2、如有需要可以手动关闭自动选择,关闭后载入文件和手动选取区域后将不自动获取,需要手动选择区域后点击手动获取或者自动获取</div>
                    <div class="iconSize">3、如果自动获取到的模板有问题可以手动选择区域范围后点击手动选择</div>
                    <div class="iconSize">4、防止操作卡顿，只会在开启自动选择后进行载入文件和选择区域会进行自动同步，其余在表格里的操作不会自动同步到模板里</div>
                    <div class="iconSize">5、启用多页获取会自动关闭自动获取</div>
                  </template>
                </el-alert>
              </div>
            </el-col>
          </el-row>



        </div>
        <!-- <iframe src="#/luckSheetTemplate" ref="iframeTemplate" :style="iframeStyle" v-if="IsrefreshIframe"></iframe> -->
        <iframe src="/TemplateLuckySheet.html" ref="iframeTemplate" :id="iframe.domid"
          class="iframeTemplate TemplateLuckySheet" :style="iframeStyle" v-if="IsrefreshIframe"></iframe>
        <input style="font-size:16px;" type="file" ref="fileSelect" @change="uploadExcel" v-show="false" />
      </el-col>
      <el-col :span="8">
        <el-col :span="24">
          <h3>判定代码</h3>
        </el-col>
        <el-col :span="24">
          <el-input v-model="form.judge_proc" style="width: 100%;" type="textarea" :rows="50"></el-input>
        </el-col>

      </el-col>
    </el-row>
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

		<el-dialog :title="dialogSheet.title" :visible.sync="dialogSheet.dialogVisible" width="50%" append-to-body>
			<el-form :model="dialogSheet.form">
				<el-form-item label="" label-width="0px">
					<el-checkbox v-model="dialogSheet.form.checkAll" :indeterminate="dialogSheet.isIndeterminate"
						@change="handleCheckAllChange">全选
					</el-checkbox>
					<div style="margin: 15px 0;"></div>
					<el-checkbox-group v-model="dialogSheet.form.sheet_id" @change="handleCheckedCitiesChange">
						<el-checkbox v-for="sheet in dialogSheet.check.sheet_id" :label="sheet.order"
							:key="sheet.order">
							{{sheet.name}}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>

			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogSheet.dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogSheetSave">确 定</el-button>
			</span>
		</el-dialog>
	</div>


</template>
<script>
	let messageListener = '';
	let vue_that = '';
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
  import {
  	GetGroupData,
  	GetGroupDataEx,
  	GetGroupDataEx2,
  	GetGroupDataCustomEx
  } from '@/utils/htmlDataGroup'
	import VueDataEditor from '@/components/editor/vue_data_editor/vue_data_editor'
	import tempupload from '@/components/Upload/uploadNameDivide'

	import templateSheetTips from '../lucksheet/templateSheetTips.vue'
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
			},
			toolbarRowSpan() {
				if (this.button.tips.isShow) {
					return 12
				}
				return 3
			}
		},
		watch: {
			IsrefreshIframe(newVal, oldVal) {
				if (newVal) {
					this.postMessage('open', true)
					this.getPostMessage()
					this.isAutoSelectChange()
					this.isMultipleSelectChange()
				}
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
				toolbar: {
					span: 6,
				},
				close: false,
				templateold: true,
				IsrefreshIframe: false,
				selectFileJson: '',
				iframe: {
					addEventListener: false,
					style: {
						height: '80%',
						width: '99%'
					},
					domid: '',
				},
        numoptions: [
          {label:'1',value:'1'},
          {label:'2',value:'2'},
          {label:'3',value:'3'},
          {label:'4',value:'4'},
          {label:'5',value:'5'},
          {label:'6',value:'6'},
          {label:'7',value:'7'},
          {label:'8',value:'8'},
          {label:'9',value:'9'},
          {label:'10',value:'10'},
          {label:'11',value:'11'},
          {label:'12',value:'12'},
          {label:'13',value:'13'},
          {label:'14',value:'14'},
          {label:'15',value:'15'},
          {label:'16',value:'16'},
          {label:'17',value:'17'},
          {label:'18',value:'18'},
          {label:'19',value:'19'},
        ],
        reportsymbol: false,
        oldsymbol: false,
				button: {
					tips: {
						isShow: true,
						txt: '隐藏提示',
						txtList: ['隐藏提示', '查看提示']
					},
					isAutoSelect: {
						status: true,
					},
					isMultipleSelect: {
						status: false,
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
				dialogSheet: {
					isManual: true,
					dialogVisible: false,
					title: '提示',
					width: '30%',
					isIndeterminate: true,
					check: {
						sheet_id: []
					},
					form: {
						checkAll: true,
						sheet_id: []
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
          tpl_id: '',
					object_id: '',
					template_id: '',
          tpl_class: '',
          judge_proc: ''
				},
				formLabelWidth: '85px',
				formloading: true,
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
          tpl_id: []
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
                var reg = /^(-?\d+)(\.\d+)?$/;
                if (!reg.test(value)) {
                  callback(new Error('请输入数字'));
                } else {
                  callback();
                }
							}

						}
					]
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
			//this.createLuckSheet()
		},
		destroyed() {
			console.log('template destroyed')
		},
		beforeDestroy() {
			console.log('template beforeDestroy')
			this.getPostMessage({
				isAddEventListener: false
			})
		},
		methods: {

			GetDomID() {
				let that = this
				let dom_list = document.getElementsByClassName('TemplateLuckySheet')
				let max = 0;
				let reg = /\d+/g;
				for (let i = 0; i < dom_list.length; i++) {
					let item = dom_list[i]
					let id = item.id;
					let numList = id.match(reg);

					if (numList == null) {
						continue
					}
					let temp = parseFloat(numList.join(""));
					if (max < temp) {
						max = temp
					}
				}
				this.iframe.domid = 'iframetempate' + (max + 1)
				return 'iframetempate' + (max + 1)
			},
			init() {
				// if (this.father) {
				// 	this.form = Object.assign({}, this.form, this.father)
				// }

				this.refreshIframe(undefined, true)
				this.close = false
				this.tipsIsShow(undefined, this.button.tips.isShow)
        this.GetGroupEx()
				//this.ManualPaste()
			},
      async GetGroupEx() {
      	let list = [{
      		data: "tpl_id",
      		sqlcode: 241
      	}];
      	await GetGroupDataCustomEx(this, list)
      },
			async templatechange(val) {
				this.formloading = true
				let sData
				sData = '[Q]483{' + val + '}|^SYS'
				const res = await QueryExec(sData)
        console.log(sData)
				this.form.template_json = res.data[0].template_json
				this.form.template_version = res.data[0].template_version
        this.form.template_name = res.data[0].template_name
        this.form.template_id = val
        this.ManualPaste(this.form.template_json)
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
				sData = '[Q]479{%' + query + '%$`3$`' + ((Number(page)) * 10).toString() + '$`10}|^SYS'
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
					this.SetIframeStyle('height', '800px')
					this.button.tips.txt = this.button.tips.txtList[0]
				} else {
					this.SetIframeStyle('height', '950px')
					this.button.tips.txt = this.button.tips.txtList[1]
				}
				this.postMessage('resizeLuckSheet')

			},
			isMultipleSelectChange(isMultipleSelect) {
				if (typeof isMultipleSelect == 'undefined') {
					isMultipleSelect = this.button.isMultipleSelect.status
				} else {
					this.button.isMultipleSelect.status = isMultipleSelect
				}
				if (typeof isMultipleSelect != 'boolean') {
					if (isMultipleSelect) {
						isMultipleSelect = true
					} else {
						isMultipleSelect = false
					}
				}
				this.postMessage('isMultipleSelectChange', isMultipleSelect)
				if (isMultipleSelect) {
					this.isAutoSelectChange(false)
				}
			},
			isAutoSelectChange(isAutoSelect) {
				if (typeof isAutoSelect == 'undefined') {
					isAutoSelect = this.button.isAutoSelect.status
				} else {
					this.button.isAutoSelect.status = isAutoSelect
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
				that.form.template_name = row.template_name
				that.form.template_version = row.template_version
				that.form.template_json = row.t_json
				that.form.template_class = '1'
        that.oldsymbol = true
				that.ManualPaste(row.t_json)
				setTimeout(() => {
					that.formloading = false
				}, 500)
			},
      displayreportold(row) {
				let that = this
				that.formloading = true
				that.reportsymbol = true
				that.form.object_id = row.object_id
				that.form.template_class = '3'
        that.oldsymbol = true
        that.templateold = false
        that.form.judge_proc=ZlibHelper.DeCompressInterData_fob(that.form.judge_proc)
				// that.ManualPaste(row.template_json)
				setTimeout(() => {
					that.formloading = false
				}, 500)
			},
			displayadd(row) {
				let that = this
				that.formloading = true
				that.form.template_class = '1'
				console.log(row)
				setTimeout(() => {
					that.formloading = false
				}, 500)
			},
      displayaddreport(row) {
      	let that = this
      	that.formloading = true
        that.reportsymbol = true
        that.form.object_id = row.object_id
      	that.form.template_class = '3'
      	console.log(row)
      	setTimeout(() => {
      		that.formloading = false
      	}, 500)
      },
      displayreport(row) {
      	let that = this
      	that.formloading = true
        that.reportsymbol = true
      	that.form.template_name = row.template_name
      	that.form.template_version = row.template_version
      	that.form.template_json = row.t_json
        console.log(row.t_json)
        that.form.entry_sheet=row.entry_sheet.split(',')
        that.form.mixed_sheet=row.mixed_sheet.split(',')
        that.form.order_sheet=row.order_sheet.split(',')
        that.form.record_sheet=row.record_sheet.split(',')
        that.form.report_sheet=row.report_sheet.split(',')
        that.form.check_sheet=row.check_sheet.split(',')
        that.form.tpl_id=row.tpl_id
      	that.form.object_id = row.object_id
        that.form.template_id = row.id
        that.form.judge_proc=ZlibHelper.DeCompressInterData_fob(row.judge_proc)
      	that.ManualPaste(row.t_json)
      	setTimeout(() => {
      		that.formloading = false
      	}, 500)
      },
      display(row) {
      	let that = this
      	that.formloading = true
      	that.form = row
      	that.ManualPaste(row.t_json)
      	setTimeout(() => {
      		that.formloading = false
      	}, 500)
      },
			refreshIframe(event, isTips) {
				let that = this
				this.GetDomID()
				if (!isTips) {
					this.$baseConfirm('确定重载表格？', null, async () => {
						refresh()
					})
				} else {
					refresh()
				}
				async function refresh() {
					//await  that.postMessage('close')
					that.iframe.addEventListener = false
					that.$set(that, 'IsrefreshIframe', false)

					that.$nextTick(async () => {
						//await that.postMessage('open')
						that.$set(that, 'IsrefreshIframe', true)

						if (that.selectFileJson && !that.iframe.error) {
							setTimeout(() => {

								that.postMessage('file', that.selectFileJson)
							}, 500)

						}
					})
				}
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
				let id = this.iframe.domid
				return new Promise((resolve, reject) => {
					try {
						let index = setInterval(function() {
							if (that.$refs.iframeTemplate && that.iframe.addEventListener) {
								clearInterval(index)
								console.log('postMessage', messageTpye, postData)
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
			updateTemplateJson(json) {
				this.form.template_json = json

				this.notify('获取所选模板成功', 'success')

			},
			MultipleSelectDialog(Option) {
				// let id = this.$layer.open({
				// 	type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
				// 	content: {
				// 		content: templateSheetTips,
				// 		parent: this,
				// 		data: {
				// 			sheet_info: Option.check.sheet_id
				// 		}
				// 	},
				// 	//content: this.$('#entrustAdd'),
				// 	btn: '确定',
				// 	area: ['30%', '30%'],
				// 	title: '提示信息',
				// 	maxmin: true,
				// 	shade: false,
				// 	resize: true,
				// 	shadeClose: false,
				// 	cancel: () => { //关闭弹窗事件
				// 		console.log('关闭iframe')
				// 	}
				// });
				this.dialogSheet.isManual = Option.isManual
				this.$set(this.dialogSheet.check, 'sheet_id', Option.check.sheet_id)
				this.handleCheckAllChange(true)
				this.dialogSheet.dialogVisible = true
			},
			dialogSheetSave() {
				let sheet_id = this.dialogSheet.form.sheet_id

				if (this.dialogSheet.form.sheet_id.length == 0) {
					this.notify('没有选择需要复制的内容', 'info')
					return
				}

				function sort(a, b) {
					return a - b
				}
				sheet_id = JSON.parse(JSON.stringify(sheet_id))
				sheet_id.sort(sort)
				if (this.dialogSheet.isManual) {
					this.postMessage('MultipleSheetSave', this.dialogSheet.form.sheet_id)
				} else {
					let length = sheet_id.length
					let sheet_list = this.dialogSheet.check.sheet_id
					let select = {}
					for (let i = 0; i < length; i++) {
						let order = sheet_id[i]
						for (let j = 0; j < sheet_list.length; j++) {
							let item = sheet_list[j]
							if (item.order == order && item.area.length > 0) {
								console.log(item)
								select[order] = {
									colRange: item.area[0].column,
									rowRange: item.area[0].row
								}
							}
						}
					}
					let flag = false
					for (let key in select) {
						if (select[key]) {
							flag = true
							break
						}
					}
					console.log('dialogSheetSave', select)
					if (flag) {
						this.postMessage('ManualSheetSave', select)
					} else {
						this.notify('没有需要复制的内容', 'info')
					}
				}
				this.dialogSheet.dialogVisible = false
			},
			handleCheckAllChange(val) {
				let select_sheet = []
				if (val) {
					let sheet_id = 0
					let sheet_list = this.dialogSheet.check.sheet_id
					let length = sheet_list.length

					for (let i = 0; i < length; i++) {
						select_sheet.push(sheet_list[i].order)
					}
				}
				this.dialogSheet.form.sheet_id = select_sheet
				this.dialogSheet.isIndeterminate = false;
			},
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.dialogSheet.form.checkAll = checkedCount === this.dialogSheet.check.sheet_id.length;
				this.dialogSheet.isIndeterminate = checkedCount > 0 && checkedCount < this.dialogSheet.check.sheet_id
					.length;
			},
			notify(message, type) {
				if (!message) {
					return
				}
				if (!type) {
					type = 'success'
				}
				if (this.close) {
					return
				}
				this.$notify({
					title: '提示',
					message: message,
					type: type
				});
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
					messageListener = function(e) {
						if (_this.close) {
							window.removeEventListener('message', messageListener)
							return
						}
						let data = e.data
						let IsEmptyOrNull = judgeVariableIsEmptyOrNull(data)
						if (IsEmptyOrNull) {
							return
						}
						let type = judgeVariableType(data)
						let typeofdata = typeof data
						console.log('templateform getPostMessage', data)
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
						}
					}
				}, 400)
			},
			closeChange(status) {
				if (!status) {
					status = true
				}
				this.close = status
				console.log('closeChange', status)
				this.postMessage('close', status)
			},
			save() {
				let that = this
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						// await that.$refs['temp_file'].setFileName(that.form.template_name + '-' + that.form
						// 	.template_version)
						// that.fileUpload(async function(status) {
            that.form.judge_proc=ZlibHelper.String2EncrbytesBase64_fob(that.form.judge_proc)
						let sData = '[Q]436{' + that.form.object_id + '$`'+ that.form.template_name + '$`' +
							that.form.entry_sheet + '$`' + that.form.mixed_sheet + '$`' + that.form
							.order_sheet + '$`' + that.form.record_sheet + '$`' +
							that.form.report_sheet + '$`' + that.form.code_prefix + '$`' + that.form.check_sheet + '$`' +
							that.form.template_version + '$`' + that.form.update_version +
							'$`' + that.form.script_version + '$`' + that.form.template_json +
							'$`'+that.form.tpl_id+'$`'+that.form.judge_proc+'}|^2|^SYS'

						const res = await ExecSql(sData)
            console.log(sData)
						if (res > 0) {
              that.$baseMessage('模板添加成功', 'success')
              that.$refs['form'].resetFields()
              that.$emit('close_comp')
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
        console.log(that.form)
				this.$refs['form'].validate(async (valid) => {

					if (valid) {
						// await that.$refs['temp_file'].setFileName(that.form.template_name + '-' + that.form
						// 	.template_version)
						// that.fileUpload(async function(status) {
            that.form.judge_proc=ZlibHelper.String2EncrbytesBase64_fob(that.form.judge_proc)
						let sData = '[Q]475{' + that.form.template_name + '$`' +that.form.template_version + '$`'
              +that.form.entry_sheet + '$`' + that.form.mixed_sheet + '$`' + that.form.order_sheet + '$`' + that.form.record_sheet + '$`' +
              that.form.report_sheet + '$`' + that.form.check_sheet + '$`'
            sData = sData.toString() + that.form.template_json + '$`'+that.form.judge_proc+'$`' + that.form.template_id +'}|^1|^SYS'

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

	#toolbar .el-custuom-button {
		width: 100%;
		text-align: center;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
	}

	#toolbar .el-custuom-button .el-button {
		margin-top: 5px;
	}

	.toolbar .el-custuom-button {
		width: 97px;
	}
</style>
