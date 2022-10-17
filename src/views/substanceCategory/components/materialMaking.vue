<template>
  <el-dialog title="标准物质制作" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="化学品名称" :label-width="formLabelWidth">
        <el-select v-model="form.name" style="width: 250px">
          <el-option label="条目一" value="entry1"></el-option>
          <el-option label="条目二" value="entry2"></el-option>
          <el-option label="条目三" value="entry3"></el-option>
          <el-option label="条目四" value="entry4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="化学品规格" :label-width="formLabelWidth">
        <el-select v-model="form.norms" style="width: 250px">
          <el-option label="条目一" value="entry1"></el-option>
          <el-option label="条目二" value="entry2"></el-option>
          <el-option label="条目三" value="entry3"></el-option>
          <el-option label="条目四" value="entry4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="制作数量" :label-width="formLabelWidth">
        <el-input
          v-model="form.number1"
          style="width: 230px; margin-right: 5px"
        ></el-input>
        ml
      </el-form-item>
      <el-form-item label="标准物质名称" :label-width="formLabelWidth">
        <el-select v-model="form.name1" style="width: 250px">
          <el-option label="条目一" value="entry1"></el-option>
          <el-option label="条目二" value="entry2"></el-option>
          <el-option label="条目三" value="entry3"></el-option>
          <el-option label="条目四" value="entry4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标准物质规格" :label-width="formLabelWidth">
        <el-select v-model="form.norms1" style="width: 250px">
          <el-option label="条目一" value="entry1"></el-option>
          <el-option label="条目二" value="entry2"></el-option>
          <el-option label="条目三" value="entry3"></el-option>
          <el-option label="条目四" value="entry4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="制作人" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px"></el-input>
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
          number: '',
        },
        formLabelWidth: '120px',
      }
    },
    methods: {
      showEdit(row) {
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
