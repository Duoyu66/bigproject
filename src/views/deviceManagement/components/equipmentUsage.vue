<template>
  <el-dialog title="修改设备使用映射" :visible.sync="dialogFormVisible">
    <UsageFrom  ref="UsageFrom"></UsageFrom>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'
  import UsageFrom from '../form/equipmentUsage.vue'
  export default {
    name: 'TableEdit',
    components: {
    	UsageFrom,
    },
    data() {
      return {
       
      form: {
        name: 'a',
        name1: 'a',
        name2: 'a',
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
      dialogFormVisible: false,
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
           if (this.$refs['UsageFrom']) {
           	this.$refs['UsageFrom'].form = Object.assign({}, row)
           }
         }
         this.dialogFormVisible = true
       },
     },
   }
</script>

<style>
</style>
