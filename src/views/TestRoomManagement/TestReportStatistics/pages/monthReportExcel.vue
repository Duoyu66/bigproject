<template>
  <!-- 参数模板 -->
	<div class="table-container definition2  purchase equipment equipment_btn parameterdictionary" style="overflow: auto;">

    <el-row :gutter="10" style="margin:0!important;height: calc(100vh - 180px);">

      <el-col :span="24" style="padding:0 0 0 0px!important;">
        <div class="baseBox">
          <el-row>
            <el-col :span="24">
              <el-form ref="form" :model="search" :inline="true" @submit.native.prevent>
                <el-form-item label="" >
                  <el-date-picker
                    v-model="search.daterange"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="" >
                  <el-input style="border-radius: 30px" v-model="search.org_id"
                    placeholder="按试验搜索" clearable>
                  </el-input>
                </el-form-item>
                <el-form-item label="" >
                  <el-button type="primary" @click="createReportData">生成报告</el-button>

                </el-form-item>
                <el-form-item label="" >
                  <el-button type="primary" @click="createReportData">导出报告</el-button>
                
                </el-form-item>
                <el-form-item label="" >
                  <el-button type="primary" @click="createReportData">打印报告</el-button>
                
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="24">
              <h1 class="excelTitle"><i></i>月报表格

              </h1>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <iframe src="/TestDataPrint.html" frameborder="0" width="100%" style="margin:0px;padding:0px;height: 100%;border:1px solid #CCCCCC"
                :style="'height:'+GetiframeHeight+' !important'" id="myframe" ref="myframe" @load="loaded"></iframe>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

	</div>
</template>

<script>
	import {
		doEdit,
		ExecSql,
		QueryExec,
    QueryExecBySql
	} from '@/api/table'
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		ViewfileUrl,
		UploadFileNameUrl
	} from '@/utils/servicefile'
	import {
		TreeDataDeal,
		TreeDataDealEx
	} from '@/global/tree_deal'
  import {
  	cellConvert,
  	cellCount,
  	cellConvertToOffice
  } from '@/utils/cellconvert'
  import {
  	ExecMapVersion
  } from '@/utils/dataCache'
  import {
  	ZlibHelper
  } from '@/global/zlibHelper'

	export default {
		name: 'ComprehensiveTable',
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
    provide() {
    	return {

    	}
    },
		data() {
			return {
				imgShow: true,
				list: [],
				total: 0,
				totalparam: 0,
				totalFile: 0,
				background: true,
        iframeheight: '100',
				selectRows: '',
				search: {
					daterange: '',
					org_id: '',
				},
        reportInfo: [],
        templateold: false,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
			}
		},
		computed: {
      ...mapGetters({
      	org_pid: 'user/org_pid',
      	org_id: 'user/org_id',
      	current_org_id: 'org/current_org',
      	current_and_chrilren_org: 'org/current_and_chrilren_org',
      	person_id: 'user/person_id',
      }),
      GetiframeHeight() {
      	let height = this.iframeheight - 105;
        console.log(height)
      	//let height = this.$el.offsetHeight - 75
      	return height + 'px'
      }
		},
		created() {

		},
		beforeDestroy() {},
		mounted: function() {
      this.fetchData()
		},
		methods: {
			async fetchData() {

        this.iframeHeight()
			},
      async createReportData() {
        console.log(this.search.daterange)
        let sData = '[Q]231{'+this.current_org_id+'}|^SYS'

        let sSql = "SELECT * FROM lb_test_data WHERE org_id='"+this.current_org_id+"'"
        sSql = await ZlibHelper.String2EncrbytesBase64_fob(sSql)
        console.log(sSql);
        let res = await QueryExecBySql(sSql,'')
        console.log(res);
        var iframe_home = document.querySelector('#myframe')
        iframe_home.contentWindow.createReport(res.data)
      },
      iframeHeight() {
      	let that = this
      	let index = setInterval(() => {
      		if (that.$el) {
      			clearInterval(index)
      			let height = that.$el.offsetHeight
      			that.$set(that, 'iframeheight', height)
      		}
      	})

      },
      loaded() {
      	let that = this
      	let index = setInterval(function() {
          console.log(that.reportInfo)
      		if (that.$refs.myframe) {
      			clearInterval(index)

      			// 只有在 iframe 加载时传递数据给子组件，$refs 才是非空的
      			that.$refs.myframe.contentWindow.postMessage({
      				org_pid: that.org_pid,
      				person_id: that.person_id,
      				reportInfo: that.reportInfo
      			}, '*');
      		}
      	},100)
      },
    },
	}
</script>
<style>
.baseBox{background:#fff;border-radius:5px;border: 1px solid #dbe0e6;padding: 10px!important;box-sizing: border-box;
box-shadow: 0 1px 4px rgb(0 21 41 / 8%);}
</style>
