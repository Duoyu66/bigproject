<template>
  <el-dialog :title='title' :visible.sync="dialogFormVisible">
    <el-form :model="form" ref="form">
      <el-form-item label="合同名称" :label-width="formLabelWidth">
      	<el-input v-model="form.contract_name" style="width: 100%;" readonly></el-input>
      </el-form-item>
      <el-form-item label="合同编号" :label-width="formLabelWidth">
      	<el-input v-model="form.contract_no" style="width: 100%;" readonly></el-input>
      </el-form-item>
      <el-form-item label="目标机构" prop='to_org' :label-width="formLabelWidth" style="margin-bottom: 100px;">
      	<tree-select :options="select.org" :max-height="300" :multiple="false"
      		:placeholder="isReadOnly('请选择调入机构...')" :disabled="readonly" v-model="form.to_org" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
 import { ExecSql } from '@/api/table'
 import CollectForm from '../form/CollectForm.vue'
 import TreeSelect from '@riophae/vue-treeselect'
 import '@riophae/vue-treeselect/dist/vue-treeselect.css'
 export default {
   name: 'TableEdit8',
   components: {
   	CollectForm,
    TreeSelect
   },
    data() {
      return {
        dialogFormVisible: false,
        formLabelWidth: '120px',
        formLabelWidth: '120px',
        title: '',
        Contract: [],
        symbol: '0',
        readonly: false,
        select: {
        	org: []
        },
        form: {
          to_org: '',
          contract_name: '',
          contract_no: '',
          contract_id: ''
        }
      }
    },
    created() {},
    methods: {
      async showEdit(row, symbol) {
        if (!row && !symbol) {
          this.title = '添加购入记录'
        }
        else if(!symbol){
          this.title = '合同迁移'
          this.Contract = Object.assign({}, row)
          console.log(this.Contract)
          this.select.org = await this.$store.dispatch('org/GetOrgTreeAllEx')
          this.form.contract_name=row.contract_name
          this.form.contract_no=row.contract_no
          this.form.contract_id=row.contract_id
        }
        this.dialogFormVisible = true
      },
      editsave(){

        let that=this;
        this.$refs['form'].validate(async (valid) => {
          if(valid)
          {
            let sData = '[Q]669{'+that.form.to_org+'$`'+this.form.contract_id+'}|^1|^SYS'
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('合同迁移成功', 'success')
              that.$refs['form'].resetFields()
              that.close_comp()
            }
            else
            {
              that.$baseMessage('合同迁移失败', 'error')
            }
          }
          else {
            return false
          }
        })
      },
      isReadOnly(text) {
      	if (this.readonly) {
      		return ''
      	}
      	return text
      },
      close_comp(){
        this.$emit('fetchDataChild',this.Contact)
        this.$emit('fetchData')
        this.dialogFormVisible = false
      }
    },
  }
</script>
