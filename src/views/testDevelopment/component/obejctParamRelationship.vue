<template>
	<!--  table-container -->
	<div class="permissions-container">
		<el-alert :title="alter.title" type="info" :closable="false">
		</el-alert>
		<vab-query-form style="margin-bottom: 5px;margin-left:20px">
			<div style="width: calc(100%); padding: 0 0px;float: right;" v-show="primary_key>0" id="rightFormPanel">
				<div class="el-custuom-button">
					<el-switch style="display: block" v-model="queryForm_param.isShowAl" active-color="#13ce66"
						inactive-color="#ff4949" active-text="仅显示所选参数" inactive-text="" @change="handleAddIsShowAll">
					</el-switch>
					<el-switch v-show="type == 20" style="display: block" v-model="queryForm_param.IsSelectByClass"
						active-color="#13ce66" inactive-color="#ff4949" active-text="按试验名称加载参数分类" inactive-text=""
						@change="handleIsSelectByClass">
					</el-switch>
					<div>
						<el-input style="border-radius: 30px;width: 150px;" v-model="queryForm_param.param"
							placeholder="参数名称" clearable />
						<el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData_param">
						</el-button>
					</div>
					<el-button icon="el-icon-plus" type="primary" @click="handleAddParam">
					</el-button>
					<el-button icon="el-icon-refresh-right" type="primary" @click="ObjectParamTable">
					</el-button>
					<el-button icon="fa fa-save" type="primary" @click="ManualSaveSelectionParam">
					</el-button>
				</div>
			</div>
		</vab-query-form>

		<el-container>
			<el-aside style="width: 300px;border: 1px solid #ddd;" v-show="tree.org.isShow">
				<el-tree ref="eltreeOrg" highlight-current :data="tree.org.treeOrgData" :props="tree.org.treeOrgProps"
					@node-click="treeNodeClickOrg" node-key="id">
				</el-tree>
			</el-aside>
			<el-main>
				<parameterTable ref="parameterTable" v-if="assembly.parameterTable.show"
					:type="tableType.parameterTable.type" style="height: calc(100vh - 350px); min-height: 200px"
					:select-form.sync="searchDataPermission" :primary_key.sync="primary_key" tableHeight="calc(93%)"
					:permission="permission" :select_org_id="tree.org.selectOrg_id">
				</parameterTable>
			</el-main>
		</el-container>
		<testitemManage ref="testitemManage" :is-up-data.sync="main_dialog"></testitemManage>
		<parameterManagement ref="parameterManagement" :is-up-data.sync="main_dialog"></parameterManagement>
	</div>
</template>

