<template>
	<div class=" definition purchase equipment_btn calc">
		<vab-query-form >
			<sampleReatinSearchForm ref="sampleReatinSearchForm" v-model="searchData" :search_fob="search_main_fob"
				:permission="permission" :accepted="accepted" :stage="stage">
			</sampleReatinSearchForm>
		</vab-query-form>
		<el-main class="box1" style="height: calc(74vh); min-height: 300px">
			<!-- :style="accepted && accepted > 0?'height: calc(35vh); min-height: 100px':'height: calc(100vh - 300px); min-height: 100px'" -->
			<sampleRetainTable ref="sampleRetainTable" :type="1" style="height:calc(100vh - 300px); min-height: 100px"
				:select-form.sync="searchData" :primary_key.sync="primary_key" :permission="permission"
				:accepted="accepted" :stage="stage">
			</sampleRetainTable>

			</el-container>
		</el-main>
	</div>
</template>

<script>
	import sampleRetainTable from '../table/sampleRetainTable'

	import sampleReatinSearchForm from '../searchForm/sampleReatinSearchForm'


	//dispatchRegisterHistoryTable
	export default {
		name: 'sampleRetainPage',
		components: {
			sampleRetainTable,

			sampleReatinSearchForm,
		},
		provide() {
			return {
				reload: this.reload,
			}
		},
		props: {
			accepted: {
				type: String,
				default: ''
			},
			stage: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				searchData: undefined,
				primary_key: -1,
				permission: {
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
				await this.fetchData()
			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			reload() {},
			handlExport() {},
			async fetchData() {
				this.$refs['sampleRetainTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['sampleRetainTable'].search(data)
			},
		},
	}
</script>

<style>
.app-main-container .app-main-height{
height:calc(100vh - 300px) ;
  }
/* .definition{
background:#fff;
border-radius:5px;
border: 1px solid #dbe0e6;
box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
padding: 10px;
box-sizing: border-box;
} */
.el-form-item--small.el-form-item{margin-bottom:10px;}
.vab-query-form{margin-bottom:0px!important;}
</style>
