<template>
	<div class=" purchase equipment_btn calc">
		<EntrustPage ref="EntrustPageRefuse" v-if="ifShow.all" accepted="1">
		</EntrustPage>
	</div>
</template>

<script>
	import EntrustPage from '../component/EntrustPage'
	//EntrustPageHistoryTable
	export default {
		name: 'testDataNoAllocPage',
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
					reAllocation: false,

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
				let permissionList = ['postingRecord', 'EntrustPage', 'examinationAndapproval'];
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
				console.log('this.permission', this.permission)
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
				this.$refs['EntrustPageTable'].search(data)
			},
		},
	}
</script>

<style>
.app-main-height{padding-left:0px!important;}
</style>
