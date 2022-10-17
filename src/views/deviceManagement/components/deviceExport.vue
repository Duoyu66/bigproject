<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="80%" style="margin-top: -100px;">
    <exportDefine ref="exportDefine" @close="close"></exportDefine>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">
        确 定
      </el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ExecSql } from '@/api/table'
import exportDefine from '@/components/export/exportDefine'
export default {
  name: 'TableEdit',
  components: {
    exportDefine,
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
        number: '',

      },
      symbol: '0',
      formLabelWidth: '120px',
      title: '',
      dialogFormVisible: false,
    }
  },
  created() { },
  methods: {
    showEdit(row) {

      let that=this
      if (!row) {
        that.title = '添加'
      } else {
        that.title = '编辑'
        this.symbol='1'
        console.log(row)
        setTimeout(()=>{
          this.$refs['exportDefine'].fetchExcelExport(row)
        },10)
      }
      that.title += '设备类别'
      that.dialogFormVisible = true
    },
    save() {
      if(this.symbol==='0')
      {
        this.$refs['ClassFrom'].save()
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      }
      else {
        this.$refs['ClassFrom'].editsave()
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      }
    },
    close() {
      this.dialogFormVisible = false
      this.$emit('fetch-data')
    }
  },
}
</script>
