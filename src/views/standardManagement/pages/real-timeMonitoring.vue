<template>
  <div class="table-container definition purchase equipment ">
    <vab-query-form>
      <vab-query-form-left-panel style="width: 100%">
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              style="border-radius: 30px"
              v-model="queryForm.title"
              placeholder="按名称搜索"
              prefix-icon="el-icon-search"
            />
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-container style="flex-wrap: wrap">
      <el-row :gutter="10" style="width: 100%">
        <el-col :span="8">
          <fieldset style="border: 0.01px solid #ddd; min-width: inherit">
            <div class="demo-image">
              <legend>力学试验室</legend>
              <div class="block" v-for="fit in fits" :key="fit">
                <el-image
                  style="width: 360px; height: 350px"
                  :src="url"
                ></el-image>
                <span class="demonstration">{{ fit }}</span>
              </div>
            </div>
          </fieldset>
        </el-col>
        <el-col :span="8">
          <fieldset style="border: 0.01px solid #ddd; min-width: inherit">
            <div class="demo-image">
              <legend>力学试验室</legend>
              <div class="block" v-for="fit in fits" :key="fit">
                <el-image
                  style="width: 360px; height: 350px"
                  :src="url"
                ></el-image>
                <span class="demonstration">{{ fit }}</span>
              </div>
            </div>
          </fieldset>
        </el-col>
        <el-col :span="8">
          <fieldset style="border: 0.01px solid #ddd; min-width: inherit">
            <div class="demo-image">
              <legend>力学试验室</legend>
              <div class="block" v-for="fit in fits" :key="fit">
                <el-image
                  style="width: 360px; height: 350px"
                  :src="url"
                ></el-image>
                <span class="demonstration">{{ fit }}</span>
              </div>
            </div>
          </fieldset>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="width: 100%">
        <el-col :span="8">
          <fieldset style="border: 0.01px solid #ddd; min-width: inherit">
            <div class="demo-image">
              <legend>力学检测室</legend>
              <div class="block" v-for="fit in fits" :key="fit">
                <el-image
                  style="width: 360px; height: 350px"
                  :src="url"
                ></el-image>
                <span class="demonstration">{{ fit }}</span>
              </div>
            </div>
          </fieldset>
        </el-col>
        <el-col :span="8">
          <fieldset style="border: 0.01px solid #ddd; min-width: inherit">
            <div class="demo-image">
              <legend>力学试验室</legend>
              <div class="block" v-for="fit in fits" :key="fit">
                <el-image
                  style="width: 360px; height: 350px"
                  :src="url"
                ></el-image>
                <span class="demonstration">{{ fit }}</span>
              </div>
            </div>
          </fieldset>
        </el-col>
        <el-col :span="8">
          <fieldset style="border: 0.01px solid #ddd; min-width: inherit">
            <div class="demo-image">
              <legend>力学试验室</legend>
              <div class="block" v-for="fit in fits" :key="fit">
                <el-image
                  style="width: 360px; height: 350px"
                  :src="url"
                ></el-image>
                <span class="demonstration">{{ fit }}</span>
              </div>
            </div>
          </fieldset>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import { getList, doDelete } from '@/api/table'
import TableEdit from './../components/defaultEdit'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
  components: {
    TableEdit,
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
      fits: [''],
      url:
        'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2800553804,1783773622&fm=26&gp=0.jpg',
      imgShow: true,
      list: [],
      imageList: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      selectRows: '',
      elementLoadingText: '正在加载...',
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: '',
      },
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number: '',
      },
      formLabelWidth: '120px',
    }
  },
  computed: {
    height() {
      return this.$baseTableHeight()
    },
  },
  created() {
    this.fetchData()
  },
  beforeDestroy() {},
  mounted() {},
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

    handleDelete(row) {
      if (row.id) {
        this.$baseConfirm(
          '你确定要删除标准物质名称为()的记录吗',
          null,
          async () => {
            const { msg } = await doDelete({
              ids: row.id,
            })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          }
        )
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
    handleQuery() {
      this.queryForm.pageNo = 1
      this.fetchData()
    },
    async fetchData() {
      this.listLoading = true
      const { data, totalCount } = await getList(this.queryForm)
      this.list = data
      const imageList = []
      data.forEach((item, index) => {
        imageList.push(item.img)
      })
      this.imageList = imageList
      this.total = totalCount
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    testMessage() {
      this.$baseMessage('test1', 'success')
    },
    testALert() {
      this.$baseAlert('11')
      this.$baseAlert('11', '自定义标题', () => {
        /* 可以写回调; */
      })
      this.$baseAlert('11', null, () => {
        /* 可以写回调; */
      })
    },
    testConfirm() {
      this.$baseConfirm(
        '你确定要执行该操作?',
        null,
        () => {
          /* 可以写回调; */
        },
        () => {
          /* 可以写回调; */
        }
      )
    },
    testNotify() {
      this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
    },
  },
}
</script>
