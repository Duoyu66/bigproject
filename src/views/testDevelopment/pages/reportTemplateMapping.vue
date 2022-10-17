<template>
	<div class="table-container purchase equipment">
		<vab-query-form class="dictionary" style="margin-bottom: 16px;">
			<vab-query-form-left-panel style="min-width: 230px;">

			</vab-query-form-left-panel>
			<vab-query-form-right-panel style="padding: 0 20px; ">

			</vab-query-form-right-panel>
		</vab-query-form>
		<el-container class="colors">
			<el-row :gutter="10">
				<el-col :span="6">
					<el-col :span="24">
						<el-input class="input-with-select" placeholder="请输入试验名称" v-model="search.object_name">
							<template #append>
								<el-button icon="el-icon-search" @click="paramsearch"></el-button>
							</template>
						</el-input>
					</el-col>
					<el-col :span="24">
						<el-table ref="tableSort" :data="list" border :element-loading-text="elementLoadingText"
							:height="height" row-key="object_id" highlight-current-row
							:tree-props="{ children: 'children', hasChildren: 'hasChildren' }" lazy
							tooltip-effect="dark" :load="fetchDataEx" @row-click="handleRowClick">
							<el-table-column show-overflow-tooltip prop="object_name" label="试验名称" min-width="80%"
								align="left">
							</el-table-column>
							<el-table-column min-width="20%">

								<template slot-scope="scope">
									<el-dropdown trigger="click" placement="left-start">
										<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary">
										</el-button>
										<el-dropdown-menu slot="dropdown" class="more">
											<el-button>添加同级试验项目</el-button>
											<el-button>添加子试验项目</el-button>
											<el-button>修改试验项目</el-button>
											<el-button>删除试验项目</el-button>
											<el-button>试验项目详情</el-button>
										</el-dropdown-menu>
									</el-dropdown>
								</template>
							</el-table-column>
						</el-table>
					</el-col>
				</el-col>
				<el-col :span="18">
					<el-row>
						<el-col :span="24" style="text-align: right;">
              <el-button type="primary" @click="handleFileOldAdd()">添加已存在模板</el-button>
							<el-button type="primary" @click="handleFileAdd()">添加模板</el-button>
						</el-col>
						<el-col :span="24">
							<el-table ref="tableSort" v-loading="listChildLoading" :data="listChildFile" border
								@row-click="handleRowClickFile" :element-loading-text="elementLoadingText"
								highlight-current-row :height="heightchild" @selection-change="setSelectRows"
								@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
								<el-table-column show-overflow-tooltip label="模板名称" prop="template_name">
								</el-table-column>
								<el-table-column show-overflow-tooltip prop="template_version" label="模板版本">
								</el-table-column>

								<el-table-column show-overflow-tooltip label="操作" width="120px">
									<template #default="{ row }">
										<el-button type="primary" class="normal" @click="handleTemplateEdit(row)">修改
										</el-button>
										<el-button @click="handleTemplateDelete(row)" class="danger">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
							<el-pagination :background="background" :current-page="queryFormFile.pageNo"
								:layout="layout" :page-size="queryFormFile.pageSize" :total="totalFile"
								@current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<h1 class="excelTitle">
								<i></i>映射定义
								<el-button style type="primary" @click="addmap">保存映射</el-button>
							</h1>
						</el-col>
						<!--           <el-col :span="2">

            </el-col>-->
					</el-row>
					<el-row>
						<el-col :span="24">
							<div id="recordsheet" ref="recordsheet"></div>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</el-container>
		<parameterTemplate ref="parameterTemplate"></parameterTemplate>
		<param-edit ref="edit1"></param-edit>
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
	import LuckyExcel from 'luckyexcel'
	import pdf from 'vue-pdf'
	import parameterTemplate from './../components/entrustTemplate'
	import ParamEdit from './../components/parameterManagement'
	import {
		getparamlistone
	} from '@/api/table'
	export default {
		name: 'ComprehensiveTable',
		components: {
			parameterTemplate,
			ParamEdit,
			pdf
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
				paramReload: this.fetchDataEx,
				reload: this.fetchData,
			}
		},
		data() {
			return {
				imgShow: true,
				list: [],
				imageList: [],
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				listChild: [],
				isHasLuckSheet: false,
				listChildLoading: true,
				layoutChild: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				totalFile: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
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
				templist: {
					object_id: '',
          temp_id: ''
				},
				search: {
					object_name: '',
					tpl_name: '',
					enable_time_start: '',
					enable_time_end: '',
					enable: '1'
				},
				input: '',
				list1: [],
				list2: [],
				listChildFile: [],
				src: "",
				pageNum: 1,
				pageTotalNum: 1,
				pageRotate: 0,
				dialogFormVisible: false,
				isViewPdf20: false,
				suredel: false,
				form: {
					param_id: '',
					tpl_class: '1',
					temp_id: ''
				},
				tpl_class: '1',
				listsumbit: [],
				formLabelWidth: '120px',
				options: [{
					value1: '选项1',
					label: '请选择行业'
				}, {
					value1: '1',
					label: '铁路'
				}, {
					value1: '2',
					label: '公路'
				}],
				value1: ''
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
			this.fetchData()
			this.fetchDataEx()
		},
		beforeDestroy() {},
		mounted() {

		},

		methods: {
			pdfdetail(row) {
				this.src = row.temp_file_src
				console.log(row.temp_file_src)
				this.isViewPdf20 = true
			},
			pdfError() {

      },
      addmap() {
        let that = this
        let succorfail = 0
        let count = -1
        console.log(that.listsumbit)
        that.listsumbit.forEach(async(item, index) => {
          count = 0
          if(item.state === 'I')
          {
            let sData = '[Q]452{'+that.form.param_id+'$`'+that.form.tpl_class+'$`'+item.meta_id+'$`'+item.cell+'$`'+that.form.temp_id+'}|^2|^SYS'
            const res = await ExecSql(sData)
            if(res>0)
            {

            }
            else{
              count++
            }
          }
          else if(item.state === 'U')
          {
            let sData = '[Q]478{'+that.form.param_id+'$`'+that.form.tpl_class+'$`'+item.meta_id+'$`'+item.cell+'$`'+that.form.temp_id+'}|^1|^SYS'
            const res = await ExecSql(sData)
            if(res>0)
            {

            }
            else{
              count++
            }
          }
          else if(item.state === 'D')
          {
            let sData = '[Q]477{'+that.form.param_id+'$`'+that.form.tpl_class+'$`'+item.meta_id+'$`'+that.form.temp_id+'}|^1|^SYS'
            const res = await ExecSql(sData)
            if(res>0)
            {

            }
            else{
              count++
            }
          }
        })
        if(count === 0)
        {
          that.$baseMessage('映射定义成功', 'success')
        }
        else{
          that.$baseMessage(count.toString()+'个映射定义失败,请刷新页面查看哪些未定义上', 'error')
        }
        // console.log(succorfail)
        // if(succorfail === that.listsumbit.length)
        // {
        //   that.$baseMessage('指标添加成功', 'success')
        // }
        // else{
        //   that.$baseMessage('指标部分添加失败', 'error')
        // }
      },
      handleRowClick(row) {
        this.form.param_id = row.object_id
        console.log(row)
        this.fetchDataChildFile(row)
      },
      handleRowClickFile(row) {
        this.form.temp_id = row.template_id
        console.log(this.$refs.recordsheet)
        luckysheet.destroy()
        setTimeout(() => {
          this.fetchDataExcel(row)
        }, 500)
        // if(this.isHasLuckSheet)
        // {
        //   luckysheet.destroy({"success":function() {
        //     this.fetchDataExcel(row)
        //   }})
        // }
        // else {

        // }
      },
      paramsearch() {
        this.fetchDataEx()
      },
      tableSortChange() {
        const imageList = []
        this.$refs.tableSort.tableData.forEach((item, index) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleFileAdd() {
        if(this.form.param_id === '')
        {
          this.$baseMessage('请选中参数')
        }
        else
        {
          this.$refs['parameterTemplate'].showEdit(this.form,'0')
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
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleTemplateEdit(row) {
        this.$refs['parameterTemplate'].showEdit(row,'1')
      },
      handleEdit1() {
        this.$refs['edit1'].showEdit()
      },
      handleTemplateDelete(row) {
        if (row.template_id) {
          this.$baseConfirm('你确定要删除此模板吗', null, async () => {

        		let sData = '[Q]481{'+row.template_id+'}|^1|^SYS'
        		const res = await QueryExec(sData)
        		if(res>0)
        		{
        			let sData1 = '[Q]480{'+row.template_id+'}|^1|^SYS'
        			const res1 = await QueryExec(sData1)
        			if(res1>0)
        			{
        				that.$baseMessage('模板删除成功', 'success')
        			}
        			else {
        				that.$baseMessage('模板删除失败', 'error')
        			}
        		}
        		else {
        			that.$baseMessage('模板删除失败', 'error')
        		}

          })
        }
      },
      prePage() {
				var page = this.pageNum
				page = page > 1 ? page - 1 : this.pageTotalNum
				this.pageNum = page
			},
			// 下一页函数
			nextPage() {
				var page = this.pageNum
				page = page < this.pageTotalNum ? page + 1 : 1
				this.pageNum = page
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData()
			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchData()
			},
			handleQuery() {
				this.queryForm.pageNo = 1
				this.fetchData()
			},
			async fetchDataChild(row) {
				this.listChildLoading = true
				if (row) {
					let sData = '[Q]287{' + row.obj_id + '$`' + ((Number(this.queryForm.pageNo) - 1) * Number(this
						.queryForm.pageSize)).toString() + '$`' + this.queryForm.pageSize + '}|^SYS'
					const res = await QueryExec(sData)
					console.log(sData)
					// if(res.data.length!=0)
					// {
					//   res.data.forEach((item, index) => {
					//     const prefix = ViewfileUrl(21)
					//     item.temp_file_src = prefix+item.temp_file
					//     console.log(item.temp_file_src)
					//   })
					// }
					this.listChild = res.data
					this.total = res.total
				}
				setTimeout(() => {
					this.listChildLoading = false
				}, 500)
			},

			async fetchData() {
				let that = this
				that.listLoading = true
				// const { data } = await getparamlistone(this.title)

        that.dialogFormVisible = true
        setTimeout(() => {
          that.listLoading = false
        }, 500)
      },
      async fetchDataExcel(row) {
        let that = this
        let sData1 = '[Q]453{'+this.form.param_id+'$`'+this.tpl_class+'$`'+this.form.temp_id+'}|^SYS'
        const res1 = await QueryExec(sData1)
        console.log(sData1)
        that.listsumbit = []
        // console.log(row)
        // res1.data.forEach((item, index) => {
        //   let coordinate = cellCount(data[0].column,data[0].row,item.cell)
        //   data[0].celldata[coordinate].v.v=item.meta_name
        //   data[0].celldata[coordinate].v.m=item.meta_name
        // })
        let sData = '[Q]451{'+this.form.param_id+'$`'+this.form.temp_id+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData1)
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
              console.log(val)
              if(val !== '/' && val !== null)
              {
                that.listsumbit.push({"meta_id":item.meta_id,"meta_name":item.meta_name,"state":"U","cell":cellConvertToOffice(params.columnIndex,params.rowIndex)})
              }
              else {
                that.listsumbit.push({"meta_id":item.meta_id,"meta_name":item.meta_name,"state":"I","cell":cellConvertToOffice(params.columnIndex,params.rowIndex)})
              }
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
          		this.isHasLuckSheet = true
          	},
          },
        };

        luckysheet.create(option);
        let index = setTimeout(() => {
        	luckysheet.ManualPaste(row.template_json, 0, 0, true)
          res1.data.forEach((item, index) => {
            that.listsumbit.push({"meta_id":item.meta_id,"meta_name":item.meta_name,"state":"","cell":item.cell})
            let coordinate = cellConvert(item.cell)
            luckysheet.setCellFormat(coordinate[0],coordinate[1], "fc", "#ff0000")
            luckysheet.setCellValue(coordinate[0],coordinate[1],item.meta_name)
          })
        }, 300)


			},
			async fetchDataChildFile(row) {
				this.listChildLoading = true
				if (row) {
					let sDataFile = '[Q]491{' + row.object_id + '$`' + ((Number(this.queryFormFile.pageNo) - 1) *
							Number(this.queryFormFile.pageSize)).toString() + '$`' + this.queryFormFile.pageSize +
						'}|^SYS'
					const resFile = await QueryExec(sDataFile)
					console.log(sDataFile)
					if (resFile.data.length != 0) {
						resFile.data.forEach((item, index) => {
							const prefix = ViewfileUrl(21)
							item.temp_file_src = prefix + item.temp_file

						})
					}
					console.log(resFile)
					this.listChildFile = resFile.data
					this.totalFile = resFile.count
				}
				setTimeout(() => {
					this.listChildLoading = false
				}, 500)
			},
			async fetchDataEx(row, treeNode, resolve) {
				//console.log(row, treeNode, resolve)
				this.listLoading = true
				this.listChildLoading = true
				// try {
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


				console.log(row)
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

					const data = TreeDataDealEx(res.data, 0, 'object_id', 'parent_id', 'hasChildren')
					console.log(data)
					this.list = data
				}
				// } catch (e) {
				//   console.log(e)
				// }
				setTimeout(() => {
					this.listLoading = false
				}, 500)
				setTimeout(() => {
					this.listChildLoading = false
				}, 500)
			},
			testMessage() {
				this.$baseMessage('test1', 'success')
			},
			testALert() {
				this.$baseAlert('11')
				this.$baseAlert('11', '自定义标题', () => {
					/* 可以写回调; */
				})
				this.$baseAlert('11', null, () => {
					/* 可以写回调; */
				})
			},
			testConfirm() {
				this.$baseConfirm(
					'你确定要执行该操作?',
					null,
					() => {
						/* 可以写回调; */
					},
					() => {
						/* 可以写回调; */
					}
				)
			},
			testNotify() {
				this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
			},
		},
	}
</script>
<style>
	.el-row {
		width: 100%;
	}

	.el-dialog__body {
		padding: 10px;
	}

	.definition .el-dialog__body {
		display: block !important;
	}

	.definition .el-dialog__footer button {
		margin-left: 100px;
	}
</style>
