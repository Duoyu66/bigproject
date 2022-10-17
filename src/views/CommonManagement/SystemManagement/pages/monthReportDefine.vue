<template>
  <!-- 试验配置-试验 -->
	<div class="  purchase">
    <el-tabs type="border-card" class="box_center" style="height: calc(100vh)-300px">
      <el-tab-pane label="周报月报定义" class="center">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <el-card class="box-card" shadow="never">
                  <div slot="header" class="clearfix">
                    <span>台账字段</span>
                  </div>
                  <div class="text item">
                    <monthReportDefineTable style="height: calc(100vh - 262px); min-height: 300px" ref="monthReportDefineTable"
                      :type="10" :primary_key.sync="primary_key" :permission="permission"></monthReportDefineTable>
                  </div>
                </el-card>

              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <el-card class="box-card" shadow="never">
                  <div slot="header" class="clearfix">
                    <span>详情字段</span>
                  </div>
                  <div class="text item">
                    <monthReportDefineTable1 style="height: calc(100vh - 262px); min-height: 300px" ref="monthReportDefineTable1"
                      :type="20" :primary_key.sync="primary_key" :permission="permission"></monthReportDefineTable1>
                  </div>
                </el-card>

              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
	</div>
</template>

<script>
	import monthReportDefineTable from '../table/monthReportDefineTable'
  import monthReportDefineTable1 from '../table/monthReportDefineTable'
  import {
  	mapGetters
  } from 'vuex'
	import {
		TreeDataDealExGetData,
		TreeDataDealEx,
		TreeDataSecondary
	} from '@/global/tree_deal'
	export default {
		name: 'testitemManagePage',
		components: {
			monthReportDefineTable,
      monthReportDefineTable1
		},
		provide() {
			return {
				objectReload: this.MainTableRaload,
				reload: this.fetchData,
			}
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
    computed: {
    	...mapGetters({
    		org_pid: 'user/org_pid',
    		org_id: 'user/org_id',
    		current_org_id: 'org/current_org',
    		person_id: 'user/person_id',
    	}),
    },
		data() {
			return {
				primary_key: -1,
				permission: {
					testManage_add: false,
					testManage_edit: false,
					testManage_delete: false,
				},
				selectRows: '',
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					title: '',
				},
				table: {
					tableHeight: this.$(window).height()
				},
				activeName: 'parameterTable',
				autoRefresh: false,
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
				let permissionList = ['testitemManage', 'routineTestparameters'];
				let permission = '';
				for (let i = 0; i < permissionList.length; i++) {
					permission = await this.$store.dispatch(
						'permission/GetALLPermissionByModel',
						permissionList[i]
					)
					console.log(permissionList[i], permission)
					if (permission) {
						this.permission = Object.assign(this.permission, permission)
					}
				}
        this.current_org=this.current_org_id
			},
			tabShowSwitch(tabName) {
				if (this.ifShow[tabName]) {
					return
				}
				this.$nextTick(() => {
					this.ifShow[tabName] = true;
				});
			},
			tabShow(tab, event) {
				// 切换tab栏时,在进行一次子组件刷新
				// console.log(tab, event);
				if (this.autoRefresh) {
					for (let key in this.ifShow) {
						this.ifShow[key] = false
					}
				}

				//el-tabs栏数据缓存问题(数据过多渲染时长不够问题)
				// 点击后在进行初始化
				this.tabShowSwitch(tab.name);
			},
		},

	}
</script>
