<template>
  <!-- 发文管理 -->
	<div class="definition purchase equipment_btn calc cardStyle" style="overflow: auto;">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="起草退回" name="register" v-show="permission.postRegistrationAdd">
				<postRegistration ref="postRegistrationAdd" v-if="ifShow.register" nextStatus="起草" status="0">
				</postRegistration>
			</el-tab-pane>
			<el-tab-pane label="审核" name="examine" v-show="permission.postExamine">
				<postRegistration ref="postRegistrationExamin" v-if="ifShow.examine" nextStatus="审核" status="0">
				</postRegistration>
			</el-tab-pane>
			<el-tab-pane label="用章" name="stamp" v-show="permission.postExamine">
				<postRegistration ref="postRegistrationStamp" v-if="ifShow.stamp" nextStatus="盖章" status="0">
				</postRegistration>
			</el-tab-pane>
			<el-tab-pane label="发送" name="send" v-show="permission.postExamine">
				<postRegistration ref="postRegistrationSend" v-if="ifShow.send" nextStatus="发送" status="0">
				</postRegistration>
			</el-tab-pane>
			<el-tab-pane label="完成" name="finish">
				<postRegistration ref="postRegistrationComplete" v-if="ifShow.finish" nextStatus="完成" status="1">
				</postRegistration>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import postRegistration from '../pages/postRegistration'
	//postRegistrationHistoryTable
	export default {
		name: 'draft',
		components: {
			postRegistration
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
					register: false,
					examine: false,
					stamp: false,
					send: false,
					finish: false,

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
 .cardStyle.app-main-height .el-tabs__header:not(.el-footer .el-tabs__header ) {
    margin-bottom: 10px;margin-right:10px;
    background: #fff;
    border-radius: 5px;
    border: 1px solid #dbe0e6;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);}
.cardStyle .draftPageHigh{height: calc(22vh)!important;}
/* 页面单独样式添加 */
@media only screen and (max-width: 1366px) {
.cardStyle .el-table:not(.el-footer .el-table ){
  height: calc(40vh)!important;
  }
  .el-footer{min-height:300px;}
  .cardStyle .draftPageHigh{height: calc(37vh)!important;}
}

</style>
