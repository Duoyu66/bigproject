<template>
  <el-dialog
    title="修改校检记录"
    :visible.sync="dialogFormVisible"
    width="480px"
  >
    <el-form :model="form" style="height: 300px">
      <el-form-item label="计划日期" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.number2"
          type="date"
          placeholder="选择日期"
          style="width: 250px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="计划内容" :label-width="formLabelWidth">
        <el-input v-model="form.desc" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="实施日期" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.number3"
          type="date"
          placeholder="选择日期"
          style="width: 250px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="计划制作人" :label-width="formLabelWidth">
        <el-input v-model="form.region" style="width: 250px"></el-input>
      </el-form-item>

      <el-form-item label="核查结果" :label-width="formLabelWidth">
        <el-input v-model="form.number4" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="核查意见" :label-width="formLabelWidth">
        <el-input v-model="form.number5" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="证书编号" :label-width="formLabelWidth">
        <el-input v-model="form.number6" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="证书扫描件" :label-width="formLabelWidth">
        <el-image
          style="width: 200px; height: 200px"
          :src="url"
          :preview-src-list="srcList"
        ></el-image>
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
          region: '张三',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '计划内容',
          number: '123',
          number1: '12233',
          number2: '2020-12-15',
          number3: '2020-12-15',
          number4: '正常',
          number5: '无',
          number6: '2123455',
          number7: '2020-12-15',
          number8: '2020-12-15',
        },
        formLabelWidth: '120px',
        url:
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        srcList: [
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        ],
      }
    },
    methods: {
      showEdit12(row) {
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
