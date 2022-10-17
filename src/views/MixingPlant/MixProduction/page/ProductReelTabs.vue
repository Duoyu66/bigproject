<template>
	<div class="definition purchase equipment_btn calc cardStyle" style="overflow: auto;">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="全部" name="ProductReelPageAll">
				<ProductReelPage ref="ProductReelPageAll" v-if="ifShow.ProductReelPageAll">
				</ProductReelPage>
			</el-tab-pane>
			<el-tab-pane label="正常" name="ProductReelPageNormal">
				<ProductReelPage ref="ProductReelPageNormal" :isOnlyShowQualified="true" v-if="ifShow.ProductReelPageNormal">
				</ProductReelPage>
			</el-tab-pane>
			<el-tab-pane label="报警" name="ProductReelPageError">
				<ProductReelPage ref="ProductReelPageError" :isOnlyShowError="true" v-if="ifShow.ProductReelPageError">
				</ProductReelPage>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import ProductReelPage from '../page/ProductReelPage'
	//dispatchRegisterHistoryTable
	export default {
		name: 'ProductReelTabs',
		components: {
			ProductReelPage
		},
		provide() {
			return {
				reload: this.reload,
			}
		},

		data() {
			return {
				activeName: 'ProductReelPageAll',
				searchData: undefined,
				primary_key: -1,
				ifShow: {
					ProductReelPageAll: false,
					ProductReelPageNormal: false,
					ProductReelPageError: false,
				},
				permission: {
					dispatchRegisterAdd: false,
					dispatchRegisterExamin: false,
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
				this.tabShow({
					name: this.activeName
				});
				// const permission = await this.$store.dispatch(
				// 	'permission/GetALLPermissionByModel',
				// 	'dispatchRegister'
				// )
				// this.permission = Object.assign(this.permission, permission)
				// console.log(permission)
			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
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
			handleClick(VueComponent, MouseEvent) {
				//console.log(tab, event);
				this.activeName = VueComponent.name
				this.tabShowSwitch(VueComponent.name);
				//this.tabShow(VueComponent, MouseEvent);
			},
			reload() {},
			handlExport() {},
			search_main_fob(data) {
				//search
				this.$refs['dispatchRegisterTable'].search(data)
			},
		},
	}
</script>

<style>
	.cardStyle .el-tabs__header:not(.el-footer .el-tabs__header) {
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
		.el-footer.table_auto {
			min-height: auto !important;
		}
	}
</style>
