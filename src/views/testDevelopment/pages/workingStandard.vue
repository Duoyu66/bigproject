<template>
  <!-- 操作标准定义、标准 -->
  <!-- 去掉了class  table-container -->
	<div class=" definition purchase equipment_btn baseBox">
		<vab-query-form style="margin-bottom: 10px">
			<vab-query-form-left-panel style="float: left; width: auto;">
				<el-button type="primary" @click="handleStandardAdd" >添加标准规范</el-button>
			</vab-query-form-left-panel>
			<vab-query-form-right-panel style="float:right;width: auto;" >
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input placeholder="请输入规范名称" v-model="queryForm.title" class="input-with-select">

            </el-input>
          </el-form-item>
					<el-form-item style="padding-left: 10px;">
					  <el-button
					    icon="el-icon-search"
					    type="primary"
					    native-type="submit"
					    @click="search"
					  >
					    查询
					  </el-button>
					</el-form-item>
				</el-form>
			</vab-query-form-right-panel>
		</vab-query-form>
		<el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"
			highlight-current-row  @selection-change="setSelectRows" @sort-change="tableSortChange"
			:header-cell-style="{ background: '#e8f0ff' }"
      :height="height">
			<el-table-column show-overflow-tooltip prop="doc_name" label="规范名称" min-width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="standard_id" label="规范编号" width="140px"></el-table-column>
			<el-table-column show-overflow-tooltip label="实施日期" prop="impl_date" width="120px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="release_org" label="发布单位" min-width="140px"></el-table-column>
			<el-table-column show-overflow-tooltip label="标准类型" prop="business_type" min-width="140px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="file" label="PDF文件" width="100px">
				<template #default="{ row }">
					<el-button type="primary" size="mini" @click="pdfdetail(row)">
						查看文件
					</el-button>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="120px">
				<template #default="{ row }">
					<el-button type="primary" class="normal" @click="handleStandardEdit(row)">
						修改
					</el-button>
					<el-button @click="handleDelete(row)" class="danger">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="删除标准规范" :visible.sync="suredel">
			<div style="font-size: 22px">
				您的删除将删除本条标准规范及相关的所有数据包括(管理编号、名称、编号、启用日期设备类型描述、发布单位、PDF文件）
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="suredel = false">确 定</el-button>
				<el-button @click="suredel = false">取 消</el-button>
			</div>
		</el-dialog>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :pager-count="6" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<workingStandard ref="workingStandard" @fetchData="fetchData"></workingStandard>
		<preview ref="preview"></preview>
		<!-- <table-edit1 ref="edit1"></table-edit1> -->
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
	import pdf from 'vue-pdf'
	import workingStandard from '../components/workingStandard.vue'
	import preview from '@/components/fileAbout/preview'
	// import TableEdit1 from '../components/workingStandard1.vue'
	import treeData from './../../vab/tree/index'
	export default {
		name: 'ComprehensiveTable',
		components: {
			workingStandard,
			// TableEdit1,
			treeData,
			preview
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
				src: "",
				pageNum: 1,
				pageTotalNum: 1,
				pageRotate: 0,
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					title: '',
				},
				dialogFormVisible: false,
				suredel: false,
				isViewPdf20: false,

			}
		},
		computed: {
			height() {
				// return this.$baseTableHeight()
        	// this.height = 'calc(63vh)'
          return this.height = 'calc(100vh - 222px)'
			},
		},
		created() {
			this.fetchData()
		},
		beforeDestroy() {},
		mounted: function() {

		},
		methods: {
			tableSortChange() {
				const imageList = []
				this.$refs.tableSort.tableData.forEach((item, index) => {
					imageList.push(item.img)
				})
				this.imageList = imageList
			},
			search() {
				this.fetchData()
			},
			pdfdetail(row) {
				let that = this
				console.log(row)
				if (row.pdf_file_table.name != '') {
					this.$refs['preview'].handleEdit(row.pdf_file_table)
				} else {
					this.$message.error(
						"服务器无可预览文件"
					)
				}
			},
			setSelectRows(val) {
				this.selectRows = val
			},
			handleStandardAdd() {
				this.$refs['workingStandard'].showEdit()
			},
			handleStandardEdit(row) {
				this.$refs['workingStandard'].showEdit(row, '1')
			},
			handleDelete(row) {
        if (row.std_id) {
          this.$baseConfirm('你确定要删除'+row.standard_id+' '+row.doc_name+'标准吗', null, async () => {

        		let sData = '[Q]631{'+row.std_id+'}|^1|^SYS'
        		const res = await ExecSql(sData)
        		if(res>0)
        		{
              this.fetchData()
        			this.$baseMessage('标准删除成功', 'success')
        		}
        		else {
        			this.$baseMessage('标准删除失败', 'error')
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
			async fetchData() {
				this.listLoading = true
				let sData = '[Q]256{%' + this.queryForm.title + '%$`' + ((Number(this.queryForm.pageNo) - 1) * Number(
					this.queryForm.pageSize)).toString() + '$`' + this.queryForm.pageSize + '}|^SYS'
				const res = await QueryExec(sData)
				console.log(res)
				this.list = res.data
				const imageList = []
				if (res.data.length != 0) {
					res.data.forEach((item, index) => {
						const prefix = ViewfileUrl(12)
						item.pdf_file_table = {
							name: item.pdf_file,
							src: prefix + item.pdf_file
						}
					})
				}
				this.imageList = imageList
				this.total = res.totalCount
				setTimeout(() => {
					this.listLoading = false
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
