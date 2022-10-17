<template>
  <el-dialog title="添加期间校检记录" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="管理编号" :label-width="formLabelWidth">
                <el-input v-model="form.number" style="width: 250px;" ></el-input>
              </el-form-item>
              <el-form-item label="标准物质名称" :label-width="formLabelWidth">
                <el-input v-model="form.number1" style="width: 250px;"></el-input>
              </el-form-item>
              <el-form-item label="校检方式" :label-width="formLabelWidth">
                <el-input v-model="form.number2" style="width: 250px;"></el-input>
              </el-form-item>
              <el-form-item label="校检人员" :label-width="formLabelWidth">
                <el-input v-model="form.number3" style="width: 250px;"></el-input>
              </el-form-item>
              <el-form-item label="校检结果" :label-width="formLabelWidth">
                <el-input v-model="form.number4" style="width: 250px;"></el-input>
              </el-form-item>
              <el-form-item label="校检时间" :label-width="formLabelWidth">
                <el-input v-model="form.number5" style="width: 250px;"></el-input>
              </el-form-item>
      <el-form-item label="备注" class="draft_textarea" :label-width="formLabelWidth" >
  	        <el-input type="textarea" v-model="form.desc"></el-input>
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
       region: '',
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
