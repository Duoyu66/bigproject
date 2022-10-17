<template>
  <el-dialog title="设备录入" :visible.sync="dialogFormVisible">
    <LedgerFrom  ref="LedgerFrom"></LedgerFrom>
    <div slot="footer" class="dialog-footer" style="display: flex; justify-content: space-around;">
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'
  import LedgerFrom from '../form/LedgerFrom.vue'
  export default {
    name: 'TableEdit',
    components: {
    	LedgerFrom,
    },
    data() {
      return {
        dialogFormVisible: false,
      form: {
        name: 'a',
        name1: 'a',
        name2: 'a',
        name3: 'a',
        name4: 'a',
        name5: 'a',
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
  created() {},
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

<style>
</style>
