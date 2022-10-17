<template>
  <!-- 资质证书 -->
	<!-- definition -->
  <div id="container" class="BaiduMap" style="height: 400px; width: 100%" ref="allmap"></div>

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
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {

		},
		methods: {
			async init() {
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
				await this.fetchData()
        await this.getTableData()
        // let dataOrg = await this.getOrgData()

        // this.initmap(dataOrg)
			},
      async getOrgData() {
        let sData = '[Q]1044{}|^SYS'
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
			initmap(data) {
				var map = new BMapGL.Map('container');
				map.centerAndZoom(new BMapGL.Point(116.331398,39.897445), 12);
				//创建地址解析器实例
				var myGeo = new BMapGL.Geocoder();
				// 将地址解析结果显示在地图上，并调整地图视野
        for(let i=0;i<data.length;i++)
        {
          myGeo.getPoint(data[i].project_name, async function(point){
            if(point){
              console.log(point)
              let sData = '[Q]1045{'+point.lng+'$`'+point.lat+'$`'+data[i].id+'}|^1|^SYS'
              let res = await ExecSql(sData)
              console.log(data[i].project_name,res)
              // map.centerAndZoom(point, 16);
              // map.addOverlay(new BMapGL.Marker(point, {title: '城建四公司'}))
            }else{
              alert('您选择的地址没有解析到结果！');
            }
          }, '北京市')
        }

			},
      setOrgRelation(dataOrg) {
        var map = new BMapGL.Map('container');
        console.log(dataOrg)
        map.centerAndZoom(new BMapGL.Point(116.331398,39.897445), 12);
        //创建地址解析器实例
        // var myGeo = new BMapGL.Geocoder();
        var myGeo = new BMapGL.Geocoder({extensions_town: true});
        // 根据坐标得到地址描述
        for(let i=0;i<dataMixOrg.length;i++)
        {
          myGeo.getLocation(new BMapGL.Point(dataMixOrg[i].longitude, dataMixOrg[i].latitude), async function(result){
            if (result){
              // console.log(result.addressComponents.district)
              for(let j=0;j<dataOrg.length;j++)
              {
                if(dataOrg[j].org_name===result.addressComponents.district+"建委")
                {
                  // let sData = '[Q]1032{'+dataOrg[j].org_id+'$`'+dataMixOrg[i].org_id+'}|^1|^SYS'
                  // let res = await ExecSql(sData)
                  // console.log(data[i].name,res)
                  console.log(result.addressComponents.district)
                }
              }

            }
          });
        }

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
<style type="text/css">
  .el-form-item--small.el-form-item{margin-bottom:10px;}


</style>
