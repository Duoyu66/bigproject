<template>
  <!-- 收文登记表格内容   与收文管理共用一个页面-->
	<div class=" definition purchase equipment_btn calc" style="overflow-y:auto;margin-right:10px;">

		<!-- height: calc(100vh - 260px); min-height: 300px -->
     <!-- :style="elMainStyle" -->
		<el-main class="box1">
      <div class="baseBox" style="margin-bottom:10px;">
          <vab-query-form >
            <dispatchRegisterSearchForm ref="dispatchRegisterSearchForm" v-model="searchData"
              :search_fob="search_main_fob" :permission="permission" :nextStatus="nextStatus">
            </dispatchRegisterSearchForm>
          </vab-query-form>
          <dispatchRegisterTable ref="dispatchRegisterTable" :type="1" style="height: calc(48%); min-height: 300px"
            :select-form.sync="searchData" :primary_key.sync="primary_key" :permission="permission"
            :nextStatus="nextStatus" :status="status">
          </dispatchRegisterTable>
      </div>

			<el-footer style="height: calc(50%); min-height:290px;padding: 0px;" class="table_auto">
				<el-tabs type="border-card" style="height: calc(73%)">
					<el-tab-pane label="操作历史">
						<dispatchRegisterHistoryTable style="height: calc(29vh)" ref="dispatchRegisterHistoryTable"
							:type="0" :primary_key.sync="primary_key" :permission="permission">
						</dispatchRegisterHistoryTable>
					</el-tab-pane>
				</el-tabs>
			</el-footer>

			</el-container>
		</el-main>
	</div>
</template>

<script>
	import dispatchRegisterTable from '../table/dispatchRegisterTable'
	import dispatchRegisterHistoryTable from '../table/dispatchRegisterHistoryTable'
	import dispatchRegisterSearchForm from '../searchForm/dispatchRegisterSearchForm'
	//dispatchRegisterHistoryTable
	export default {
		name: 'dispatchRegister',
		components: {
			dispatchRegisterTable,
			dispatchRegisterHistoryTable,
			dispatchRegisterSearchForm,
		},
		provide() {
			return {
				reload: this.reload,
			}
		},
		props: {
			nextStatus: {
				type: String,
			},
			status: {
				type: String,
				default: '0'
			}
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
				dom: {

				}
			}
		},
		computed: {
			elMainStyle() {
				let height = '100vh'
				console.log(this.dom['dispatchRegisterSearchForm'])
				if (this.dom['dispatchRegisterSearchForm']) {
					console.log($(this.dom['dispatchRegisterSearchForm'].$el).height())
					height = height + ' - ' + (this.dom['dispatchRegisterSearchForm'].$el.offsetHeight + 210) + 'px'
				} else {
					height = height + ' - 260px'
				}
				console.log('height: calc(' + height + '); min-height: 300px')
				return 'height: calc(' + height + '); min-height: 300px;overflow-y:auto;max-height:calc(100vh - 220px)'
			}
		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {
			let that = this
			let index = setInterval(() => {
				if (that.$refs['dispatchRegisterSearchForm']) {
					clearInterval(index)
					//that.dom['dispatchRegisterSearchForm'] = that.$refs['dispatchRegisterSearchForm']
					that.$set(that.dom, 'dispatchRegisterSearchForm', that.$refs['dispatchRegisterSearchForm'])
					console.log('dispatchRegisterSearchForm 初始化完成')
				}
			})
		},
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
				this.$refs['dispatchRegisterTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['dispatchRegisterTable'].search(data)
			},
		},
	}
</script>

<style>
.el-form-item--small.el-form-item{margin-bottom:10px}
.vab-query-form{margin-bottom:0px!important}
/* 主表表格高度控制 */
@media only screen and (max-width: 1366px) {
   .el-footer.table_auto{min-height:auto!important;}
}
</style>
