<template>
	<div class="definition purchase contract equipment_btn calc" style="overflow: auto;">
		<el-tabs type="border-card"  class="box_center" style="height: calc(100vh)-300px">
			<el-tab-pane label="undefined">
				<el-row>
					<el-col :span="24">
						<el-form ref="form" :model="search.main" :inline="true" @submit.native.prevent>
							<el-form-item label="" :label-width="formLabelWidth">
							</el-form-item>
							<el-form-item label="" :label-width="formLabelWidth">
								<el-button icon="el-icon-search" type="primary" @click="searchMain"></el-button>
							</el-form-item>
						</el-form>
					</el-col>
					<el-col :span="24">
						<productReelTable style="height: calc(100vh - 111px); min-height: 300px" ref="productReelTable"
							type="main_table" :primary_key.sync="primary_key" :permission="permission">
						</productReelTable>
					</el-col>
					<el-col :span="24">
						<el-tabs type="border-card" style="height: calc(50%)">
							<el-tab-pane label="undefined">
								<el-row>
									<el-col :span="24">
										<ProductMaterialTable style="height: calc(100vh - 111px); min-height: 300px"
											ref="ProductMaterialTable" type="main_table" :primary_key.sync="primary_key"
											:permission="permission"></ProductMaterialTable>
									</el-col>
								</el-row>
							</el-tab-pane>
						</el-tabs>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>


<script>
	import productReelTable from '../table/productReelTable.vue'
	import ProductMaterialTable from '../table/ProductMaterialTable.vue'
	import productReelForm from '../form/productReelForm.vue'
	export default {
		name: 'productReel',
		components: {
			productReelTable,
			productReelForm
		},
		data() {
			return {
				primary_key: -1,
				search: {
					main: {
						output_time: '',
					},
				},
				permission: {
					person_role: false,
					self: false,
				},
			}
		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {},
		methods: {
			async init() {
				let permissionList = ['undefined'];
				let permission = '';
				for (let i = 0; i < permissionList.length; i++) {
					permission = await this.$store.dispatch(
						'permission/GetALLPermissionByModel',
						permissionList[i],
					)
					if (permission) {
						this.permission = Object.assign(this.permission, permission)
					}
				}
				await this.fetchData()
				//await this.getTableData() 
			},
			async fetchData() {
				this.$refs['productReelTable'].fetchData()
				this.$refs['ProductMaterialTable'].fetchData()
			},
		},
	}
</script>
