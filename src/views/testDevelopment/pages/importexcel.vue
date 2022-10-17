<template>
	<div class="table-container definition2 purchase equipment equipment_btn parameterdictionary" style="width: 100%;">
    <iframe src="/mainImport.html" frameborder="0" width="1600px" height="900px" id="myframe" ref="myframe"
    	@load="loaded"></iframe>
<!-- 			<el-row :gutter="10">
				<el-col :span="6">
          <el-row>
            <el-col :span="24">
              <el-select v-model="queryform.table_type" style="width: 100%;" filterable placeholder="请选择导入的类型" @change="import_search">
                <el-option
                  v-for="item in item_options"
                  :key="item.item_id"
                  :label="item.item_name"
                  :value="item.item_id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="24" style="margin-top: 10px;">
              <el-table
                ref="tableSort"
                v-loading="listLoading"
                :data="list"
                border
                :element-loading-text="elementLoadingText"
                highlight-current-row
                :height="height"
                @selection-change="setSelectRows"
                @sort-change="tableSortChange"
                :header-cell-style="{ background: '#e8f0ff' }"

              >
                <el-table-column show-overflow-tooltip prop="order_num" label="字段顺序">
                </el-table-column>
                <el-table-column show-overflow-tooltip label="字段名称" prop="column_name" align="center">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="column_name_en" label="表字段名称" align="center">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>

				</el-col>
				<el-col :span="18">

					<el-row>
            <el-col :span="12">
              <input style="font-size:16px;" type="file" @change="uploadExcel" />
            </el-col>
            <el-col :span="12">
              <el-input
                style="border-radius: 30px"
                width="100%"
                v-model="queryform.title"
                placeholder="请输入导入到excel的第几行"
              >
              </el-input>
            </el-col>
						<el-col :span="24">
							<h1 class="excelTitle">
								<i></i>映射定义
								<el-button style type="primary" @click="addmap">执行导入</el-button>
							</h1>
						</el-col>
						<el-col :span="24">
							<div id="entrustsheet" ref="entrustsheet"></div>
						</el-col>
					</el-row>
				</el-col>
			</el-row> -->
<!-- 		<parameterTemplate ref="parameterTemplate"></parameterTemplate>
		<param-edit ref="edit1"></param-edit> -->
	</div>
</template>

