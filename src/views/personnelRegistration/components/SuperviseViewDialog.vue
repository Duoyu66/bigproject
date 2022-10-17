<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="90%" @close="close" top="10vh" center>
		<div>
			<el-row style="max-height: calc(100vh - 290px); overflow-y: auto" :gutter="20">
				<el-col :span="9" style="max-height: calc(100vh - 290px); overflow-y: auto">
					<el-row>
						<el-col :span="24">
							<div style="max-height: calc(100vh - 220px); overflow-y: auto">
								<SuperviseCheckingForm ref="SuperviseCheckingForm" :formData.sync="formData" :type="1">
								</SuperviseCheckingForm>
							</div>
						</el-col>
						<el-col :span="24">
							<div style="max-height: calc(100vh - 290px); overflow-y: auto">
								<SuperviseSuperviseeForm ref="SuperviseSuperviseeForm" :formData.sync="formData"
									:type="1">
								</SuperviseSuperviseeForm>
							</div>
						</el-col>
						<el-col :span="24">
							<div style="max-height: calc(100vh - 290px); overflow-y: auto">
								<SuperviseVerificationForm ref="SuperviseVerificationForm" :formData.sync="formData"
									:type="1">
								</SuperviseVerificationForm>
							</div>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="15" style="height: calc(100vh - 290px); overflow-y: auto">
					<el-table ref="personel" v-loading="listLoading" :data="tablelist" border
						:element-loading-text="elementLoadingText" highlight-current-row height="calc(89%)"
						:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
						@sort-change="tableSortChange">
						<el-table-column show-overflow-tooltip prop="times" label="编号" align="center" width="50px"
							fixed="left">
						</el-table-column>
						<el-table-column show-overflow-tooltip prop="correction_name" label="改正人" align="center"
							width="80px">
						</el-table-column>
						<el-table-column show-overflow-tooltip prop="correction_time" label="改正时间" align="center"
							width="146px">
						</el-table-column>

						<el-table-column show-overflow-tooltip prop="correction_content" label="改正详情" align="center"
							min-width="100px">
						</el-table-column>
						<el-table-column show-overflow-tooltip prop="correction_enclosure" label="改正附件" align="center"
							width="80px">
							<template slot-scope="scope">
								<span v-show="scope.row.correction_enclosure">
									<a :href="getfileUrl(file_type,scope.row.correction_enclosure)"
										download="改正附件">改正附件</a>
								</span>

							</template>
						</el-table-column>

						<el-table-column show-overflow-tooltip prop="checking_name" label="验证人" align="center"
							width="80px">
						</el-table-column>
						<el-table-column show-overflow-tooltip prop="checking_time" label="验证时间" align="center"
							width="146px">

						</el-table-column>
						<el-table-column show-overflow-tooltip prop="checking_content" label="检查详情" align="center"
							min-width="100px">
						</el-table-column>
						<el-table-column show-overflow-tooltip prop="checking_enclosure" label="检查附件" align="center"
							width="80px">
							<template slot-scope="scope">
								<span v-show="scope.row.checking_enclosure">
									<a :href="getfileUrl(file_type,scope.row.checking_enclosure)"
										download="检查附件">检查附件</a>
								</span>

							</template>
						</el-table-column>
					</el-table>
					<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
						:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
						@size-change="handleSizeChange"></el-pagination>
				</el-col>
			</el-row>
		</div>

		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import SuperviseCheckingForm from '../form/SuperviseCheckingForm'
	import SuperviseSuperviseeForm from '../form/SuperviseSuperviseeForm'
	import SuperviseVerificationForm from '../form/SuperviseVerificationForm'
	import {
		ViewfileUrlEx
	} from '@/utils/servicefile'
	export default {
		name: 'TableEdit',
		components: {
			SuperviseCheckingForm,
			SuperviseSuperviseeForm,
			SuperviseVerificationForm,
		},
		model: {
			prop: 'isUpData',
			event: 'on-change',
		},
		props: {
			//.sync同步
			isUpData: {
				type: Boolean,
				default: false,
				//required: true,
			},
		},
		data() {
			let that = this
			return {
				formData: {},
				title: '',
				dialogFormVisible: false,

				background: false,
				listLoading: false,
				tablelist: [],
				elementLoadingText: '加载数据中',
				queryForm: {
					pageSize: 10,
					pageNo: 1,
					reward_id: -1,
				},
				file_type: 12,
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				columnHideList: [],
			}
		},

		created() {},
		methods: {
			showEdit(row, person_info) {
				this.formData = {}
				let form = {}
				this.title = '查看监督检查记录'
				if (row) {
					form = Object.assign(form, row)
				}
				if (person_info) {
					form = Object.assign(form, person_info)
				}
				this.formData = Object.assign(this.formData, form)
				if (this.formData && this.formData.reward_id) {
					this.queryForm.reward_id = this.formData.reward_id
				}
				this.queryForm.pageSize = 10
				this.queryForm.pageSize = 1
				this.fetchData()
				this.dialogFormVisible = true
			},
			close() {
				this.$refs['SuperviseCheckingForm'].close()
				this.$refs['SuperviseSuperviseeForm'].close()
				this.$refs['SuperviseVerificationForm'].close()
				//this.$refs['form'].resetFields()
				//this.details = this.$options.data().details
				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},
			getfileUrl(type, file_url) {
				return ViewfileUrlEx(type) + file_url
			},
			save() {
				this.close()
			},
			setSelectRows(row) {

			},
			tableSortChange() {},
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
			fetchData(pageInfo) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				let select_list = [{
						field: 'reward_id',
						type: 3,
						level: 1,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 2,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 3,
					},
				]
				that.queryForm.person_id = that.primary_key
				that.search_fob(select_list, that, 305, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
			},
		},
	}
</script>
