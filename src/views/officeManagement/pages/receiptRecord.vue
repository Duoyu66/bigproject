<template>
  <!-- 收文管理 -->
	<div class="definition purchase equipment_btn calc cardStyle" style="overflow: auto;">
		<el-tabs  v-model="activeName"  @tab-click="handleClick" >
			<el-tab-pane label="登记" name="register" v-if="permission.dispatchRegisterAdd">
				<dispatchRegister ref="dispatchRegister" nextStatus="登记" status="1">
				</dispatchRegister>
			</el-tab-pane>
			<el-tab-pane label="审核" name="examine" v-if="permission.dispatchRegisterExamin">
				<dispatchRegister ref="dispatchRegister" nextStatus="审核" status="0">
				</dispatchRegister>
			</el-tab-pane>
			<el-tab-pane label="完成" name="finish">
				<dispatchRegister ref="dispatchRegister" nextStatus="完成" status="0">
				</dispatchRegister>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import dispatchRegister from '../pages/dispatchRegister'
	//dispatchRegisterHistoryTable
	export default {
		name: 'receiptRecord',
		components: {
			dispatchRegister
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
					dispatchRegisterAdd:false,
					dispatchRegisterExamin:false,
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
				console.log(permission)
			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			handleClick() {

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
.cardStyle .el-tabs__header:not(.el-footer .el-tabs__header ) {
    margin-bottom: 10px;margin-right: 10px;
    background: #fff;
    border-radius: 5px;
    border: 1px solid #dbe0e6;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);}
.cardStyle .draftPageHigh{height: calc(22vh)!important;}
/* 页面单独样式添加 */
@media only screen and (max-width: 1366px) {
   .el-footer.table_auto{min-height:auto!important;}
}


</style>
