<template> 
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="650px" @close="close" top="5vh" center > 
    <div style="max-height: calc(100vh - 250px); overflow-y: auto"> 
      <deviceLedgerForm ref="deviceLedgerForm" :formData.sync="form" :table_type="option.table_type" :type="type" :outOrgStatus="option.outOrgStatus"></deviceLedgerForm> 
    </div> 
    <div slot="footer" class="dialog-footer dialog-footer-center-custom"> 
      <el-button type="primary" @click="save">确 定</el-button> 
      <el-button @click="close">取 消</el-button> 
    </div> 
  </el-dialog> 
</template> 

<script> 
  import deviceLedgerForm from '../form/deviceLedgerForm' 
  export default { 
    name: 'deviceLedgerDialog', 
    model: { 
      prop: 'isUpData', 
      event: 'on-change' 
    }, 
    props: { 
      isUpData: { 
        type: Boolean, 
        default: false 
      }, 
      type: { 
        type: Number, 
        default: 0 //0 正常表单 1 详情表单 
      }, 
    }, 
    watch: {}, 
    components: { 
      deviceLedgerForm, 
    }, 
    data() { 
      return { 
        form: {}, 
        info: {}, 
        option: { 
          table_type: '0', 
          outOrgStatus: false, 
        }, 
        title: '', 
        dialogFormVisible: false, 
      } 
    }, 
    created() {}, 
    methods: { 
      showEdit(row, formInfo, option) { 
        let form = {}; 
        if (!row) { 
          this.title = 'undefined' 
        } else { 
          this.title = 'undefined' 
          form = Object.assign(form, row) 
        } 
        if (formInfo) { 
          form = Object.assign(form, formInfo) 
        } 
        if (option) { 
          this.option = Object.assign(this.option, option) 
        } 
        this.form = Object.assign({},this.form, form) 
        this.info = Object.assign(this.info, form); 
        this.dialogFormVisible = true 
        this.dialogFormVisible = true 
        if(this.$refs['deviceLedgerForm']) { 
          this.$refs['deviceLedgerForm'].init(this.form); 
        } 
      }, 
      async close(event, status) { 
        if (status) { 
          await this.reload_table() 
        } 
        this.$refs['deviceLedgerForm'].close() 
        this.dialogFormVisible = false 
      }, 
      async reload_table() { 
        this.$emit('fencthRelod'); 
        this.$emit('fencthRelodChildren'); 
      }, 
      save() { 
        let that = this 
        this.$refs['deviceLedgerForm'].save(async (valid) => { 
          if (valid) { 
            await that.close(undefined, true) 
          } 
        }) 
      }, 
    }, 
  } 
</script> 
