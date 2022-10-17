<template>
  <el-dialog
    title="制作记录详情"
    :visible.sync="dialogFormVisible"
    width="480px"
  >
    <el-form :model="form">
      <el-form-item label="化学品名称" :label-width="formLabelWidth">
        <el-select v-model="form.name" style="width: 250px" :disabled="true">
          <el-option label="铁溶液" value="entry1"></el-option>
          <el-option label="条目二" value="entry2"></el-option>
          <el-option label="条目三" value="entry3"></el-option>
          <el-option label="条目四" value="entry4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="化学品规格" :label-width="formLabelWidth">
        <el-select v-model="form.norms" style="width: 250px" :disabled="true">
          <el-option label="g" value="entry1"></el-option>
          <el-option label="条目二" value="entry2"></el-option>
          <el-option label="条目三" value="entry3"></el-option>
          <el-option label="条目四" value="entry4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消耗数量" :label-width="formLabelWidth">
        <el-input
          v-model="form.number"
          style="width: 250px"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="试验委托编号" :label-width="formLabelWidth">
        <el-input
          v-model="form.number1"
          style="width: 250px; margin-right: 5px"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="参数名称" :label-width="formLabelWidth">
        <el-select v-model="form.date1" style="width: 250px" :disabled="true">
          <el-option label="密度" value="entry1"></el-option>
          <el-option label="条目二" value="entry2"></el-option>
          <el-option label="条目三" value="entry3"></el-option>
          <el-option label="条目四" value="entry4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="记录人" :label-width="formLabelWidth">
        <el-select v-model="form.date2" style="width: 250px" :disabled="true">
          <el-option label="张三" value="entry1"></el-option>
          <el-option label="条目二" value="entry2"></el-option>
          <el-option label="条目三" value="entry3"></el-option>
          <el-option label="条目四" value="entry4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="记录时间" :label-width="formLabelWidth">
        <el-input
          v-model="form.number2"
          style="width: 250px"
          :disabled="true"
        ></el-input>
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
          date1: 'entry1',
          date2: 'entry1',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number: '123',
          number1: '12233',
          number2: '2020-12-15',
        },
        formLabelWidth: '120px',
      }
    },
    methods: {
      showEdit3(row) {
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
