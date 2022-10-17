<template> 
  <el-form ref="form" :model="form" :rules="rules"> 
    <el-row> 
      <el-col :span="span"> 
        <el-form-item label="问题描述" :label-width="formLabelWidth" prop="text" > 
          <el-input v-model="form.risks" :placeholder="isReadOnly('')" style="width:100%" maxlength="500"></el-input> 
        </el-form-item> 
      </el-col> 
      <el-col :span="span"> 
        <el-form-item label="问题来源" :label-width="formLabelWidth" prop="varchar" > 
          <el-select v-model="form.risk_source" :placeholder="isReadOnly('')" style="width:100%"></el-input> 
            <el-option v-for="data in selectData.risk_source" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option> 
          </el-select> 
        </el-form-item> 
      </el-col> 
      <el-col :span="span"> 
        <el-form-item label="问题等级" :label-width="formLabelWidth" prop="varchar" > 
          <el-select v-model="form.risk_level" :placeholder="isReadOnly('')" style="width:100%"></el-input> 
            <el-option v-for="data in selectData.risk_level" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option> 
          </el-select> 
        </el-form-item> 
      </el-col> 
      <el-col :span="span"> 
        <el-form-item label="扣分值" :label-width="formLabelWidth" prop="float" > 
          <el-input v-model="form.credit" :placeholder="isReadOnly('')" style="width:100%" maxlength="18"></el-input> 
        </el-form-item> 
      </el-col> 
      <el-col :span="span"> 
        <el-form-item label="责任单位" :label-width="formLabelWidth" prop="varchar" > 
          <el-select v-model="form.charge_department" :placeholder="isReadOnly('')" style="width:100%"></el-input> 
            <el-option v-for="data in selectData.charge_department" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option> 
          </el-select> 
        </el-form-item> 
      </el-col> 
      <el-col :span="span"> 
        <el-form-item label="责任人" :label-width="formLabelWidth" prop="varchar" > 
          <el-input v-model="form.charge_person" :placeholder="isReadOnly('')" style="width:100%" maxlength="8"></el-input> 
        </el-form-item> 
      </el-col> 
      <el-col :span="span"> 
        <el-form-item label="问题时间" :label-width="formLabelWidth" prop="datetime" > 
          <el-date-picker v-model="form.risk_c_time" align="right" type="date" placeholder="选择日期" style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker> 
        </el-form-item> 
      </el-col> 
      <el-col :span="span"> 
        <el-form-item label="问题确认" :label-width="formLabelWidth" prop="nvarchar" > 
          <el-input v-model="form.risk_confirm" :placeholder="isReadOnly('')" style="width:100%" maxlength="10"></el-input> 
        </el-form-item> 
      </el-col> 
      <el-col :span="span"> 
        <el-form-item label="问题人" :label-width="formLabelWidth" prop="nvarchar" > 
          <el-input v-model="form.risk_person" :placeholder="isReadOnly('')" style="width:100%" maxlength="10"></el-input> 
        </el-form-item> 
      </el-col> 
    </el-row> 
  </el-form> 
</template> 

