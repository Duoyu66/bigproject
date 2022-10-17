<template>
  <el-dialog
    title="执行核查"
    :visible.sync="dialogFormVisible"
    width="615px"
    height="400px"
  >
    <span class="purchasefrom">
      <el-form :model="form" height="400px">
        <el-form-item label="核查用户" :label-width="formLabelWidth">
          <el-input v-model="form.mill3" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="核查单位" :label-width="formLabelWidth">
          <el-input v-model="form.mill4" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="证书编号" :label-width="formLabelWidth">
          <el-input v-model="form.mill5" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="扫描证书" :label-width="formLabelWidth">
          <el-input
            v-model="form.mill2"
            style="width: calc(100% - 58px)"
          ></el-input>
          <el-button type="primary">上传</el-button>
        </el-form-item>
        <el-form-item label="核查结果" :label-width="formLabelWidth">
          <el-input v-model="form.hecha" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="核查意见" :label-width="formLabelWidth">
          <el-input v-model="form.hecha1" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="核查日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.hecha3"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </span>
    <div slot="footer" class="dialog-footer" style="margin-left: 70px">
      <div class="devides_btn">
        <el-button type="primary" @click="dialogFormVisible = false">
          确 定
        </el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'
  export default {
    name: 'ComprehensiveTable',
    components: {},
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
        dialogFormVisible: false,
        form: {
          name: 'a',
          name1: 'a',
          name2: 'a',
          name3: 'a',
          region: 'qualified',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number: '',
          hecha: '',
          hecha1: '',
          hecha2: '',
          hecha3: '',
        },
        formLabelWidth: '80px',
      }
    },
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
          if (this.$refs['PurchaseFrom']) {
            this.$refs['PurchaseFrom'].form = Object.assign({}, row)
          }
        }
        this.dialogFormVisible = true
      },
    },
  }
</script>
