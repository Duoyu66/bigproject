<template>
  	 <!-- table-container -->
	<div class=" purchase baseBox">
		<vab-query-form>
			<vab-query-form-left-panel style="margin-left:0px">
				<el-tag type="info" v-show="load.status.orgName.isShow">所选机构：{{org_name}}</el-tag>
				<el-button type="primary" @click="handleAdd" v-if="permission.testManage_add" v-show="false">添加根节点
				</el-button>
				<el-button style="margin: 0 10px!important;" type="primary" @click="OrgRelationObjectIdAllAdd">绑定全部</el-button>
				<el-button type="primary" @click="OrgRelationObjectIdAllDelete">删除所有绑定</el-button>
				<!-- 			<el-button type="primary">展开全部</el-button>
				<el-button type="primary">折叠全部</el-button> -->
			</vab-query-form-left-panel>
			<vab-query-form-right-panel>
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
					<!-- 					<el-form-item>
						<el-input style="border-radius: 30px;padding-left:10px" v-model="queryForm.title"
							placeholder="按试验项目名称搜索" prefix-icon="el-icon-search" />
					</el-form-item> -->
				</el-form>
			</vab-query-form-right-panel>
		</vab-query-form>
		<!-- :header-cell-style="{background:'#e8f0ff'}" -->
		<testOjectTable v-if="maintableShow" style="height: calc(30vh)" ref="testOjectTable" :type="21"
			:primary_key.sync="primary_key" :permission="permission">
		</testOjectTable>
		<testitemManage ref="edit"></testitemManage>

	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		dealRespond,
		Notify
	} from '@/utils/respondDeal'
	import testitemManage from '../components/testitemManage'
	import testOjectTable from '../table/testOjectTable'


	import {
		TreeDataDealExGetData,
		TreeDataDealEx,
		TreeDataSecondary
	} from '@/global/tree_deal'
	export default {
		name: 'commonTest',
		components: {
			testitemManage,
			testOjectTable
		},

		provide() {
			return {
				objectReload: this.MainTableRaload,
				reload: this.fetchData,
			}
		},
		watch: {
			current_org_id(newVal, oldVal) {
				//this.getOrgNameByselect()
			}
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				org_pid: 'user/org_pid',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id'
			}),

		},
		data() {
			return {
				maintableShow: false,
				org_name: '',
				primary_key: -1,
				permission: {
					testManage_add: false,
					testManage_edit: false,
					testManage_delete: false,
				},
				formLabelWidth: '120px',
				list: [],
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				queryForm: {
					title: '',
				},
				table: {
					tableHeight: this.$(window).height()
				},
				load: {
					status: {
						orgName: {
							isShow: false
						}
					}

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
		beforeUpdate() {

		},
		beforeDestroy() {},
		mounted: function() {
			this.$nextTick(function() {

			});
		},
		methods: {
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				this.MainTableload();
				const permission = await this.$store.dispatch('permission/GetALLPermissionByModel', 'testitemManage')
				this.permission = Object.assign(this.permission, permission)
				await this.getOrgNameByselect()
			},
			getOrgId() {
				let org_id = ''
				switch (this.role_max) {
					case 'super_admin':
						org_id = this.$store.getters['org/current_org']
						break;
					default:
						org_id = org_pid
						break
				}
				return org_id;
			},
			async getOrgNameByselect() {
				//this.$nextTick(async () => {
				let index = setInterval(async () => {
					let org_name = await this.getOrgName(this.getOrgId());
					this.$set(this, 'org_name', org_name)
					if (org_name.trim()) {
						clearInterval(index);
						this.$set(this.load.status.orgName, 'isShow', true)
					}
				}, 500)
			},
			async getOrgName(value) {
				let orgName = await this.$store.dispatch('org/GetOrgNameByOrgId', value)
				return orgName
			},
			handleAdd() {
				this.formShow(undefined, {
					group_id: '0',

				})
			},
			formShow(row, info) {
				this.$refs['edit'].showEdit(row, info)
			},
			MainTableReload() {
				this.$set(this, 'maintableShow', false)
				this.$nextTick(() => {
					this.MainTableload()
				})
			},
			MainTableload() {
				this.$set(this, 'maintableShow', true)
				this.$nextTick(() => {
					this.$refs['testOjectTable'].search({})
				})
			},
			search() {
				this.$refs['testOjectTable'].search(this.queryForm)
			},
			OrgRelationObjectIdAllDelete() {
				this.OrgRelationObjectIdAll(1)
			},
			OrgRelationObjectIdAllAdd() {
				this.OrgRelationObjectIdAll(0)
			},
			async OrgRelationObjectIdAll(opertion_type) {
				let sqlcode = 415
				let list = [{
					field: 'opertion_type',
					type: 3,
					level: 1,
				}, {
					field: 'org_id',
					type: 3,
					level: 2,
				}]
				let form = {
					org_id: this.getOrgId(),
					opertion_type: opertion_type,
				}
				let info = await dealRespond(sqlcode, list, form)
				Notify(this, info[0], info[1]);
				this.MainTableReload();
			},

		},

	}
</script>