<script> 
  import { mapGetters } from 'vuex' 
  import { 
    format_fob, 
    pickerOptions, 
    getToday, 
    dateFormat, 
  } from '@/utils/dateHelp' 
  import { 
    GetGroupData, 
    GetGroupDataEx, 
  } from '@/utils/htmlDataGroup' 
  export default { 
    name: 'riskLedgerForm', 
    model: { 
      prop: 'formData', 
      event: 'on-change' 
    }, 
    props: { 
      formData: { 
        type: Object, 
        default: function() { return {} } 
      }, 
      type: { 
        type: Number, 
        default: 0 //0 正常表单 1 详情表单 
      }, 
      table_type: { 
        type: String, 
        default: '0' 
      }, 
      outOrgStatus: { 
        type: Boolean, 
        default: false 
      }, 
    }, 
    computed: { 
      ...mapGetters({ 
        org_id: 'user/org_id', 
        current_org_id: 'org/current_org', 
        person_id: 'user/person_id' 
      }), 
    }, 
    watch: { 
      formData(newVal, oldVal) { 
        if (newVal) { 
          this.form = Object.assign({}, this.formdefalut) 
          this.init() 
        } 
      }, 
    }, 
    data() { 
      return { 
        span: 24, 
        readonly: false, 
        formdefalut: {}, 
        selectData: { org_type: [], parent_id: [], out_org_status: [],}, 
        form: { 
          org_id: '', 
          risks: '', 
          risk_source: '', 
          risk_level: '', 
          credit: '', 
          charge_department: '', 
          charge_person: '', 
          r_status: '', 
          risk_c_time: '', 
          risk_confirm: '', 
          risk_person: '', 
        }, 
        rules_temp: { 
        }, 
        rules: {}, 
        formLabelWidth: '120px', 
      } 
    }, 
    created() { this.init() }, 
    methods: { 
      async init(formDataS) { 
        switch (this.type) { 
          case 0: 
            this.readonly = false 
            this.rules = this.rules_temp 
            break; 
          case 2: 
            this.readonly = false 
            this.rules = this.rules_temp 
            break; 
          case 1: 
            this.readonly = true 
            this.rules = {} 
            break; 
        } 
        // this.uploadDeault = JSON.parse(JSON.stringify(this.upload)) 
        this.form.table_type = this.table_type 
        this.GetGroup() 
        // this.formdefalut = JSON.parse(JSON.stringify(this.form)) 
        if (this.formData) { 
          this.form = Object.assign(this.form, this.formData) 
        } 
        this.role_max = await this.$store.dispatch('user/getRoleMax') 
        if (this.role_max == 'super_admin') { 
          this.readonlyParentSelect = false 
          if (this.type == 2 && !(this.form.parent_id && this.form.parent_id > 0)) { 
            this.form.parent_id = this.current_org_id 
          } 
        } else { 
          await this.GetParentOrg() 
        } 
      }, 
      async GetGroup() {
         let list = [
           {	data: 'varchar', group_id: 1007 }, 
          {	data: 'varchar', group_id: 1008 }, 
          {	data: 'varchar', group_id: 1009 }, 
        ]; 
        await GetGroupDataEx(this, list); 
      }, 
      async GetParentOrg() { 
        let select_list = [ 
          { field: 'org_id', type: 3, level: 1},  
        ] 
        let form = { org_id: this.org_id } 
        let { data } = await this.QueryExec_fob(327, select_list, form) 
        if (!data) { 
          return -1 
        } 
        if (data.length == 0) { 
          return -1 
        } 
        this.form.parent_id = data[0].parent_id 
      }, 
      isReadOnly(text) { 
        if (this.readonly) { 
          return '' 
        } 
        return text 
      }, 
      close() { 
        let that = this 
        this.upload = JSON.parse(JSON.stringify(this.uploadDeault)) 
        this.form = this.$options.data().form 
        this.form = JSON.parse(JSON.stringify(this.formdefalut)); 
      }, 
      async QueryExec_fob_custom(list, form, sqlcode) { 
        return await this.QueryExec_fob(sqlcode, list, form) 
      }, 
      async save(callback) { 
        let that = this 
        async function submit() { 
          that.loading = true 
          that.loadingText = '提交表单中...' 
          let form = JSON.parse(JSON.stringify(that.form)); 
          let list = [ 
            { field: 'org_id', type: 3, level: 1}, 
            { field: 'risks', type: 3, level: 2}, 
            { field: 'risk_source', type: 3, level: 3}, 
            { field: 'risk_level', type: 3, level: 4}, 
            { field: 'credit', type: 3, level: 5}, 
            { field: 'charge_department', type: 3, level: 6}, 
            { field: 'charge_person', type: 3, level: 7}, 
            { field: 'r_status', type: 3, level: 8}, 
            { field: 'risk_c_time', type: 3, level: 9}, 
            { field: 'risk_confirm', type: 3, level: 10}, 
            { field: 'risk_person', type: 3, level: 11}, 
          ] 
          let fob = ''; 
          let sqlcode = -1; 
          let msg = '' 
          if (form.exId && form.exId > 0) { 
            sqlcode = 1 
            fob = that.QueryExec_fob_custom; 
            msg = '更新' 
          } else { 
            msg = '添加' 
            sqlcode = 1 
            fob = that.QueryExec_fob_custom; 
          } 
          const { code, influence, data } = await fob(list, that.form, sqlcode) 
          if (code != 200) { 
            that.$baseMessage(msg + '失败', 'error') 
            return false 
          } 
          if (!data || data.length == 0) { 
            that.$baseMessage(msg + '失败', 'error') 
            return 
          } 
          let json = JSON.parse(data[0].info) 
          if (json.code > 0) { 
            switch (json.code) { 
              case 1: 
                that.$baseMessage(json.msg, 'success') 
                that.close() 
                return true 
                break 
              case 2: 
                that.$baseMessage(json.msg, 'error') 
                break 
              case 3: 
                that.$baseMessage(json.msg, 'error') 
                break 
            } 
            return false 
          } else { 
            that.$baseMessage(json.msg, 'error') 
            return false 
          } 
        } 
        that.$refs['form'].validate((valid) => { 
          if (valid) { 
            that.$baseConfirm('确定提交？', null, async () => { 
              that.fileUpload(async function(status) { 
                if (status) { 
                  const flag = await submit() 
                  callback(flag) 
                } 
              }) 
            }) 
          } else { 
            return false 
          } 
        }) 
      }, 
    }, 
  } 
</script> 
