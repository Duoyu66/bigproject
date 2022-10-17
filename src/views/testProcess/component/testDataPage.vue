<template>
  <!-- 报告批准、试验批准表格 -->
	<div class=" purchase equipment_btn calc">
		<el-container>
			<div  class="baseBox" style="height: calc(100vh - 186px);margin-right: 10px;">
				<CommonTestObjectTable ref="CommonTestObjectTable"
					style="height: calc(100vh - 170px); min-height: 100px" :select-form.sync="searchData"
					:primary_key.sync="object_id" :permission="permission" :accepted="accepted" :stage="stage" :testCountType="20" :isShowZeroRow="false">
				</CommonTestObjectTable>
			</div>
			<el-main class="box1" :style="accepted && accepted > 0?'height: calc(35vh); min-height: 100px':'height: calc(100vh - 180px);'">
        <!-- style="height: calc(87vh); min-height: 300px;padding-left: 0px;" -->
				<!-- :style="accepted && accepted > 0?'height: calc(35vh); min-height: 100px':'height: calc(100vh - 300px); min-height: 100px'" -->
        <div class="baseBox">
          <vab-query-form style="margin-bottom:0px;">
            <testDataSearchForm ref="testDataSearchForm" v-model="searchData" :search_fob="search_main_fob"
              :permission="permission" :accepted="accepted" :stage="stage" >
            </testDataSearchForm>
          </vab-query-form>
          <testDataTable ref="testDataTable" :type="1" style="height: calc(31vh); min-height: 100px"
            :select-form.sync="searchData" :primary_key.sync="primary_key" :permission="permission"
            :accepted="accepted" :stage="stage" :object_id="object_id">
          </testDataTable>
        </div>
				<el-footer style="height: calc(100vh - 590px); min-height: 100px;padding: 0 0px;margin-top: 10px;" class="table_auto">
					<el-tabs type="border-card" style="height: calc(100vh - 595px)">
						<el-tab-pane label="试验参数">
							<testDataParamTable style="height: calc(30vh);overflow: auto;" ref="testDataParamTable" :type="10"
								:primary_key.sync="primary_key" :permission="permission">
							</testDataParamTable>
						</el-tab-pane>
						<el-tab-pane label="样品台账">
							<sampleCollectTable style="height: calc(30vh);overflow: auto;" ref="sampleCollectTable" :type="10"
								:primary_key.sync="primary_key" :permission="permission">
							</sampleCollectTable>
						</el-tab-pane>
					</el-tabs>
				</el-footer>
			</el-main>
		</el-container>




	</div>
</template>

<script>
	import testDataTable from '../table/testDataTable'
	import testDataParamTable from '../table/testDataParamTable'
	import sampleCollectTable from '../table/sampleCollectTable'
	import CommonTestObjectTable from '../table/CommonTestObjectTable'


	import testDataSearchForm from '../searchForm/testDataSearchForm'
	//dispatchRegisterHistoryTable
	export default {
		name: 'testDataPage',
		components: {
			testDataTable,
			testDataParamTable,
			sampleCollectTable,
			CommonTestObjectTable,

			testDataSearchForm,
		},
		provide() {
			return {
				reload: this.reload,
			}
		},
		props: {
			accepted: {
				type: String,
				default: ''
			},
			stage: {
				type: String,
				default: ''
			},
      permissionname: {
        type: String,
        default: 'testTask'
      },
		},
		data() {
			return {
				object_id: '',
				searchData: undefined,
				primary_key: -1,
				permission: {
					person_role: false,
					// person_role: {
					// 	person_role_manage: false,
					// },
					self: false,
				},
			}
		},
		computed: {

		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {},
		methods: {
			async init() {
				let permissionList = [];
        permissionList.push(this.permissionname)
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
				await this.fetchData()
			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			reload() {},
			handlExport() {},
			async fetchData() {
				this.$refs['testDataTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['testDataTable'].search(data)
			},
		},
	}
</script>

<style>
.el-form-item--small.el-form-item{margin-bottom:10px;}
</style>
