<template>
	<el-dialog title="操作规范分配" :visible.sync="dialogFormVisible" width="70%" top="5vh">
		<el-dialog width="60%" title="输入管理编号" :visible.sync="innerVisible" append-to-body>
			<el-form :model="form" :rules="rules" ref="form" v-loading="formloading">
				<el-form-item label="管理编号" :label-width="formLabelWidth">
					<el-input v-model="form.manage_id" style="width: 100%;" readonly></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">

				<div slot="footer" class="dialog-footer" style="margin-top:10px">
					<el-button type="primary" @click="manageConfirm" style="width:100px;margin-left: 200px">确 定
					</el-button>
					<el-button @click="innerVisible = false" style="width:100px;margin-left: 200px">取 消</el-button>
				</div>
			</div>
		</el-dialog>

		<div style="max-height: calc(72vh); overflow-y: auto">


			<el-row>
				<el-col :span="20" style="padding-bottom: 10px;">
					<el-tag type="info">所选机构：{{org_name}}</el-tag>
					<!-- <div class="tag-group" style="max-height: calc(10vh); overflow-y: auto">
						<el-row>
							<el-col :span="4">
								<span>所选数量{{selectAllRow.length}}</span>
							</el-col>
							<el-col :span="4" v-for="row in selectAllRow" :key='row.std_id'
								v-if="load.status.tipsRelod">
								<el-popover trigger="hover" placement="top">
									<p v-for="data in demotableexpand.mainTable" :key="data.field" v-show="data.isShow">
										{{ data.label }}:{{row[data.field]}}
									</p>
									<div slot="reference" class="name-wrapper">
										<el-tag>{{row.standard_id}}</el-tag>
									</div>
								</el-popover>
							</el-col>

						</el-row>
					</div> -->

				</el-col>
				<el-col :span="4" style="padding-bottom: 10px;">
					<el-input placeholder="请输入规范编号" v-model="queryForm.standard_id" class="input-with-select">
						<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
					</el-input>
				</el-col>
				<el-col :span="24">
					<el-table :data="list" ref="multipleTable" :height="height" @select="handleSelectionChange"
						@select-all="handleSelectionChangeAll" width="100%" v-loading="listLoading"
						class="distribution_table device_tab" highlight-current-row>
						<el-table-column type="selection" width="55" fixed="left"></el-table-column>
						<el-table-column show-overflow-tooltip prop="doc_name" label="规范名称" min-width="300px">
						</el-table-column>
						<el-table-column show-overflow-tooltip prop="standard_id" label="规范编号" min-width="180px">
						</el-table-column>
						<el-table-column show-overflow-tooltip label="实施日期" prop="impl_date" min-width="120px">
						</el-table-column>
						<el-table-column show-overflow-tooltip prop="release_org" label="发布单位" min-width="200px">
						</el-table-column>
						<el-table-column show-overflow-tooltip label="标准类型" prop="business_type" min-width="140px">
						</el-table-column>
						<el-table-column show-overflow-tooltip label="PDF文件" prop="file" width="170px" align="center">
							<template #default="{ row }">
								<el-button type="primary" size="mini" @click="pdfdetail(row)" :disabled="!row.pdf_file"
									v-if="row.pdf_file">
									查看
								</el-button>
								<el-button type="primary" size="mini" @click="pdfDownLoad(row)"
									:disabled="!row.pdf_file" v-if="row.pdf_file">
									下载
								</el-button>
								<el-tag type="danger" v-else>无文件
								</el-tag>
							</template>
						</el-table-column>

					</el-table>
					<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
						:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
						@size-change="handleSizeChange"></el-pagination>
				</el-col>
			</el-row>
		</div>


		<div slot="footer" class="dialog-footer">
			<div slot="footer" class="dialog-footer" style="margin-top:10px">
				<el-button type="primary" @click="handleConfirm" style="width:200px;margin-left: 200px">确 定</el-button>
				<el-button @click="dialogFormVisible = false" style="width:200px;margin-left: 200px">取 消</el-button>
			</div>
		</div>
		<preview ref="preview"></preview>
	</el-dialog>

</template>

