<template>
	<div>
      <!-- style="height: calc(32vh);overflow: scroll; 影响了表格展示" -->
		<el-table ref="personel" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick"
      :height=height
      >
			<el-table-column type="selection" width="39" fixed="left">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="状态" prop="work_status" width="64px" align="center"
				header-align="center">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.work_status=='在岗'" type="success">在岗
					</el-tag>
					<el-tag v-else-if="scope.row.work_status=='停职'" type="danger">停职
					</el-tag>
					<el-tag v-else-if="scope.row.work_status=='休假'" type="warning">休假
					</el-tag>
					<el-tag v-else-if="scope.row.work_status=='离职'" type="info">离职
					</el-tag>
					<el-tag v-else>{{scope.row.work_status}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="name" label="姓名" width="100px"></el-table-column>
			<el-table-column show-overflow-tooltip label="性别" prop="sex" align="center" width="50px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="birthday" label="出生日期" align="center" width="100px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="education" label="文化程度"></el-table-column>
			<el-table-column show-overflow-tooltip label="职务(岗位)" prop="duty" min-width="120px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="职称" prop="title" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="id_type" label="证件类型" min-width="100px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="证件号码" prop="id_no" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="所学专业" prop="major" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="从业时间" prop="start_date" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="岗位" prop="department" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
				<template #default="{ row }">
					<el-dropdown trigger="click" placement="left-start" :hide-on-click="true">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary">
						</el-button>
						<el-dropdown-menu slot="dropdown" class="more" style="min-width: 115px">
							<el-button @click="handleAdd(row)" v-show="ishasPermission('edit',row)">修改人员</el-button>
							<el-button @click="handleEmpowerment(row)" v-show="ishasPermission('permission',row)">
								赋权
							</el-button>
							<el-button @click="handleReInitPassword(row)"
								v-show="ishasPermission('passwordReInit',row)">
								重置密码
							</el-button>
							<!-- 	<el-button @click="handlePersonelView(row)">
								人员详情
							</el-button> -->
							<el-button @click="handAddRole(row)" v-show="ishasPermission('role_manage',row)">
								添加系统角色
							</el-button>
							<el-button @click="handlePersonelEducation(row)" v-show="ishasPermission('edu_add',row)">
								添加教育经历
							</el-button>
							<el-button @click="handlePersonelWork(row)" v-show="ishasPermission('work_add',row)">
								添加工作经历
							</el-button>
							<el-button @click="handlePersonelTrain(row)" v-show="ishasPermission('train_add',row)">
								添加培训经历
							</el-button>
							<el-button @click="handlePersonelHost(row)" v-show="ishasPermission('host_add',row)">
								添加主持项目
							</el-button>
							<el-button @click="handlePersonelMove(row)" v-show="ishasPermission('move_add',row)">
								添加调动记录
							</el-button>
							<el-button @click="handlePersonelDivide(row)" v-show="ishasPermission('division_add',row)">
								添加分工记录
							</el-button>
							<el-button @click="handlePersonelPaper(row)" v-show="ishasPermission('paper_add',row)">
								添加发表论文
							</el-button>
							<el-button @click="handlePersonelTech(row)" v-show="ishasPermission('award_add',row)">
								添加科技成果
							</el-button>
							<el-button @click="handlePersonelCred(row)" v-show="ishasPermission('cert_add',row)">
								添加相关证书
							</el-button>
							<el-button @click="handlePersonelGrant(row)" v-show="ishasPermission('empower_add',row)">
								添加授权记录
							</el-button>
							<el-button @click="handleDelete(row)" v-show="ishasPermission('delete',row)">
								删除人员
							</el-button>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="onrenewalForm.pageNo" :layout="layout"
			:page-size="onrenewalForm.pageSize" :total="mbePageTotal" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<empowerment ref="empowerment"></empowerment>
		<personnelEdit ref="personnelEdit" :isUpData.sync="main_dialog"></personnelEdit>
		<personnelEducation ref="personnelEducation" :isUpData.sync="children_dialog"></personnelEducation>
		<personnelWork ref="personnelWork" :isUpData.sync="children_dialog"></personnelWork>
		<personnelTrain ref="personnelTrain" :isUpData.sync="children_dialog"></personnelTrain>
		<personnelHost ref="personnelHost" :isUpData.sync="children_dialog"></personnelHost>


		<personnelView ref="personnelView"></personnelView>
		<personnelAllocation ref="personnelAllocation" :isUpData.sync="children_dialog"></personnelAllocation>
		<personnelDivide ref="personnelDivide" :isUpData.sync="children_dialog"></personnelDivide>
		<personnelPaper ref="personnelPaper" :isUpData.sync="children_dialog"></personnelPaper>
		<personnelTech ref="personnelTech" :isUpData.sync="children_dialog"></personnelTech>
		<personnelCred ref="personnelCred" :isUpData.sync="children_dialog"></personnelCred>
		<personnelGrant ref="personnelGrant" :isUpData.sync="children_dialog"></personnelGrant>
		<personelDivideDialog ref="personelDivideDialog" :isUpData.sync="children_dialog"></personelDivideDialog>
		<roleComonent ref="roleComonent" :isUpData.sync="children_dialog"></roleComonent>
	</div>

</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import empowerment from '../components/Empowerment'
	import personnelEdit from '../components/personnelDialog'
	import personnelEducation from '../components/personnelEducation'
	import personnelWork from '../components/personnelWork'
	import personnelTrain from '../components/personnelTrain'
	import personnelHost from '../components/personnelHost'
	import personnelPaper from '../components/personnelPaper'

	import personnelView from '../components/personnelView.vue'
	import personnelAllocation from '../components/personnelAllocation'
	import personnelDivide from '../components/personnelDivide'

	import personelDivideDialog from '../components/personelDivideDialog'

	import personnelTech from '../components/personnelTech'
	import personnelCred from '../components/personnelCred'
	import personnelGrant from '../components/personnelGrant'


	import roleComonent from '../components/roleComonent'
	import {
		hasPermission
	} from '../js/permission'
	export default {
		name: 'personelTable',
		props: {
			type: {
				type: Number,
				default: 0,
			},
			primary_key: {
				type: Number,
				default: -1,
			},
			radioRow: {
				type: Function,
				default: undefined
			},
			pageForm: {
				type: Object,
				default: function() {
					return {}
				}
			},
			selectForm: {
				type: Object,
				default: function() {
					return {}
				}
			},
			permission: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				org_pid: 'user/org_pid',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id'
			}),
		},
		components: {
			empowerment,
			personnelEdit,
			personnelEducation,
			personnelWork,
			personnelTrain,
			personnelHost,

			personnelView,
			personnelAllocation,
			personnelDivide,
			personnelPaper,
			personnelTech,
			personnelCred,
			personnelGrant,
			personelDivideDialog,

			roleComonent
		},
		/* 监听table数据对象 */
		watch: {
			tablelist(val) {
				this.doLayout();
			},
			pageForm(newVal, oldVal) {
				if (newVal) {
					this.onrenewalForm = Object.assign({}, newVal)
				}
			},
			onrenewalForm(newVal, oldVal) {
				if (newVal) {
					this.$emit('update:pageForm', Object.assign({}, newVal));
					this.$emit('update:selectForm', Object.assign(this.selectForm, newVal));
				}
			},
			selectForm(newVal, oldVal) {
				if (newVal) {
					this.onrenewalForm = Object.assign(newVal, this.onrenewalForm)
				}
			},
			//监听主表弹窗属性变化
			main_dialog(newVal, oldVal) {
				this.fetchData()
			},
			children_dialog(newVal, oldVal) {
				if (this.selectedRow && this.selectedRow.person_id) {
					let that = this
					that.$emit('update:primary_key', -1);
					setTimeout(function() {
						that.$emit('update:primary_key', Number(that.selectedRow.person_id));
					}, 600)

				}
				//this.rowClick(this.selectedRow)
			},
			selectedRow(newVal, oldVal) {
				if (newVal && newVal.person_id) {
					this.$emit('update:primary_key', Number(newVal.person_id));
				}

			},
			org_id(newVal, oldVal) {
				this.fetchData()
			},
			current_org_id(newVal, oldVal) {
				this.fetchData()
			},
			tablelist(newVal, oldVal) {
				switch (this.type) {
					case 0:
						this.height = 'calc(84%)'//主表高度控制
						break
				}
			}
		},
		data() {
			return {
				height: 'auto',
				children_dialog: false,
				main_dialog: false,
				background: false,
				listLoading: false,
				tablelist: [],
				elementLoadingText: '加载数据中',
				org_load_type: 2,
				onrenewalForm: {
					pageSize: 10,
					pageNo: 1,
				},
				mbePageTotal: 0,
				columnHideList: [],
				layout: 'total, sizes, prev, pager, next, jumper',
				table: {
					tableHeight: this.$(window).height() - 210,
				},
				selectedRow: {},
				role_max: '',
				//复选框
				checkRow: []
			}
		},
		async created() {
			if (this.selectForm) {
				this.onrenewalForm = Object.assign(this.selectForm, this.onrenewalForm)
			}
			this.role_max = await this.$store.dispatch('user/getRoleMax')
			this.fetchData()
		},

		methods: {
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
					case 'edit':
						permission_name = 'person_edit'
						break
					case 'delete':
						permission_name = 'person_delete'
						break
					case 'permission':
						permission_name = 'permission'
						break
					case 'edu_add':
						permission_name = 'education_add'
						break
					case 'work_add':
						permission_name = 'work_add'
						break
					case 'train_add':
						permission_name = 'train_add'
						break
					case 'host_add':
						permission_name = 'host_add'
						break
					case 'move_add':
						permission_name = 'move_add'
						break
					case 'division_add':
						permission_name = 'division_add'
						break
					case 'cert_add':
						permission_name = 'cert_add'
						break
					case 'paper_add':
						permission_name = 'paper_add'
						break
					case 'award_add':
						permission_name = 'award_add'
						break
					case 'empower_add':
						permission_name = 'empower_add'
						break
					case 'all_info':
						permission_name = 'all_person_info'
						break
					case "role_manage":
						permission_name = 'person_role_manage_edit'
						break;
					case "passwordReInit":
						permission_name = 'passwordReinit'
						break;
					default:
						permission_name = name
						break
				}
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				// if(this.org_pid != row.org_pid){
				// 	return false;
				// }
				if (!flag && role_max !== 'super_admin') {
					return false
				}
				if (row && row.max_role_name == '超级管理员' && role_max !== 'super_admin') {
					return false
				}
				switch (name) {
					case 'permission':
						if (role_max === 'super_admin') {
							flag = true
						} else if (this.person_id == row.person_id) {
							flag = false
						}
						break
					case 'delete':
						if (role_max === 'super_admin' && this.person_id == row.person_id) {
							flag = false
						} else if (role_max === 'super_admin' && this.person_id != row.person_id) {
							flag = true
						}
						break
					case 'role_manage':
						console.log(role_max)
						if (role_max === 'super_admin') {
							flag = true
						}
						break
				}
				return flag
			},
			/* 重新渲染table组件 */
			doLayout() {
				this.$nextTick(() => {
					this.$refs.personel.doLayout()
				})
			},
			setSelectRows(row) {
				this.checkRow = row
			},
			rowClick(row) {
				this.selectedRow = row
				if (this.radioRow) {
					this.radioRow(row)
				}
			},
			search(data) {
				this.onrenewalForm = Object.assign(data, this.onrenewalForm)
				this.fetchData()
			},
			async fetchData(pageInfo) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.onrenewalForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.onrenewalForm.pageNo = 1
				} else {

				}
				if (that.ishasPermission("all_info")) {
					that.onrenewalForm.person_id = undefined
				} else {
					that.onrenewalForm.person_id = that.person_id

				}
				//根据sql自行编写
				let select_list = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'org_pid',
						type: 3,
						level: 2,
					}, {
						field: 'name',
						type: 2,
						level: 3,
					}, {
						field: 'title',
						type: 2,
						level: 4,
					}, {
						field: 'sex',
						type: 3,
						level: 5,
					}, {
						field: 'mobile',
						type: 2,
						level: 6,
					}, {
						field: 'person_id',
						type: 3,
						level: 7,
					}, {
						field: 'pageNo',
						type: 3,
						level: 8,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 9,
					},
				]
				//	org_pid: 'user/org_pid',
				//current_org_id: 'org/current_org',
				that.setOrg()
				that.search_fob(select_list, that, 53, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'mbePageTotal', //数据数量，根据该数量分页
					queryForm: 'onrenewalForm', //查询数据表单，请将分页条件也放置在其中
				})
			},
			setOrg() {
				let org_type = ''
				if (this.selectForm && this.selectForm.org_type) {
					org_type = this.selectForm.org_type
				} else {
					org_type = 2
				}
				let that = this
				let org_id = that.org_id
				if (that.current_org_id && that.current_org_id > 0) {
					org_id = that.current_org_id
				}
				switch (org_type) {
					//原机构
					case 1:
						that.onrenewalForm.org_id = org_id
						that.onrenewalForm.org_pid = undefined
						break
						//调拨机构
					case 2:
						that.onrenewalForm.org_id = undefined
						that.onrenewalForm.org_pid = org_id
						break
				}
			},
			handleEmpowerment(row) {
				this.$refs['empowerment'].showEdit(row)
			},
			handleReInitPassword(row) {
				let tips = '是否将姓名为[' + row.name + ']的密码重置为默认密码？'
				let that = this
				that.$confirm(tips, '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					})
					.then(async () => {
						let list = [{
							field: "person_id",
							type: 3,
							level: 1
						}]
						let formSubmit = {
							person_id: row.person_id
						}
						const {
							code,
							influence,
							data
						} = await that.QueryExec_fob(461, list, formSubmit)
						console.log(code, influence, data);
						if (code != 200) {
							that.$baseMessage('重置失败，请刷新重试', 'error')
							return false
						}
						if (!data || data.length == 0) {
							that.$baseMessage('重置失败，请刷新重试', 'error')
							return
						}
						let json = JSON.parse(data[0].info)
						if (json.success) {
							that.$baseMessage('重置成功,默认密码为用户名', 'success')
							return
						} else {
							switch (json.code) {
								case 1:
									that.$baseMessage('重置成功,默认密码为用户名', 'success')
									break
								case 2:
									that.$baseMessage(json.msg, 'error')
									break
								default:
									that.$baseMessage(json.msg, 'error')
									break
							}
						}
					})
					.catch(async action => {

					});
			},

			tableSortChange() {

			},
			handleDeletemodify1() {

			},
			paginationHadle() {

			},
			handleAdd(row) {
				this.$refs['personnelEdit'].showEdit(row)
			},
			handleCurrentChange(val) {
				this.onrenewalForm.pageNo = val
				this.fetchData({
					pageNo: val
				})
			},
			handleSizeChange(val) {
				this.onrenewalForm.pageSize = val
				this.fetchData({
					pageNo: this.onrenewalForm.pageNo
				})
			},
			handAddRole(row) {
				this.$refs['roleComonent'].showEdit(undefined, {
					person_id: row.person_id
				})
			},
			handleDelete(row) {
				let that = this
				that.$confirm('此操作会清空所有相关信息，是否继续？', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '取消',
						cancelButtonText: '确定删除'
					})
					.then(() => {

					})
					.catch(action => {
						that.delete_from_fob(that, row, 178, {
							//"selectRows": "selectRows", //复选框选中数据
							"fetchData": "fetchData", //加载数据
							"main_key": "person_id", //主键
							"file": {
								head_con: 15,
								photo: 15,
								commitment_img: 14,
								title_image: 11,
								contract_image: 12,
								ability_img: 11,
								card_image_pos: 14,
								card_image_other: 14,
								auth_cert: 12
							},
						});
					});
			},
			handlePersonelView(row) {
				this.$refs['personnelView'].showEdit(row)
			},
			handlePersonelEducation(row) {
				this.$refs['personnelEducation'].showEdit(undefined, row.person_id)
			},
			handlePersonelWork(row) {
				this.$refs['personnelWork'].showEdit(undefined, {
					person_id: row.person_id,
					org_pid: row.org_pid
				})
			},
			handlePersonelTrain(row) {
				this.$refs['personnelTrain'].showEdit(undefined, {
					person_id: row.person_id,
					org_id: row.org_pid
				})
			},
			handlePersonelHost(row) {
				this.$refs['personnelHost'].showEdit(undefined, {
					person_id: row.person_id,
					org_id: row.org_pid
				})
			},
			handlePersonelMove(row) {
				this.$refs['personnelAllocation'].showEdit(undefined, {
					person_id: row.person_id,
					orgp_name: row.orgp_name,
					user_name: row.name,
					org_pid: row.org_pid
				})
			},
			handlePersonelDivide(row) {
				this.$refs['personelDivideDialog'].showEdit(undefined, {
					person_id: row.person_id,
					org_id: row.org_pid
				})
			},
			handlePersonelPaper(row) {
				this.$refs['personnelPaper'].showEdit(undefined, {
					person_id: row.person_id,
					org_id: row.org_pid
				})
			},
			handlePersonelTech(row) {
				this.$refs['personnelTech'].showEdit(undefined, {
					person_id: row.person_id,
					org_id: row.org_pid
				})
			},
			handlePersonelCred(row) {
				this.$refs['personnelCred'].showEdit(undefined, {
					person_id: row.person_id,
					org_id: row.org_pid
				})
			},
			handlePersonelGrant(row) {
				this.$refs['personnelGrant'].showEdit(undefined, {
					person_id: row.person_id,
					org_id: row.org_pid
				})
			},


		},
	}
</script>

<style>
</style>
