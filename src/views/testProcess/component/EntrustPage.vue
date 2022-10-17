<template>
  <!-- 委托申请表格 -->
	<div class="purchase equipment_btn calc">
		<el-container>
        <!-- 左边部分 -->
			<div class="baseBox" style="margin-right:10px;">
				<CommonTestObjectTable ref="CommonTestObjectTable"
					style="height: calc(100vh - 204px); min-height: 100px;" :select-form.sync="searchData"
					:primary_key.sync="object_id" :permission="permission" :accepted="accepted" :stage="stage" :testCountType="10">
				</CommonTestObjectTable>
			</div>
       <!-- 右边部分 -->
      <el-main class="" :style="!accepted || accepted > 0?'height: calc(80vh); min-height: 100px;padding-left: 0px;':'height: calc(82vh - 10px); min-height: 100px;padding-left: 0px;'">


					<!-- :style="accepted && accepted > 0?'height: calc(35vh); min-height: 100px':'height: calc(100vh - 300px); min-height: 100px'" -->
          <div class="baseBox" style="margin-right:10px;">
            <vab-query-form>
              <EntrustdataForm ref="EntrustdataForm" v-model="searchData" :search_fob="search_main_fob"
                :permission="permission" :accepted="accepted" :stage="stage">
              </EntrustdataForm>
            </vab-query-form>
            <entrustTable ref="entrustTable" :type="1"
              :style="!accepted || accepted > 0?'height: calc(33vh); min-height: 100px':'height: calc(79vh - 60px); min-height: 100px'"
              :select-form.sync="searchData" :primary_key.sync="primary_key" :object_id="object_id"
              :permission="permission" :accepted="accepted" :stage="stage">
            </entrustTable>
          </div>





					<el-footer style="height: calc(38vh - 10px); min-height: 100px;padding: 0 0px;margin-top:10px;" class="table_auto"
						v-if="!accepted || accepted > 0">
						<el-tabs type="border-card" style="height: calc(100%);margin-right:10px;">
							<el-tab-pane label="试验参数" style="">
								<testDataParamTable style="height: calc(39vh - 60px)" ref="dispatchRegisterHistoryTable"
									:type="0" :primary_key.sync="primary_key" :permission="permission">
								</testDataParamTable>
							</el-tab-pane>
						</el-tabs>
					</el-footer>

			</el-main>
		</el-container>
	</div>
</template>

<script>
	import entrustTable from '../table/entrustTable'
	import testDataParamTable from '../table/testDataParamTable'
	import CommonTestObjectTable from '../table/CommonTestObjectTable'


	import EntrustdataForm from '../searchForm/EntrustdataForm'


	//dispatchRegisterHistoryTable
	export default {
		name: 'EntrustPage',
		components: {
			entrustTable,
			testDataParamTable,
			EntrustdataForm,
			CommonTestObjectTable
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
		},
		watch: {
			object_id(newVal, oldVal) {
				this.$set(this,'primary_key',-1)
			}
		},
		data() {
			return {
				searchData: undefined,
				object_id: '',
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
        let permissionList = ['entrustAccept'];
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
				this.$refs['entrustTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['entrustTable'].search(data)
			},
		},
	}
</script>

<style>
.el-form-item--small.el-form-item{margin-bottom:10px;}
.vab-query-form{margin-bottom:0px!important;}
</style>
