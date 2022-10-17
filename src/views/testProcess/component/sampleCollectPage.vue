<template>
	<div class=" definition purchase equipment_btn calc">

		<el-main class="box1" style="height: calc(86vh); min-height: 300px">
			<!-- :style="accepted && accepted > 0?'height: calc(35vh); min-height: 100px':'height: calc(100vh - 300px); min-height: 100px'" -->
      <div class="baseBox" style="margin-bottom:10px;">
        <vab-query-form>
          <sampleCollectSearchForm ref="sampleCollectSearchForm" v-model="searchData" :search_fob="search_main_fob"
            :permission="permission" :accepted="accepted" :stage="stage">
          </sampleCollectSearchForm>
        </vab-query-form>
        <sampleCollectTable ref="sampleCollectTable" :type="1"  style="height: calc(37vh); min-height: 100px"
          :select-form.sync="searchData" :primary_key.sync="primary_key" :permission="permission"
          :accepted="accepted" :stage="stage">
        </sampleCollectTable>
      </div>
			<el-footer style="height: calc(45%); min-height: 100px" class="table_auto">
				<el-tabs type="border-card" style="height: calc(100%)">
					<el-tab-pane label="留样">
						<sampleRetainTable style="height: calc(29vh)" ref="sampleRetainTable" :type="10"
							:primary_key.sync="primary_key" :permission="permission">
						</sampleRetainTable>
					</el-tab-pane>
          <el-tab-pane label="使用记录">
          	<sampleUse style="height: calc(29vh)" ref="sampleUse" :type="10"
          		:primary_key.sync="primary_key" :permission="permission">
          	</sampleUse>
          </el-tab-pane>
				</el-tabs>
			</el-footer>
			</el-container>
		</el-main>
	</div>
</template>

<script>
	import sampleCollectTable from '../table/sampleCollectTable'
	import sampleRetainTable from '../table/sampleRetainTable'
  import sampleUse from '../table/sampleUse'

	import sampleCollectSearchForm from '../searchForm/sampleCollectSearchForm'


	//dispatchRegisterHistoryTable
	export default {
		name: 'sampleCollectPage',
		components: {
			sampleCollectTable,
			sampleRetainTable,
      sampleUse,
			sampleCollectSearchForm,
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
		data() {
			return {
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
				const permission = await this.$store.dispatch(
					'permission/GetALLPermissionByModel',
					'dispatchRegister'
				)
				this.permission = Object.assign(this.permission, permission)
				await this.fetchData()
			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			reload() {},
			handlExport() {},
			async fetchData() {
				this.$refs['sampleCollectTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['sampleCollectTable'].search(data)
			},
		},
	}
</script>

<style>
.el-form-item--small.el-form-item{margin-bottom:10px;}
.vab-query-form{margin-bottom:0px!important;}
</style>
