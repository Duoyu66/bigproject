<template>
	<div class="table-container definition2 purchase equipment equipment_btn parameterdictionary">
		<vab-query-form class="template dictionary">
			<el-row :gutter="15">
				<el-col :span="5">
					<el-input v-model="search.param" placeholder="按模板名称搜索" prefix-icon="el-icon-search">
            <template #prepend>
              <el-button type="primary" @click="handleFileAdd()">添加模板</el-button>
            </template>
						<template #append>
							<el-button icon="el-icon-search" @click="paramsearch"></el-button>
						</template>
					</el-input>
				</el-col>
        <el-col :span="7">
        	<el-button type="primary" @click="handleStageAdd()">添加步骤</el-button>
        </el-col>
<!-- 				<el-col :span="18">
					<el-row :gutter="15">

					</el-row>
				</el-col> -->
			</el-row>
		</vab-query-form>

		<el-container class="colors">
			<el-row :gutter="15">
        <el-col :span="5">
          <el-row>
            <el-col :span="24">
              <el-table ref="tableSort" v-loading="listChildFileLoading" :data="listChildFile" border
               	@row-click="handleRowClickFile" :element-loading-text="elementLoadingText"
               	highlight-current-row :height="height" @selection-change="setSelectRows"
               	@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }" >
                <el-table-column show-overflow-tooltip label="标识" prop="template_id" width="50px">
                </el-table-column>
               	<el-table-column show-overflow-tooltip label="模板名称" prop="template_name">
               	</el-table-column>
               	<el-table-column show-overflow-tooltip prop="template_sheetcount" label="页签数" width="70px">
               	</el-table-column>

               	<el-table-column show-overflow-tooltip label="操作" width="120px">
               		<template #default="{ row }">
               			<el-button type="primary" class="normal" @click="handleTemplateEdit(row)">修改
               			</el-button>
               			<el-button @click="handleTemplateDelete(row)" class="danger">删除</el-button>
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
          </el-row>
        </el-col>
				<el-col :span="7">
          <el-row>
            <el-col :span="24">
            	<el-table ref="tableSort" v-loading="listStageLoading" :data="listStage" border @row-click="handleRowClickStage"
            		:element-loading-text="elementLoadingText" highlight-current-row :height="heightchild"
            		@selection-change="setSelectRows" @sort-change="tableSortChange"
            		:header-cell-style="{ background: '#e8f0ff' }">
            		<el-table-column show-overflow-tooltip label="步骤标识" prop="stage_id" align="center" width="80px">
            		</el-table-column>
            		<el-table-column show-overflow-tooltip prop="sheet_id" label="页数" align="center" width="80px">
            		</el-table-column>
            		<el-table-column show-overflow-tooltip label="是否表" prop="isTable" align="center" width="80px">
            		</el-table-column>
            		<el-table-column show-overflow-tooltip label="sql语句" prop="sql_val"
            			align="center"></el-table-column>

            		<el-table-column show-overflow-tooltip label="操作" width="120px">
            			<template #default="{ row }">
            				<el-button type="primary" class="normal" @click="handleStageEdit(row)">
            					修改
            				</el-button>
            				<el-button class="danger" @click="handleStageDelete(row)">删除</el-button>
            			</template>
            		</el-table-column>
            	</el-table>
            	<el-pagination :background="background"
                :current-page="queryFormStage.pageNo"
                :layout="layout"
            		:page-size="queryFormStage.pageSize"
                :total="total" @current-change="handleCurrentChangeStage"
            		@size-change="handleSizeChangeStage">
                </el-pagination>
            </el-col>
            <el-col :span="16" style="margin-top: 10px;margin-bottom: 10px;">
            	<el-button type="primary" icon="el-icon-plus" @click="handleAdd()">添加导出参数</el-button>
            </el-col>
            <el-col :span="8" style="margin-top: 10px;margin-bottom: 10px;">
            	<el-input v-model="queryForm.meta_name" placeholder="按导出参数名称搜索">
            		<template #append>
            			<el-button icon="el-icon-search" @click="meta_search"></el-button>
            		</template>
            	</el-input>
            </el-col>
            <el-col :span="24">
            	<el-table ref="tableSort" v-loading="listChildLoading" :data="listChild" border
            		:element-loading-text="elementLoadingText" highlight-current-row :height="heightchild"
            		@selection-change="setSelectRows" @sort-change="tableSortChange"
            		:header-cell-style="{ background: '#e8f0ff' }">
            		<el-table-column show-overflow-tooltip label="指标标识" prop="map_id" align="center">
            		</el-table-column>
            		<el-table-column show-overflow-tooltip prop="field_name" label="字段名(中)" align="center" min-width="100px">
            		</el-table-column>
            		<el-table-column show-overflow-tooltip label="字段名(英)" prop="field_title" align="center" min-width="100px">
            		</el-table-column>
            		<el-table-column show-overflow-tooltip label="单元格" prop="cell"
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
				</el-col>

				<el-col :span="12">
          <el-row>
          	<el-col :span="24">
          		<h1 class="excelTitle" style="margin: 0;">
          			<i></i>参数模板定义
          			<el-button style type="primary"   @click="addmap" style="margin-right: 10px;">保存映射</el-button>
                <el-button style type="primary"   @click="clearmap" style="margin-right: 10px;">清空映射</el-button>
          		</h1>
          	</el-col>
          </el-row>
          <el-row>
          	<el-col :span="24">
