<template>
  <el-dialog title="执行校检" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="物质规格" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="标准物质" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="是否合格" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="合格" style="width: 250px;">
          <el-option label="合格" value="qualified"></el-option>
          <el-option label="不合格" value="unqualified"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="校检证书" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" style="width: 205px; margin-right: 5px;"></el-input>
        <el-button type="primary" class="normal">上传</el-button>
      </el-form-item>
      <el-form-item label="证书编号" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" style="width: 250px;"></el-input>

      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'
  export default {
    name: 'ComprehensiveTable',
    components: {
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
        dialogFormVisible: false,
      form: {
        name: '',
        region: 'qualified',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number:''
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
