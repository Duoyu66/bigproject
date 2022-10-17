<template>
	<div id="sxau_20171611244_yfdc_buy_reg_rec" class="definition purchase equipment_btn calc" name="yfdc_buy_reg_rec">
		<!--购入登记购入台账-->
		<el-tabs v-model="tabs" type="border-card" class="box_center" @tab-click="handleClick">
			<el-tab-pane label="购入登记" class="buy center" name="form" v-if="permission.materialPurchaseAdd">
				<div
					style="display: flex;justify-content: center;box-shadow: rgb(170, 170, 170) 1px 1px 10px 1px;width: 1200px;margin: 0 auto;flex-wrap: wrap; padding-bottom: 20px; ">
					<div style="width: 100%;">
						<div style="height: 100%">
							<div class="purchasefrom">
								<materialPurchaseForm ref="materialPurchaseForm" :chemicalSelectStatus="false"
									:rmSelectStatus="false">
								</materialPurchaseForm>
							</div>
						</div>
					</div>
					<div style="width: 100%; height: 60px; display: flex">
						<el-button @click="handleCllickOk"
							style="margin: 0 auto; height: 40px; width: 200px;margin-top: 10px;" type="primary">
							确 定
						</el-button>
					</div>
				</div>
				<!-- <div class="usage">
					<div style="max-height: calc(100vh - 250px); overflow-y: auto;margin-top: 30px;">
						<materialPurchaseForm ref="materialPurchaseForm"></materialPurchaseForm>
					</div>
					<div>
						
					</div>
				</div> -->
			</el-tab-pane>
			<el-tab-pane label="购入记录" name="table">
				<div>
					<div style="float: right;">
						<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;" v-model="queryForm.name"
									placeholder="标准物质名称" />
							</el-form-item>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;" v-model="queryForm.mat_name"
									placeholder="标准物质类别" />
							</el-form-item>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;" v-model="queryForm.buyer"
									placeholder="购买人" />
							</el-form-item>
							<el-form-item style="margin-right: 0px;">
								<el-button icon="el-icon-search" type="primary" @click="searchTable">

								</el-button>
							</el-form-item>
						</el-form>
					</div>
				</div>
				<div style="max-height: calc(70vh); overflow-y: auto;clear: both;">
					<materialPurchaseTable ref="materialPurchaseTable" :permission="permission" type="materialPurchase"
						style="height: calc(69vh)">
					</materialPurchaseTable>
				</div>

			</el-tab-pane>
		</el-tabs>
		<!-- <table-edit1 ref="edit1"></table-edit1> -->
	</div>
</template>

<script>
	import {
		search_fob
	} from '@/global/form.helper'

	import materialPurchaseForm from '../form/materialPurchaseForm'

	import materialPurchaseTable from '../table/materialPurchaseTable'

	export default {
		name: 'materialPurchase',
		components: {
			materialPurchaseForm,
			materialPurchaseTable,
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					published: 'success',
					draft: 'gray',
					deleted: 'danger',
				}
				return statusMap[status]
			},
		},
		data() {
			let that = this
			return {
				permission: {
					materialPurchaseAdd: false,
				},
				c_name: '',
				queryForm: {
					name: '',
					mat_name: '',
					buyer: ''
				},

				listLoading: true,

				elementLoadingText: '正在加载...',
			}
		},
		computed: {
			height() {
				return this.$baseTableHeight()
			},
			tabs: {
				//getter 方法
				get() {
					console.log('computed getter...')
					let dafault = 'table'
					if (this.c_name) {
						return this.c_name
					}
					if (this.$route.query.tabs) {
						return this.$route.query.tabs
					}
					return dafault
				},
				//setter 方法
				set(newValue) {
					console.log('computed setter...')
					this.c_name = newValue
				}

			}
		},
		created() {
			console.log(this.$route.query.tabs)
			this.init()
		},
		beforeDestroy() {
			console.log('materialPurchase')
		},
		mounted: function() {

		},
		methods: {
			async init() {
				let permissionList = ['materialPurchase'];
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
			handleCllickCancel() {
				this.$refs['materialPurchaseForm'].reset_form()
			},
			handleCllickOk() {
				let that = this
				this.$refs['materialPurchaseForm'].save(function(status) {
					if (status) {
						that.$refs["materialPurchaseForm"].resetForm()
						that.$baseConfirm('是否继续添加？', '提示', async () => {

							},
							function() {
								that.c_name = 'table'
								that.searchTable()
							})
					}


				})
			},
			handleClick(VueComponent, MouseEvent) {
				//console.log(tab, event);
				this.c_name = VueComponent.name
				try {
					this.$router
						.replace({
							path: this.$route.path,
							query: {
								tabs: this.c_name
							},
						})
						.then(function() {})
						.catch(function() {})
				} catch (e) {
					console.log(e)
				}
			},
			handleAdd(row) {
				this.$refs['edit'].showEdit(row)
			},
			searchTable() {
				this.$refs['materialPurchaseTable'].search(this.queryForm)
			},


		},
	}
</script>