<!--              <div id="recordsheet" ref="recordsheet"></div> -->
            <iframe src="/SpreadJsDictionary.html" frameborder="0" width="100%" style="margin:0px;padding:0px;height: 700px;border:1px solid #CCCCCC" id="myframe" ref="myframe"
              	@load="loaded"></iframe>
          	</el-col>
          </el-row>

				</el-col>
			</el-row>
		</el-container>
		<exportStage ref="exportStage" @fetchDataChild="fetchDataStage"></exportStage>
    <exportDict ref="exportDict" @fetchDataChild="fetchDataChild"></exportDict>
    <parameterDictionary ref="parameterDictionary" @fetchDataChild="fetchDataChild"></parameterDictionary>
		<parameterTemplate ref="parameterTemplate" @fetchDataChildFile="fetchDataChildFile"></parameterTemplate>
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
	import parameterTemplate from './../components/parameterTemplate'
  import exportStage from '../components/exportStage.vue'
  import exportDict from '../components/exportDict.vue'
	// import TableEdit2 from '../components/parameterDictionary2.vue'
	import treeData from './../../vab/tree/index'
	export default {
		name: 'ComprehensiveTable',
		components: {
			parameterDictionary,
			parameterTemplate,
			treeData,
      exportStage,
      exportDict
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
        listStage: [],
				listChildFile: [],
				listChildLoading: false,
        listStageLoading: false,
				layoutChild: 'total, sizes, jumper',
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
          template_json: '',
          stage_id: '',
          template_name: ''
				},
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					title: '',
					meta_name: ''
				},
        queryFormStage: {
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
        this.templist.template_name = row.template_name
        this.templist.template_version = row.template_version
        this.templist.map_version = row.map_version
        let sData = '[Q]690{'+row.template_id+'}|^SYS'
        const res = await QueryExec(sData)
        if(res.data !== undefined && res.data.length>0)
        {
          row.template_json = res.data[0].template_json
        }
        this.entrustInfo = row
				this.fetchDataStage(row)
        this.loaded()
        //luckysheet.destroy()
        setTimeout(() => {
          //this.fetchDataExcel(row)
        }, 500)
      },
      async handleRowClickStage(row) {
        this.rowfile = row
        this.queryForm.pageNo = 1
      	this.templist.stage_id = row.stage_id
        this.entrustInfo = row
      	this.fetchDataChild(row)
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
				this.fetchDataChild()
			},
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
        this.$refs['exportDict'].showEdit(this.templist, '0')
			},
			handleOldAdd(row) {
				this.$refs['parameterDictionary'].showEdit()
			},
			handleEdit(row) {
        row.meta_version = this.templist.meta_version
				 this.$refs['exportDict'].showEdit(row, '1')
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
      async handleStageEdit(row) {
        this.$refs['exportStage'].showEdit(row, '1')
      },
			handleTemplateDelete(row) {
        let that = this
        if (row.template_id) {
          this.$baseConfirm('你确定要删除此模板吗', null, async () => {

        		let sData = '[Q]769{'+row.template_id+'}|^1|^SYS'
        		const res = await ExecSql(sData)
        		if(res>0)
        		{
        			// let sData1 = '[Q]481{'+row.template_id+'}|^1|^SYS'
        			// const res1 = await ExecSql(sData1)
        			that.$baseMessage('模板删除成功', 'success')
              that.fetchDataChildFile()
        		}
        		else {
        			that.$baseMessage('模板删除失败', 'error')
        		}

          })
        }

			},
      handleStageDelete(row) {
        let that = this
        if (row.stage_id) {
          that.$baseConfirm('你确定要删除此步骤吗', null, async () => {

        		let sData = '[Q]771{'+row.stage_id+'}|^1|^SYS'
        		const res = await ExecSql(sData)
            console.log(res)
        		if(res>0)
        		{
              // let sData1 = '[Q]670{'+row.id+'}|^1|^SYS'
              // const res1 = await ExecSql(sData1)
              // if(res1>0) {
                that.fetchDataChild()
                that.$baseMessage('指标删除成功', 'success')
              // }
              // else {
              //   that.$baseMessage('指标删除失败', 'error')
              // }
        		}
        		else {
        			that.$baseMessage('指标删除失败', 'error')
        		}
          })
        }
			},
      handleMetaDelete(row) {
        let that = this
        if (row.map_id) {
          that.$baseConfirm('你确定要删除此步骤吗', null, async () => {

        		let sData = '[Q]772{'+row.map_id+'}|^1|^SYS'
        		const res = await ExecSql(sData)
            console.log(res)
        		if(res>0)
        		{
              // let sData1 = '[Q]670{'+row.id+'}|^1|^SYS'
              // const res1 = await ExecSql(sData1)
              // if(res1>0) {
                that.fetchDataChild()
                that.$baseMessage('指标删除成功', 'success')
              // }
              // else {
              //   that.$baseMessage('指标删除失败', 'error')
              // }
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
      handleCurrentChangeStage(val) {
				this.queryFormStage.pageNo = val
				this.fetchDataStage()
			},
      handleSizeChangeStage(val) {
				this.queryFormStage.pageSize = val
				this.fetchDataStage()
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
      handleStageAdd() {
      	this.$refs['exportStage'].showEdit(this.templist, '0')
      },
			async fetchDataChild(row) {
				this.listChildLoading = true
        let sData = '[Q]697{' + this.templist.stage_id + '$`%' + this.queryForm.meta_name +
        	'%$`' + ((Number(this.queryForm.pageNo) - 1) * Number(this.queryForm.pageSize)).toString() +
        	'$`' + this.queryForm.pageSize + '}|^SYS'
        const res = await QueryExec(sData)

        this.listChild = res.data

        this.total = res.total
				setTimeout(() => {
					this.listChildLoading = false
				}, 500)
			},
      async fetchDataStage(row) {
      	this.listStageLoading = true
        let sData = '[Q]698{' + this.templist.temp_id + '$`' + ((Number(this.queryFormStage.pageNo) - 1) * Number(this.queryFormStage.pageSize)).toString() +
        	'$`' + this.queryFormStage.pageSize + '}|^SYS'
        const res = await QueryExec(sData)

        this.listStage = res.data

        this.total = res.total
      	setTimeout(() => {
      		this.listStageLoading = false
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
