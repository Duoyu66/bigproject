<template>
<!-- 试验室标准物质定制 -->
	<div class="table-container definition distribution baseBox">
		<vab-query-form style="margin-bottom: 0px;">
			<div style="float: left;">
				<el-tooltip class="item" effect="dark" :content="organization.org_name" placement="top-start" style="margin-top: 8px;">
					<el-tag type="info">
						分配标准物质给:{{organization.org_name}}
					</el-tag>
				</el-tooltip>

			</div>
			<div style="float: right;">
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
					<el-form-item>
						<el-switch v-model="queryForm.isShowSelect" active-text="仅显示分配的标准物质" inactive-text=""
							@change="switchisShowSelect">
						</el-switch>
					</el-form-item>
					<el-form-item>
						<el-input style="border-radius: 30px;" v-model="queryForm.name" placeholder="按照标准物质名称搜索"
							prefix-icon="el-icon-search" />
					</el-form-item>

					<el-form-item style="margin-right: 0px;">
						<el-button icon="el-icon-search" type="primary" @click="searchchemical_alloc">

						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</vab-query-form>
		<standardTable ref="standardTable" :permission="btnShow" type="Rm_alloc"
			:select_org_id="organization.org_id" style="height: calc(78vh)"></standardTable>
	</div>
</template>

<script>
	import standardTable from '../table/standardTable'

	import {
		GetOrgId,
		GetCurrentOrgId,
		GetPersonRoleMax,
		getOrgNameByselect,
	} from '../commonJs/common.substanceCategory'
	export default {
		name: 'ComprehensiveTable',
		components: {
			standardTable
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
				this.$refs['standardTable'].search(this.queryForm)
			}
		},
	}
</script>
<style type="text/css">
.el-form-item--small.el-form-item{margin-bottom:10px;}  
</style>