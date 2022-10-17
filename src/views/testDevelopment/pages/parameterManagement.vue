<template>
  <!-- 试验配置-参数管理 -->
	<div class="table-container purchase equipment_btn">
    <div class="baseBox" style="margin-bottom: 10px;">
      <vab-query-form>
        <vab-query-form-left-panel style="width: 20%">
          <el-button type="primary" @click="handleAddd">添加根节点参数</el-button>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel style="width: 80%">
          <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
            <el-form-item style="padding-right: 10px;">
              <el-input   v-model="queryForm.class_name" placeholder="按参数分类搜索" clearable/>
            </el-form-item>
            <el-form-item style="padding-right: 10px;">
              <el-input  v-model="queryForm.param" placeholder="按参数名称搜索"
                clearable />
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" native-type="submit" @click="search_main_fob">
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>

      <el-container>
        <el-main style="height: calc(80vh); min-height: 275px;" class="box1">
          <!-- parameterTable -->
          <parameterTable ref="parameterTable" style="height: calc(100%);min-height: 300px"
            :selectForm.sync="queryForm" :primary_key.sync="primary_key" :permission="permission">
          </parameterTable>
          <!-- 				<el-dialog title="删除参数" :visible.sync="dialogFormVisible">
            <div style="font-size: 22px">
              您的删除将删除本条参数及相关的所有数据包括(参数名称、参数版本、龄期、启用时间）
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogFormVisible = false">
                确 定
              </el-button>
              <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
          </el-dialog> -->
          <!-- <table-edit1 ref="edit1"></table-edit1> -->
        </el-main>

      </el-container>
    </div>
    <!-- 第二个表格 -->
    <el-footer  class="table_auto">



    	<table-edit ref="edit"></table-edit>

    </el-footer>
	</div>
</template>

<script>
	import {
		getList,
		doDelete
	} from '@/api/table'
	// import TableEdit1 from '../components/parameterManagement1.vue'

	import parameterTable from '../table/parameterTable'
	import standardTable from '../table/standardTable'
	import paramDeviceTable from '../table/paramDeviceTable'
	import paramChemicalTable from '../table/paramChemicalTable'
	import paramRmTable from '../table/paramRmTable'
	import templateTable from '../table/templateTable'

	import TableEdit from '../components/parameterManagement'

	export default {
		name: 'ComprehensiveTable',
		components: {
			parameterTable,
			standardTable,
			paramDeviceTable,
			paramChemicalTable,
			paramRmTable,
			templateTable,
			TableEdit,
			// TableEdit1,

		},
		provide() {
			return {
				paramReload: this.reload_min,
				reload: this.reload_min,
			}
		},

		data() {
			return {
				// 使用中
				queryForm: {
					// pageNo: 1,
					// pageSize: 20,
					param: '',
					class_name: '',
				},
				primary_key: 0,
				permission: {},
				ifShow: {
					paramDeviceTable: false,
					paramChemicalTable: false,
					paramRmTable: false,
					standardTable: false,
					templateTable: false
				},
				activeName: 'paramDeviceTable',
				table: {
					tableHeight: this.$(window).height()
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
		beforeDestroy() {},
		mounted: function() {
			this.$nextTick(function() {

			});
		},
		methods: {
			init() {
				this.tabShow({
					name: this.activeName
				})
			},
			search_main_fob() {
				this.$refs['parameterTable'].search(this.queryForm)
			},
			reload_min(row) {
				this.$refs['parameterTable'].fetchData(row)
			},
			handleAddd() {
				this.$refs['edit'].showEdit()
			},
			tabShowSwitch(tabName) {
				if (this.ifShow[tabName]) {
					return
				}
				this.$nextTick(() => {
					this.ifShow[tabName] = true;
				});
			},
			tabShow(tab, event) {
				// 切换tab栏时,在进行一次子组件刷新
				// console.log(tab, event);
				for (let key in this.ifShow) {
					this.ifShow[key] = false
				}
				//el-tabs栏数据缓存问题(数据过多渲染时长不够问题)
				// 点击后在进行初始化
				this.tabShowSwitch(tab.name);
			},
			handleClick(VueComponent, MouseEvent) {
				//console.log(tab, event);
				this.activeName = VueComponent.name
				this.tabShow(VueComponent, MouseEvent);
			},
		},
	}
</script>
<style lang="scss" scoped>
  // 第二个表格高度设置  全高-第一个表格高度529px -底部边距10px-底部滚动条10px
.table_auto{box-sizing: border-box;
  height: calc( #{$base-app-main-height} - 529px - 20px)!important;
}

</style>
