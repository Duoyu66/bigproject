<template>
  <!-- 角色-权限映射 -->
	<!--  table-container -->
	<div class="permissions-container" style="overflow: auto;">
      <el-container>
        <div class="baseBox" style="margin-right: 10px;">
          <vab-query-form style="margin-bottom: 5px">
            <vab-query-form-left-panel style="width: 270px;">
              <el-form ref="form" :model="queryForm_main" :inline="true" @submit.native.prevent >
                <el-row class="" style="" :gutter="0">
                  <el-col :span="14" style="margin-right: 10px;">
                    <el-form-item >
                      <el-input v-model="queryForm_main.role_name" style="width: 100%;" placeholder="角色名称"
                        clearable>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item >
                      <el-button icon="el-icon-search" type="primary" native-type="submit"
                        @click="selectData_main">
                      </el-button>
                    </el-form-item>

                  </el-col>
                  <el-col :span="5" style="margin-right: 0px;width: auto;">
                    <el-form-item>
                      <el-button icon="el-icon-plus" type="primary" @click="handlAddRole">
                      </el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </vab-query-form-left-panel>

          </vab-query-form>
          <el-aside style="width: 270px">
            <roleDefinitionTable ref="roleDefinitionTable" :type="2"
              style="height: calc(100vh - 184px); min-height: 300px" :select-form.sync="searchData"
              :primary_key.sync="primary_key" :permission="permission">
            </roleDefinitionTable>
          </el-aside>
      </div>
			<el-main>
         <div class="baseBox" style="height:100%;margin-right: 10px;">
          <vab-query-form-right-panel style="width: 430px; padding: 0 0px;float: right;" v-show="primary_key>0">
            <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
              <el-form-item style="">
                <el-input style="border-radius: 30px" v-model="queryForm_permission.title"
                  placeholder="权限名称" clearable />
              </el-form-item>
              <el-form-item style="">
                <el-button icon="el-icon-search" type="primary" native-type="submit"
                  @click="selectData_permission">
                </el-button>
              </el-form-item>
              <el-form-item style="">
                <el-button icon="el-icon-plus" type="primary" @click="handleAddPersmisson">

                </el-button>
              </el-form-item>
              <el-form-item style="">
                <el-button icon="el-icon-refresh-right" type="primary" @click="roloadPersmissTable">
                </el-button>
              </el-form-item>
              <el-form-item style="margin-right: 0px;">
                <el-button icon="fa fa-save" type="primary" @click="ManualSaveSelectionPermission">
                </el-button>
              </el-form-item>

              <!-- <el-row class="" style="" :gutter="0">
                <el-col :span="8">
                  <el-form-item style="">
                    <el-input style="border-radius: 30px" v-model="queryForm_permission.title"
                      placeholder="权限名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item style="">
                    <el-button icon="el-icon-search" type="primary" native-type="submit"
                      @click="selectData_permission">
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item style="">
                    <el-button icon="el-icon-plus" type="primary" @click="handleAddPersmisson">

                    </el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item style="">
                    <el-button icon="el-icon-refresh-right" type="primary" @click="roloadPersmissTable">
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item style="">
                    <el-button icon="fa fa-save" type="primary" @click="ManualSaveSelectionPermission">
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row> -->
            </el-form>
          </vab-query-form-right-panel>
          <permissionTable ref="permissionTable" v-if="assembly.permissionTable.show" :type="20"
            style="height: calc(100vh - 230px); min-height: 300px" :select-form.sync="searchDataPermission"
            :primary_key.sync="primary_key" :permission="permission">
          </permissionTable>
        </div>
			</el-main>
		</el-container>

    <roleDefinitionDialog ref="roleDefinitionDialog" :is-up-data.sync="main_dialog"></roleDefinitionDialog>
		<permissionFrom ref="permissionFrom" :is-up-data.sync="main_dialog"></permissionFrom>
	</div>
</template>

<script>
	import roleDefinitionTable from '../table/roleDefinitionTable'
	import permissionTable from '../table/permissionTable'

	import roleDefinitionDialog from '../components/roleDefinitionDialog'

	import permissionFrom from './../components/permissionFrom'

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
			roleDefinitionTable,
			roleDefinitionDialog,
			permissionTable,
			permissionFrom

		},
		provide() {
			return {
				reload: this.roloadPersmissTable,
			}
		},
		watch: {
			main_dialog(newVal, oldVal) {
				this.selectData_main()
			},
			primary_key(newVal, oldVal) {
				this.roloadPersmissTable()
			}
		},
		data() {
			return {
				primary_key: -1,
				permission: {},
				searchData: {},
				searchDataPermission: {},
				queryForm_main: {
					role_name: '',
				},
				queryForm_permission: {
					title: ''
				},
				main_dialog: false,
				assembly: {
					permissionTable: {
						show: true
					}
				},
				queryForm: {
					title: '',
				},


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
			init() {
				this.fetchData_main()
				this.GetGroupEx()
			},
			handleCurrentChangeMain() {},
			handleSizeChangeMain() {},
			roloadPersmissTable() {
				this.$set(this.assembly.permissionTable, 'show', false)
				this.$nextTick(() => {
					this.$set(this.assembly.permissionTable, 'show', true)
					this.$nextTick(() => {
						let form = {
							role_id: this.primary_key
						}
						form = Object.assign(form, this.queryForm_permission)
						console.log('roloadPersmissTable form', form)
						this.$refs['permissionTable'].search(form)
					})
				})
			},
			selectData_main() {
				this.$refs['roleDefinitionTable'].search(this.queryForm_main)
			},
			selectData_permission() {
				this.$refs['permissionTable'].search(this.queryForm_permission)
			},
			async fetchData_main() {
				let that = this
				this.$nextTick(() => {
					that.$refs['roleDefinitionTable'].fetchData()
				})
				// let index = setInterval(function() {
				// 	if (that.$refs['roleDefinitionTable']) {
				// 		clearInterval(index)
				// 		that.$refs['roleDefinitionTable'].fetchData()
				// 	}
				// })

			},
			async GetGroupEx() {
				// let list = [{
				// 	data: "tpl_id",
				// 	sqlcode: 241
				// }];
				// await GetGroupDataCustomEx(this, list)
			},
			handlAddRole() {
				this.$refs['roleDefinitionDialog'].showEdit()
			},
			ManualSaveSelectionPermission() {
				// let flag = false
				// for (let key in this.queryForm_permission) {
				// 	if (this.queryForm_permission[key]) {
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
				if (this.assembly.permissionTable.show) {
					this.$refs['permissionTable'].ManualSaveSelection(this.queryForm_permission)
				}

			},
			handleAddPersmisson() {
				this.handleshowDialog(undefined, false, {
					parent_id: 0,
				})
			},
			handleshowDialog(row, disable, person_info) {
				//console.log(this.$refs['permissionFrom'])
				this.$refs['permissionFrom'].showEdit(row, disable, person_info)
			},

		},
	}
</script>
<style>
  .el-form-item--small.el-form-item{margin-bottom:10px;}
  @media only screen and (max-width: 1366px) {
    /* 左侧表格1366px适配 */
  .el-aside .roleRTabHigh{height: calc(90%)!important;}
  }
</style>
