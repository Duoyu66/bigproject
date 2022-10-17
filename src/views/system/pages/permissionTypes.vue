<template>
  <!-- 系统管理-权限类型定义 -->
	<div class="table-container definition" style="overflow: auto;">
    <div class="baseBox" style="height:calc(100vh - 120px);margin-right: 10px;">
      <vab-query-form  style="margin-bottom:10px;">
        <vab-query-form-left-panel style="width:50%;">
          <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
            添加
          </el-button>
          <el-button v-show="false" icon="el-icon-upload2" type="primary" @click="upload2">
            上传
          </el-button>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel style="width:50%;">
          <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
            <el-form-item style="margin-right: 10px!important;">
              <el-input v-model="queryForm.name" placeholder="类型名称" />
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery">
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <!--        表格列表-->
      <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"
        :height="table.tableHeight" highlight-current-row @selection-change="setSelectRows"
        @sort-change="tableSortChange" @row-click="rowClick">
        <!--			<el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>-->
        <el-table-column show-overflow-tooltip label="权限类型ID" prop="type_id" width="100" align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="权限类型名称" prop="name" width="120" align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="权限类型描述" prop="desc" header-align="center"></el-table-column>
        <el-table-column show-overflow-tooltip label="操作" width="280px" align="center" fixed="right" style="background:#e8f0ff ;">
          <template #default="{ row }">
            <el-button type="text" class="normal" @click="handleEdit(row)" v-if="row.edit=='1'">
              编辑
            </el-button>
            <el-button disabled type="text" class="normal" v-else>
              编辑
            </el-button>
            <el-button type="text" class="danger" @click="handleDelete(row)" v-if="row.edit=='1'">
              删除
            </el-button>
            <el-button disabled type="danger" class="normal" v-else>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
        :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
        @size-change="handleSizeChange"></el-pagination>
      <table-edit ref="edit"></table-edit>
      <updateEdit ref="update"></updateEdit>
    </div>
	</div>
</template>

<script>
	import TableEdit from './../components/defaultEdit'
	import updateEdit from './../components/update_test'


	export default {
		name: 'ComprehensiveTable',
		components: {
			TableEdit,
			updateEdit,
			// eslint-disable-next-line vue/no-unused-components
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
		//设置provider
		provide() {
			return {
				reload: this.reload,
			}
		},
		data() {
			return {
				imgShow: true,
				list: [],
				imageList: [],
				listLoading: true,
				layout: 'sizes, prev, pager, next, jumper, ->, total, slot',
				total: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					name: '',
				},
				table: {
					tableHeight: this.$(window).height() - 260,
				},
			}
		},
		computed: {},
		created() {
			this.fetchData()
		},
		beforeDestroy() {},
		mounted: function() {
			// this.$nextTick(function() {
			// 	let exceptHeight = 210
			// 	// this.$refs.table.$el.offsetTop：表格距离浏览器的高度
			// 	//tableSort为table中ref的值
			// 	if (this.$refs.tableSort.$el) {
			// 		this.table.tableHeight =
			// 			window.innerHeight -
			// 			this.$refs.tableSort.$el.offsetTop -
			// 			exceptHeight
			// 	}
			// 	// 监听窗口大小变化
			// 	let that = this
			// 	window.onresize = function() {
			// 		if (that.$refs.tableSort.$el) {
			// 			that.table.tableHeight =
			// 				window.innerHeight -
			// 				that.$refs.tableSort.$el.offsetTop -
			// 				exceptHeight
			// 		}
			// 	}
			// })
		},
		methods: {
			upload2() {
				this.$refs['update'].showEditEx()
			},
			tableSortChange() {
				// const imageList = []
				// this.$refs.tableSort.tableData.forEach((item, index) => {
				//   imageList.push(item.img)
				// })
				// this.imageList = imageList
			},

			setSelectRows(val) {
				this.selectRows = val
			},
			//行点击事件
			rowClick(row) {
				console.log(row)
			},
			handleAdd() {
				this.$refs['edit'].showEdit()
			},
			handleEdit(row) {
				this.$refs['edit'].showEdit(row)
			},
			handleDelete(row) {
				let that = this
				that.delete_from_fob(that, row, 6, {
					"selectRows": "selectRows", //复选框选中数据
					"fetchData": "fetchData", //加载数据
					"main_key": "type_id" //主键
				});
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData()
			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchData()
			},
			handleQuery() {
				this.queryForm.pageNo = 1
				this.fetchData()
			},
			async fetchData() {
				let that = this
				//根据sql自行编写
				//SELECT COUNT(*) OVER(PARTITION BY'') AS Total,type_id,name,[desc] FROM PermissionType
				//where 1=1 ~ and name like $p1~  ORDER BY type_id OFFSET $pp2 ROWS FETCH NEXT $pp3 ROWS ONLY
				let select_list = [{
						field: 'name',
						type: 2,
						level: 1,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 2,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 3,
					},
				]
				//[Q]2{$`0$`19}|^SYS
				that.search_fob(select_list, that, 2, {
					'loading': 'listLoading', //加载画面
					'data': 'list', //数据存放位置
					'total': 'total', //数据数量，根据该数量分页
					'queryForm': 'queryForm' //查询数据表单，请将分页条件也放置在其中
				});

			},
			reload() {
				this.fetchData()
			},
		},
	}
</script>
<style>
.baseBox{
background:#fff;
border-radius:5px;
border: 1px solid #dbe0e6;
box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
padding: 10px;
box-sizing: border-box;
}
.el-table th.el-table__cell{background: #e8f0ff !important;}
</style>
