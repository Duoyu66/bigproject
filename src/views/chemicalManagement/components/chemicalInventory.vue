<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <InventoryForm ref="InventoryForm"></InventoryForm>
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
import InventoryForm from '../form/InventoryForm.vue'
export default {
  name: 'TableEdit5',
  components: {
    InventoryForm,
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        norms: 'rygz',
        name: 'xst',
        region: 'g',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number2: '2',
        value1: ''
      },
      formLabelWidth: '120px',
      title: '',
      dialogFormVisible: false,
    }
  },
  created() { },
  methods: {
    showEdit5(row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
      }
      this.title += '盘点记录'
      this.dialogFormVisible = true
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
}
</script>
