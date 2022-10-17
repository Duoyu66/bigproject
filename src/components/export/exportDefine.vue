<template>
	<div class="" style="width: 100%;">
<!-- 		<vab-query-form class="template dictionary">
			<el-row :gutter="15">
				<el-col :span="24">
					<el-input v-model="search.param" placeholder="按模板名称搜索" prefix-icon="el-icon-search">
            <template #prepend>
              <el-button type="primary" @click="handleFileAdd()">添加模板</el-button>
            </template>
						<template #append>
							<el-button icon="el-icon-search" @click="paramsearch"></el-button>
						</template>
					</el-input>
				</el-col>
			</el-row>
		</vab-query-form> -->


			<el-row :gutter="15">
				<el-col :span="24">
          <el-row>

          </el-row>
				</el-col>

				<el-col :span="24">
          <el-row>
          	<el-col :span="24">
          		<h1 class="excelTitle" style="margin: 0;">
          			<i></i>导出预览
          			<el-button style type="primary"   @click="exchangejs" style="margin-right: 30px;">导出</el-button>
                <el-button style type="primary"   @click="clearmap" style="margin-right: 30px;">打印</el-button>
          		</h1>
          	</el-col>
          </el-row>
          <el-row>
          	<el-col :span="24">
<!--              <div id="recordsheet" ref="recordsheet"></div> -->
            <iframe src="/SpreadJsExport.html" frameborder="0" width="100%" style="margin:0px;padding:0px;height: 700px;border:1px solid #CCCCCC" id="myframe" ref="myframe"
              	@load="loaded"></iframe>
          	</el-col>
          </el-row>

				</el-col>
			</el-row>

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
  import {
  	getExportData
  } from '@/components/export/exportData'
	// import treeData from './../../vab/tree/index'
	export default {
		name: 'ComprehensiveTable',
		components: {

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
				layoutChild: 'total, sizes, prev, pager, next, jumper',
				layoutParam: 'total, sizes, prev, pager, next, jumper',
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
				return this.$baseTableHeight() * 1.2
			},
			heightchild() {
				return this.$baseTableHeight() * 0.5
			}
		},
		created() {
      this.fetchExcelExport()
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
        let sData = '[Q]690{'+row.template_id+'}|^SYS'
        const res = await QueryExec(sData)
        if(res.data !== undefined && res.data.length>0)
        {
          row.template_json = res.data[0].template_json
        }
        this.entrustInfo = row
        console.log(row)
				this.fetchDataChild(row)
        this.loaded()
        //luckysheet.destroy()
        setTimeout(() => {
          //this.fetchDataExcel(row)
        }, 500)
      },
      async fetchExcelExport(row) {
        if(row)
        {
          let sData = '[Q]690{'+row.template_id+'}|^SYS'
          const res = await QueryExec(sData)
          this.entrustInfo = row
          console.log(row)
          this.loaded()
        }
      },
      clearmap() {

      },
      async exchangejs() {
        let that = this
        let succorfail = 0
        let count = 0
        var childWindow = document.getElementById("myframe").contentWindow;
        console.log(childWindow)
        await childWindow.exchangejs()

      },
			tableSortChange() {

			},
			paramsearch() {
        this.fetchDataChildFile()
			},
			meta_search() {
				this.fetchDataChild()
			},
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
        //this.$refs['parameterDictionary'].showEdit(this.templist, '0')
			},
			handleOldAdd(row) {
				//this.$refs['parameterDictionary'].showEdit()
			},
			handleEdit(row) {
        row.meta_version = this.templist.meta_version
				//this.$refs['parameterDictionary'].showEdit(row, '1')
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

        		let sData = '[Q]480{'+row.template_id+'}|^1|^SYS'
        		const res = await ExecSql(sData)
        		if(res>0)
        		{
        			let sData1 = '[Q]481{'+row.template_id+'}|^1|^SYS'
        			const res1 = await ExecSql(sData1)
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

        		let sData = '[Q]488{'+row.id+'}|^1|^SYS'
        		const res = await ExecSql(sData)
            console.log(res)
        		if(res>0)
        		{
              let sData1 = '[Q]670{'+row.id+'}|^1|^SYS'
              const res1 = await ExecSql(sData1)
              if(res1>0) {
                that.fetchDataChild()
                that.$baseMessage('指标删除成功', 'success')
              }
              else {
                that.$baseMessage('指标删除失败', 'error')
              }
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
        let sData = '[Q]697{' + this.templist.temp_id + '$`%' + this.queryForm.meta_name +
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

				let sDataFile = '[Q]688{%' + this.search.param +
        	'%$`' + ((Number(this.queryFormFile.pageNo) - 1) *
						Number(this.queryFormFile.pageSize)).toString() + '$`' + this.queryFormFile.pageSize +
					'}|^SYS'

				const resFile = await QueryExec(sDataFile)
        console.log(resFile)
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
