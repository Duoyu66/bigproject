<template>
  <!-- 试验配置-试验 -->
	<div class="  purchase">
     <div class="baseBox" style="margin-bottom: 10px;">
      <vab-query-form>
        <vab-query-form-left-panel style="margin-left:0px">
          <el-button type="primary" @click="handleAdd" v-if="permission.testManage_add">添加根节点</el-button>
          <!-- 			<el-button type="primary">展开全部</el-button>
          <el-button type="primary">折叠全部</el-button> -->
        </vab-query-form-left-panel>
        <vab-query-form-right-panel>
          <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
            <!-- <el-form-item>
              <el-input style="border-radius: 30px;padding-left:10px" v-model="queryForm.title"
                placeholder="按试验项目名称搜索" prefix-icon="el-icon-search" />
            </el-form-item> -->
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <!-- :header-cell-style="{background:'#e8f0ff'}" -->
      <el-container>
        <el-main style="height: calc(55%); min-height: 230px" class="box1">
          <!-- parameterTable -->
          <testOjectTable style="height: calc(70%);min-height: 230px" ref="testOjectTable" :type="1"
            :primary_key.sync="primary_key" :permission="permission">
          </testOjectTable>
        </el-main>
      </el-container>
    </div>
    <!-- 第二个表格 -->
    <el-footer style="height: calc(45%); min-height: 188px;padding: 0px;" class="table_auto">
    	<el-tabs type="border-card" style="height: calc(100%)" @tab-click="handleClick"
    		v-model="activeName">
    		<el-tab-pane label="试验参数" name="parameterTable">
    			<parameterTable ref="parameterTable" :type="21" style="height: calc(27vh)"
    				:primary_key.sync="primary_key" :permission="permission" v-if="ifShow.parameterTable"
            :select_org_id="current_org">
    			</parameterTable>
    		</el-tab-pane>
<!--    		<el-tab-pane label="常用参数" name="parameterCommonTable">
    			<parameterTable ref="parameterTable" :type="11" style="height: calc(27vh)"
    				:primary_key.sync="primary_key" :permission="permission" v-if="ifShow.parameterCommonTable">
    			</parameterTable>
    		</el-tab-pane> -->
    		<el-tab-pane label="评定依据" name="standardTable">
    			<standardTable ref="standardTable" style="height: calc(27vh)" :primary_key.sync="primary_key"
    				:permission="permission" :type="10" v-if="ifShow.standardTable">
    			</standardTable>
    		</el-tab-pane>
        <el-tab-pane label="试验依据" name="usageTable">
        	<usageTable ref="usageTable" style="height: calc(27vh)" :primary_key.sync="primary_key"
        		:permission="permission" :type="20" v-if="ifShow.usageTable">
        	</usageTable>
        </el-tab-pane>
<!--    		<el-tab-pane label="委托模板" name="entrustTemplateTable">
    			<templateTable ref="templateTable" style="height: calc(27vh)" :primary_key.sync="primary_key"
    				:permission="permission" :type="10" v-if="ifShow.entrustTemplateTable">
    			</templateTable>
    		</el-tab-pane>
    		<el-tab-pane label="报告模板" name="ReportTemplateTable">
    			<templateTable ref="templateTable" style="height: calc(27vh)" :primary_key.sync="primary_key"
    				:permission="permission" :type="11" v-if="ifShow.ReportTemplateTable">
    			</templateTable>
    		</el-tab-pane> -->


    	</el-tabs>
    </el-footer>
		<testitemManage ref="edit"></testitemManage>

	</div>
</template>

<script>
	import testitemManage from '../components/testitemManage'

	import testOjectTable from '../table/testOjectTable'
	import parameterTable from '../table/parameterTable'
	import standardTable from '../table/standardTable'
  import usageTable from '../table/standardTable'
	import templateTable from '../table/templateTable'
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
			testitemManage,
			testOjectTable,
			parameterTable,
			standardTable,
      usageTable,
			templateTable
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
        current_org: '',
				formLabelWidth: '120px',
				list: [],
				listLoading: true,
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
				table: {
					tableHeight: this.$(window).height()
				},
				activeName: 'parameterTable',
				autoRefresh: false,
				ifShow: {
					parameterTable: true,
					parameterCommonTable: false,
					standardTable: false,
          usageTable: false,
					entrustTemplateTable: false,
					ReportTemplateTable: false,
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
			this.$nextTick(function() {

			});
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
				this.MainTableRaload();
				console.log(permission)
			},
			handleAdd() {
				this.formShow(undefined, {
					group_id: '0',

				})
			},
			formShow(row, info) {
				this.$refs['edit'].showEdit(row, info)
			},
			MainTableRaload() {
				this.$nextTick(() => {
					this.$refs['testOjectTable'].search({})
				})
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
			handleClick(VueComponent, MouseEvent) {
				//console.log(tab, event);
				this.activeName = VueComponent.name
				this.tabShow(VueComponent, MouseEvent);
			},
		},

	}
</script>