<script>
	import {
		doEdit,
		ExecSql,
		QueryExec,
		QueryExecFile
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
  	ExecImportUpload
  } from '@/api/dataCache'
	// import LuckyExcel from 'luckyexcel'
	// import pdf from 'vue-pdf'
	// // import parameterTemplate from './../components/parameterTemplate'
	// // import ParamEdit from './../components/parameterManagement'
	import {
		getparamlistone
	} from '@/api/table'
	export default {
		name: 'ComprehensiveTable',
		components: {
			// parameterTemplate,
			// ParamEdit,
			// pdf
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
				reload: this.fetchData,
			}
		},
		data() {
			return {
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
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        listLoading: true,
				form: {
					param_id: '',
					tpl_class: '1',
					temp_id: ''
				},
        list: [],
        listsumbit: [],
        queryform: {
          table_type: '',
          title: ''
        },
        isHasLuckSheet: false,
        item_options: [],
			}
		},
		computed: {
			height() {
				return this.$baseTableHeight() * 1.2
			},
			heightchild() {
				return this.$baseTableHeight() * 0.4
			}
		},
		created() {
			this.loaded()
		},
		beforeDestroy() {},
		mounted() {

		},

		methods: {
			// import_search() {
   //      this.fetchData()
   //    },
   //    async addmap() {
   //      let that = this
   //      var numReg = /^[1-9]\d*$/
   //      if (!numReg.test(that.queryform.title)) {
   //        this.$message({
   //          type: 'error',
   //          message: '请输入要导入到哪一行',
   //          duration: 10000,
   //          showClose: true,
   //        })
   //      }
   //      else if(!that.isHasLuckSheet)
   //      {
   //        that.$baseMessage('请选择文件', 'error')
   //      }
   //      else if(that.queryform.table_type==='')
   //      {
   //        that.$baseMessage('请选择导入的类型', 'error')
   //      }
   //      else{
   //        let str = that.queryform.table_type + '|^'
   //        for(let i=1;i<Number(that.queryform.title);i++)
   //        {
   //          for(let j=0;j<that.list.length;j++)
   //          {
   //            let val = luckysheet.getCellValue(i, j)
   //            if(val === null)
   //            {
   //              val = ''
   //            }
   //            console.log(i,j,val)
   //            str=str+val+'$`'
   //          }
   //          str = str.substr(0,str.length-2)
   //          str=str+'|^'
   //        }
   //        str = str.substr(0,str.length-2)
   //        const res = await ExecImportUpload(str)
   //        console.log(res)
   //      }
   //    },
   //    handleRowClick(row) {
   //      this.form.param_id = row.param_id
   //      console.log(row)
   //    },
   //    // handleRowClickFile(row) {
   //    //   this.form.temp_id = row.template_id
   //    //   console.log(this.$refs.recordsheet)
   //    //   luckysheet.destroy()
   //    //   setTimeout(() => {
   //    //     this.fetchDataExcel(row)
   //    //   }, 500)
   //    // },
   //    paramsearch() {
   //      this.fetchDataEx()
   //    },
   //    tableSortChange() {
   //      const imageList = []
   //      this.$refs.tableSort.tableData.forEach((item, index) => {
   //        imageList.push(item.img)
   //      })
   //      this.imageList = imageList
   //    },
   //    setSelectRows(val) {
   //      this.selectRows = val
   //    },
   //    handleEdit(row) {
   //      this.$refs['edit'].showEdit(row)
   //    },
   //    handleTemplateEdit(row) {
   //      this.$refs['parameterTemplate'].showEdit(row,'1')
   //    },
   //    handleEdit1() {
   //      this.$refs['edit1'].showEdit()
   //    },
			// handleSizeChange(val) {
			// 	this.queryForm.pageSize = val
			// 	this.fetchData()
			// },
			// handleCurrentChange(val) {
			// 	this.queryForm.pageNo = val
			// 	this.fetchData()
			// },
			// handleQuery() {
			// 	this.queryForm.pageNo = 1
			// 	this.fetchData()
			// },
   //    uploadExcel(evt){
   //      let that = this
   //      const files = evt.target.files;
   //      if(files==null || files.length==0){
   //          alert("No files wait for import");
   //          return;
   //      }

   //      let name = files[0].name;
   //      let suffixArr = name.split("."), suffix = suffixArr[suffixArr.length-1];
   //      if(suffix!="xlsx"){
   //          alert("Currently only supports the import of xlsx files");
   //          return;
   //      }
   //    	console.log(evt.target.files)
   //      LuckyExcel.transformExcelToLucky(files[0], function(exportJson, luckysheetfile){
   //        if(exportJson.sheets==null || exportJson.sheets.length==0){
   //            alert("Failed to read the content of the excel file, currently does not support xls files!");
   //            return;
   //        }
   //        luckysheet.destroy();
   //        console.log(exportJson.sheets);
   //        let datajson = exportJson.sheets[0].celldata
   //        that.listsumbit = datajson
   //        luckysheet.create({
   //          container: 'entrustsheet', //luckysheet is the container id
   //          showinfobar:false,
   //          data:exportJson.sheets,
   //        	lang: 'zh',
   //          hook: {
   //          	workbookCreateAfter(json) {
   //          		that.isHasLuckSheet = true
   //          	},
   //          },
   //        });
   //      });
   //    },

			// async fetchData() {
			// 	let that = this
			// 	that.listLoading = true
			// 	// const { data } = await getparamlistone(this.title)
   //      let sData = '[Q]651{'+that.queryform.table_type+'}|^SYS'
   //      const res = await QueryExec(sData)
   //      that.list = res.data
   //      setTimeout(() => {
   //        that.listLoading = false
   //      }, 500)
   //    },
   //    async fetchDataExcel(row) {
   //      let that = this
   //      let sData1 = '[Q]453{'+this.form.param_id+'$`'+this.tpl_class+'$`'+this.form.temp_id+'}|^SYS'
   //      const res1 = await QueryExec(sData1)
   //      that.listsumbit = []
   //      let sData = '[Q]451{'+this.form.param_id+'$`'+this.form.temp_id+'}|^SYS'
   //      const res = await QueryExec(sData)
   //      console.log(sData1)

   //      let listtemp = {}
   //      let data = [{
   //        "name": "cell",
   //        "color": "",
   //        "index": 0,
   //        "status": 0,
   //        "order": 0,
   //        "celldata": [],
   //        "config": {},
   //      }]
   //      let option = {
   //        container: "recordsheet",
   //        lang: "zh",
   //        showinfobar: false,
   //        showtoolbar: false,
   //        sheetFormulaBar: false,
   //        showstatisticBar: false,
   //        showsheetbar: false,
   //        data: data,
   //        hook: {
   //        	workbookCreateAfter(json) {
   //        		this.isHasLuckSheet = true
   //        	},
   //        },
   //      };

   //      luckysheet.create(option);
   //      let index = setTimeout(() => {
   //      	luckysheet.ManualPaste(row.template_json, 0, 0, true)
   //        res1.data.forEach((item, index) => {
   //          that.listsumbit.push({"meta_id":item.meta_id,"meta_name":item.meta_name,"state":"","cell":item.cell})
   //          let coordinate = cellConvert(item.cell)
   //          luckysheet.setCellFormat(coordinate[0],coordinate[1], "fc", "#ff0000")
   //          luckysheet.setCellValue(coordinate[0],coordinate[1],item.meta_name)
   //        })
   //      }, 300)
			// },
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
