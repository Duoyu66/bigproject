<template>

	<div class=" purchase equipment_btn calc cardStyle" style="margin-right:10px">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="未完成试验" name="notest">
				<testDataPage ref="testDataPageComplete" v-if="ifShow.notest" stage="1">
				</testDataPage>
			</el-tab-pane>
			<el-tab-pane label="未复核" name="nocheck">
				<testDataPage ref="testDataPageComplete" v-if="ifShow.nocheck" stage="2">
				</testDataPage>
			</el-tab-pane>
			<el-tab-pane label="未批准" name="passs">
				<testDataPage ref="testDataPageComplete" v-if="ifShow.passs" stage="3">
				</testDataPage>
			</el-tab-pane>
			<el-tab-pane label="复核未通过" name="noPass">
				<testDataPage ref="testDataPageComplete" v-if="ifShow.noPass" stage="-2">
				</testDataPage>
			</el-tab-pane>
			<el-tab-pane disabled>
				<span slot="label">
					<el-switch v-model="autoRefresh" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
					切换时自动刷新标签页内容
				</span>
			</el-tab-pane>
		</el-tabs>

	</div>
</template>

<script>
	import testDataPage from '../component/testDataPage'
	//testDataPageHistoryTable
	export default {
		name: 'testExcute',
		components: {
			testDataPage
		},
		provide() {
			return {
				reload: this.reload,
			}
		},

		data() {
			return {
				activeName: 'notest',
				searchData: undefined,
				primary_key: -1,
				permission: {
					// person_role: {
					// 	person_role_manage: false,
					// },
					self: false,
				},
				autoRefresh: true,
				ifShow: {
					passs: false,
					nocheck: true,
					noPass: false,
					notest: false,

				}
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

				this.tabShowSwitch(this.activeName);
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
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			handleClick(VueComponent, MouseEvent) {
				//console.log(tab, event);
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
				this.tabShow(VueComponent, MouseEvent);
			},
			reload() {},
			handlExport() {},
			search_main_fob(data) {
				//search
				this.$refs['testDataPageTable'].search(data)
			},
		},
	}
</script>

<style>
.cardStyle .el-tabs__header:not(.el-tabs__content .el-tabs__header ){
  margin-bottom:10px;background: #fff;border-radius: 5px;border: 1px solid #dbe0e6;padding: 10px;box-sizing: border-box;box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}
</style>
