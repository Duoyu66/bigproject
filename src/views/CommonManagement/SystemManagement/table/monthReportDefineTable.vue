<template>
  <!-- 参数化学品消耗定义左侧表格相关class ="parameterLtableHigh"-->
	<div>
		<el-table ref="tableSort" v-loading="listLoading" :data="tableData" border
			:element-loading-text="elementLoadingText" :height="height" highlight-current-row
			lazy :load="fetchData" :header-cell-style="{ background: '#e8f0ff' }" :header-cell-class-name="cellClass"
			@selection-change="handleSelectionChange" @select="handleSelectionChange" @row-click="rowClick"
			class="parameterLtableHigh">
      <el-table-column type="selection" label="是否导出" width="120px" align="center">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="字段名称或编号" prop="item_name"
        min-width="200px" align="center">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="custom" label="导出表格的列名" align="left"
        min-width="200px">
      </el-table-column>
		</el-table>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
  import {
  	ExecSql,
  	QueryExec
  } from '@/api/table'
	import {
		hasPermission
	} from '@/utils/permission'

	import {
		TreeDataDealExGetData,
		TreeDataDealEx,
		TreeDataSecondary
	} from '@/global/tree_deal'
	import {
		pageDeal
	} from '@/global/form.helper'

	export default {
		name: 'parameterTable',
		components: {
		},
		provide() {
			return {
				paramReload: this.fetchData,
				reload: this.fetchData,
			}
		},
		props: {
			type: {
				type: Number,
				default: 0,
			},
			//选中行主键
			primary_key: {
				type: Number,
				default: -1,
			},
			//选中行事件
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				org_pid: 'user/org_pid',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id'
			}),
		},
		/* 监听table数据对象 */
		watch: {

			tableData(val) {
				this.doLayout();
			},
			selectForm(newVal, oldVal) {
				if (newVal) {
					this.onrenewalForm = Object.assign(this.onrenewalForm, newVal)
				}
			},
			onrenewalForm(newVal, oldVal) {
				if (newVal) {
					//this.$emit('update:pageForm', Object.assign(this.pageForm, newVal));
				}
			},
			selectedRow(newVal, oldVal) {
				if (newVal && newVal.param_id) {
					switch (this.type) {
						case 0:
						case 30:
							this.$emit('update:primary_key', Number(newVal.param_id))
							break
					}

				}

			},
			primary_key(newVal, oldVal) {
				if (newVal) {
					switch (this.type) {
						case 10:
						case 20:
						case 11:
            case 21:
							this.fetchData()
							break;
					}
				}
			},
			screenWidth(newVal, oldVal) {
				// 为了避免频繁触发resize函数导致页面卡顿，使用定时器
				if (!this.timer) {
					// 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
					let that = this
					that.timer = true
					setTimeout(function() {
						// 打印screenWidth变化的值
						that.scrollAbout()
						that.timer = false
					}, 500)
				}
			},
			select_org_id(newVal, oldVal) {
				console.log('select_org_id', newVal)
				if (newVal) {
					switch (this.type) {
						case 10:
						case 20:
						case 11:

							this.fetchData()
							break;
						default:
							if (this.type != 0) {
								this.fetchData()
							}
							break
					}
				}
			},
		},
		data() {
			return {
				selectedRow: {},
				checkedSelection: [],
				screenWidth: document.body.clientWidth,
				height: 'calc(80%)',
				tableData: [],
				tableDataCurrent: [],
				selectionRows: [],
				listLoading: false,
				elementLoadingText: '正在加载。。',
				background: true,
				layout: '',
				total: 0,
        field_class: '1',
        label: '',
				main_dialog: false,
				children_dialog: false,
				onrenewalForm: {
					pageNo: 1,
					pageSize: 10
				},
				columnHideList: [],
				emptyConfig: {
					description: '无数据,请刷新重试'
				},

				load: {
					status: {
						allComplete: false
					},
					pagination: {
						isDestory: false
					}
				},
			}
		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {
			const that = this
			window.onresize = () => {
				return (() => {
					window.screenWidth = document.body.clientWidth
					that.screenWidth = window.screenWidth
				})()
			}
		},
		methods: {
			rowClick(row) {

			},
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				let height = ''
				switch (this.type) {
					case 10: //参数主表
            this.columnHideList = ['selection'];
            this.height = 'calc(90%)'
            this.layout = 'total, sizes, prev, pager, next, jumper'
            this.field_class = '1'
            this.fetchData()
            break
          case 20: //参数映射
						this.columnHideList = ['selection'];
						this.height = 'calc(90%)'
						this.layout = 'total, sizes, prev, pager, next, jumper'
            this.field_class = '2'
						this.fetchData1()
						break
				}
				if (this.tableHeight) {
					this.height = this.tableHeight
				}
				this.scrollAbout()
			},
      doLayout() {

      },
			scrollAbout() {
				try {
					switch (this.type) {
						case 10: //试验 参数子表
						case 20: //参数映射
							this.$nextTick(() => {
								let scrollWidth = this.$el.scrollWidth;
								let offsetWidth = this.$el.offsetWidth;
								if (offsetWidth >= scrollWidth) {
									this.$set(this, 'layout', 'total, sizes, prev,pager, next, jumper')
									this.reloadAssembly('pagination', 'isDestory');
									return;
								}
								this.$set(this, 'layout', 'total, sizes, prev, next, jumper')
								this.reloadAssembly('pagination', 'isDestory');
							})
							break
					}


				} catch (e) {
					console.log(e)
				}
			},
      async handleSelectionChange(val, row) {
        let count=0;
        let data = this.tableDataCurrent
        for(let i=0;i<data.length;i++)
        {
          if(data[i].item_id===row.item_id) {
            count++
            await this.DeleteData(row.id)
            break
          }
        }
        if(count===data.length) {
          await this.InsertData(row)
        }
      	console.log(val,row)
        this.tableDataCurrent=val
      },
      async DeleteData(id)
      {
        let sData = '[Q]1066{'+id+'}|^1|^SYS';
        const res = await ExecSql(sData);
        if(res>0) {
          this.$notify({
          	title: '删除成功',
          	message: '删除'+row.item_name,
          	type: 'success'
          });
        }
        else {
          this.$notify({
          	title: '删除失败',
          	message: '删除'+row.item_name,
          	type: 'error'
          });
        }
      },
      async InsertData(row)
      {
        let sData = '[Q]1067{'+this.current_org_id+'$`'+row.item_name+'$`'+row.custom+'$`'+this.field_class+'}|^2|^SYS';
        const res = await ExecSql(sData);
        if(res>0) {
          this.$notify({
          	title: '添加成功',
          	message: '添加'+row.item_name,
          	type: 'success'
          });
        }
        else {
          this.$notify({
          	title: '添加失败',
          	message: '添加'+row.item_name,
          	type: 'error'
          });
        }
      },
			reloadAssembly(assemblyName, key) {
				try {
					this.$nextTick(() => {
						this.$set(this.load[assemblyName], 'key', !this.load[assemblyName][key])

						this.$nextTick(() => {
							this.$set(this.load[assemblyName], 'key', !this.load[assemblyName][key])
						})
					})
				} catch (e) {
					console.log(e)
				}
			},
      cellClass(row){
        if (row.columnIndex === 0) {
          return 'addAllChecked'
        }
      },

			hideColFob(col_name) {
				try {
					let that = this
					if (!col_name) {
						return true
					}
					if (that.columnHideList.indexOf(col_name) < 0) {
						return true
					}
					return false
				} catch (e) {
					console.log(e)
					return false
				}
			},
			ishasPermission(name) {
				try {
					return true
				} catch (e) {
					console.log(e)
				}
			},
			search(data) {
				if (data) {
					this.onrenewalForm = Object.assign(data, this.onrenewalForm)
				}

				this.onrenewalForm.pageNo = 1
				this.fetchData()
			},
			handleCurrentChange(val) {
				this.onrenewalForm.pageNo = val
				this.fetchData()
			},
			handleSizeChange(val) {
				this.onrenewalForm.pageSize = val
				this.fetchData()
			},


			async fetchData(row, treeNode, resolve) {
        let that = this
        that.listLoading = true
        let sDataGroup = '[Q]71{1014}|^SYS'
        const resGroup = await QueryExec(sDataGroup)

        let sData = '[Q]1065{'+that.current_org_id+'$`1}|^SYS'
        const res = await QueryExec(sData)

        resGroup.data.forEach((item,index)=>{
          
        })
        console.log(sDataGroup,resGroup)
        that.tableData = resGroup.data
        setTimeout(() => {
        	this.listLoading = false
        }, 10)
			},
      async fetchData1(row, treeNode, resolve) {
        let that = this

      },

		},
	}
</script>

<style>
  .el-table .addAllChecked .cell .el-checkbox__inner{
      /* display: none !important;  */
      margin-left: -90px;
  }
  .el-table .addAllChecked .cell::before{
      content: '全选';
      text-align: center;
      margin-left: 20px;
  }
</style>
