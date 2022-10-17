<template>
	<div>
		<el-table ref="personel" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row height="calc(80%)"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange">
			<el-table-column show-overflow-tooltip label="角色名字" prop="role_name" align="center" width="120px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="enable_role" label="角色状态" min-width="200px">
				<template slot-scope="scope">
					<span style="margin-left: 10px" v-if="scope.row.enable_role =='0'">禁用</span>
					<span style="margin-left: 10px" v-else-if="scope.row.enable_role =='1'">启用</span>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="enable" label="用户角色状态" min-width="200px">
				<template slot-scope="scope">
					<span style="margin-left: 10px" v-if="scope.row.enable =='0'">禁用</span>
					<span style="margin-left: 10px" v-else-if="scope.row.enable =='1'">启用</span>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="80px" align="center" fixed="right">
				<template #default="{ row }">
				<!-- 	<el-button class="normal" @click="EditPersonelRole(row)" v-show="ishasPermission('edit',row)">
						修改
					</el-button> -->
					<el-button class="danger" @click="handleDeletemodify(row)" v-show="ishasPermission('delete',row)">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<roleComonent ref="roleComonent" :isUpData.sync="main_dialog"></roleComonent>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission,
		PermissionSubtableDeal
	} from '../js/permission'

	import roleComonent from '../components/roleComonent'

	export default {
		name: 'personMoveTable',
		components: {
			roleComonent
		},
		props: {
			type: {
				type: Number,
				default: 0,
			},
			primary_key: {
				type: Number,
				default: 0,
			},
			permission: {
				type: Object,
				default: function() {
					return {}
				}
			}

		},
		watch: {
			primary_key(newVal, oldVal) {
				this.fetchData({
					reload: 1
				})
			},
			main_dialog(newVal, oldVal) {
				this.fetchData()
			}
		},

		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id'
			}),
		},
		data() {
			return {
				main_dialog: false,
				background: false,
				listLoading: false,
				tablelist: [],
				elementLoadingText: '加载数据中',
				queryForm: {
					pageSize: 10,
					pageNo: 1,
				},
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				columnHideList: []
			}
		},
		created() {
			this.init()
		},
		methods: {
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
			},
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
			ishasPermission(name, row) {
				let permission_name = ''
				switch (name) {
					case 'role_manage':
						permission_name = 'person_role_manage'
						break
					case 'edit':
						permission_name = 'person_role_manage_edit'
						break
					case 'delete':
						permission_name = 'person_role_manage_delete'
						break
					default:
						permission_name = name
						break
				}
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				flag = PermissionSubtableDeal(flag, name, row, this.person_id, role_max)
				return flag
			},
			getHideColist() {

			},
			setSelectRows() {

			},
			tableSortChange() {

			},
			EditPersonelRole(row) {
				this.$refs['roleComonent'].showEdit(row)
			},
			async handleDeletemodify(row) {
				let that = this
				let list = [{
					field: 'person_id',
					type: 3,
					level: 1,
				}, {
					field: 'role_id',
					type: 3,
					level: 2,
				}, ]
				let msg = '删除'
				that.$baseConfirm('确定删除？', null, async () => {
					const {
						code,
						influence,
						data
					} = await this.QueryExec_fob(248, list, row)
					console.log(code,influence,data)
					if (code != 200) {
						that.$baseMessage(msg + '失败', 'error')
						return false
					}
					if (!data || data.length == 0) {
						that.$baseMessage(msg + '失败', 'error')
						return
					}
					let json = JSON.parse(data[0].info)
					if (json.code > 0) {
						switch (json.code) {
							case 1:
								that.$baseMessage(json.msg, 'success')
								that.fetchData()
								break
							case 2:
								that.$baseMessage(json.msg, 'error')
								break
							default:
								that.$baseMessage(json.msg, 'error')
								break
						}
						return false
					} else {
						that.$baseMessage(json.msg, 'error')
						return false
					}
				})

			},
			paginationHadle() {

			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchData({
					pageNo: val
				})
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData({
					pageNo: this.queryForm.pageNo
				})
			},
			fetchData(pageInfo) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {

				}
				switch (that.type) {
					case 0:
						that.fetchData1()
						break
				}
			},
			//从表加载数据
			async fetchData1() {
				let that = this
				let select_list = [{
						field: 'person_id',
						type: 3,
						level: 1,
					}, {
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
				that.search_fob(select_list, that, 247, {
					'loading': 'listLoading', //加载画面
					'data': 'tablelist', //数据存放位置
					'total': 'total', //数据数量，根据该数量分页
					'queryForm': 'queryForm' //查询数据表单，请将分页条件也放置在其中
				});
			},

		},
	}
</script>

<style>
</style>
