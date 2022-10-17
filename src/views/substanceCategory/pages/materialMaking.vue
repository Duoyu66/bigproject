<template>
	<div id="sxau_20171611244_yfdc_buy_reg_rec" class="definition purchase equipment_btn calc" name="yfdc_buy_reg_rec">
		<!--购入登记购入台账-->
		<el-tabs v-model="c_name" type="border-card" class="box_center" @tab-click="handleClick">
			<el-tab-pane label="添加制作记录" class="buy center" name="RmMakeDialog" v-if="permission.materialMakingAdd">
				<div
					style="display: flex;justify-content: center;box-shadow: rgb(170, 170, 170) 1px 1px 10px 1px;width: 1200px;margin: 0 auto;flex-wrap: wrap; padding-bottom: 20px; ">
					<div style="width: 100%;">
						<div style="height: 100%">
							<div class="purchasefrom">
								<RmMakeDialog ref="RmMakeDialog" :chemicalSelectStatus="false" :rmSelectStatus="false">
								</RmMakeDialog>
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
						<RmMakeDialog ref="RmMakeDialog"></RmMakeDialog>
					</div>
					<div>
						
					</div>
				</div> -->
			</el-tab-pane>
			<el-tab-pane label="制作记录" name="table">
				<div>
					<div style="float: right;">
						<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;" v-model="queryForm.rm_name"
									placeholder="标准物质类别" />
							</el-form-item>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;" v-model="queryForm.make_person"
									placeholder="制作人" />
							</el-form-item>
							<el-form-item style="margin-right: 0px;">
								<el-button icon="el-icon-search" type="primary" @click="searchTable">

								</el-button>
							</el-form-item>
						</el-form>
					</div>
				</div>
				<div style="max-height: calc(70vh); overflow-y: auto;clear: both;">
					<rmMakeTable ref="rmMakeTable" :permission="permission" type="main" style="height: calc(69vh)">
					</rmMakeTable>
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
	import {
		insert_fob,
		delete_fob
	} from '@/global/form.helper'
	import setting from '@/config/setting.config'



	import RmMakeDialog from '../../chemicalManagement/form/MakeForm'

	import rmMakeTable from '../../chemicalManagement/table/rmMakeTable'

	export default {
		name: 'ComprehensiveTable',
		components: {
			RmMakeDialog,
			rmMakeTable,
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
			return {
				permission: {
					materialMakingAdd: false,
				},
				c_name: this.$route.query.tabs ? this.$route.query.tabs : 'talbe',
				queryForm: {
					rm_name: '',
					make_person: '',
				},

				listLoading: true,

				elementLoadingText: '正在加载...',
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
				let permissionList = ['materialMaking'];
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
				this.$refs['RmMakeDialog'].reset_form()
			},
			handleCllickOk() {
				let that = this
				this.$refs['RmMakeDialog'].save(function(status) {
					if (status) {
						that.$refs["RmMakeDialog"].resetForm()
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
								tabs: '' + this.c_name
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
				this.$refs['rmMakeTable'].search(this.queryForm)
			},


		},
	}
</script>
