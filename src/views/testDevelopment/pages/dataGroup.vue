<template>
  <!-- 数据分组、试验分组  去掉table-container -->
	<div class="table-container definition2 purchase equipment equipment_btn parameterdictionary">
	  <div class="baseBox" style="margin-bottom: 10px;">
				<vab-query-form style="margin-bottom: 10px;">
					<vab-query-form-left-panel style="width: 20%;">
						<el-button type="primary" @click="handleAdd">添加数据分组</el-button>
					</vab-query-form-left-panel>
					<vab-query-form-right-panel style="width: 80%">
						<el-form ref="form" :model="search" :inline="true" @submit.native.prevent>
							<el-form-item>
								<el-input style="border-radius: 30px" v-model="search.item_name" placeholder="按字典名称搜索"
									prefix-icon="el-icon-search" />
							</el-form-item>
              <el-form-item style="padding-left: 10px;">
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  native-type="submit"
                  @click="handleQuery"
                >
                  查询
                </el-button>
              </el-form-item>
						</el-form>
            
					</vab-query-form-right-panel>
				</vab-query-form>
				<el-table ref="tableSort" :data="list" border :element-loading-text="elementLoadingText"
					:height="height" row-key="item_id" highlight-current-row
					:tree-props="{ children: 'children', hasChildren: 'hasChildren' }" lazy
					tooltip-effect="dark" :load="fetchDataEx" >
					<el-table-column show-overflow-tooltip prop="item_name" label="试验名称" min-width="200px">
					</el-table-column>
					<el-table-column show-overflow-tooltip label="试验标识" prop="item_id">
					</el-table-column>
					<el-table-column show-overflow-tooltip label="平行率" prop="group_id" width="70px"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="180px">
          	<template #default="{ row }">
          		<el-button type="primary" class="normal" @click="handleEdit(row)">
          			修改
          		</el-button>
          		<el-button @click="handleDelete(row)" class="danger">删除</el-button>
          	</template>
          </el-table-column>
				</el-table>
				<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
					:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
					@size-change="handleSizeChange"></el-pagination>


		<dataGroup ref="dataGroup" @fetchData="fetchDataEx"></dataGroup>
		<!-- <table-edit1 ref="edit1"></table-edit1> -->
	</div>
  </div>
</template>

