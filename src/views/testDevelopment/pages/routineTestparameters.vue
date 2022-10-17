<template>
  <!-- 常用试验参数界面 -->
	<div>
		<objectParameter ref="objectParameter" :type="10" style="height: calc(100vh-100px);">
		</objectParameter>
	</div>
</template>

<script>
	import objectParameter from '../component/objectParameter'


	import {
		treePaging
	} from '@/global/form.helper'
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataEx2,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'

	import {
		getList,
		doDelete
	} from '@/api/table'



	export default {
		name: 'rolePermissionMapping',
		components: {
			objectParameter

		},
		provide() {
			return {
				paramReload: this.ObjectParamTable,
				objectReload: this.ojectTabelLoad
			}
		},
		watch: {
			main_dialog(newVal, oldVal) {
				this.selectData_main()
			},
			primary_key(newVal, oldVal) {
				this.ObjectParamTable()
			}
		},
		data() {
			return {



			}
		},
		computed: {
			height() {
				return this.$baseTableHeight()
			},
		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {

		},
		methods: {
			async init() {

			},
			async GetPermission() {
				let permissionList = ['testitemManage'];
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
			},
			handleCurrentChangeMain() {},
			handleSizeChangeMain() {},
			ObjectParamTable() {
				this.$set(this.assembly.parameterTable, 'show', false)
				this.$nextTick(() => {
					this.$set(this.assembly.parameterTable, 'show', true)
					this.$nextTick(() => {
						let form = {
							objecrt_id: this.primary_key
						}
						form = Object.assign(form, this.queryForm_param)
						this.$refs['parameterTable'].search(form)
					})
				})
			},
			selectData_main() {
				this.$refs['testOjectTable'].search(this.queryForm_main)
			},
			selectData_param() {
				this.$refs['parameterTable'].search(this.queryForm_param)
			},
			async fetchData_main() {
				let that = this
				this.$nextTick(() => {
					that.$refs['testOjectTable'].search({})
				})
				// let index = setInterval(function() {
				// 	if (that.$refs['testOjectTable']) {
				// 		clearInterval(index)
				// 		that.$refs['testOjectTable'].fetchData()
				// 	}
				// })

			},
			async GetGroupEx() {
				let list = [{
					data: "tpl_id",
					sqlcode: 241
				}];
				await GetGroupDataCustomEx(this, list)
			},
			handlAddRole() {
				this.$refs['testitemManage'].showEdit()
			},
			ManualSaveSelectionParam() {
				if (this.assembly.parameterTable.show) {
					this.$refs['parameterTable'].ManualSaveSelection(this.queryForm_param)
				}

			},
			handleAddParam() {
				this.handleshowDialog(undefined, false, {
					parent_id: 0,
				})
			},
			handleshowDialog(row, disable, person_info) {
				this.$refs['parameterManagement'].showEdit(row, disable, person_info)
			},
			ojectTabelLoad() {
				this.selectData_main()
			},

		},
	}
</script>
<style>

</style>
