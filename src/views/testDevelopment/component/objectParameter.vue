<template>
   <!-- 常用试验参数界面的表格 -->
	<div class="table-container permissions-container" >
<!-- 		<vab-query-form style="margin-bottom: 5px;"></vab-query-form> -->
		<el-container style="height: calc(100vh-108px);">
      <div class="baseBox" style="margin-right:10px;">
        <div style="width: 300px;">
          <el-form ref="form" :model="queryForm_main" :inline="true" @submit.native.prevent>
            <el-row class="" style="" :gutter="0">
              <el-col :span="5" v-show="tableType.isShowSelectOrgName">
                <el-form-item style="">
                  <el-tooltip class="item" effect="dark" :content="org_name" placement="top-start">
                    <el-tag type="info">
                      所选机构{{ org_name.length>4 ?org_name.substring(0,4)+'...':org_name.substring(0,4)}}
                    </el-tag>
                  </el-tooltip>

                </el-form-item>
              </el-col>
              <el-col :span="4" style="float: right;width: auto;">
                <el-form-item style="margin-right:0px;">
                  <el-button icon="el-icon-search" type="primary" native-type="submit"
                    @click="selectData_main">
                  </el-button>
                </el-form-item>

              </el-col>
              <el-col :span="tableType.isShowSelectOrgName?14-5:14" style="float: right;">
                <el-form-item style="">
                  <el-input v-model="queryForm_main.object_name" clearable style="width: 100%;"
                    placeholder="试验名称">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item >
                  <el-button icon="el-icon-plus" type="primary" @click="handlAddRole" v-if="false">
                  </el-button>
                </el-form-item>

              </el-col>

            </el-row>
          </el-form>
        </div>
        <el-aside style="width: 300px">
          <testOjectTable ref="testOjectTable" :type="tableType.testOjectTable.type"
            style="height: calc(100vh -130px); min-height: 300px" :select-form.sync="searchData"
            :primary_key.sync="primary_key" :permission="permission">
          </testOjectTable>
        </el-aside>
      </div>
      <div class="baseBox" style="width:100%;margin-right:10px;">
        <el-main >
			<!-- style="width: 100%; padding: 0 0;float: right;margin-bottom: 10px;" -->
          <div  v-show="primary_key>0"
            id="rightFormPanel">
   <!--         <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent v-if="false">
              <el-form-item style="">

              </el-form-item>
              <el-form-item style="">

              </el-form-item>
               <el-row class="" style="" :gutter="0">

                <el-col :span="8">

                </el-col>
                <el-col :span="4">

                </el-col>
                <el-col :span="4">
                  <el-form-item style="">

                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item style="">

                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item style="">

                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item style="">

                  </el-form-item>
                </el-col>
              </el-row>
            </el-form> -->
            <div class="el-custuom-button">
              <el-switch style="display: block" v-model="queryForm_param.isShowAl" active-color="#13ce66"
                inactive-color="#ff4949" active-text="仅显示所选参数" inactive-text="" @change="handleAddIsShowAll">
              </el-switch>
              <el-switch v-show="type == 20" style="display: block" v-model="queryForm_param.IsSelectByClass"
                active-color="#13ce66" inactive-color="#ff4949" active-text="按试验名称加载参数分类" inactive-text=""
                @change="handleIsSelectByClass">
              </el-switch>
              <div>
                <el-input style="width: 150px;margin-right:10px;" v-model="queryForm_param.param"
                  placeholder="参数名称" clearable />
                <el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData_param">
                </el-button>
              </div>

              <el-button icon="el-icon-plus" type="primary" @click="handleAddParam" v-if="false">

              </el-button>
              <el-button icon="el-icon-refresh-right" type="primary" @click="ObjectParamTable">
              </el-button>
              <el-button icon="fa fa-save" type="primary" @click="ManualSaveSelectionParam">
              </el-button>
            </div>
          </div>
          <parameterTable ref="parameterTable" v-if="assembly.parameterTable.show"
            :type="tableType.parameterTable.type" style="height: calc(100vh - 133px); min-height: 300px"
            :select-form.sync="searchDataPermission" :primary_key.sync="primary_key" :permission="permission">
          </parameterTable>
        </el-main>
      </div>
    </el-container>
		<testitemManage ref="testitemManage" :is-up-data.sync="main_dialog"></testitemManage>
		<parameterManagement ref="parameterManagement" :is-up-data.sync="main_dialog"></parameterManagement>
	</div>
</template>

<script>
	import testOjectTable from '../table/testOjectTable'
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



	export default {
		name: 'rolePermissionMapping',
		components: {
			testOjectTable,
			testitemManage,
			parameterTable,
			parameterManagement

		},
		props: {
			//.sync同步
			type: {
				type: Number,
				default: 0 //0 正常表单 1 详情表单
			}
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
			}
		},
		data() {
			return {
				org_name: '',
				selectData: {
					tpl_id: []
				},
				primary_key: -1,
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
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					//常用试验参数
					case 10:
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
						this.tableType = {
							isShowSelectOrgName: false,
							testOjectTable: {
								type: 20,
							},
							parameterTable: {
								type: 20,
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
							objecrt_id: this.primary_key
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
					form.class_name = this.primary_key
				} else {
					form.class_name = undefined
				}
				this.$refs['parameterTable'].search(form)
			},
			async fetchData_main() {
				let that = this
				this.$nextTick(() => {
					that.$refs['testOjectTable'].search({})
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

		},
	}
</script>
<style>
	#rightFormPanel .el-custuom-button {
		width: 100%;
		text-align: center;
		display: flex;
		justify-content: space-around;
		align-items: center;
		justify-content: space-between;
	}
  .el-form-item--small.el-form-item{margin-bottom:10px;}
</style>