<script>
	import parameterTable from '../table/parameterTable'

	import testitemManage from '../components/testitemManage'

	import parameterManagement from './../components/parameterManagement'

	import {
		treePaging
	} from '@/global/form.helper'
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataEx2,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'

	import {
		getList,
		doDelete
	} from '@/api/table'


	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'obejctParamRelationship',
		components: {
			testitemManage,
			parameterTable,
			parameterManagement

		},
		props: {
			//.sync同步
			type: {
				type: Number,
				default: 0 //0 正常表单 1 详情表单
			},
			object_id: {
				type: Number,
				default: -1
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
		},
		provide() {
			return {
				paramReload: this.ObjectParamTable,
				objectReload: this.ojectTabelLoad
			}
		},
		watch: {
			main_dialog(newVal, oldVal) {
				this.selectData_main()
			},
			primary_key(newVal, oldVal) {
				this.ObjectParamTable()
			},
			'tree.org.isShow'(newVal, oldVal) {
				if (newVal) {
					this.GetTreeData()
				}
			}
		},
		data() {
			return {
				tree: {
					org: {
						isShow: false,
						treeOrgProps: {
							children: 'children',
							label: 'name',
						},
						treeOrgData: [],
						selectNode: {},
						selectOrg_id: ''
					}
				},
				primary_key: -1,

				alter: {
					title: '请先选择左侧机构后在勾选对应的常用参数,删除映射请取消勾选'
				},
				org_name: '',
				selectData: {
					tpl_id: []
				},
				permission: {},
				searchData: {},
				searchDataPermission: {},
				queryForm_main: {
					tpl_name: '',
					object_name: ''
				},
				queryForm_param: {
					param: '',
					isShowAll: false,
					IsSelectByClass: true,
				},
				main_dialog: false,
				assembly: {
					parameterTable: {
						show: true
					}
				},
				queryForm: {
					title: '',
				},
				right: {
					isShowAll: true,
				},
				tableType: {
					isShowSelectOrgName: false,
					testOjectTable: {
						type: 20,
					},
					parameterTable: {
						type: 20,
					}
				}

			}
		},
		computed: {
			height() {
				return this.$baseTableHeight()
			},
		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {

		},
		methods: {
			getOrgID() {
				if (this.current_org_id && this.current_org_id > 0) {
					return this.current_org_id
				}
				return this.org_pid
			},
			async GetTreeData() {
				const tree1 = await this.$store.dispatch('org/SetOrgStore')
				this.tree.org.treeOrgData = tree1
				const org_id = this.getOrgID()
				this.$nextTick(() => {
					if (this.$refs['eltreeOrg']) {
						//this.$refs['eltreeOrg'].setCurrentKey(org_id)
					}
				})
			},
			treeNodeClickOrg(node) {
				this.tree.org.selectNode = node
				this.tree.org.selectOrg_id = node.id
				this.primary_key = this.object_id
			},
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				console.log(this.type, this.primary_key)
				switch (this.type) {
					//常用试验参数
					case 10:
						this.alter.title = '请先选择左侧机构后在勾选对应的常用参数,删除映射请取消勾选,当所选机构没有添加该试验为常用试验勾选参数后会自动添加为常用试验'
						this.tree.org.isShow = true
						this.tableType = {
							isShowSelectOrgName: true,
							testOjectTable: {
								type: 22,
							},
							parameterTable: {
								type: 21,
							}
						}
						break
						//试验参数映射
					case 20:
						this.$nextTick(() => {
							this.$set(this, 'primary_key', this.object_id)
						})
						this.alter.title = '添加映射请选择勾选,删除映射请取消勾选'
						this.tree.org.isShow = false
						this.tableType = {
							isShowSelectOrgName: false,
							testOjectTable: {
								type: 20,
							},
							parameterTable: {
								type: 20, //
							}
						}
						break
				}
				await this.getOrgNameByselect()
				await this.GetPermission()
				this.fetchData_main()
				this.GetGroupEx()
			},
			handleIsSelectByClass(IsSelectByClass) {
				if (typeof IsSelectByClass == 'undefined') {
					IsSelectByClass = !this.queryForm_param.IsSelectByClass
				}
				this.$set(this.queryForm_param, 'IsSelectByClass', IsSelectByClass)
				this.selectData_param()
			},
			handleAddIsShowAll(isShowAll) {
				if (typeof isShowAll == 'undefined') {
					isShowAll = !this.queryForm_param.isShowAll
				}
				this.$set(this.queryForm_param, 'isShowAll', isShowAll)
				this.selectData_param()
			},
			async GetPermission() {
				let permissionList = ['testitemManage'];
				let permission = '';
				for (let i = 0; i < permissionList.length; i++) {
					permission = await this.$store.dispatch(
						'permission/GetALLPermissionByModel',
						permissionList[i]
					)
					if (permission) {
						this.permission = Object.assign(this.permission, permission)
					}
				}
			},
			getOrgId() {
				let org_id = ''
				switch (this.role_max) {
					case 'super_admin':
						org_id = this.$store.getters['org/current_org']
						break;
					default:
						org_id = org_pid
						break
				}
				return org_id;
			},
			async getOrgNameByselect() {
				//this.$nextTick(async () => {
				let index = setInterval(async () => {
					let org_name = await this.getOrgName(this.getOrgId());
					if (org_name.trim()) {
						this.$set(this, 'org_name', org_name)
						clearInterval(index);
						//this.$set(this.load.status.orgName, 'isShow', true)
					}
				}, 500)
			},
			async getOrgName(value) {
				let orgName = await this.$store.dispatch('org/GetOrgNameByOrgId', value)
				return orgName
			},
			handleCurrentChangeMain() {},
			handleSizeChangeMain() {},
			ObjectParamTable() {
				this.$set(this.assembly.parameterTable, 'show', false)
				this.$nextTick(() => {
					this.$set(this.assembly.parameterTable, 'show', true)
					this.$nextTick(() => {
						let form = {
							objecrt_id: this.object_id
						}
						form = Object.assign(form, this.queryForm_param)
						//this.$refs['parameterTable'].search(form)
						this.selectData_param(form)
					})
				})
			},
			selectData_main() {
				this.$refs['testOjectTable'].search(this.queryForm_main)
			},
			selectData_param(form) {
				if (!form) {
					form = {}
				}
				form = Object.assign(this.queryForm_param, form)
				if (this.queryForm_param.isShowAll) {
					form.hasNum = 0
				} else {
					form.hasNum = undefined
				}

				if (this.queryForm_param.IsSelectByClass) {
					form.class_name = this.object_id
				} else {
					form.class_name = undefined
				}
				this.$refs['parameterTable'].search(form)
			},
			async fetchData_main() {
				let that = this
				this.$nextTick(() => {
					switch (this.type) {
						case 20:
							let form = {
								objecrt_id: this.object_id
							}
							form = Object.assign(form, this.queryForm_param)
							this.selectData_param(form)
							break
					}
				})
				// let index = setInterval(function() {
				// 	if (that.$refs['testOjectTable']) {
				// 		clearInterval(index)
				// 		that.$refs['testOjectTable'].fetchData()
				// 	}
				// })

			},
			async GetGroupEx() {
				let list = [{
					data: "tpl_id",
					sqlcode: 241
				}];
				await GetGroupDataCustomEx(this, list)
			},
			handlAddRole() {
				this.$refs['testitemManage'].showEdit()
			},
			ManualSaveSelectionParam() {
				// let flag = false
				// for (let key in queryForm_param) {
				// 	if (this.queryForm_param[key]) {
				// 		flag = true
				// 	}
				// }
				// if (flag) {
				// 	this.$notify.error({
				// 		title: '错误',
				// 		message: '请先清空搜索内容重载表格后再试,搜索状态下会导致保存结果出错'
				// 	});
				// 	//return
				// }
				if (this.assembly.parameterTable.show) {
					this.$refs['parameterTable'].ManualSaveSelection(this.queryForm_param)
				}

			},
			handleAddParam() {
				this.handleshowDialog(undefined, false, {
					parent_id: 0,
				})
			},
			handleshowDialog(row, disable, person_info) {
				this.$refs['parameterManagement'].showEdit(row, disable, person_info)
			},
			ojectTabelLoad() {
				this.selectData_main()
			},
			close() {
				this.primary_key = -1
			}
		},
	}
</script>
<style>
	#rightFormPanel .el-custuom-button {
		width: 100%;
		text-align: center;
		display: flex;
		justify-content: space-between;
		align-items: center
	}
</style>
