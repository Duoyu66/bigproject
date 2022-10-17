<template>
  <!-- 委托模板 -->
	<div class="table-container definition2 purchase equipment equipment_btn parameterdictionary" style="overflow: auto;margin-right: 10px;">
<!-- 		<vab-query-form class="template dictionary">
			<el-row :gutter="15">
				<el-col :span="12">
					<el-input v-model="search.object_name" placeholder="按试验名称搜索" prefix-icon="el-icon-search">
						<template #append>
							<el-button icon="el-icon-search" @click="paramsearch"></el-button>
						</template>
					</el-input>
				</el-col>
			</el-row>
		</vab-query-form> -->

		<el-container class="colors">
			<el-row :gutter="15">
				<el-col :span="12" style="float: left;padding-right: 10px!important;x;padding-left: 0!important;" >
          <el-row>
            <div class="baseBox" style="margin-bottom: 10px;">
              <el-col :span="24">
                <!-- <el-button
                  type="primary"
                  @click="handleFileAdd()"
                >
                  添加模板
                </el-button>

              </el-col>
              <el-col :span="12">
                <div style="text-align: right;">
                  <el-form ref="form" :model="search" :inline="true" @submit.native.prevent>
                  	<el-form-item  style="margin-bottom: 10px;margin-right:10px; text-align: right;">
                  		<el-input v-model="search.param" placeholder="按模板名称搜索" prefix-icon="el-icon-search">
                  		</el-input>
                  	</el-form-item>
                    <el-form-item  style="margin-bottom: 10px;margin-right:0px">
                      <el-button
                        type="primary"
                        native-type="submit"
                        @click="paramsearch"
                      >
                        查询
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div> -->
              </el-col>
              <el-col :span="24">
                <el-table ref="tableSort" :data="list" border :element-loading-text="elementLoadingText"
              	:height="heightchild" row-key="object_id" highlight-current-row
              	:tree-props="{ children: 'children', hasChildren: 'hasChildren' }" lazy tooltip-effect="dark"
              	:load="fetchDataEx" @row-click="handleRowClick">
                <el-table-column show-overflow-tooltip prop="object_name" label="试验名称" min-width="200px" alig="left">
                </el-table-column>
                <el-table-column show-overflow-tooltip label="试验标识" prop="object_id" v-if="hideColFob('object_id')">
                </el-table-column>
                <el-table-column show-overflow-tooltip label="平行率" prop="repeat_rate" width="70px"
                  v-if="hideColFob('repeat_rate')"></el-table-column>
                <el-table-column show-overflow-tooltip label="见证率" prop="witness_rate" width="70px"
                  v-if="hideColFob('witness_rate')"></el-table-column>
                <el-table-column show-overflow-tooltip label="自动计算" prop="auto_judge" width="90px"
                  v-if="hideColFob('auto_judge')">
                  <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.auto_judge=='0'">
                      否
                    </el-tag>
                    <el-tag type="success" v-else-if="scope.row.auto_judge=='1'">
                      是
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="版本" prop="version" width="70px" v-if="hideColFob('version')">
                </el-table-column>
                <el-table-column show-overflow-tooltip label="试验类型" prop="has_entry_str" width="150px"
                  v-if="hideColFob('has_entry_str')"></el-table-column>
              </el-table>
              <el-pagination :background="background" :current-page="queryFormParam.pageNo" :layout="layoutParam"
              	:page-size="queryFormParam.pageSize" :total="totalparam" @current-change="handleCurrentChangeParam"
              	@size-change="handleSizeChangeParam"></el-pagination>
              </el-col>
            </div>

            <div class="baseBox">
              <el-col :span="24" style="margin-bottom: 10px;">
                <el-col :span="14">
                  <el-button type="primary" @click="handleAdd()">添加委托字典项</el-button>
                </el-col>
                <el-col :span="10">
                  <div style="text-align: right;">
                    <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
                    	<el-form-item  style="margin-bottom: 0px;margin-right:10px;">
                    		<el-input v-model="queryForm.meta_name" placeholder="按委托字典项名称搜索" prefix-icon="el-icon-search">
                    		</el-input>
                    	</el-form-item>
                      <el-form-item  style="margin-bottom: 0px;margin-right:0px">
                        <el-button
                          type="primary"
                          native-type="submit"
                          @click="meta_search"
                        >
                          查询
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-col>
              </el-col>
              <el-col :span="24">
            	<el-table ref="tableSort" v-loading="listChildLoading" :data="listChild" border
            		:element-loading-text="elementLoadingText" highlight-current-row :height="heightchild"
            		@selection-change="setSelectRows" @sort-change="tableSortChange"
            		:header-cell-style="{ background: '#e8f0ff' }">
            		<el-table-column show-overflow-tooltip label="指标标识" prop="meta_id" align="center">
            		</el-table-column>
            		<el-table-column show-overflow-tooltip prop="meta_name" label="指标名称" min-width="100px">
            		</el-table-column>
            		<el-table-column show-overflow-tooltip prop="group_id" label="所属组" width="100px"
            			align="center"></el-table-column>
            		<el-table-column show-overflow-tooltip label="数据类型" prop="data_type" align="center">
            		</el-table-column>
            		<el-table-column show-overflow-tooltip prop="is_auto" label="自动计算" align="center">
            		</el-table-column>
            		<el-table-column show-overflow-tooltip label="数据项类别" prop="item_category" width="150px"
            			align="center"></el-table-column>
            		<el-table-column show-overflow-tooltip label="操作" width="120px">
            			<template #default="{ row }">
            				<el-button type="primary" class="normal" @click="handleMetaEdit(row)">
            					修改
            				</el-button>
            				<el-button class="danger" @click="handleMetaDelete(row)" >删除</el-button>
            			</template>
            		</el-table-column>
            	</el-table>
            	<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
            		:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
            		@size-change="handleSizeChange"></el-pagination>
              </el-col>
            </div>
          </el-row>

				</el-col>

				<el-col :span="12" class="baseBox">
					<el-row>
						<el-col :span="24">
							<h1 class="excelTitle" style="margin: 0;">
								<i></i>委托模板定义

								<el-button style type="primary" @click="addmap" >保存映射</el-button>
                <el-button style type="primary" @click="clearmap" style="margin-right:15px;">清空映射</el-button>
                <el-button style type="primary" @click="handleTemplateEdit" style="margin-right:15px;">添加或修改模板</el-button>
                <el-button type="primary" style="margin-right:15px;" @click="handleTemplateCopy">复制模板</el-button>
                <el-button type="primary" style="margin-right:15px;" @click="handleTemplateDelete">删除模板</el-button>
							</h1>
						</el-col>
						<!--           <el-col :span="2">

					  </el-col>-->
					</el-row>
					<el-row>
						<el-col :span="24">
							<!-- <div id="entrustsheet" ref="entrustsheet"></div> -->
              <iframe src="/SpreadJsDictionary.html" frameborder="0" width="100%" style="margin:0px;padding:0px;height:calc(100vh - 185px );border:1px solid #CCCCCC" id="myframe" ref="myframe"
                	@load="loaded"></iframe>
						</el-col>
					</el-row>

				</el-col>
			</el-row>
		</el-container>
		<parameterDictionary ref="parameterDictionary" @fetchDataChild="fetchDataTemplate"></parameterDictionary>
		<parameterTemplate ref="parameterTemplate" @addDictionary="addDictionary"></parameterTemplate>
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
  	cellConvert,
  	cellCount,
  	cellConvertToOffice
  } from '@/utils/cellconvert'
	import parameterDictionary from '../components/parameterDictionary.vue'
	import parameterTemplate from './../components/entrustTemplate'
	// import TableEdit2 from '../components/parameterDictionary2.vue'
	import treeData from './../../vab/tree/index'
	export default {
		name: 'ComprehensiveTable',
		components: {
			parameterDictionary,
			parameterTemplate,
			treeData,
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					published: 'success',
					draft: 'gray',
					deleted: 'danger',
				}
				return statusMap[status]
			},
		},
		data() {
			return {
				imgShow: true,
				list: [],
				imageList: [],
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				listChild: [],
				listChildFile: [],
				listChildLoading: true,
				layoutChild: 'total, sizes, prev, pager, next, jumper',
        layoutParam: 'total, sizes, jumper',
				total: 0,
        totalparam: 0,
				totalFile: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				search: {
					object_name: '',
					tpl_name: '',
					enable_time_start: '',
					enable_time_end: '',
					enable: '1'
				},
				templist: {
					object_id: '',
          param_id: '',
					template_id: ''
				},
        template: {},
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					title: '',
					meta_name: ''
				},
				queryFormFile: {
					pageNo: 1,
					pageSize: 20,
					title: '',
					meta_name: ''
				},
        queryFormParam: {
        	pageNo: 1,
        	pageSize: 20,
        	title: '',
        	meta_name: ''
        },
				listChildFileLoading: false,
				dialogFormVisible: false,
        templateold: false,
				multipleSelection: [],
        columnHideList: ['selection'],
			}
		},
		computed: {
			height() {
				return this.$baseTableHeight() * 1.2
			},
			heightchild() {
				return this.$baseTableHeight() * 0.555
			}
		},
		created() {
			this.fetchDataEx()
		},
		beforeDestroy() {},
		mounted() {

		},
		methods: {
      async init() {
      	switch (this.type) {
      		case 0:
      			this.height = 'calc(80%)'
      			this.columnHideList = ['selection']
      			break
      		case 1:
      			this.columnHideList = ['selection']
      			this.height = 'calc(80%)'
      			break
      		case 22:
      		case 20:
      			this.columnHideList = ['selection', 'object_id', 'group_id', 'repeat_rate', 'witness_rate',
      				'auto_judge',
      				'workflow', 'version', 'has_entry_str'
      			]
      			break
      		case 21:
      			this.columnHideList = []
      			break
      	}
      },
			handleRowClick(row) {
				this.templist.object_id = row.object_id
        this.templist.param_id = row.object_id
				this.fetchDataTemplate(row)

			},
      hideColFob(col_name) {
      	try {
      		let that = this
      		if (!col_name) {
      			return true
      		}
      		if (that.columnHideList.indexOf(col_name) < 0) {
      			return true
      		}
      		return false
      	} catch (e) {
      		console.log(e)
      		return false
      	}
      },
      clearmap() {
        let that = this
        this.$baseConfirm('你确定要清空所有映射吗', null, async () => {

        	let sData = '[Q]667{' + that.templist.template_id + '}|^1|^SYS'
        	const res = await ExecSql(sData)
        	if (res > 0) {
            that.$baseMessage('映射清空成功', 'success')
        	} else {
        		that.$baseMessage('映射清空失败', 'error')
        	}

        })
      },
      async addDictionary(temp)
      {
        let sData = '[Q]742{' + temp.old_id + '$`' + temp.new_id + '}|^1|^SYS'
        const res = await ExecSql(sData)
        console.log(sData)
        if (res > 0) {
          this.$baseMessage('复制模板成功', 'success')
        } else {
        	this.$baseMessage('复制模板失败', 'error')
        }
      },
      async addmap() {
        let that = this
        let succorfail = 0
        let count = -1
        console.log(that.listsumbit)
        var childWindow = document.getElementById("myframe").contentWindow;
        console.log(childWindow)
        await childWindow.addmap()
        that.fetchDataTemplate(this.templist)
      },
			tableSortChange() {
				const imageList = []
				this.$refs.tableSort.tableData.forEach((item, index) => {
					imageList.push(item.img)
				})
				this.imageList = imageList
			},
			paramsearch() {
				this.fetchDataEx()
			},
			meta_search() {
				if (this.templist.object_id === '') {
					this.$baseMessage('请选中参数')
				} else {
					this.fetchDataChild(this.templist)
          this.queryForm.pageNo = 1
				}
			},
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
        console.log(this.templist)
				if (this.templist.object_id === '') {
					this.$baseMessage('请选中试验','error')
				}
        else if(this.templist.template_id === '')
        {
          this.$baseMessage('请先添加模板','error')
        }
        else {
					this.$refs['parameterDictionary'].showEdit(this.templist, '0')
				}
			},

			handleOldAdd(row) {
				this.$refs['parameterDictionary'].showEdit()
			},
			handleEdit(row) {
				this.$refs['parameterDictionary'].showEdit(row, '1')
			},
      handleMetaEdit(row) {
				this.$refs['parameterDictionary'].showEdit(row, '1')
			},
      handleTemplateEdit() {
        console.log(this.templist)
        if (this.templist.object_id === '') {
        	this.$baseMessage('请选中试验')
        }
        else {
          let arr = Object.keys(this.template);
          if(arr.length === 0)
          {
            this.$refs['parameterTemplate'].showEdit(this.templist, '0')
          }
          else {
            this.$refs['parameterTemplate'].showEdit(this.template, '1')
          }
        }

      },
      handleTemplateCopy() {
      	if (this.templist.object_id === '') {
      		this.$baseMessage('请选中试验','error')
      	} else {
      		let arr = Object.keys(this.templist);
          console.log(this.templist)
      		if (arr.length === 0 || this.templist.template_id.toString().length === 0) {
            console.log(this.templist.template_id)
      			this.$refs['parameterTemplate'].showEdit(this.templist, '2')
      		} else {
      			this.$baseMessage('模板已经存在','error')
      		}
      	}

      },
      handleTemplateDelete() {
      	let that = this

      	if (this.templist.template_id) {
      	  this.$baseConfirm('你确定要删除此模板吗', null, async () => {
      			let sData = '[Q]743{'+this.templist.template_id+'}|^1|^SYS'
      			const res = await ExecSql(sData)
      			if(res>0)
      			{
      				that.$baseMessage('模板删除成功', 'success')
      	      that.fetchDataChildFile()
      			}
      			else {
      				that.$baseMessage('模板删除失败', 'error')
      			}
      	  })
      	}
      },
      handleMetaDelete(row) {
        let that = this
        if (row.id) {
          that.$baseConfirm('你确定要删除此指标吗', null, async () => {

        		let sData = '[Q]785{'+row.id+'}|^1|^SYS'
        		const res = await ExecSql(sData)
            console.log(res)
        		if(res>0)
        		{
              that.fetchDataChild()
              that.$baseMessage('指标删除成功', 'success')
        		}
        		else {
        			that.$baseMessage('指标删除失败', 'error')
        		}
          })
        }
      },
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchDataChild(this.templist)
			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchDataChild(this.templist)
			},
      handleSizeChangeParam(val) {
      	this.queryForm.pageSize = val
      	this.fetchDataEx()
      },
      handleCurrentChangeParam(val) {
      	this.queryForm.pageNo = val
      	this.fetchDataEx()
      },
			async fetchData(row) {
				this.listLoading = true
				if (row) {

				}
				setTimeout(() => {
					this.listLoading = false
				}, 500)
			},
			testMessage() {
				this.$baseMessage('test1', 'success')
			},
			testNotify() {
				this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
			},
			async fetchDataChild(row) {
				this.listChildLoading = true
				if (row) {
					let sData = '[Q]499{' + row.object_id + '$`' + row.template_id + '$`%' + this.queryForm.meta_name +
						'%$`' + ((Number(this.queryForm.pageNo) - 1) * Number(this.queryForm.pageSize)).toString() +
						'$`' + this.queryForm.pageSize + '}|^SYS'
					const res = await QueryExec(sData)
					console.log(res)
					this.listChild = res.data
					this.total = res.total
				}
				setTimeout(() => {
					this.listChildLoading = false
				}, 500)
			},
			async fetchDataTemplate(row) {
				this.listChildFileLoading = true
        let that = this
        console.log(row)
        this.template = {}
				if (row) {
					let sDataFile = '[Q]490{' + this.templist.object_id + '}|^SYS'
					const resFile = await QueryExec(sDataFile)
          console.log(resFile)
          if(resFile.total > 0)
          {
            // this.fetchDataExcel(resFile.data[0])
            this.fetchDataChild(resFile.data[0])
            this.templist.object_id=resFile.data[0].obj_id
            this.templist.param_id=resFile.data[0].obj_id
            this.templist.template_id=resFile.data[0].template_id
            this.template = resFile.data[0]
            this.entrustInfo = resFile.data[0]
            that.loaded()
          }
          else {
            this.templist.object_id=row.object_id
            this.templist.param_id=row.object_id
            this.templist.template_id=''
            // this.fetchDataExcelBlank()
            this.fetchDataChild(this.templist)
            this.template = {}
          }
				}
				setTimeout(() => {
					this.listChildFileLoading = false
				}, 500)
			},
			async fetchDataEx(row, treeNode, resolve) {
				//console.log(row, treeNode, resolve)
				this.listLoading = true
				this.listChildLoading = true
				try {
					let sData;
					let form = Object.assign({}, this.queryForm)
					if(row)
					{
					  form.parent_id = row.object_id
					}
					else {
					  form.parent_id = '0'
					}
					sData = '[Q]243{' + form.parent_id + '$`%' + this.search.object_name + '%$`' + this.search.tpl_name +'}|^SYS'

					// console.log(row)
					if (row) {
						const res = await QueryExec(sData)
						const data = res.data
						// console.log(res)
						for (let i = 0; i < data.length; i++) {
							if (Number(data[i].children) > 0) {
								data[i].hasChildren = true
							} else {
								data[i].hasChildren = false
							}
						}
						if (resolve) {
							console.log('resolve')
							resolve(data)
						} else if (this.resolve && this.resolve[form.parent_id]) {
							console.log('this.resolve')
							this.$set(this.$refs.tableSort.store.states.lazyTreeNodeMap, form.parent_id, []);
							this.resolve[form.parent_id](data)
						} else if (form.parent_id == 0) {
							this.list = data
							//this.tableDataTemp = JSON.parse(JSON.stringify(data))
							return
						}

					} else {

						const res = await QueryExec(sData)
            console.log(sData)
						const data = TreeDataDealEx(res.data, 0, 'object_id', 'parent_id', 'hasChildren')
						// console.log(data)
						this.list = data
            this.totalparam = res.total
					}
				} catch (e) {
					console.log(e)
				}
				setTimeout(() => {
					this.listLoading = false
				}, 500)
				setTimeout(() => {
					this.listChildLoading = false
				}, 500)
			},

      async fetchDataExcel(row) {
        let that = this
        let sData1 = '[Q]453{'+row.object_id+'$`0$`'+row.template_id+'}|^SYS'
        const res1 = await QueryExec(sData1)
        that.listsumbit = []
        let sData = '[Q]451{'+row.object_id+'$`'+row.template_id+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(res)
        let listright = [{
        	title: '清空单元格',
        	onClick: function (clickEvent, event, params) {
        		let val = luckysheet.getCellValue(params.rowIndex,params.columnIndex)

            for(let i=0;i<that.listsumbit.length;i++)
            {

              if(that.listsumbit[i].meta_name===val)
              {
                console.log(that.listsumbit[i].meta_name)
                that.listsumbit[i].state = "D"
              }
            }
            luckysheet.setCellValue(params.rowIndex,params.columnIndex,'/')
        	}
        }]
        let listtemp = {}
        res.data.forEach((item, index) => {
          listright.push({
          	title: item.meta_name,
          	onClick: function (clickEvent, event, params) {
              let val = luckysheet.getCellValue(params.rowIndex,params.columnIndex)
              if(val !== '/' && val !== null)
              {
                for (k=0;k<that.listsumbit.length;k++)
                {
                  if(cellConvertToOffice(params.columnIndex,params.rowIndex)===that.listsumbit[k].cell)
                  {
                    that.listsumbit[k].meta_id=item.meta_id
                    that.listsumbit[k].meta_name=item.meta_name
                    that.listsumbit[k].state="U"
                  }
                }
              }
              else {
                that.listsumbit.push({"meta_id":item.meta_id,"meta_name":item.meta_name,"state":"I","cell":cellConvertToOffice(params.columnIndex,params.rowIndex)})
              }
              clickEvent.target.parentNode.remove()
              luckysheet.setCellFormat(params.rowIndex,params.columnIndex, "fc", "#ff0000")
          		luckysheet.setCellValue(params.rowIndex,params.columnIndex,item.meta_name)
            }
          })
        })
        let data = [{
          "name": "cell",
          "color": "",
          "index": 0,
          "status": 0,
          "order": 0,
          "celldata": [],
          "config": {},
        }]
        let option = {
          container: "entrustsheet",
          lang: "zh",
          showinfobar: false,
          showtoolbar: false,
          sheetFormulaBar: false,
          showstatisticBar: false,
          showsheetbar: false,
          rowHeaderWidth: 0,
          columnHeaderHeight: 0,
          data: data,
          cellRightClickConfig: {
            copy: true, // 复制
            copyAs: false, // 复制为
            paste: true, // 粘贴
            insertRow: false, // 插入行
            insertColumn: false, // 插入列
            deleteRow: false, // 删除选中行
            deleteColumn: false, // 删除选中列
            deleteCell: false, // 删除单元格
            hideRow: false, // 隐藏选中行和显示选中行
            hideColumn: false, // 隐藏选中列和显示选中列
            rowHeight: false, // 行高
            columnWidth: false, // 列宽
            clear: false, // 清除内容
            matrix: false, // 矩阵操作选区
            sort: false, // 排序选区
            filter: false, // 筛选选区
            chart: false, // 图表生成
            image: false, // 插入图片
            link: false, // 插入链接
            data: false, // 数据验证
            cellFormat: false ,// 设置单元格格式
            customs: listright,
          },
          hook: {
          	workbookCreateAfter(json) {
          		that.isHasLuckSheet = true
          	},
          },
        };
        luckysheet.create(option);
        let index = setInterval(async () => {
          console.log(that.isHasLuckSheet)
        	if (that.isHasLuckSheet) {
        		clearInterval(index)
            let count = await luckysheet.ManualPaste(row.template_json, 0, 0, true)
            res1.data.forEach((item, index) => {
              that.listsumbit.push({"meta_id":item.meta_id,"meta_name":item.meta_name,"state":"","cell":item.cell})
              let coordinate = cellConvert(item.cell)
              luckysheet.setCellFormat(coordinate[0],coordinate[1], "fc", "#ff0000")
              luckysheet.setCellValue(coordinate[0],coordinate[1],item.meta_name)
            })
        	}
        }, 300)

			},
      fetchDataExcelBlank() {
        let data = [{
          "name": "cell",
          "color": "",
          "index": 0,
          "status": 0,
          "order": 0,
          "celldata": [],
          "config": {},
        }]
        let option = {
          container: "entrustsheet",
          lang: "zh",
          showinfobar: false,
          showtoolbar: false,
          sheetFormulaBar: false,
          showstatisticBar: false,
          showsheetbar: false,
          data: data,
          cellRightClickConfig: {
            copy: false, // 复制
            copyAs: false, // 复制为
            paste: false, // 粘贴
            insertRow: false, // 插入行
            insertColumn: false, // 插入列
            deleteRow: false, // 删除选中行
            deleteColumn: false, // 删除选中列
            deleteCell: false, // 删除单元格
            hideRow: false, // 隐藏选中行和显示选中行
            hideColumn: false, // 隐藏选中列和显示选中列
            rowHeight: false, // 行高
            columnWidth: false, // 列宽
            clear: false, // 清除内容
            matrix: false, // 矩阵操作选区
            sort: false, // 排序选区
            filter: false, // 筛选选区
            chart: false, // 图表生成
            image: false, // 插入图片
            link: false, // 插入链接
            data: false, // 数据验证
            cellFormat: false ,// 设置单元格格式
          },
          hook: {
          	workbookCreateAfter(json) {
          		this.isHasLuckSheet = true
          	},
          },
        };
      },
      loaded() {
      	let that = this
      	let index = setInterval(function() {
      		if (that.$refs.myframe) {
      			clearInterval(index)
      			// 只有在 iframe 加载时传递数据给子组件，$refs 才是非空的
      			that.$refs.myframe.contentWindow.postMessage({
      				org_pid: that.org_pid,
      				person_id: that.person_id,
      				pageType: that.pageType,
      				data: that.data,
      				object_id: that.object_id,
      				entrustInfo: that.entrustInfo,
              current_org_id: that.current_org_id
      			}, '*');
      		}
      	})

      },
		},

	}
</script>
<style lang="scss" scoped>
.el-row{margin: 0!important;}
// .el-col.el-col-12{padding:0!important;}
.baseBox{overflow:hidden;padding:10px!important;}
</style>
