<template>
  <div class="draftPageHigh">
    <el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
      :element-loading-text="elementLoadingText" highlight-current-row :height="height"
      :header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
      @sort-change="tableSortChange" @row-click="rowClick">
      <el-table-column show-overflow-tooltip prop="stage" label="试验状态" width="100px" align="center" fixed="left">
      	<template slot-scope="scope">
<!--      		<el-tag type="danger" v-if="scope.row.stage=='0'">待收样
      		</el-tag> -->
      		<el-tag type="warning" v-if="scope.row.stage=='0'">待试验
      		</el-tag>
      		<el-tag type="warning" v-else-if="scope.row.stage=='2'">待复核
      		</el-tag>
      		<el-tag type="warning" v-else-if="scope.row.stage=='3'">待批准
      		</el-tag>
      		<el-tag type="warning" v-else-if="scope.row.stage=='4'">待打印
      		</el-tag>
<!--      		<el-tag type="success" v-else-if="scope.row.stage=='5'">待寄发
      		</el-tag> -->
          <el-tag type="warning" v-else-if="scope.row.stage=='5'">已完成
          </el-tag>
          <el-tag type="danger" v-else-if="scope.row.stage=='-2'">复核失败
          </el-tag>
      		<el-tag v-else>未知状态{{ scope.row.stage }}
      		</el-tag>
      	</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="conclusion" label="判断结果" width="100px" align="center"
      	fixed="left">
      	<template slot-scope="scope">
      		<el-tag type="warning" v-if="scope.row.conclusion=='0'">尚未评定
      		</el-tag>
      		<el-tag type="success" v-else-if="scope.row.conclusion=='1'">合格
      		</el-tag>
      		<el-tag type="danger" v-else-if="scope.row.conclusion=='2'">不合格
      		</el-tag>
