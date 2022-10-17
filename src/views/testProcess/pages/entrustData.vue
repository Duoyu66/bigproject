<template>
  <div class="definition purchase contract equipment_btn calc">
    <el-tabs type="border-card" class="box_center" style="height: calc(100vh)-300px">
		   <el-tab-pane label="全部">
         <el-row :gutter="10">
           <el-col :span="6">
             <el-button type="primary" @click="addEntrust">添加委托</el-button>
           </el-col>
           <el-col :span="18">
             <el-form ref="form" :model="search.main" :inline="true" @submit.native.prevent>
             <el-form-item label="" >
               <el-input style="border-radius: 30px" v-model="search.main.order_id"
               	placeholder="按委托编号搜索" clearable>
               </el-input>
             </el-form-item>
             <el-form-item label="" >
               <el-input style="border-radius: 30px" v-model="search.main.object_id"
               	placeholder="按试验搜索" clearable>
               </el-input>
             </el-form-item>
             <el-form-item label="" >
               <el-button icon="el-icon-search" type="primary" @click="searchMain"></el-button>

             </el-form-item>
             </el-form>
           </el-col>
          <el-col :span="24">
            <entrustDataTable style="height: calc(50vh - 50px); min-height: 300px" ref="entrustDataTable" :type="0"
            :primary_key_main.sync="primary_key_main" :permission="permission"></entrustDataTable>
          </el-col>
          <el-col :span="24">
          	<el-tabs type="border-card" style="height: calc(50vh)">
          		<el-tab-pane label="试验修改记录">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <entrustEditHistoryTable style="height: calc(50vh - 222px);" ref="entrustEditHistoryTable" :type="1" :primary_key.sync="primary_key"
                    :primary_key_main.sync="primary_key_main" :permission="permission"></entrustEditHistoryTable>
                  </el-col>
                  <el-col :span="12">
                    <entrustEditDetailTable style="height: calc(50vh - 222px);" ref="entrustEditDetailTable" :type="1"
                    :primary_key.sync="primary_key" :primary_key_main.sync="primary_key_main" :permission="permission"></entrustEditDetailTable>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
		   </el-tab-pane>
       <el-tab-pane label="待受理">
       </el-tab-pane>
       <el-tab-pane label="已受理">
       </el-tab-pane>
       <el-tab-pane label="已批准">
       </el-tab-pane>
		 </el-tabs>
  </div>
</template>


<script>
  import entrustDataTable from '../table/entrustDataTable.vue'
  import entrustAdd from '../components/entrustAdd'
  import entrustEditHistoryTable from '../table/entrustEditHistoryTable'
  import entrustEditDetailTable from '../table/entrustEditDetailTable'
  import { mapGetters	} from 'vuex'
  // import entrustDataForm from '../form/entrustDataForm.vue'
  export default {
    name: 'entrustData',
    components: {
      entrustDataTable,
      entrustAdd,
      entrustEditHistoryTable,
      entrustEditDetailTable
      // entrustDataForm
    },
    data() {
      return {
        primary_key: -1,
        primary_key_main: -1,
        search: {
          main: {
          },
        },
        permission: {
          person_role: false,
          self: false,
        },
      }
    },
    computed: {
      ...mapGetters({ object_id: 'testInfo/object_id'}),
    },
    created() {
      this.init()
    },
    beforeDestroy() {},
    mounted: function() {},
    methods: {
      async init() {
        let permissionList = ['entrustData'];
        let permission = '';

        for (let i = 0; i < permissionList.length; i++) {
          permission = await this.$store.dispatch(
            'permission/GetALLPermissionByModel',
            permissionList[i],
          )
          console.log(permission)
          if (permission) {
            this.permission = Object.assign(this.permission, permission)
          }
        }
        await this.fetchData()
        //await this.getTableData()
      },
      searchMain() {

      },
      async fetchData() {
        this.$refs['entrustDataTable'].fetchData()
        this.$refs['entrustEditHistoryTable'].fetchData()
      },
      addEntrust(row) {
        row.object_id=this.object_id

      	let id = this.$layer.open({
      		type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
      		content: {
      			content: entrustAdd,
      			parent: this,
      			data: {
      				iframeData: this.iframeData,
      				pageType: 10,
      				object_id: row.object_id,
              object_name: row.object_name,
              id: id
      			}
      		},
      		//content: this.$('#entrustAdd'),
      		btn: '确定',
      		area: ['900px', '90%'],
      		title: '委托' +"试验",
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
