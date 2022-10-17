<template>
  <div class="definition purchase contract equipment_btn calc">
    <el-tabs type="border-card" class="box_center" style="height: calc(100vh)-300px">
		   <el-tab-pane label="全部">
         <el-row>
           <el-col :span="6">
             <el-button type="primary" @click="addEntry">添加进场</el-button>
           </el-col>
          <el-col :span="18">
		     <el-form ref="form" :model="search.main" :inline="true" @submit.native.prevent>
		       <el-form-item label="" :label-width="formLabelWidth">
             <el-input style="border-radius: 30px" v-model="search.main.object_id"
             	placeholder="按试验名称搜索" clearable>
             </el-input>
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            <el-button icon="el-icon-search" type="primary" @click="searchMain"></el-button>
          </el-form-item>
          </el-form>
          </el-col>
          <el-col :span="24">
            <entryDataTable style="height: calc(100vh - 211px); min-height: 300px" ref="entryDataTable" :type="0" :primary_key.sync="primary_key" :permission="permission"></entryDataTable>
          </el-col>
        </el-row>
		   </el-tab-pane>
      <el-tab-pane label="验收中">
      </el-tab-pane>
      <el-tab-pane label="验收完成">
      </el-tab-pane>
		 </el-tabs>
  </div>
</template>


<script>
  import entryDataTable from '../table/entryDataTable.vue'
  import entrustAdd from '../components/entrustAdd'
  import { mapGetters	} from 'vuex'
  // import entryDataForm from '../form/entryDataForm.vue'
  export default {
    name: 'entryData',
    components: {
      entryDataTable,
      entrustAdd
      // entryDataForm
    },
    data() {
      return {
        primary_key: -1,
        search: {
          main: {
            object_id: 0,
          },
        },
        permission: {
          person_role: false,
          self: false,
        },
      }
    },
    created() {
      this.init()
    },
    computed: {
      ...mapGetters({ object_id: 'testInfo/object_id'}),
    },
    beforeDestroy() {},
    mounted: function() {},
    methods: {
      async init() {
        let permissionList = ['undefined'];
        let permission = '';
        for (let i = 0; i < permissionList.length; i++) {
          permission = await this.$store.dispatch(
            'permission/GetALLPermissionByModel',
            permissionList[i],
          )
          if (permission) {
            this.permission = Object.assign(this.permission, permission)
          }
        }
        await this.fetchData()
        //await this.getTableData()
      },
      async fetchData() {
        this.$refs['entryDataTable'].fetchData()
      },
      addEntry(row) {
        row.object_id=this.object_id

      	let id = this.$layer.open({
      		type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
      		content: {
      			content: entrustAdd,
      			parent: this,
      			data: {
      				iframeData: this.iframeData,
      				pageType: 70,
      				object_id: row.object_id,
              object_name: row.object_name
      			}
      		},
      		//content: this.$('#entrustAdd'),
      		btn: '确定',
      		area: ['900px', '80%'],
      		title: '添加进场',
      		maxmin: true,
      		shade: false,
      		resize: true,
      		shadeClose: false,
      		cancel: () => { //关闭弹窗事件
      			console.log('关闭iframe')
      		}
      	});
      	console.log('addEntrust', id)
      	window.entrustAdd = this.$parent
      },
    },
  }
</script>