<!--      		<el-tag type="danger" v-else-if="scope.row.conclusion=='3'">待复检
      		</el-tag> -->
      		<el-tag v-else>未知状态{{ scope.row.conclusion }}
      		</el-tag>
      	</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="委托编号" prop="order_id" min-width="150px"></el-table-column>
      <el-table-column show-overflow-tooltip label="试验项目" prop="object_name" min-width="140px"></el-table-column>
      <el-table-column show-overflow-tooltip label="委托日期" prop="order_date" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="试验类型" prop="test_class" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="委托单位" prop="order_agent" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="项目名称" prop="project_name" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="强度" prop="strength" min-width="80px"></el-table-column>
      <el-table-column show-overflow-tooltip label="样品规格" prop="sample_spec" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="样品尺寸" prop="sample_size" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="龄期" prop="age" min-width="80px"></el-table-column>
      <el-table-column show-overflow-tooltip label="代表数量" prop="quantity" min-width="80px"></el-table-column>
      <el-table-column show-overflow-tooltip label="批号" prop="batch_id" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="报告编号" prop="report_id" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="报告日期" prop="report_date" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="试验结论" prop="conclusion" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="记录编号" prop="record_id" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="流程位置" prop="stage" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="试验分类" prop="test_category" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="状态" prop="status" min-width="120px"></el-table-column>
      <!-- <el-table-column show-overflow-tooltip label="试验人" prop="person_id" min-width="100px"></el-table-column> -->
      <el-table-column show-overflow-tooltip label="委托人" prop="order_person" min-width="100px"></el-table-column>
      <el-table-column show-overflow-tooltip label="取样人" prop="sample_collector" min-width="100px"></el-table-column>
      <el-table-column show-overflow-tooltip label="试验人" prop="test_person" min-width="100px"></el-table-column>
      <el-table-column show-overflow-tooltip label="复核人" prop="review_person" min-width="100px"></el-table-column>
      <el-table-column show-overflow-tooltip label="批准人" prop="approved_person" min-width="100px"></el-table-column>
      <el-table-column show-overflow-tooltip label="监理确认" prop="super_confirm" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="是否超期" prop="is_expired" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="委托时间" prop="order_time" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="受理时间" prop="accept_time" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="取样时间" prop="sample_time" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="检测时间" prop="test_time" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="复核时间" prop="review_time" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="批准时间" prop="approve_time" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="监理确认时间" prop="super_time" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
        <template #default="scope">
          <el-dropdown trigger="click" placement="left-start">
            <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleCommand('view', scope.row)">详情</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('test', scope.row)"
                v-show="ishasPermission('test',scope.row)">试验</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('review', scope.row)"
                v-show="ishasPermission('review',scope.row)">复核</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('approve', scope.row)"
                v-show="ishasPermission('approve',scope.row)">批准</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('apply', scope.row)"
                v-show="ishasPermission('apply',scope.row)">申请修改</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('print', scope.row)"
                v-show="ishasPermission('print',scope.row)">打印报告</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('print', scope.row)"
                v-show="ishasPermission('print',scope.row)">生成见证任务</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('print', scope.row)"
                v-show="ishasPermission('print',scope.row)">打印材料标签</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('pasteEntrust', scope.row)"
                v-show="ishasPermission('pasteEntrust',scope.row)">粘贴式新建委托单</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('print', scope.row)"
                v-show="ishasPermission('print',scope.row)">粘贴式新建对比试验</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('print', scope.row)"
                v-show="ishasPermission('print',scope.row)">粘贴式新建抽检试验</el-dropdown-item>
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
  import entrustAdd from '../components/entrustAdd'
  import { QueryExec } from '@/api/table'
  import { mapGetters	} from 'vuex'
  import { hasPermission } from '@/utils/permission'
  import testReview from '../luckysheet/testDataReviewWhole'
  import testDataDialog from '../component/testDataDialog'
  import entrustAssign from '../components/entrustAssign.vue'
  export default {
    name: 'testDataTable',
    components: { testDataDialog,testReview,entrustAssign },
    props: {
      type: {	type: Number,	default: 0, },
      primary_key: { type: Number, default: 0, },
      permission: { type: Object, default: function() { return {} }, },
      group_id: { type: Number, default: 0 },
      tablename: { type: String, default: '' },
    },
    provide() {	return { reload: this.fetchData, } },
    computed: {
      ...mapGetters({ org_id: 'user/org_id',current_org_id: 'org/current_org',person_id: 'user/person_id',object_id: 'testInfo/object_id'}),
    },
    watch: {
      primary_key(newVal, oldVal) {
        if (this.type == 0 || this.type == 2 || this.type == 3) {
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
        if (newVal && newVal.data_id) {
          switch (this.type) {
            case 1:
              this.$emit('update:primary_key', Number(newVal.data_id));
              break;
          }
        }
      },
    },
    data() {
      return {
        height: 'calc(70%)',
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
        rowClickData: {},
        iframe: {
        	approval: {
        		id: ''
        	},
          review: {
          	id: ''
          }
        },
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
        this.rowClickData = { data_id:-1, }
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
          case 'test':
            this.toDoteask(row)
            break
          case 'review':
            this.toReview(row)
            break
          case 'apply':
            this.toApplyEdit(row)
            break
          case 'print':
            this.testPrint(row)
            break
          case 'approve':
            this.handleApprove(row)
            break
          case 'pasteEntrust':
            this.pasteEntrust(row)
            break
        }
      },
      setSelectRows() {},
      tableSortChange() {},
      ishasPermission(name, row) {
        console.log(name);
        let permission_name = ''
        switch (name) {
        	case 'test':
        		permission_name = 'testTestMenu'
        		break
        	case 'review':
        		permission_name = 'testReviewMenu'
        		break
        	case 'approve':
        		permission_name = 'testApproveMenu'
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
        	case 'test':
        		if (row.stage == '0') {
        			flag = true
        		} else {
        			flag = false
        		}
        		break
          case 'review':
          	if (row.stage == '2') {
          		flag = true
          	} else {
          		flag = false
          	}
          	break
          case 'approve':
          	if (row.stage == '3') {
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
        this.handleAdd(row, undefined, undefined)
      },
      handleAdd(row, parent_info, disable) {
        this.$refs['sysDataGroupDialog'].showEdit(row, parent_info, disable)
      },
      pasteEntrust(row) {
        console.log(row)
        this.$layer.iframe({
        	content: {
        		content: entrustAdd,
        		parent: this,
        		data: {
        			iframeData: this.iframeData,
        			pageType: 80,
        			object_id: row.object_id,
        			entrustInfo: row
        		}
        	},
        	btn: '确定',
        	area: ['900px', '80%'],
        	title: '粘贴式新建' + row.object_name + '委托',
        	maxmin: true,
        	shade: false,
        	resize: true,
        	shadeClose: false,
        	cancel: () => { //关闭弹窗事件
        		console.log('关闭iframe')
        	}
        });

      },
      handleDeletemodify(row) {
        let that = this
        let tips = '确定删除' + data_id
        tips = tips + '?'
        that.delete_from_fobEx(that, row, 661, {
          'fetchData': 'fetchData', //加载数据
          'main_key': 'item_id', //主键
          'confirmMsg': tips,
          'successMsg': '删除成功',
        })
      },
      getELementHeight(type, key) {
      	let dom = this.getELement(type, key)
      	return dom.offsetHeight
      },
      getELementWidth(type, key) {
      	let dom = this.getELement(type, key)
      	return dom.offsetWidth
      },
      getELement(type, key) {
      	if (!type) {
      		type = 'ref'
      	}
      	let dom = ''
      	switch (type) {
      		case 'ref':
      			if (key) {
      				dom = this.$refs[key]
      			} else {
      				dom = this.$el
      			}
      			break
      		case 'id':
      			dom = dom.document.getElementById(id)
      			break
      		case 'html':
      			dom = document.documentElement
      			break
      	}
      	return dom
      },
      testPrint(row) {
      	this.$layer.iframe({
      		content: {
      			content: entrustAssign,
      			parent: this,
      			data: {
      				iframeData: this.iframeData,
      				pageType: 20,
      				object_id: row.object_id,
      				entrustInfo: row
      			}
      		},
      		btn: '确定',
      		area: ['60%', '80%'],
      		title: row.order_id,
      		maxmin: true,
      		shade: false,
      		shadeClose: false,
      		cancel: () => { //关闭弹窗事件
      			console.log('关闭iframe')
      		}
      	});
      },
      toApplyEdit(row) {
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
      handleApprove(row) {
        row.windowstate=3
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
        	title: '批准'+row.object_name,
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
      toReview(row) {
        row.windowstate=2
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
        	title: '复核'+row.object_name,
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
      toDoteask(row) {
        row.windowstate=1
        console.log(row)

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
							TestData: row,
              stage: 1 //试验
						}
					},
					btn: '确定',
					area: area,
					title: '试验'+row.object_name,
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
      async fetchDataMain(pageInfo, treeNode, resolve) {
        let that = this
        let select_list = [
          { field: 'order_id',	type: 2,	level: 1	},
          { field: 'order_start_date',	type: 3,	level: 2	},
          { field: 'order_end_date',	type: 3,	level: 3	},
          { field: 'report_id',	type: 2,	level: 4	},
          { field: 'batch_id',	type: 2,	level: 5	},
          { field: 'pageNo',	type: 3,	level: 6	},
          { field: 'pageSize',	type: 3,	level: 7	},
          { field: 'object_id',	type: 3,	level: 8	},
        ]
        that.queryForm.object_id = that.object_id
        await that.search_fob(select_list, that, 929, {
          loading: 'listLoading', //加载画面
          data: 'tablelist', //数据存放位置
          total: 'total', //数据数量，根据该数量分页
          queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
        })
        console.log(that.tablelist)
        this.clearChildren()
      },
    },
  }
</script>
