<template>
  <!-- 常用标准 -->
	<!-- definition purchase equipment_btn calc -->
	<!-- table-container definition2 -->
	<div class="table-container definition2 definition purchase equipment_btn calc baseBox" style="height: calc(90%);">
		<vab-query-form style="margin-bottom: 0px;">
			<div style="float: left;">
				<el-tag type="info">机构名称：{{org_name}}</el-tag>
				<el-button type="primary" @click="handleAdd" style="margin-left: 5px;">分配新的操作标准</el-button>
			</div>
			<div style="float: right;">
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
					<el-form-item style="margin:0 0 10px 0;">
						<el-input placeholder="按标准名称搜索" v-model="queryForm.doc_name" class="input-with-select">
							<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
						</el-input>
					</el-form-item>
				</el-form>
			</div>
		</vab-query-form>
		<el-main>
			<el-table ref="tableSort" style="" v-loading="listLoading" :data="list" border
				:element-loading-text="elementLoadingText" highlight-current-row height="calc(100vh - 220px)"
				@selection-change="setSelectRows" @sort-change="tableSortChange"
				:header-cell-style="{background:'#e8f0ff' }">
				<el-table-column show-overflow-tooltip prop="manage_id" label="管理编号" min-width="150px">
					<template slot-scope="scope">
						<el-input v-model="scope.row.manage_id" style="width: 100%;"
							@blur="manageIdBlur(scope.row,scope.row.manage_id)"></el-input>
					</template>
				</el-table-column>
				<el-table-column show-overflow-tooltip prop="doc_name" label="规范名称" min-width="150px"></el-table-column>
				<el-table-column show-overflow-tooltip prop="standard_id" label="规范编号" width="140px"></el-table-column>
				<el-table-column show-overflow-tooltip label="实施日期" prop="impl_date" width="120px"></el-table-column>
				<el-table-column show-overflow-tooltip prop="release_org" label="发布单位" min-width="140px">
				</el-table-column>
				<el-table-column show-overflow-tooltip label="标准类型" prop="business_type" min-width="140px">
				</el-table-column>
				<el-table-column show-overflow-tooltip label="PDF文件" prop="file" width="160px" align="center">
					<template #default="{ row }">
						<el-button type="primary" size="mini" @click="pdfdetail(row)" :disabled="!row.pdf_file"
							v-if="row.pdf_file">
							查看
						</el-button>
						<el-button type="primary" size="mini" @click="pdfDownLoad(row)" :disabled="!row.pdf_file"
							v-if="row.pdf_file">
							下载
						</el-button>
						<el-tag type="danger" v-else>无文件
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column show-overflow-tooltip label="操作" width="80px" align="center" fixed="right">
					<template #default="{ row }">
						<el-button @click="deleteMap(row)" class="danger">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-dialog title="删除操作标准" :visible.sync="dialogFormVisible">
				<div style="font-size:22px;">是否将该标准从常用标准中删除？内部管理编号也将一并删除</div>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="deleteMap">确 定</el-button>
					<el-button @click="dialogFormVisible = false">取 消</el-button>
				</div>
			</el-dialog>
			<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
				:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
				@size-change="handleSizeChange"></el-pagination>
			<standardSelectFrom ref="standardSelectFrom" @handleList="handleList"></standardSelectFrom>
			<preview ref="preview"></preview>
		</el-main>

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
		UploadFileNameUrl,
		ViewfileUrlEx,
		UploadfileUrl,
		GetSuffix
	} from '@/utils/servicefile'
	import {
		TreeDataDeal,
		TreeDataDealEx
	} from '@/global/tree_deal'

	import {
		Notify,
		dealRespond,
	} from '@/utils/respondDeal'
	import {
		openDownloadProxy,
		GetHost
	} from '@/utils/downLoad'

	import pdf from 'vue-pdf'
	import standardSelectFrom from '../components/standardSelect.vue'
	import preview from '@/components/fileAbout/preview'
	import treeData from './../../vab/tree/index'
	export default {
		name: 'ComprehensiveTable',
		components: {
			standardSelectFrom,
			treeData,
			preview
		},
		props: {
			type: {
				type: Number,
				default: 10,
			},
			primary_key: {
				type: Number,
				default: 0,
			},
			permission: {
				type: Object,
				default: function() {
					return {}
				},
			},
			nextStatus: {
				type: String
			},
			status: {
				type: String,
				default: '0'
			},
			selectForm: {
				type: Object,
				default: function() {
					return {}
				},
			}
		},
		filters: {

		},
		watch: {
			list(newVal, oldVal) {
				if (newVal) {

				}
			},
			current_org(newVal, oldVal) {
				this.init()
			},
		},
		data() {
			return {
				pdf_file_type: 12,
				org_name: '',
				imgShow: true,
				list: [],
				listTemp: [],
				src: "",
				pageNum: 1,
				pageTotalNum: 1,
				pageRotate: 0,
				// 加载进度
				loadedRatio: 0,
				curPageNum: 0,
				listLoading: false,
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
				isViewPdf20: false,

				table: {
					tableHeight: this.$(window).height()
				}
			}
		},
		computed: {
			height() {
				return this.$baseTableHeight()
			},
			...mapGetters({
				current_org: 'org/current_org',
			}),
		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {
			this.$nextTick(function() {

			});
		},
		methods: {
			init() {
				this.fetchData()
				this.GetOrgName()
			},
			async GetOrgId() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				let org_id = ''
				if (this.role_max == 'super_admin') {
					org_id = this.current_org
				} else {
					org_id = org_pid
				}

				return org_id
			},
			async GetOrgName() {
				let index = setInterval(async () => {
					let org_name = await this.$store.dispatch('org/GetOrgNameByOrgId', await this
						.GetOrgId());
					this.$set(this, 'org_name', org_name)
					if (org_name.trim()) {
						clearInterval(index);
						//this.$set(this.load.status.orgName, 'isShow', true)
					}
				}, 500)
			},
			deleteMap(row) {
				this.$baseConfirm('是否将该标准从常用标准中删除？内部管理编号也将一起删除', null, async () => {
					//opertion_type 0 选中【添加】 1 取消选中【删除】
					let sqlcode = 426

					let list = [{
							field: 'opertion_type',
							type: 3,
							level: 1,
						}, {
							field: 'org_id',
							type: 3,
							level: 2,
						},
						{
							field: 'std_id',
							type: 3,
							level: 3,
						}
					]

					let form = {
						opertion_type: 1,
						org_id: await this.GetOrgId(),
						std_id: row.std_id
					}
					let info = await dealRespond(sqlcode, list, form)
					Notify(this, info[0], info[1]);
					this.fetchData()
				})
			},
			GetStdFromTemp(std_id, ) {
				let temp = this.listTemp.filter((e) => {
					return e.std_id == std_id
				})
				if (temp.length > 0) {
					return temp[0]
				}
				return {}
			},
			async manageIdBlur(row, manage_id) {
				manage_id = manage_id.trim()
				console.log(row, manage_id)
				let std_id = row.std_id
				let temp = this.GetStdFromTemp(std_id)
				if (!temp) {
					Notify(this, false, '未找到该标准，请刷新重试')
					return
				}
				if (temp.manage_id == manage_id) {
					console.log('无需修改')
					return
				}
				console.log('需修改')
				let sqlcode = 423
				let list = [{
					field: 'org_id',
					type: 3,
					level: 1,
				}, {
					field: 'std_id',
					type: 3,
					level: 2,
				}, {
					field: 'manage_id',
					type: 3,
					level: 2,
				}]
				let form = {
					org_id: await this.GetOrgId(), //$store.getters['org/current_org'],
					std_id: std_id,
					manage_id: manage_id
				}
				let info = await dealRespond(sqlcode, list, form)
				Notify(this, info[0], info[1]);
				if (info[0]) {
					temp.manage_id = manage_id
				}
				//this.MainTableReload();
			},
			tableSortChange() {

			},
			handleList(val) {
				this.fetchData()
			},
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
				this.$refs['standardSelectFrom'].showEdit()
			},
			pdfdetail(row) {
				let that = this
				if (row.pdf_file != '') {
					const prefix = ViewfileUrl(this.pdf_file_type)
					console.log(prefix + row.pdf_file)
					let file = {
						src: prefix + row.pdf_file,
						name: row.doc_name + '.pdf'
					}
					this.$refs['preview'].handleEdit(file, 0)
				} else {
					this.$message.error(
						"服务器无可预览文件"
					)
				}
			},
			pdfDownLoad(row) {
				const prefix = ViewfileUrlEx(this.pdf_file_type)
				let pdf_file = prefix + row.pdf_file
				const suffix = GetSuffix(pdf_file)
				let fileName = row.standard_id + '  ' + row.doc_name
				openDownloadProxy(
					pdf_file, //.replace(baseURL, GetHost() + '/webapi'),
					fileName.replace(suffix, '') + '.' + suffix
				)
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
			search() {
				this.fetchData()
			},
			async fetchData() {
				let type = this.type
				switch (type) {
					case 10:
						await this.fetchDataMain()
						break
				}
			},
			async fetchDataMain() {
				let that = this
				let select_list = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'doc_name',
						type: 2,
						level: 1,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 5,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 6,
					},
				]
				that.queryForm.org_id = await that.GetOrgId()
				await that.search_fob(select_list, that, 422, {
					loading: 'listLoading', //加载画面
					data: 'list', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
				that.listTemp = JSON.parse(JSON.stringify(that.list))
				console.log(that.listTemp)
			}

		},
	}
</script>
