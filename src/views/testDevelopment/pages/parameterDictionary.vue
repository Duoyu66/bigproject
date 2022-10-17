<template>
  <!-- 参数模板 -->
	<div class="table-container definition2  purchase equipment equipment_btn parameterdictionary" style="overflow: auto;">
<!-- 		<vab-query-form class="template dictionary">
			<el-row :gutter="15"></el-row>
		</vab-query-form> -->

		<el-container class="colors">
			<el-row :gutter="24" style="margin:0!important;height: calc(100vh - 120px);">
        <el-col :span="6" class="baseBox" style="padding:10px!important;">

            <el-form ref="form" :model="search" :inline="true" @submit.native.prevent>
              <el-form-item  style="margin-bottom: 10px;margin-right:10px">
                <el-button
                  type="primary"
                  @click="handleFileAdd()"
                >
                  添加模板
                </el-button>
              </el-form-item>
            	<el-form-item  style="margin-bottom: 10px;margin-right:10px">
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

            <el-table ref="tableSort" v-loading="listChildFileLoading" :data="listChildFile" border
            	@row-click="handleRowClickFile" :element-loading-text="elementLoadingText"
            	highlight-current-row :height="height" @selection-change="setSelectRows"
            	@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
            	<el-table-column show-overflow-tooltip label="模板名称" prop="template_name">
            	</el-table-column>
            	<el-table-column show-overflow-tooltip prop="template_version" label="模板版本">
            	</el-table-column>

            	<el-table-column show-overflow-tooltip label="操作" width="60px">
                <template #default="{ row }">
                	<el-dropdown trigger="click" placement="left-start">
                		<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                		<el-dropdown-menu slot="dropdown" class="more">
                      <el-button @click="handleTemplateCopy(row)">复制模板</el-button>
                      <el-button @click="
                      handleTemplateEdit(row)">修改</el-button>
                      <el-button @click="handleTemplateDelete(row)">删除</el-button>
                		</el-dropdown-menu>
                	</el-dropdown>
                </template>
            	</el-table-column>
            </el-table>
            <el-pagination :background="background"
           :current-page="queryFormFile.pageNo"
            	:layout="layoutChild"
              :total="totalFile"
            	@current-change="handleCurrentChangeFile"
              @size-change="handleSizeChangeFile">
            </el-pagination>
          </el-col>

        <el-col :span="18" style="padding:0 10px 0 10px!important;">
          <div class="baseBox" style="margin-bottom:10px;">
            <el-row :gutter="15" style="margin-bottom:10px;">
          		<el-col :span="16">
          			<el-button type="primary" icon="el-icon-plus" @click="handleAdd()">添加参数字典项</el-button>
          		</el-col>
          		<el-col :span="8">
                <div style="text-align: right;">
