<template>
    <el-row :gutter="5">

      <el-col :span="18" style="height:100%">
        <iframe src="/luckysheet.html" frameborder="0" width="98%" height="100%" id="myframe" ref="myframe"
        	@load="loaded"></iframe>
      </el-col>

      <el-col :span="6">
        <el-col :span="24" style="margin: 9px;">
          <el-button type="primary" size="medium" @click="handleOldValue">
          	显示旧值
          </el-button>
          <el-button type="primary" size="medium" @click="handleNewValue">
          	显示新值
          </el-button>
        </el-col>
        <el-col :span="24">
          <el-table ref="approvalTable" v-loading="listLoading"
          	:data="tablelist" border
          	:element-loading-text="elementLoadingText" highlight-current-row
          	height="600px" :header-cell-style="{ background: '#e8f0ff' }" size="mini">
          	<el-table-column show-overflow-tooltip prop="meta_id" label="指标名称">
          	</el-table-column>
            <el-table-column show-overflow-tooltip prop="old_value" label="旧值">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="new_value" label="新值">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="24">
          <el-button type="primary" size="medium" @click="">
          	通过
          </el-button>
          <el-button type="primary" size="medium" @click="">
          	拒绝
          </el-button>
        </el-col>

      </el-col>

    </el-row>
</template>

<script>

  //导入库export.js 这个文件是es6的，不能在普通的HTML文件直接引入js文件（虽然都是js文件，但是有区别，具体请百度es6与es5）！需要把es6转es5才可以直接引入使用！

  import {
    QueryExec,
    ExecSql
  } from '@/api/table'
  import {
  	mapGetters
  } from 'vuex'
  export default {
    name: 'excelEdit',
    props: {
    	//.sync同步
    	isUpData: {
    		type: Boolean,
    		default: false
    		//required: true,
    	},
    	pageType: {
    		type: Number,
    		default: 0,
    	},
    	object_id: {
    		type: String,
    		default: '0',
    	},
      object_name: {
      	type: String,
      	default: '',
      },
    	entrustInfo: {
    		type: Object,
    		default: function() {
    			return {}
    		}
    	}
    },
    data() {
      return {
        form: {
          title: '',
          textarea2: '',
        },
        selected: "",
        title: '',
        listLoading: false,
        tablelist: [],
        elementLoadingText: '加载数据中....',

        value: '',
        value1: '',
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
    },
    mounted() {
      // In some cases, you need to use $nextTick

    },
    created() {
      this.fetchData()
    },
    methods: {

      close() {
        this.dialogFormVisible = false
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      async fetchData() {
        let that = this
        let sData = '[Q]1060{'+that.entrustInfo.entrust_id+'}|^SYS'
        const res = await QueryExec(sData)
        that.tablelist = res.data
        that.loaded()
      },
      handleNewValue() {
        let that = this
        var iframe_home = document.querySelector('#myframe')
        iframe_home.contentWindow.handleNewValue()
      },
      handleOldValue() {
        let that = this
        var iframe_home = document.querySelector('#myframe')
        iframe_home.contentWindow.handleOldValue()

      },
      loaded() {
      	let that = this
      	let index = setInterval(function() {
      		if (that.$refs.myframe) {
            console.log(that.$refs.myframe)
      			clearInterval(index)
      			// 只有在 iframe 加载时传递数据给子组件，$refs 才是非空的
      			that.$refs.myframe.contentWindow.postMessage({
      				org_pid: that.org_pid,
      				person_id: that.person_id,
      				pageType: that.pageType,
      				data: that.data,
      				object_id: that.object_id,
      				entrustInfo: that.entrustInfo,
              current_org_id: that.current_org_id,
              object_name: that.object_name,
              entrustTablelist: that.tablelist
      			}, '*');
      		}
      	})

      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .el-row {
    width: 100%;
  }
</style>