<script>
	import {
		openDownloadProxy,
		GetHost
	} from '@/utils/downLoad'
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
		pageDeal
	} from '@/global/form.helper'
	import preview from '@/components/fileAbout/preview'
	export default {
		name: 'TableEdit',
		components: {
			preview
		},
		data() {
			return {
				pdf_file_type: 12,
				selectAllRow: [],
				load: {
					status: {
						allComplete: true,
						tipsRelod: true
					},

				},
				demotableexpand: {
					mainTable: [{
						field: 'standard_id',
						label: '规范编号',
						isShow: true,
					}, {
						field: 'doc_name',
						label: '规范名称',
						isShow: true,
					}, {
						field: 'release_org',
						label: '发布单位',
						isShow: true,
					}, {
						field: 'release_date',
						label: '发布日期',
						isShow: true,
					}, {
						field: 'impl_date',
						label: '实施日期',
						isShow: true,
					}]
				},
				org_name: '',

				dialogFormVisible: false,
				form: {
					name: 'xst',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: ''
				},
				innerVisible: false,
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					standard_id: '',
				},
				formloading: true,
				imageList: [],
				list: [],
				selectdata: [],
				formLabelWidth: '120px',
				rules: {

				}
			}
		},
		created() {

		},
		computed: {
			height() {
				return this.$baseTableHeight() / 1.2
			},
			...mapGetters({
				current_org: 'org/current_org',
				org_id: 'user/org_id',
				org_pid: 'user/org_pid',
			}),
		},

		methods: {
			tipsRelod() {
				this.$set(this.load.status, 'tipsRelod', false)
				this.$nextTick(() => {
					this.$set(this.load.status, 'tipsRelod', true)
				})
			},
			//多选
			selectRowOpertion(opertion_type, row) {
				// opertion_type 0 添加 1 删除
				let standard_id = ''
				let selectAllRow = this.selectAllRow
				let type = (typeof row).toLowerCase()
				switch (type) {
					case 'object':
						standard_id = row.std_id
						break
					default:
						standard_id = row
						break
				}
				if (!standard_id) {
					return false
				}
				let temp = selectAllRow.filter((e) => {
					return e.std_id == standard_id
				})
				let index = -1;
				let tempLength = temp.length;
				switch (type) {
					case 'object':

						break
					case 'number':
					case 'string':
					default:
						if (tempLength > 0) {
							return temp[0]
						}
						return {}
				}
				if (tempLength > 0) {
					index = selectAllRow.findIndex(e => e.std_id == standard_id)
				}
				switch (opertion_type) {
					case 0:
						if (tempLength > 0) {
							selectAllRow[index] = row
						} else {
							selectAllRow.push(row);
						}
						return true
						break
					case 1:
						if (tempLength > 0) {
							selectAllRow.splice(index, 1) // 将删除id等于1的选项
							this.tipsRelod()
							return true
						} else {
							return false
						}
						break
				}

			},
			rowSelectAll(selection) {
				if (!selection) {
					return
				}
				let that = this
				console.log(selection)
				if (selection.length > 0) {
					selection.forEach(row => {
						that.selectRowOpertion(0, row);
					})
				} else {
					selection.forEach(row => {
						that.selectRowOpertion(1, row);
					})
				}

			},
			rowselect(val, row) {
				if (row && this.load.status.allComplete) {
					let selected = val.length && val.indexOf(row) !== -1
					let flag = false
					if (selected == true) {
						flag = true
					} else if (selected == false || selected == 0) {
						flag = false
					} else {
						flag = false
					}
					let opertion_type = 0;
					if (flag) {
						opertion_type = 0
					} else {
						opertion_type = 1
					}
					this.selectRowOpertion(opertion_type, row);
				}
			},
			toggleSelection(rows) {
				if (!rows) {
					return;
				}
				let that = this
				rows.forEach(row => {
					that.$nextTick(() => {
						if (that.$refs.multipleTable) {
							that.$refs.multipleTable.toggleRowSelection(row)
						} else {
							let index = setInterval(() => {
								if (that.$refs.multipleTable) {
									clearInterval(index)
									that.$refs.multipleTable.toggleRowSelection(row)
								}
							})
						}

					})
				});
			},
			async handleSelectionChangeAll(selection) {
				if (!selection) {
					return
				}
				let that = this
				console.log(selection)
				let length = selection.length
				let std_id_list = []
				for (let i = 0; i < length; i++) {
					let item = selection[i]

					std_id_list.push(item.std_id)
				}
				let std_id = std_id_list.join(',')
				let sqlcode = 427
				let list = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'std_id',
						type: 3,
						level: 2,
					},
					{
						field: 'doc_name',
						type: 2,
						level: 4,
					},
					{
						field: 'standard_id',
						type: 3,
						level: 5,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 7,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 7,
					}
				]
				let form = {
					org_id: await that.GetOrgId(),
					std_id: std_id,
				}
				form = Object.assign(form, that.queryForm)
				form = pageDeal(form)
				let info = await dealRespond(sqlcode, list, form)
				Notify(this, info[0], info[1]);
			},
			handleSelectionChange(val, row) {
				this.selectionRows = val
				if (row && this.load.status.allComplete) {
					let selected = val.length && val.indexOf(row) !== -1
					console.log(selected) // true就是选中，0或者false是取消选中
					let flag = false
					if (selected == true) {
						flag = true
					} else if (selected == false || selected == 0) {
						flag = false
					} else {
						flag = false
					}
					let opertion_type = 0;
					if (flag) {
						opertion_type = 0
					} else {
						opertion_type = 1
					}
					this.SelectionChangeDataBase(row, opertion_type)
				}
			},
			async SelectionChangeDataBase(row, opertion_type) {
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
					opertion_type: opertion_type,
					org_id: await this.GetOrgId(),
					std_id: row.std_id
				}
				let info = await dealRespond(sqlcode, list, form)
				Notify(this, info[0], info[1]);
			},

			reSelectRow() {
				let selectAllRow = this.selectAllRow
				let list = this.list
				let length = selectAllRow.length
				let ToBeselectedArray = []
				//获取当前页中选中的行
				for (let i = 0; i < length; i++) {
					let row = selectAllRow[i]
					let std_id = row.std_id
					let temp = list.filter((e) => {
						return e.std_id == std_id
					})
					if (temp.length == 0) {
						continue
					}
					ToBeselectedArray.push(temp[0])
				}
				this.toggleSelection(ToBeselectedArray)
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
			RelationSelect() {
				let data = this.list
				let length = data.length
				let selectList = []
				for (let i = 0; i < length; i++) {
					try {
						let item = data[i]
						if (!item.hasNum) {
							continue
						}
						let hasNum = Number(item.hasNum)
						if (hasNum <= 0) {
							continue
						}
						selectList.push(item)
					} catch (e) {
						console.log(e)
					}

				}
				this.toggleSelection(selectList);
				this.load.status.allComplete = true
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
				let that = this
				let select_list = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'doc_name',
						type: 2,
						level: 2,
					}, {
						field: 'standard_id',
						type: 2,
						level: 3,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 4,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 5,
					},
				]
				that.queryForm.org_id = await that.GetOrgId()
				await that.search_fob(select_list, that, 425, {
					loading: 'listLoading', //加载画面
					data: 'list', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
				this.RelationSelect()
				//this.reSelectRow();
			},
			pdfdetail(row) {
				let that = this
				console.log(row)
				if (row.pdf_file != '') {
					const prefix = ViewfileUrl(this.pdf_file_type)
					console.log(prefix + row.pdf_file)
					const suffix = GetSuffix(prefix + row.pdf_file)
					let file = {
						src: prefix + row.pdf_file,
						name: row.doc_name + '.' + suffix
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


			async showEdit(row) {
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					// this.form = Object.assign({}, row)
				}
				this.selectAllRow = [];
				await this.GetOrgName()
				await this.fetchData();
				this.dialogFormVisible = true
			},
			search() {
				this.fetchData()
			},
			manageConfirm() {

			},

			handleConfirm() {
				// this.transfer = this.$refs.multipleTable.selection
				// console.log(this.transfer)
				this.$emit('handleList', '')
				this.dialogFormVisible = false
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
			handleDelete(row) {
				if (row.id) {
					this.$baseConfirm('你确定要删除采购日期为()的记录吗', null, async () => {
						const {
							msg
						} = await doDelete({
							ids: row.id
						})
						this.$baseMessage(msg, 'success')
						this.fetchData()
					})
				}
			},

		},
	}
</script>

<style>
</style>
