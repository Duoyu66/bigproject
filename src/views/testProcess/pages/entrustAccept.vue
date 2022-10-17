<template>
	<div class="" style="" class="cardStyle">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="全部委托" name="all">
				<EntrustPage ref="EntrustPageComplete" v-if="ifShow.all">
				</EntrustPage>
			</el-tab-pane>
			<el-tab-pane label="未受理" name="NoAcceptance" v-show="permission.EntrustPageAdd">
				<EntrustPage ref="EntrustPageNoAcceptance" v-if="ifShow.NoAcceptance" accepted="0">
				</EntrustPage>
			</el-tab-pane>
			<el-tab-pane label="已拒绝" name="refuse" v-show="permission.postExamine">
				<EntrustPage ref="EntrustPageRefuse" v-if="ifShow.refuse" accepted="-1">
				</EntrustPage>
			</el-tab-pane>
			<el-tab-pane label="已受理" name="Acceptance" v-show="permission.Acceptance">
				<EntrustPage ref="EntrustPageAcceptance" v-if="ifShow.Acceptance" accepted="1" status="0">
				</EntrustPage>
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
	import EntrustPage from '../component/EntrustPage'
	//EntrustPageHistoryTable
	export default {
		name: 'entrustAccept',
		components: {
			EntrustPage
		},
		provide() {
			return {
				reload: this.reload,
			}
		},

		data() {
			return {
				autoRefresh: true,
				activeName: 'all',
				searchData: undefined,
				primary_key: -1,
				permission: {
					// person_role: {
					// 	person_role_manage: false,
					// },
					self: false,
				},
				ifShow: {
					NoAcceptance: false,
					refuse: false,
					Acceptance: false,
					test: false,
					all: false,
					review: false,
					approval: false,
					valuation: false,


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
        // console.log(this.permission)
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
				this.$refs['EntrustPageTable'].search(data)
			},
		},
	}
</script>

<style>
.cardStyle .el-tabs__header:not(.el-footer .el-tabs__header ) {
    margin: 0 10px 10px 0;
    background: #fff;
    border-radius: 5px;
    border: 1px solid #dbe0e6;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);}
</style>
