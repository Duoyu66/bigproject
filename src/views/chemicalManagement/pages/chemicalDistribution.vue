<template>
<!-- 化学品分配 -->
	<div class="table-container definition distribution" style="margin-right: 10px; overflow: auto;">
		<vab-query-form style="margin-bottom: 0px;">
			<div style="float: left;">
				<el-tooltip class="item" effect="dark" :content="organization.org_name" placement="top-start"
					style="margin-top: 6px;">
					<el-tag type="info">
						分配化学品给:{{organization.org_name}}
					</el-tag>
				</el-tooltip>
			</div>
			<div style="float: right;">
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
					<el-form-item>
						<el-switch v-model="queryForm.isShowSelect" active-text="仅显示分配的化学品" inactive-text=""
							@change="switchisShowSelect">
						</el-switch>
					</el-form-item>
					<el-form-item>
						<el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按照化学品名称搜索"
							prefix-icon="el-icon-search" />
					</el-form-item>

					<el-form-item style="margin-right:0;">
						<el-button icon="el-icon-search" type="primary" @click="searchchemical_alloc">

						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</vab-query-form>
		<chemicalPreserveTable ref="chemicalPreserveTable" :permission="btnShow" type="chemical_alloc"
			:select_org_id="organization.org_id" style="height: calc(81vh)"></chemicalPreserveTable>
		<table-edit ref="edit"></table-edit>
	</div>
</template>

<script>
	import TableEdit from '../components/chemicalDistribution.vue'
	import chemicalPreserveTable from '../table/chemicalPreserveTable'

	import {
		GetOrgId,
		GetCurrentOrgId,
		GetPersonRoleMax,
		getOrgNameByselect,
	} from '../commonjs/common.chemical'
	export default {
		name: 'ComprehensiveTable',
		components: {
			TableEdit,
			chemicalPreserveTable
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
				btnShow: {
					chemicalPreserveadd: false,
					chemicalPreserveedit: false,
					chemicalPreserveDelete: false,
				},
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				selectRows: '',
				queryForm: {
					title: '',
					isShowSelect: false
				},
				dialogFormVisible: false,

				table: {
					tableHeight: this.$(window).height()
				},
				organization: {
					org_name: '',
					org_id: ''
				}

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
		beforeDestroy() {
			this.organization = {
				org_name: '',
				org_id: ''
			}
		},
		mounted: function() {

		},
		methods: {
			async init() {
				this.role_max = await GetPersonRoleMax()
				await this.getOrgNameByselect()
			},
			async getOrgId() {
				let org_id = await GetOrgId()

				this.organization.org_id = org_id.toString()
				return org_id;
			},
			async getOrgName(value) {
				let orgName = await this.$store.dispatch('org/GetOrgNameByOrgId', value)
				return orgName
			},
			async getOrgNameByselect() {

				let index = setInterval(async () => {
					let org_id = await this.getOrgId()
					let org_name = await this.getOrgName(org_id);
					if (org_name.trim()) {
						this.$set(this.organization, 'org_name', org_name)
						clearInterval(index);
						//this.$set(this.load.status.orgName, 'isShow', true)
					}
				}, 500)
			},
			tableSortChange() {

			},
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
				this.$refs['edit'].showEdit()
			},
			switchisShowSelect() {
				this.searchchemical_alloc()
			},
			searchchemical_alloc(event, queryForm) {
				if (this.queryForm.isShowSelect) {
					this.queryForm.alloc_num = 0
				} else {
					this.queryForm.alloc_num = undefined
				}
				this.$refs['chemicalPreserveTable'].search(this.queryForm)
			}
		},
	}
</script>
<style>
.table-container{background:#fff;border-radius:5px;border: 1px solid #dbe0e6;padding: 10px;box-sizing: border-box;
box-shadow: 0 1px 4px rgb(0 21 41 / 8%);}
.el-form-item--small.el-form-item{margin-bottom: 10px;}
/* 可能会影响其他页面暂存 */
.app-main-container .app-main-height{min-height: calc( 100vh - 40px - 48px - 10px - 10px )!important;}

@media only screen and (max-width: 1366px) {
.heightControl{height:calc(69vh)!important;}
  }
</style>
