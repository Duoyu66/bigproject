<template>
	<div id="sxau_20171611244_yfdc_buy_reg_rec" class="definition purchase equipment_btn calc" name="yfdc_buy_reg_rec" style="margin-right:10px;">
		<!--购入登记购入台账-->
		<el-tabs v-model="c_name" type="border-card" class="box_center" @tab-click="handleClick">
			<el-tab-pane label="购入登记" class="buy center" name="PurchaseForm" v-if="permission.chemical_buy_add">
				<div
					style="display: flex;justify-content: center;box-shadow: rgb(170, 170, 170) 1px 1px 10px 1px;width: 1200px;margin: 0 auto;flex-wrap: wrap; padding-bottom: 20px; ">
					<div style="width: 100%;">
						<div style="height: 100%">
							<div class="purchasefrom">
								<PurchaseForm ref="PurchaseForm"></PurchaseForm>
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
						<PurchaseForm ref="PurchaseForm"></PurchaseForm>
					</div>
					<div>

					</div>
				</div> -->
			</el-tab-pane>
			<el-tab-pane label="购入记录" name="PurchaseTalbe">
				<div>
					<div style="float: right;margin-right: -10px;">
						<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;" v-model="queryForm.chemical_name"
									placeholder="化学品名称" />
							</el-form-item>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;" v-model="queryForm.buyer"
									placeholder="购买人" />
							</el-form-item>
							<el-form-item>
								<el-button icon="el-icon-search" type="primary" @click="searchTable">

								</el-button>
							</el-form-item>
						</el-form>
					</div>
				</div>
				<chemicalPurchaseTalbe ref="chemicalPurchaseTalbe" :permission="permission" type="chemical_purchase"
					></chemicalPurchaseTalbe>
				<chemical-buy-edit ref="edit"></chemical-buy-edit>
			</el-tab-pane>
		</el-tabs>
		<!-- <table-edit1 ref="edit1"></table-edit1> -->
	</div>
</template>

<script>
	//let g_org_id;
	import {
		search_fob
	} from '@/global/form.helper'
	import {
		insert_fob,
		delete_fob
	} from '@/global/form.helper'
	import setting from '@/config/setting.config'

	function zcm_date(obj) {
		if (obj === undefined) return ''
		if (obj.getFullYear === undefined) {
			console.error('not a date')
			return ''
		}
		let mon = obj.getMonth() + 1
		let day = obj.getDate()
		if (mon <= 9) mon = '0' + mon
		if (day <= 9) day = '0' + day
		mon = String(mon)
		day = String(day)
		return String(obj.getFullYear()) + '-' + mon + '-' + day
	}

	function obj_value(obj, def) {
		return obj !== undefined ? obj : def
	}
	let g_org_id = undefined
	import {
		getList,
		doDelete
	} from '@/api/table'
	import ChemicalBuyEdit from '../components/chemicalPurchase'

	import chemicalPurchaseTalbe from '../table/chemicalPurchaseTalbe'

	import PurchaseForm from '../form/PurchaseForm.vue'

	export default {
		name: 'ComprehensiveTable',
		components: {
			ChemicalBuyEdit,
			chemicalPurchaseTalbe,
			PurchaseForm,

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
					chemical_buy_add: false,
					chemical_buy_edit: false,
					chemical_buy_delete: false,
				},
				c_name: this.$route.query.tabs ? this.$route.query.tabs : 'PurchaseTalbe',
				queryForm: {
					chemical_name: '',
				},

				show_edit_btn: false,
				show_delete_btn: false,
				has_permition: false,
				yfdc: null,

				isEmptyList: true,
				imgShow: true,
				list: [],
				imageList: [],
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',

				purchace_edit_form: {},
				form: {
					value1: '',
					norms: 'cj',
					name: 'rygz',
					region: 'g',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: '',
				},
				formLabelWidth: '120px',
				table: {
					tableHeight: this.$(window).height(),
				},
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
				let permissionList = ['chemical_buy'];
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
			set_ok_form(form) {
				this.purchace_edit_form = form
			},
			handleCllickCancel() {
				this.$refs['PurchaseForm'].reset_form()
			},
			handleCllickOk() {
				let that = this
				this.$refs['PurchaseForm'].save(function(status) {
					if (status) {
						that.$refs["PurchaseForm"].resetForm()
						that.$baseConfirm('是否继续添加？', '提示', async () => {

							},
							function() {
								that.c_name = 'PurchaseTalbe'
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
							path: this.$route.path, //'/chemicalManagement/chemicalPurchase',
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
				this.$refs['chemicalPurchaseTalbe'].search(this.queryForm)
			},


		},
	}
</script>
<style>
.el-form-item--small.el-form-item{margin-bottom:10px!important ;}
  @media only screen and (max-width: 1366px) {
    /* .el-table{height: calc(83%)!important;} */
  }
</style>