<script>
	import {
		doEdit,
		ExecSql,
		QueryExec
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
	import dataGroup from '../components/dataGroup.vue'
	// import TableEdit1 from '../components/dataDictionary1.vue'
	import treeData from './../../vab/tree/index'
	export default {
		name: 'ComprehensiveTable',
		components: {
			dataGroup,
			// TableEdit1,
			treeData,
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
				imgShow: true,
				list: [],
				listchild: [],
				imageList: [],
				listLoading: true,
				listChildLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				layoutChild: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				totalChild: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				search: {
					item_name: ''
				},
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					title: '',
				},
				queryFormChild: {
					pageNo: 1,
					pageSize: 20,
					title: '',
				},
				dialogFormVisible: false,
				item_class: '',
				table: {
					tableHeight: this.$baseTableHeight()
				}
			}
		},
		computed: {
			height() {
				// return this.$baseTableHeight() + 100
        return this.$baseTableHeight() + 140
			},
		},
		created() {
			this.fetchDataEx()
		},
		beforeDestroy() {},
		mounted: function() {
			this.$nextTick(function() {
				let exceptHeight = 210;
				// this.$refs.table.$el.offsetTop：表格距离浏览器的高度
				//tableSort为table中ref的值
				if (this.$refs.tableSort.$el) {
					this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop -
						exceptHeight;
				}

				// 监听窗口大小变化
				let that = this;
				window.onresize = function() {
					if (that.$refs.tableSort.$el) {
						that.table.tableHeight = window.innerHeight - that.$refs.tableSort.$el.offsetTop -
							exceptHeight;
					}
				}
			});
		},
		methods: {
			tableSortChange() {
				const imageList = []
				this.$refs.tableSort.tableData.forEach((item, index) => {
					imageList.push(item.img)
				})
				this.imageList = imageList
			},
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
				this.$refs['dataGroup'].showEdit()
			},
			handleEdit(row) {
				this.$refs['dataGroup'].showEdit(row)
			},
			handleDelete(row) {
        console.log(row)
        let that = this
				if (row.item_id) {
					this.$baseConfirm('你确定要删除分组吗？', null, async () => {
						let sData = "[Q]685{"+row.item_id+"}|^1|^SYS"
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0) {
              this.fetchDataEx()
              that.$baseMessage('删除成功', 'success')
            }
            else {
              this.fetchDataEx()
              that.$baseMessage('删除失败', 'error')
            }
					})
				}
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData()
			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchData()
			},

			handleSizeChildChange(val) {
				this.queryForm.pageSize = val
				this.fetchData()
			},
			handleCurrentChildChange(val) {
				this.queryForm.pageNo = val
				this.fetchData()
			},

			handleQuery() {
				this.queryForm.pageNo = 1
				this.fetchData()
			},
			async fetchData(row) {
				this.listLoading = true
				this.listChildLoading = true
				try {
					let sData;
					sData = '[Q]279{0' + '$`' + ((Number(this.queryForm.pageNo) - 1) * Number(this.queryForm.pageSize))
						.toString() + '$`' + this.queryForm.pageSize + '}|^SYS'
					const res = await QueryExec(sData)
					console.log(res)
					this.list = res.data
					this.total = res.count
					this.listchild = []
					setTimeout(() => {
						this.listLoading = false
					}, 500)
					setTimeout(() => {
						this.listChildLoading = false
					}, 500)
				} catch (e) {
					console.log(e)
				}
			},
      async fetchDataEx(row, treeNode, resolve) {
      	//console.log(row, treeNode, resolve)
      	this.listLoading = true
      	this.listChildLoading = true
      	try {
      		let sData;
      		let form = Object.assign({}, this.queryForm)
      		if(row)
      		{
      		  form.parent_id = row.item_id
      		}
      		else {
      		  form.parent_id = '0'
      		}
      		sData = '[Q]684{' + form.parent_id + '$`%' + this.search.item_name + '%}|^SYS'
          console.log(sData)
      		// console.log(row)
      		if (row) {
      			const res = await QueryExec(sData)
      			const data = res.data
      			// console.log(res)
      			for (let i = 0; i < data.length; i++) {
      				if (Number(data[i].hasChildren) > 0) {
      					data[i].children = true
      				} else {
      					data[i].children = false
      				}
      			}
      			if (resolve) {
      				console.log('resolve',data)
      				resolve(data)
      			} else if (this.resolve && this.resolve[form.parent_id]) {
      				console.log('this.resolve')
      				this.$set(this.$refs.tableSort.store.states.lazyTreeNodeMap, form.parent_id, []);
      				this.resolve[form.parent_id](data)
      			} else if (form.parent_id == 0) {
      				this.list = data
      				//this.tableDataTemp = JSON.parse(JSON.stringify(data))
      				return
      			}

      		} else {

      			const res = await QueryExec(sData)

      			const data = TreeDataDealEx(res.data, 0, 'item_id', 'parent_id', 'hasChildren')
      			// console.log(data)
      			this.list = data
            this.totalparam = res.total
      		}
      	} catch (e) {
      		console.log(e)
      	}
      	setTimeout(() => {
      		this.listLoading = false
      	}, 500)
      	setTimeout(() => {
      		this.listChildLoading = false
      	}, 500)
      },
		},
	}
</script>
<style>
.baseBox{background:#fff;border-radius:5px;border: 1px solid #dbe0e6;padding: 10px;box-sizing: border-box;
box-shadow: 0 1px 4px rgb(0 21 41 / 8%);}
</style>
