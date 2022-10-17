<template>
  <div id="container1" class="BaiduMap" style="height: 400px; width: 100%" ref="allmap"></div>
</template>

<script>
  import {
    QueryExec,
    ExecSql
  } from '@/api/table'
  import {
    createAndDownloadFile,
    autoSqlCreate,
    autoPageCreateMain,
    addSqlToDB
  } from '@/utils/autoCreatePage'

  import JSZip from 'jszip'

	export default {
		name: 'detectionRoomdefinition',
		components: {

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
				primary_key: -1,
				btnShow: {
					qualificationCertAdd: false,
				},
				list: [],
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				queryForm: {
					name: '',
				},
				table: {
					tableHeight: this.$(window).height(),
				},

        tabledata: [],
        formLabelWidth: '85px',
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
			height() {
				return this.$baseTableHeight()
			},
		}, //,
		created() {
			// this.init()
		},
		beforeDestroy() {},
		mounted: function() {

		},
		methods: {
			async init(data) {
				let permissionList = ['sealLedger'];
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
				// await this.fetchData()
    //     await this.getTableData()
        let dataOrg = await this.getOrgData(data)
        let dataProject = await this.getProjectData(data)
        this.initmap(dataOrg,dataProject)
			},
      async getOrgData(data) {
        let sData = '[Q]1046{'+data.org_id+'}|^SYS'
        let res = await QueryExec(sData)
        return res.data
        console.log(res)
      },
      async getProjectData(data) {
        let sData = '[Q]1047{'+data.project_id+'}|^SYS'
        let res = await QueryExec(sData)
        return res.data
        console.log(res)
      },
      async getMixOrgData() {
        let sData = '[Q]1030{4}|^SYS'
        let res = await QueryExec(sData)
        return res.data
        console.log(res)
      },
			initmap(dataOrg,dataProject) {
				// var map = new BMapGL.Map('container1');
				// map.centerAndZoom(new BMapGL.Point(116.331398,39.897445), 8);
				// //创建地址解析器实例
				// var myGeo = new BMapGL.Geocoder();
				// 将地址解析结果显示在地图上，并调整地图视野
        var map = new BMapGL.Map("container1");
        map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 11);
        console.log(parseFloat(dataOrg[0].longitude),parseFloat(dataOrg[0].latitude))
        var p1 = new BMapGL.Point(parseFloat(dataOrg[0].longitude),parseFloat(dataOrg[0].latitude));
        var p2 = new BMapGL.Point(parseFloat(dataProject[0].longitude),parseFloat(dataProject[0].latitude));

        var driving = new BMapGL.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
        driving.search(p1, p2);

			},

			tableSortChange() {

			},
      async getTableData() {
        let that = this
        let sData = "[Q]893{}|^SYS"
        let res = await QueryExec(sData)
        console.log(sData,res)
        that.tabledata = res.data
      },
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
				// this.$refs['edit'].showEdit()
			},
			searchTable() {

			},
      weekReportAdd() {
        // this.$refs['onDutyAddForm'].save()
      },
      async fetchData() {
        let that=this
        // console.log(that.search.main)
      	// this.$refs['pageCreateTable'].fetchData()
       //  this.$refs['monthReportCostTable'].fetchData()
        // this.$refs['monthReportTestTable'].fetchData()
      },
		},
	}
</script>

<style>
</style>
