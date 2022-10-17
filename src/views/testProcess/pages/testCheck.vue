<template>
	<div class=" purchase equipment_btn calc">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="未复核" name="nocheck">
				<testDataPage ref="testDataPageComplete" v-if="ifShow.nocheck" stage="2" permissionname="testCheck">
				</testDataPage>
			</el-tab-pane>
			<el-tab-pane label="已通过" name="passs">
				<testDataPage ref="testDataPageComplete" v-if="ifShow.passs" stage="3" permissionname="testCheck">
				</testDataPage>
			</el-tab-pane>
			<el-tab-pane label="未通过" name="noPass">
				<testDataPage ref="testDataPageComplete" v-if="ifShow.noPass" stage="-2" permissionname="testCheck">
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
		name: 'testCheck',
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
				activeName: 'nocheck',
				searchData: undefined,
				autoRefresh: true,
				primary_key: -1,
				permission: {
					// person_role: {
					// 	person_role_manage: false,
					// },
					self: false,
				},
				ifShow: {
					passs: false,
					nocheck: true,
					noPass: false,



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

</style>
