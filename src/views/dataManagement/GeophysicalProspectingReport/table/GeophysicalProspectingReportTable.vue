<template>
	<div>
		<el-table ref="tableSort" v-loading="listLoading" highlight-current-row :data="tablelist" border
			:element-loading-text="elementLoadingText" :height="table.tableHeight"
			:header-cell-style="{ background: '#e8f0ff' }" @sort-change="tableSortChange"
			@selection-change="handleSelectionChange" @select="handleSelectionChange" @row-click="rowClick"
			v-if="table.isShow">
			<el-table-column show-overflow-tooltip label="状态" prop="status" width="100px" align="center"
				header-align="center">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.status=='100'" type="success">通过
					</el-tag>
					<el-tag v-else-if="scope.row.status=='0'" type="info">草稿
					</el-tag>
					<el-tag v-else-if="scope.row.status=='10'" type="danger">待复核
					</el-tag>
					<el-tag v-else-if="scope.row.status=='11'" color="#CD853F">复核不通过
					</el-tag>
					<el-tag v-else-if="scope.row.status=='12'" color="#f99440">待重新复核
					</el-tag>
					<el-tag v-else-if="scope.row.status=='20'" color="#483D8B">待审核
					</el-tag>
					<el-tag v-else-if="scope.row.status=='21'" color="#27214d">审核不通过
					</el-tag>
					<el-tag v-else-if="scope.row.status=='22'" color="#705fdf">待重新审核
					</el-tag>
					<el-tag v-else-if="scope.row.status=='30'" type="warning">待审定
					</el-tag>
					<el-tag v-else-if="scope.row.status=='31'" color="#CD5C5C">审定不通过
					</el-tag>
					<el-tag v-else-if="scope.row.status=='32'" color="#BC8F8F">待重新审定
					</el-tag>
					<el-tag v-else-if="scope.row.status=='-1'" color="#808080">作废
					</el-tag>
					<el-tag v-else>{{scope.row.status}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="编写人" prop="compiler" align="center" header-align="center"
				width="65px"></el-table-column>
			<el-table-column show-overflow-tooltip label="编写时间" prop="writingTime" align="center" header-align="center"
				width="100px"></el-table-column>
			<el-table-column label="成果文件" prop="achievement_file" min-width="200px" header-align="center">
				<template slot-scope="scope">
					<FileShowAndDownLoad v-show="scope.row.achievement_file" :src="scope.row.achievement_file"
						:fileName="scope.row.achievement_file_name" :fileTypeUrl="file_upload_type" :maxShowChar="0">
					</FileShowAndDownLoad>
				</template>
			</el-table-column>
			<el-table-column label="报告文件" prop="report_file" min-width="200px" header-align="center">
				<template slot-scope="scope">
					<FileShowAndDownLoad v-show="scope.row.report_file" :src="scope.row.report_file"
						:fileName="scope.row.report_file_name" :fileTypeUrl="file_upload_type" :maxShowChar="0">
					</FileShowAndDownLoad>
				</template>
			</el-table-column>
			<el-table-column label="附件" prop="compile_enclosure" min-width="200px" header-align="center">
				<template slot-scope="scope">
					<FileShowAndDownLoad v-show="scope.row.compile_enclosure" :src="scope.row.compile_enclosure"
						:fileName="scope.row.compile_enclosure_name" :fileTypeUrl="file_upload_type" :maxShowChar="0">
					</FileShowAndDownLoad>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="复核人" prop="review_person" align="center" header-align="center"
				width="65px">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top" v-if="scope.row.review_person">
						<p>复核: {{ scope.row.review_person }}</p>
						<p>复核时间: {{ scope.row.review_time }}</p>
						<p v-show="scope.row.review_opinion">复核回复: {{ scope.row.review_opinion }}</p>
						<FileShowAndDownLoad v-show="scope.row.review_enclosure" :src="scope.row.review_enclosure"
							:fileName="scope.row.review_enclosure_name" :fileTypeUrl="file_upload_type">
						</FileShowAndDownLoad>
						<div slot="reference" class="name-wrapper">
							<div>{{scope.row.review_person}}
							</div>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="审核人" prop="examine_person" align="center"
				header-align="center" width="65px">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top" v-if="scope.row.examine_person">
						<p>审核人: {{ scope.row.examine_person }}</p>
						<p>审核时间: {{ scope.row.examine_time }}</p>
						<p v-show="scope.row.examine_opinion">审核回复: {{ scope.row.examine_opinion }}</p>
						<FileShowAndDownLoad v-show="scope.row.examine_enclosure" :src="scope.row.examine_enclosure"
							:fileName="scope.row.examine_enclosure_name" :fileTypeUrl="file_upload_type">
						</FileShowAndDownLoad>
						<div slot="reference" class="name-wrapper">
							<div>{{scope.row.examine_person}}
							</div>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="审定人" prop="approve_person" align="center"
				header-align="center" width="65px">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top" v-if="scope.row.approve_person">
						<p>审定人: {{ scope.row.approve_person }}</p>
						<p>审定时间: {{ scope.row.approve_time }}</p>
						<p v-show="scope.row.approve_opinion">审定回复: {{ scope.row.approve_opinion }}</p>
						<FileShowAndDownLoad v-show="scope.row.approve_enclosure" :src="scope.row.approve_enclosure"
							:fileName="scope.row.approve_enclosure_name" :fileTypeUrl="file_upload_type">
						</FileShowAndDownLoad>
						<div slot="reference" class="name-wrapper">
							<div>{{scope.row.approve_person}}
							</div>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="60px" fixed="right" v-if="hideColFob('operation')"
				align="center" header-align="center">
				<template #default="{ row }">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown" class="more">
							<template v-for="item in dropdown.menu">
								<el-dropdown-item v-if="ishasPermission(item.permission_name,row)"
									@click.native="handleCommand(item.command, row)" :icon="item.icon ?item.icon:''">
									{{ item.label }}
								</el-dropdown-item>
							</template>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<GeophysicalProspectingReportAdd ref="GeophysicalProspectingReportAdd" @reload="searchTable">
		</GeophysicalProspectingReportAdd>
		<GeoReportReviewDialog ref="GeoReportReviewDialog" @reload="searchTable">
		</GeoReportReviewDialog>
		<GeoReportExamineDialog ref="GeoReportExamineDialog" @reload="searchTable">
		</GeoReportExamineDialog>
		<GeoReportApproveDialog ref="GeoReportApproveDialog" @reload="searchTable">
		</GeoReportApproveDialog>
	</div>
</template>

<script>
	import {
		Notify,
		dealRespond,
	} from '@/utils/respondDeal'
	import {
		treePaging
	} from '@/global/form.helper'
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'
	import {
		handleSelectionChange,
		toggleSelectionList
	} from '@/utils/tableHelper'

	import {
		file_upload_type,
		type_str,
		type_array,
		GetOrgId,
		GetCurrentOrgId
	} from '../common/common.js'

	import GeophysicalProspectingReportAdd from '../dialog/GeophysicalProspectingReportAdd'
	import GeoReportReviewDialog from '../dialog/GeoReportReviewDialog'
	import GeoReportExamineDialog from '../dialog/GeoReportExamineDialog'
	import GeoReportApproveDialog from '../dialog/GeoReportApproveDialog'
	import FileShowAndDownLoad from '@/components/fileAbout/FileShowAndDownLoad'
	export default {
		name: 'GeophysicalProspectingReportTable',
		components: {
			GeophysicalProspectingReportAdd,
			GeoReportReviewDialog,
			GeoReportExamineDialog,
			GeoReportApproveDialog,
			FileShowAndDownLoad
		},
		props: {
			type: {
				type: String,
				default: 'report_main',
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
			select_org_id: {
				type: String,
				default: '',
			},
			status: {
				type: String,
				default: ''
			}
		},
		provide() {
			return {
				reload: this.fetchData,
			}
		},
		computed: {
			...mapGetters({
				org_pid: 'user/org_pid',
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
			}),
		},
		watch: {
			primary_key(newVal, oldVal) {
				switch (this.type) {
					case 'chemical_store':
						this.fetchData({
							reload: 1,
						})
						break
				}

			},
			tableReload(newVal, oldVal) {
				this.fetchData({

				})
			},
			main_dialog(newVal, oldVal) {
				let selectedRow = JSON.parse(JSON.stringify(this.selectedRow))
				this.selectedRow = {
					seal_id: -1
				}
				this.fetchData()
				setTimeout(function() {
					this.selectedRow = selectedRow
				}, 500)

			},
			current_org_id() {
				this.fetchData()
			},
			selectedRow(newVal, oldVal) {
				console.log(newVal);
				switch (this.type) {
					case 'report_main':
						if (newVal && newVal.report_id) {
							this.$emit('update:primary_key', Number(newVal.report_id));
						}
						break
				}


			},
			tablelist(newVal, oldVal) {
				if (newVal && newVal.length > 0) {
					this.$set(this.table, 'isShow', false)
					this.$nextTick(() => {
						this.$set(this.table, 'isShow', true)
					})
				}
			},
		},
		data() {
			return {
				file_upload_type: file_upload_type,
				tableReload: false,
				main_dialog: false,
				background: false,
				listLoading: false,
				tablelist: [],
				selectedRow: {},
				selectedRowList: {},
				elementLoadingText: '加载数据中',
				queryForm: {
					pageNo: 1,
					pageSize: 20,
				},
				demotableexpand: {
					mainTable: [{
						field: 'doc_id',
						label: '收文编号',
						isShow: true,
					}]
				},
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				columnHideList: ['selection'],

				table: {
					tableHeight: 'calc(80%)',
					isShow: true,
				},
				dropdown: {
					menu: [{
							command: 'editReport',
							permission_name: 'edit',
							label: '修改报告'
						},
						{
							command: 'review',
							permission_name: 'review',
							label: '复核报告'
						},
						{
							command: 'examine',
							permission_name: 'examine',
							label: '审核报告'
						},
						{
							command: 'approve',
							permission_name: 'approve',
							label: '审定报告'
						},
						{
							command: 'Delete',
							permission_name: 'delete',
							label: '删除'
						},
						{
							command: '',
							permission_name: 'empty',
							label: '无权限操作此行数据'
						}
					],
					count: {

					}
				},
			}
		},
		created() {
			this.init()
		},
		methods: {
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					case 'report_main':
						this.columnHideList = []
						this.table.tableHeight = 'calc(47vh - 172px)'
						this.fetchData()
						break
				}
			},
			handleSelectionChange(val, row) {
				if (!val || val.length == 0) {
					val = []
				}
				this.selectedRowList = val
				if (!row) {
					return false
				}


			},
			rowClick(row) {
				this.selectedRow = row
				if (this.radioRow) {
					this.radioRow(row)
				}
			},
			GetHeight() {},
			//判断是否隐藏列，ture为不隐藏，false为隐藏
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
			ishasPermission(name, row, e) {
				let is_super_admin = false;
				if (!name) {
					if (this.dropdown.count[row.store_id]) {
						this.dropdown.count[row.store_id]++
					} else {
						this.dropdown.count[row.store_id] = 1
					}
					return true
				}
				let permission_name = ''
				let permissionRegister = {
					report_main: {
						editReport: 'editGeoReport',
						review: 'reviewGeoReport',
						examine: 'examineGeoReport',
						approve: 'approveGeoReport',
						delete: 'deleteGeoReport',
					}
				}
				switch (name) {
					default:
						if (permissionRegister[this.type] && permissionRegister[this.type][name]) {
							permission_name = permissionRegister[this.type][name]
						} else {
							permission_name = name
						}
						break
				}
				let flag = hasPermission(this.permission, permission_name)
				if (name == 'empty') {
					if (!this.dropdown.count[row.store_id]) {
						flag = true;
					}

				}

				let role_max = this.role_max
				if (role_max == 'super_admin') {
					is_super_admin = true;
					if (name != 'empty') {
						flag = true
						if (this.dropdown.count[row.store_id]) {
							this.dropdown.count[row.store_id]++
						} else {
							this.dropdown.count[row.store_id] = 1
						}
						return flag;
					}
				}
				let dropdowMenu = {
					report_main: ['all'],
				}
				if (dropdowMenu[this.type]) {
					let menu_list = dropdowMenu[this.type];
					if (menu_list.indexOf('all') >= 0) {

					} else if (menu_list.indexOf(name) < 0) {
						flag = false
					}
				}
				if (row.org_id != this.org_pid) {
					switch (name) {
						case 'empty':
							break
						default:
							flag = false
							break
					}

				}
				if (!flag) {
					return flag
				}
				switch (name) {
					case 'editReport':
						if ((row.compiler_id == this.person_id && (row.status <= 12 || row.status == 21 || row
								.status == 22 || row.status == 31 || row.status == 32))) {
							flag = true;
						} else {
							flag = false;
						}
						break
					case 'review':
						if (row.compiler_id != this.person_id && (row.status == 10 || row.status == 11 || row.status ==
								12)) {
							flag = true;
						} else {
							flag = false;
						}
						break;
					case 'examine':
						if (row.compiler_id != this.person_id && row.review_person_id != this.person_id && (row
								.status ==
								20 || row.status == 21 || row.status ==
								22)) {
							flag = true;
						} else {
							flag = false;
						}
						break;
					case 'approve':
						if (row.compiler_id != this.person_id && row.review_person_id != this.person_id && row
							.examine_person_id != this.person_id && (row
								.status ==
								30 || row.status == 31 || row.status ==
								32)) {
							flag = true;
						} else {
							flag = false;
						}
						break;

					default:
						flag = flag
						break;
				}
				if (flag) {
					let person_id = this.person_id;
					switch (name) {
						case 'empty':
							break
						default:
							if (this.dropdown.count[row.store_id]) {
								this.dropdown.count[row.store_id]++
							} else {
								this.dropdown.count[row.store_id] = 1
							}
							break
					}

				}

				return flag
			},
			handleCommand(command, row) {
				switch (command) {
					case 'editReport':
						this.handleEdit(row)
						break
					case 'review':
						this.GeoReportReview(row)
						break
					case 'examine':
						this.GeoReportExamine(row)
						break
					case 'approve':
						this.GeoReportApprove(row)
						break
					case 'ChemicalChecky':
						this.handleChemicalChecky(row)
						break
					case 'Delete':
						this.handleDelete(row)
						break
					default:
						break;
				}
			},
			GeoReportApprove(row) {
				this.$refs['GeoReportApproveDialog'].showEdit(undefined, row);
			},
			GeoReportExamine(row) {
				this.$refs['GeoReportExamineDialog'].showEdit(undefined, row);
			},
			GeoReportReview(row) {
				this.$refs['GeoReportReviewDialog'].showEdit(undefined, row);
			},
			getHideColist() {},
			tableSortChange() {},
			handleEdit(row) {
				this.$refs['GeophysicalProspectingReportAdd'].showEdit(row)
			},
			async GetHistory(pageNo, report_id, total) {
				let pageSize = 100;
				let data = [];
				if (typeof pageNo == 'undefined') {
					pageNo = 1;
				}
				let sqlcode = 863;
				let filed = {};
				let list = [{
						field: 'pageNo',
						type: 3,
						level: 1,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 2,
					}, {
						field: 'report_id',
						type: 3,
						level: 3,
					},
				]

				filed = {
					report_id: report_id,
					pageSize: 100,
					pageNo: pageNo
				};
				let res = await this.QueryExecAndPage_fob(sqlcode, list, filed);
				if (res && res.data && res.data.length > 0) {
					if (typeof total == 'undefined') {
						total = res.data[0]['Total'];
						try {
							total = parseFloat(total);
						} catch (e) {
							console.log(e);
						}
					}
					for (let i = 0; i < res.data.length; i++) {
						data.push(res.data[i]);
					}
				} else {
					return data;
				}
				if (data.length < total) {

					let pageNext = await this.GetHistory(pageNo + 1, report_id, total);
					for (let i = 0; i < pageNext.length; i++) {
						data.push(pageNext[i]);
					}
				}
				return data;
			},
			async handleDelete(row) {
				let sqlcode = -1;
				let tips = '';
				let data, file, temp;
				try {
					this.listLoading = true;
					switch (this.type) {
						case 'report_main':
							data = await this.GetHistory(1, row.report_id);
							console.log('handleDelete', data);
							file = {
								achievement_file: file_upload_type,
								report_file: file_upload_type,
								compile_enclosure: file_upload_type,
								review_enclosure: file_upload_type,
								examine_enclosure: file_upload_type,
								approve_enclosure: file_upload_type
							};
							temp = 'history';
							let fileSet = new Set();
							for (let i = 0; i < data.length; i++) {
								if (!data[i].enclosure) {
									continue;
								}
								if (fileSet.has(data[i].enclosure)) {
									continue;
								}
								fileSet.add(data[i].enclosure);
								row[temp + i] = data[i].enclosure;
								file[temp + i] = file_upload_type;
							}
							console.log('handleDelete', data);
							console.log('handleDelete row', row);
							console.log('handleDelete file', file);
							sqlcode = 864;
							tips = '确定删除日期：' + row.writingTime + ' 编写人：' + row.compiler + '的物探报告？'
							break
						case 10:
							break
						case 11:
							break
					}
					this.listLoading = false;
					if (sqlcode < 0) {
						return
					}
					this.delete_from_fob(this, row, sqlcode, {
						//"selectRows": "selectRows", //复选框选中数据
						"fetchData": "fetchData", //加载数据
						"main_key": "report_id", //主键
						'confirmMsg': tips,
						"file": file
					});
				} catch (e) {
					console.log(e);
				}
				this.listLoading = false;

			},
			paginationHadle() {},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchData({
					pageNo: val,
				})
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData({
					pageNo: this.queryForm.pageNo,
				})
			},
			searchTable() {
				this.fetchData({
					pageNo: this.queryForm.pageNo
				})
			},
			search(data) {
				if (data) {
					this.queryForm = Object.assign(data, this.queryForm)
				}
				this.queryForm.pageNo = 1
				this.fetchData()
			},
			GetCurrentOrg() {
				if (this.current_org_id > 0) {
					return this.current_org_id
				}
				return this.org_id
			},
			toggleSelection() {
				let data = this.tablelist
				let length = data.length
				let selectList = []
				for (let i = 0; i < length; i++) {
					try {
						let item = data[i]

						if (!item.alloc_num) {
							continue
						}

						let hasNum = Number(item.alloc_num)
						if (hasNum <= 0) {
							continue
						}
						selectList.push(item)
					} catch (e) {
						console.log(e)
					}
				}
				toggleSelectionList(this, 'tableSort', selectList)
			},
			async fetchData(pageInfo, treeNode, resolve) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				console.log('fetchData', that.type);
				switch (that.type) {
					case 'report_main':
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
				}
			},
			async getOrgId() {
				let org_id = ''
				if (this.select_org_id) {
					return this.select_org_id
				}
				org_id = await GetCurrentOrgId()
				return org_id
			},
			async fetchDataMain(pageInfo, treeNode, resolve) {
				let alist = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'status',
						type: 3,
						level: 2,
					},
					{
						field: 'compiler',
						type: 2,
						level: 3,
					},
					{
						field: 'review_person',
						type: 2,
						level: 4,
					},
					{
						field: 'examine_person',
						type: 2,
						level: 5,
					},
					{
						field: 'approve_person',
						type: 2,
						level: 6,
					},
					{
						field: 'writingTime_start',
						type: 3,
						level: 7,
					},
					{
						field: 'writingTime_end',
						type: 3,
						level: 8,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 9,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 9,
					},
				]
				let queryForm = JSON.parse(JSON.stringify(this.queryForm))
				queryForm.org_id = await this.getOrgId()
				if (!queryForm.status && this.status) {
					let str_temp = this.status.split(',');
					if (str_temp.length > 1) {
						queryForm.status = "'" + str_temp.join("','") + "'";
					} else {
						queryForm.status = str_temp[0];
					}

				}
				this.queryFormTemp = queryForm;
				let key_json = {
					loading: 'listLoading', //加载效果属性名
					data: 'tablelist', //数据属性名
					total: 'total', //总数属性名
					queryForm: 'queryFormTemp', //查询条件属性名
				}
				await this.search_fob(alist, this, 841, key_json)
			}
		},
	}
</script>

<style>

</style>
