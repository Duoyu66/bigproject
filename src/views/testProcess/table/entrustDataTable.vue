<template>
  <div class="draftPageHigh">
    <el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
      :element-loading-text="elementLoadingText" highlight-current-row :height="height"
      :header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
      @sort-change="tableSortChange" @row-click="rowClick">
      <el-table-column show-overflow-tooltip prop="accepted" label="委托状态" width="100px" align="center"
      	fixed="left">
      	<template slot-scope="scope">
      		<el-tag type="success" v-if="scope.row.accepted=='1'">已受理
      		</el-tag>
      		<el-tag type="warning" v-else-if="scope.row.accepted=='0'">待受理
      		</el-tag>
      		<el-tag type="danger" v-else-if="scope.row.accepted=='-1'">退回
      		</el-tag>
          <el-tag type="info" v-else-if="scope.row.accepted=='-2'">未委托
          </el-tag>
          <el-tag type="danger" v-else-if="scope.row.accepted=='-4'">已废止
          </el-tag>
          <el-tag type="warning" v-else-if="scope.row.accepted=='-5'">申请修改
          </el-tag>
      		<el-tag v-else>未知状态{{ scope.row.accepted }}
      		</el-tag>
      	</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="委托编号" prop="order_id" min-width="200px"></el-table-column>
      <el-table-column show-overflow-tooltip label="试验名称" prop="object_name" min-width="150px"></el-table-column>
      <el-table-column show-overflow-tooltip label="委托日期" prop="order_date" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="试验类别" prop="test_class" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="委托单位" prop="order_agent" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="项目名称" prop="project_name" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="强度" prop="strength" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="样品规格" prop="sample_spec" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="样品尺寸" prop="sample_size" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="龄期" prop="age" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="代表数量" prop="quantity" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="代表批号" prop="batch_id" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="委托试验室标识" prop="lab_id" min-width="120px"></el-table-column>

      <el-table-column show-overflow-tooltip label="试验分类" prop="test_category" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作人" prop="person_id" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="上传状态" prop="send_status" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="委托人" prop="order_person" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="废除类型" prop="abolish_type" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="监理确认" prop="super_confirm" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="任务编号" prop="task_no" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
        <template #default="scope">
          <el-dropdown trigger="click" placement="left-start">
            <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleCommand('view', scope.row)">查看委托</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('edit', scope.row)"
                v-show="ishasPermission('edit',scope.row)">
              	编辑
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('appleedit', scope.row)"
                v-show="ishasPermission('appleedit',scope.row)">
              	申请修改
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('approveedit', scope.row)"
                v-show="ishasPermission('cancel',scope.row)">
              	审批修改
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('accept', scope.row)"
                v-show="ishasPermission('accept',scope.row)">
              	受理
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('cancel', scope.row)"
                v-show="ishasPermission('cancel',scope.row)">
              	撤销
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('viewreport', scope.row)"
                v-show="ishasPermission('viewreport',scope.row)">
              	查看报告
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('printTag', scope.row)"
                v-show="ishasPermission('printTag',scope.row)">
              	打印试样标签
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
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
  import testReview from '../luckysheet/testDataReviewWhole'
  export default {
    name: 'entrustDataTable',
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
      ...mapGetters({ org_id: 'user/org_id',current_org_id: 'org/current_org',person_id: 'user/person_id', object_id: 'testInfo/object_id'}),
    },
    watch: {
      primary_key(newVal, oldVal) {
        if (this.type == 1 || this.type == 2 || this.type == 3) {
          this.fetchData({ reload: 1, })
        }
      },
      main_dialog(newVal, oldVal) {
        this.fetchData()
      },
      current_org_id() {
        this.fetchData()
      },
      object_id() {
        this.fetchData()
      },
      rowClickData(newVal) {
        if (newVal && newVal.entrust_id) {
          switch (this.type) {
            case 0:
              this.$emit('update:primary_key_main', Number(newVal.entrust_id));
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
          case 'viewreport':
            this.viewReport(row)
            break
          case 'printTag':
            this.printTag(row)
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
      viewReport(row) {
        row.windowstate=4
        if (this.iframe.review.id) {
        	let iframe = this.$layer.instancesVue[this.iframe.review.id]
        	if (iframe) {
        		iframe.iframe.pushTestData(row)
        		return true
        	}

        }
        let area = ['900px', '720px']

        if (this.getELementHeight('html') < 720) {
        	area[1] = '80%'
        }
        if (this.getELementWidth('html') < 900) {
        	area[0] = '80%'
        }
        let iframe_review_id = this.$layer.iframe({
        	content: {
        		content: testReview,
        		parent: this,
        		data: {
        			TestData: row
        		}
        	},
        	btn: '确定',
        	area: area,
        	title: '申请'+row.order_id+'修改',
        	maxmin: true,
        	shade: false,
        	shadeClose: false,
        	resize: true,
        	cancel: () => { //关闭弹窗事件
        		console.log('关闭iframe')
        	}
        });
        this.iframe.review.id = iframe_review_id
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
        }
      },
      setSelectRows() {},
      tableSortChange() {},
      async fetchDataMain(pageInfo, treeNode, resolve) {
        let that = this
        let select_list = [
          { field: 'pageNo',	type: 3,	level: 1	},
          { field: 'pageSize',	type: 3,	level: 2	},
          { field: 'object_id',	type: 3,	level: 3	},
        ]
        that.queryForm.object_id = that.object_id
        await that.search_fob(select_list, that, 937, {
          loading: 'listLoading', //加载画面
          data: 'tablelist', //数据存放位置
          total: 'total', //数据数量，根据该数量分页
          queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
        })
        this.clearChildren()
      },
    },
  }
</script>
