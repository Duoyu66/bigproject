<template>
	<!-- 发文管理 -->
	<div class="definition purchase equipment_btn calc cardStyle" style="overflow: auto;">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="草稿" name="draft">
				<GeophysicalProspectingReport ref="draft" v-if="ifShow.draft" status="0">
				</GeophysicalProspectingReport>
			</el-tab-pane>
			<el-tab-pane label="复核" name="review">
				<GeophysicalProspectingReport ref="review" v-if="ifShow.review" status="10,11,12">
				</GeophysicalProspectingReport>
			</el-tab-pane>
			<el-tab-pane label="审核" name="examine" v-show="permission.postExamine">
				<GeophysicalProspectingReport ref="examine" v-if="ifShow.examine" status="20,21,22">
				</GeophysicalProspectingReport>
			</el-tab-pane>
			<el-tab-pane label="审定" name="approve" v-show="permission.postExamine">
				<GeophysicalProspectingReport ref="approve" v-if="ifShow.approve" status="30,31,32">
				</GeophysicalProspectingReport>
			</el-tab-pane>
			<el-tab-pane label="完成" name="finish">
				<GeophysicalProspectingReport ref="postRegistrationComplete" v-if="ifShow.finish" status="100">
				</GeophysicalProspectingReport>
			</el-tab-pane>
			<el-tab-pane label="所有" name="all">
				<GeophysicalProspectingReport ref="postRegistrationComplete" v-if="ifShow.all" >
				</GeophysicalProspectingReport>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import GeophysicalProspectingReport from './GeophysicalProspectingReport'
	//postRegistrationHistoryTable
	export default {
		name: 'draft',
		components: {
			GeophysicalProspectingReport
		},
		provide() {
			return {
				reload: this.reload,
			}
		},

		data() {
			return {
				activeName: 'finish',
				searchData: undefined,
				primary_key: -1,
				permission: {
					// person_role: {
					// 	person_role_manage: false,
					// },
					self: false,
				},
				ifShow: {
					draft: false,
					review: false,
					examine: false,
					approve: false,
					finish: false,
					all: false,

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
				let permissionList = ['postingRecord', 'postRegistration', 'examinationAndapproval'];
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
				for (let key in this.ifShow) {
					this.ifShow[key] = false
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
				this.$refs['postRegistrationTable'].search(data)
			},
		},
	}
</script>

<style>
	.cardStyle.app-main-height .el-tabs__header:not(.el-footer .el-tabs__header) {
		margin-bottom: 10px;
		margin-right: 10px;
		background: #fff;
		border-radius: 5px;
		border: 1px solid #dbe0e6;
		padding: 10px;
		box-sizing: border-box;
		box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
	}

	.cardStyle .draftPageHigh {
		height: calc(22vh) !important;
	}

	/* 页面单独样式添加 */
	@media only screen and (max-width: 1366px) {
		.cardStyle .el-table:not(.el-footer .el-table) {
			height: calc(40vh) !important;
		}

		.el-footer {
			min-height: 300px;
		}

		.cardStyle .draftPageHigh {
			height: calc(37vh) !important;
		}
	}
</style>
