<template>
  <el-dialog
    title="修改盘点记录"
    :visible.sync="dialogFormVisible"
    width="480px"
  >
    <el-form :model="form">
      <el-form-item label="消耗用户" :label-width="formLabelWidth">
        <el-select v-model="form.name" style="width: 250px">
          <el-option label="张三" value="entry1"></el-option>
          <el-option label="条目二" value="entry2"></el-option>
          <el-option label="条目三" value="entry3"></el-option>
          <el-option label="条目四" value="entry4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="财务库存" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="实际库存" :label-width="formLabelWidth">
        <el-input v-model="form.number1" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="盘点时间" :label-width="formLabelWidth">
        <el-input v-model="form.number2" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="盘盈/盘亏/盘平" :label-width="formLabelWidth">
        <el-input v-model="form.number3" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="单位" :label-width="formLabelWidth">
        <el-input v-model="form.number4" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="盘点人" :label-width="formLabelWidth">
        <el-input v-model="form.number5" style="width: 250px"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">
        确 定
      </el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
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
          name: 'entry1',
          norms: 'entry2',
          name1: 'entry2',
          norms1: 'entry4',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number: '123',
          number1: '456',
          number2: '2020-12-15',
          number3: '盈利10000',
          number4: '北京',
          number5: '李四',
        },
        formLabelWidth: '120px',
      }
    },
    methods: {
      showEdit8(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
    },
  }
</script>