<!--          			<el-input v-model="queryForm.meta_name" placeholder="按参数字典项名称搜索">
          				<template #append>
          					<el-button icon="el-icon-search" @click="meta_search"></el-button>
          				</template>
          			</el-input> -->
                  <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
                    <el-form-item  style="margin-bottom: 0px;margin-right:10px">
                      <el-input v-model="queryForm.meta_name" placeholder="按指标名称搜索" prefix-icon="el-icon-search">
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
          	</el-row>
            <el-row>
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
                  <el-table-column show-overflow-tooltip prop="is_auto" label="是否自动计算" align="center">
                  </el-table-column>
                  <el-table-column show-overflow-tooltip label="数据项类别" prop="item_category" width="150px"
                    align="center"></el-table-column>

                  <el-table-column show-overflow-tooltip label="操作" width="120px">
                    <template #default="{ row }">
                      <el-button type="primary" class="normal" @click="handleEdit(row)">
                        修改
                      </el-button>
                      <el-button class="danger" @click="handleMetaDelete(row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination :background="background"
                  :current-page="queryForm.pageNo"
                  :layout="layout"
                  :page-size="queryForm.pageSize"
                  :total="total" @current-change="handleCurrentChange"
                  @size-change="handleSizeChange">
                </el-pagination>
            </el-col>
            </el-row>
          </div>

          <div class="baseBox">
            <el-row>
              <el-col :span="24">
                <h1 class="excelTitle"><i></i>参数模板定义
                <el-button style type="primary"   @click="addmap" style="margin-right: 10px;">保存映射</el-button>
                <el-button style type="primary"   @click="clearmap" style="margin-right: 10px;">清空映射</el-button>
                </h1>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <iframe src="/SpreadJsDictionary.html" frameborder="0" width="100%" style="margin:0px;padding:0px;height: 350px;border:1px solid #CCCCCC" id="myframe" ref="myframe"
                                @load="loaded"></iframe>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

    </el-container>
		<parameterDictionary ref="parameterDictionary" @fetchDataChild="fetchDataChild"></parameterDictionary>
		<parameterTemplate ref="parameterTemplate" @fetchDataChildFile="fetchDataChildFile" @addDictionary="addDictionary"></parameterTemplate>
		<table-edit1 ref="edit1"></table-edit1>
    <table-edit ref="edit"></table-edit>
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
	import TableEdit1 from '../components/parameterDictionary1.vue'
	import parameterTemplate from './../components/parameterTemplate'
	// import TableEdit2 from '../components/parameterDictionary2.vue'
	import treeData from './../../vab/tree/index'
  import TableEdit from '../components/parameterManagement'
	export default {
		name: 'ComprehensiveTable',
		components: {
      TableEdit,
			parameterDictionary,
			TableEdit1,
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
    provide() {
    	return {
    		paramReload: this.fetchDataChildFile,
    		reload: this.fetchDataChildFile,
    	}
    },
		data() {
			return {
				imgShow: true,
				list: [],
				imageList: [],
				listLoading: false,
				layout: 'total, sizes, prev, pager, next, jumper',
				listChild: [],
				listChildFile: [],
				listChildLoading: false,
				layoutChild: 'total, sizes,prev, next, jumper',
				layoutParam: 'total, jumper',
				total: 0,
				totalparam: 0,
				totalFile: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				search: {
					param: '',
					tpl_name: '',
					enable_time_start: '',
					enable_time_end: '',
					enable: '1'
				},
				templist: {
					param_id: '',
					temp_id: '',
          meta_version: '',
          map_version: '',
          template_json: ''
				},
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
					param: '',
          tpl_class: ''
				},
				queryFormParam: {
					pageNo: 1,
					pageSize: 20,
					title: '',
					meta_name: ''
				},
        isHasLuckSheet: false,
				listChildFileLoading: false,
				dialogFormVisible: false,
        templateold: false,
				multipleSelection: [],
        rowfile: [],
				options: [],
				value1: '选项1'
			}
		},
		computed: {
      ...mapGetters({
      	org_pid: 'user/org_pid',
      	org_id: 'user/org_id',
      	current_org_id: 'org/current_org',
      	current_and_chrilren_org: 'org/current_and_chrilren_org',
      	person_id: 'user/person_id',
      }),
			height() {
				// return this.$baseTableHeight() * 1.2
        return this.height = 'calc(100vh - 224px)'
			},
			heightchild() {
				// return this.$baseTableHeight() * 0.5
         return this.$baseTableHeight() * 0.515
			}
		},
		created() {
      this.fetchDataChildFile()
		},
		beforeDestroy() {},
		mounted: function() {

		},
		methods: {
			async handleRowClickFile(row) {
        this.rowfile = row
        this.queryForm.pageNo = 1
				this.templist.temp_id = row.template_id
        this.templist.template_id = row.template_id
        this.templist.template_version = row.template_version
        this.templist.map_version = row.map_version
        let sData = '[Q]564{'+row.template_id+'}|^SYS'
        const res = await QueryExec(sData)
        // console.log(res)
        if(res.data !== undefined && res.data.length>0)
        {
          row.template_json = res.data[0].template_json
        }
        this.entrustInfo = row
        // var childWindow = document.getElementById("myframe").contentWindow;
        // console.log(childWindow)
        // childWindow.fetchData()


				this.fetchDataChild(row)
        this.loaded()
        //luckysheet.destroy()
        setTimeout(() => {
          //this.fetchDataExcel(row)
        }, 500)
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
      async addDictionary(template_id)
      {
        let sData = '[Q]742{' + this.templist.template_id + '$`' + template_id + '}|^1|^SYS'
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
        let count = 0
        var childWindow = document.getElementById("myframe").contentWindow;
        console.log(childWindow)
        await childWindow.addmap()
        that.handleRowClickFile(this.templist)
      },
			tableSortChange() {

			},
			paramsearch() {
        this.fetchDataChildFile()
			},
			meta_search() {
        this.queryForm.pageNo = 1
				this.fetchDataChild()
			},
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
        this.$refs['parameterDictionary'].showEdit(this.templist, '0')
			},
      paramadd() {
        this.$refs['edit'].showEdit()
      },
      paramedit(row) {
        this.$refs['edit'].showEdit(row)
      },
			handleOldAdd(row) {
				this.$refs['parameterDictionary'].showEdit()
			},
			handleEdit(row) {
        row.meta_version = this.templist.meta_version
				this.$refs['parameterDictionary'].showEdit(row, '1')
			},
      handleTemplateCopy(row) {
        console.log(row)
        if (row.template_id) {
          this.$baseConfirm('你确定要复制此模板吗？(提示：此操作会生成新的模板，同时复制旧模板的字典)', null, async () => {
            this.$refs['parameterTemplate'].showEdit(row, '2')
          })
        }
    //     let sData = '[Q]564{'+row.template_id+'}|^SYS'

    //     const res = await QueryExec(sData)
    //     console.log(res)
    //     if(res.data !== undefined && res.data.length>0)
    //     {
    //       row.template_json = res.data[0].template_json
    //     }
				// this.$refs['parameterTemplate'].showEdit(row, '1')
			},
			async handleTemplateEdit(row) {
        let sData = '[Q]564{'+row.template_id+'}|^SYS'

        const res = await QueryExec(sData)
        console.log(res)
        if(res.data !== undefined && res.data.length>0)
        {
          row.template_json = res.data[0].template_json
        }
				this.$refs['parameterTemplate'].showEdit(row, '1')
			},
			handleTemplateDelete(row) {
        let that = this
        if (row.template_id) {
          this.$baseConfirm('你确定要删除此模板吗', null, async () => {

        		let sData = '[Q]743{'+row.template_id+'}|^1|^SYS'
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
      handleFileOldAdd() {
        if(this.form.param_id === '')
        {
          this.$baseMessage('请选中参数')
        }
        else
        {
          this.$refs['parameterTemplate'].showEdit(this.form,'2')
        }
      },
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchDataChild()
			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchDataChild()
			},
      handleSizeChangeFile(val) {
      	this.queryFormFile.pageSize = val
      	this.fetchDataChildFile()
      },
      handleCurrentChangeFile(val) {
      	this.queryFormFile.pageNo = val
      	this.fetchDataChildFile()
      },
			async fetchData(row) {

			},
			testMessage() {
				this.$baseMessage('test1', 'success')
			},
			handleFileAdd() {
				this.$refs['parameterTemplate'].showEdit(this.templist, '0')
			},
			async fetchDataChild(row) {
				this.listChildLoading = true
				console.log(row)
        let sData = '[Q]285{' + this.templist.temp_id + '$`%' + this.queryForm.meta_name +
        	'%$`' + ((Number(this.queryForm.pageNo) - 1) * Number(this.queryForm.pageSize)).toString() +
        	'$`' + this.queryForm.pageSize + '}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData)
        this.listChild = res.data

        this.total = res.total
				setTimeout(() => {
					this.listChildLoading = false
				}, 500)
			},
			async fetchDataChildFile() {
				this.listChildFileLoading = true

				let sDataFile = '[Q]494{%' + this.search.param +
        	'%$`' + ((Number(this.queryFormFile.pageNo) - 1) *
						Number(this.queryFormFile.pageSize)).toString() + '$`' + this.queryFormFile.pageSize +
					'}|^SYS'

				const resFile = await QueryExec(sDataFile)
        console.log(sDataFile)
				this.listChildFile = resFile.data
				this.totalFile = resFile.total

				setTimeout(() => {
					this.listChildFileLoading = false
				}, 500)
			},
      async fetchDataExcel(row) {
        let that = this
        let sData1 = '[Q]498{'+this.templist.temp_id+'}|^SYS'
        const res1 = await QueryExec(sData1)
        that.listsumbit = []
        let sData = '[Q]497{'+this.templist.temp_id+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(res1)
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
            luckysheet.setCellValue(params.rowIndex,params.columnIndex,'D')
        	}
        }]
        let listtemp = {}
        if(res.data.length !== 0)
        {
          res.data.forEach((item, index) => {
            listright.push({
            	title: item.meta_name,
            	onClick: function (clickEvent, event, params) {
                let val = luckysheet.getCellValue(params.rowIndex,params.columnIndex)
                let k = 0
                console.log(that.listsumbit)
                if(val !== '/' && val !== null)
                {
                  for (k=0;k<that.listsumbit.length;k++)
                  {
                    if(cellConvertToOffice(params.columnIndex,params.rowIndex)===that.listsumbit[k].cell)
                    {
                      if(that.listsumbit[k].state!=="I")
                      {
                        that.listsumbit[k].meta_id=item.meta_id
                        that.listsumbit[k].meta_name=item.meta_name
                        that.listsumbit[k].state="U"
                      }
                      else
                      {
                        that.listsumbit[k].meta_id=item.meta_id
                        that.listsumbit[k].meta_name=item.meta_name
                      }
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
        }

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
          container: "recordsheet",
          lang: "zh",
          showinfobar: false,
          showtoolbar: false,
          sheetFormulaBar: false,
          showstatisticBar: false,
          showsheetbar: false,
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
        let customformula = new Customformula(luckysheet)
        option.customOptions = {
        	Customformula: customformula.GetCustomformula()
        }

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
<style>
.baseBox{background:#fff;border-radius:5px;border: 1px solid #dbe0e6;padding: 10px!important;box-sizing: border-box;
box-shadow: 0 1px 4px rgb(0 21 41 / 8%);}
</style>
