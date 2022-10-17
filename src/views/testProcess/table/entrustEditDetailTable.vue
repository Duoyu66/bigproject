<template>
  <div class="draftPageHigh">
    <el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
      :element-loading-text="elementLoadingText" highlight-current-row :height="height"
      :header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
      @sort-change="tableSortChange" @row-click="rowClick">

      <el-table-column show-overflow-tooltip label="指标名称" prop="meta_name" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="旧值" prop="old_value" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="新值" prop="new_value" min-width="120px"></el-table-column>

    </el-table>
    <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"	:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"@size-change="handleSizeChange"></el-pagination>

  </div>
</template>

<script>
  import { treePaging	} from '@/global/form.helper'
  import { QueryExec } from '@/api/table'
  import { mapGetters	} from 'vuex'
  import { hasPermission } from '@/utils/permission'
  import entrustAdd from '../components/entrustAdd'
  import entrustEditApprove from '../components/entrustEditApprove'
  export default {
    name: 'entrustEditHistoryTable',
    components: { entrustAdd,entrustEditApprove },
    props: {
      type: {	type: Number,	default: 0, },
      primary_key: { type: Number, default: 0, },
      permission: { type: Object, default: function() { return {} }, },
      group_id: { type: Number, default: 0 },
      tablename: { type: String, default: '' },
    },
    provide() {	return { reload: this.fetchData, } },
    computed: {
      ...mapGetters({ org_id: 'user/org_id',current_org_id: 'org/current_org',person_id: 'user/person_id',}),
    },
    watch: {
      primary_key(newVal, oldVal) {
        if (this.type == 1 || this.type == 2 || this.type == 3) {
          console.log(newVal)
          this.fetchData({ reload: 1, })
        }
      },
      main_dialog(newVal, oldVal) {
        this.fetchData()
      },
      current_org_id() {
        this.fetchData()
      },
      rowClickData(newVal) {
        if (newVal && newVal.apply_id) {
          switch (this.type) {
            case 0:
              this.$emit('update:primary_key', Number(newVal.apply_id));
              break;
          }
        }
      },
    },
    data() {
      return {
        height: 'calc(85%)',
        main_dialog: false,
        background: false,
        listLoading: false,
        tablelist: [],
        elementLoadingText: '加载数据中',
        queryForm: { group_id: 0, pageSize: 10, pageNo: 1, },
        tabledata: [],
        layout: 'total, sizes, prev, next, jumper',
        total: 0,
        columnHideList: [],
        rowClickData: {}
      }
    },
    created() { this.init() },
    methods: {
      async init() {
        this.role_max = await this.$store.dispatch('user/getRoleMax')
        switch (this.type) {
          case 0:
            this.height = 'calc(85%)'
            break
          case 1:
            this.height = 'calc(85%)'
            break
          case 3:
            this.height = 'calc(85%)'
            break
        }
      },
      rowClick(row, col, event) {
        this.rowClickData = row
      },
      clearChildren() {
        this.rowClickData = { entrust_id:-1, }
      },
      fencthRelod(row) {
        if (!row) {
          row = JSON.parse(JSON.stringify(this.rowClickData))
        }
        this.clearChildren()
        let that = this
        setTimeout(() => {
          that.rowClickData = row
        }, 500)
        this.fetchData({
          pageNo: this.queryForm.pageNo
        })
      },
      handleCommand(command, row) {
        switch (command) {
          case 'edit':
            this.EditInfo(row)
            break
          case 'addChildren':
            this.handleAddChild(row)
            break
          case 'delete':
            this.handleDeletemodify(row)
            break
          case 'accept':
          	this.acceptEntrust(row)
          	break
          case 'cancel':
          	this.cancelEntrust(row)
          	break
          case 'appleedit':
          	this.applyEditEntrust(row)
          	break
          case 'approveedit':
            this.approveApply(row)
            break
        }
      },
      async cancelEntrust(row) {
        let that = this
        var spread = window.$("#ss").wijspread("spread");
        let sData = '[Q]735{-2$`'+row.entrust_id+'}|^1|^SYS'
        console.log(sData)
        const resentrustadd = await ExecSql(sData)
        if(resentrustadd>0)
        {
          that.$baseMessage('撤销委托成功', 'success')
        }
        else {
          that.$baseMessage('撤销委托失败', 'error')
        }
      },
      acceptEntrust(row) {
        console.log(row)
      	this.$layer.iframe({
      		content: {
      			content: entrustAdd,
      			parent: this,
      			data: {
      				iframeData: this.iframeData,
      				pageType: 20,
      				object_id: row.object_id,
      				entrustInfo: row
      			}
      		},
      		btn: '确定',
      		area: ['900px', '80%'],
      		title: row.order_id + '-' + row.object_name + "试验",
      		maxmin: true,
      		shade: false,
      		resize: true,
      		shadeClose: false,
      		cancel: () => { //关闭弹窗事件
      			console.log('关闭iframe')
      		}
      	});
      },
      approveApply(row) {
        console.log(row)
      	this.$layer.iframe({
      		content: {
      			content: entrustEditApprove,
      			parent: this,
      			data: {
      				iframeData: this.iframeData,
      				pageType: 60,
      				object_id: row.object_id,
      				entrustInfo: row
      			}
      		},
      		btn: '确定',
      		area: ['900px', '80%'],
      		title: '审批'+'-'+row.order_id + '-' + row.object_name + "试验",
      		maxmin: true,
      		shade: false,
      		resize: true,
      		shadeClose: false,
      		cancel: () => { //关闭弹窗事件
      			console.log('关闭iframe')
      		}
      	});
      },
      applyEditEntrust(row) {
        console.log(row)
        this.$layer.iframe({
        	content: {
        		content: entrustAdd,
        		parent: this,
        		data: {
        			iframeData: this.iframeData,
        			pageType: 50,
        			object_id: row.object_id,
        			entrustInfo: row
        		}
        	},
        	btn: '确定',
        	area: ['900px', '80%'],
        	title: '申请'+row.order_id + '-' + row.object_name + "委托修改",
        	maxmin: true,
        	shade: false,
        	resize: true,
        	shadeClose: false,
        	cancel: () => { //关闭弹窗事件
        		console.log('关闭iframe')
        	}
        });
      },
      ishasPermission(name, row) {
        let permission_name = ''
        switch (name) {
        	case 'add':
        		permission_name = 'entrustAddMenu'
        		break
        	case 'edit':
        		permission_name = 'entrustEditMenu'
        		break
        	case 'delete':
        		permission_name = 'entrustDeleteMenu'
        		break
        	case 'accept':
        		permission_name = 'entrustAcceptMenu'
        		break
          case 'cancel':
          	permission_name = 'entrustCancelMenu'
          	break
          case 'appleedit':
          	permission_name = 'entrustApplyMenu'
          	break
        	default:
        		permission_name = name
        		break
        }
        let flag = hasPermission(this.permission, permission_name)
        let role_max = this.role_max
        if (role_max == 'super_admin') {
          flag = true
          return flag
        }
        if (!flag) {
        	return flag
        }
        switch (name) {
        	case 'accept':
        		if (row.accepted == '0') {
        			flag = true
        		} else {
        			flag = false
        		}
        		break
        	case 'edit':
        		if (row.accepted == '-1' || row.accepted == '-2') {
        			flag = true
        		} else {
        			flag = false
        		}
        		break
          case 'cancel':
          	if (row.accepted == '0') {
          		flag = true
          	} else {
          		flag = false
          	}
          	break
          case 'appleedit':
          	if (row.accepted == '1') {
          		flag = true
          	} else {
          		flag = false
          	}
          	break
        	default:
        		flag = flag
        		break;
        }
        return flag
      },
      EditInfo(row) {
        console.log(row)
        this.$layer.iframe({
        	content: {
        		content: entrustAdd,
        		parent: this,
        		data: {
        			iframeData: this.iframeData,
        			pageType: 40,
        			object_id: row.object_id,
        			entrustInfo: row
        		}
        	},
        	btn: '确定',
        	area: ['900px', '80%'],
        	title: row.order_id + '-' + row.object_name + "试验",
        	maxmin: true,
        	shade: false,
        	resize: true,
        	shadeClose: false,
        	cancel: () => { //关闭弹窗事件
        		console.log('关闭iframe')
        	}
        });
      },
      handleAdd(row, parent_info, disable) {
        this.$refs['sysDataGroupDialog'].showEdit(row, parent_info, disable)
      },
      handleDeletemodify(row) {
        let that = this
        let tips = '确定删除' + entrust_id
        tips = tips + '?'
        that.delete_from_fobEx(that, row, 661, {
          'fetchData': 'fetchData', //加载数据
          'main_key': 'item_id', //主键
          'confirmMsg': tips,
          'successMsg': '删除成功',
        })
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData({pageNo: val,})
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData({pageNo: this.queryForm.pageNo,})
      },
      search(data) {
        this.queryForm = Object.assign(data, this.queryForm)
        this.fetchData()
      },
      fetchData(pageInfo, treeNode, resolve) {
        let that = this
        if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
          this.queryForm.pageNo = pageInfo.pageNo
        } else if (pageInfo) {
          this.queryForm.pageNo = 1
        } else {}
        switch (that.type) {
          case 0:
            that.fetchDataMain(pageInfo, treeNode, resolve)
            break
          case 1:
            that.fetchDataMain(pageInfo, treeNode, resolve)
            break
        }
      },
      setSelectRows() {},
      tableSortChange() {},
      async fetchDataMain(pageInfo, treeNode, resolve) {
        let that = this
        let select_list = [
          { field: 'apply_id',	type: 3,	level: 1	},
          { field: 'pageNo',	type: 3,	level: 2	},
          { field: 'pageSize',	type: 3,	level: 3	},
        ]
        that.queryForm.apply_id = that.primary_key
        await that.search_fob(select_list, that, 1063, {
          loading: 'listLoading', //加载画面
          data: 'tablelist', //数据存放位置
          total: 'total', //数据数量，根据该数量分页
          queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
        })
        that.tablelist.forEach((item,index)=>{
          
        })
        this.clearChildren()
      },
    },
  }
</script>
