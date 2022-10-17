<template>
  <span class="purchasefrom">
  <el-form ref="form" :model="form" :rules="rules">

    <el-row>
      <el-col :span="span">
        <el-form-item label="设备名称" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.name" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="型号" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.model" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="生产厂家" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.factory" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="生产日期" :label-width="formLabelWidth" prop="date" >
          <el-date-picker v-model="form.production_date" align="right" type="date" placeholder="选择日期" style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="启用日期" :label-width="formLabelWidth" prop="date" >
          <el-date-picker v-model="form.buy_date" align="right" type="date" placeholder="选择日期" style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="校准日期" :label-width="formLabelWidth" prop="date" >
          <el-date-picker v-model="form.last_adjust_date" align="right" type="date" placeholder="选择日期" style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="管理编号" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.manage_id" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="读数范围" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.show_scope" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="读数精度" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.resolution" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="金额" :label-width="formLabelWidth" prop="money" >
          <el-input v-model="form.amount" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="产品编码" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.product_no" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="证书编码" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.cert_id" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="校检周期" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.adjust_cycle" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="校检结果" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.adjust_result" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="备注" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.remark" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="设备等级" :label-width="formLabelWidth" prop="varchar" >
          <el-select v-model="form.level" :placeholder="isReadOnly('')" style="width:100%"></el-input>
            <el-option v-for="data in selectData.level" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="所属试验室" :label-width="formLabelWidth" prop="varchar" >
          <el-select v-model="form.belong_to" :placeholder="isReadOnly('')" style="width:100%"></el-input>
            <el-option v-for="data in selectData.belong_to" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="责任人" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.owner" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="购买机构" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.buy_agent" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="维护周期" :label-width="formLabelWidth" prop="int" >
          <el-input v-model="form.mt_interval" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="上次维护时间" :label-width="formLabelWidth" prop="datetime2" >
          <el-date-picker v-model="form.last_mt_date" align="right" type="date" placeholder="选择日期" style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="规格" :label-width="formLabelWidth" prop="varchar" >
          <el-input v-model="form.specification" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  </span>
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
    name: 'deviceLedgerForm',
    components: {

    },
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
        span: 12,
        readonly: false,
        formdefalut: {},
        selectData: { level: [], belong_to: [], out_org_status: [],},
        form: {
          org_id: '',
          name: '',
          model: '',
          factory: '',
          production_date: '',
          buy_date: '',
          last_adjust_date: '',
          manage_id: '',
          show_scope: '',
          resolution: '',
          amount: '',
          product_no: '',
          cert_id: '',
          adjust_cycle: '',
          adjust_result: '',
          remark: '',
          level: '',
          belong_to: '',
          owner: '',
          buy_agent: '',
          mt_interval: '',
          last_mt_date: '',
          specification: '',
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
        this.formdefalut = JSON.parse(JSON.stringify(this.form))
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
          {	data: 'level', group_id: 1004 },
          {	data: 'belong_to', group_id: 1005 },
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
            { field: 'name', type: 3, level: 2},
            { field: 'model', type: 3, level: 3},
            { field: 'factory', type: 3, level: 4},
            { field: 'production_date', type: 3, level: 5},
            { field: 'buy_date', type: 3, level: 6},
            { field: 'last_adjust_date', type: 3, level: 7},
            { field: 'manage_id', type: 3, level: 8},
            { field: 'show_scope', type: 3, level: 9},
            { field: 'resolution', type: 3, level: 10},
            { field: 'amount', type: 3, level: 11},
            { field: 'product_no', type: 3, level: 12},
            { field: 'cert_id', type: 3, level: 13},
            { field: 'adjust_cycle', type: 3, level: 14},
            { field: 'adjust_result', type: 3, level: 15},
            { field: 'remark', type: 3, level: 16},
            { field: 'level', type: 3, level: 17},
            { field: 'belong_to', type: 3, level: 18},
            { field: 'owner', type: 3, level: 19},
            { field: 'buy_agent', type: 3, level: 20},
            { field: 'mt_interval', type: 3, level: 21},
            { field: 'last_mt_date', type: 3, level: 22},
            { field: 'specification', type: 3, level: 23},
          ]
          let fob = '';
          let sqlcode = -1;
          let msg = ''
          if (form.device_id && form.device_id > 0) {
            sqlcode = 911
            fob = that.update_fob;
            list.push({ field: 'device_id', type: 3, level: 24})
            msg = '更新'
          } else {
            msg = '添加'
            sqlcode = 910
            fob = that.QueryExec_fob_custom;
          }

          const { code, influence, data } = await fob(list, that.form, sqlcode)
          console.log(code, influence, data)
          if (code != 200) {
            that.$baseMessage(msg + '失败', 'error')
            return false
          }
          if (!data || data.length == 0) {
            that.$baseMessage(msg + '失败', 'error')
            return
          }
          let res = data[0].Column1
          console.log(res)
          if (res > 0) {
            that.$baseMessage(msg + '成功', 'success')
            that.close()
            return true
          } else {
            that.$baseMessage(msg + '失败', 'error')
            return false
          }
        }
        that.$refs['form'].validate((valid) => {
          let that = this
          if (valid) {
            that.$baseConfirm('确定提交？', null, async () => {
              // that.fileUpload(async function(status) {
                // if (status) {
                  const flag = await submit()
                  callback(flag)
                // }
              // })
            })
          } else {
            return false
          }
        })
      },
    },
  }
</script>
