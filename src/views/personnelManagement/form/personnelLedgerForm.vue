<template>
  <span class="purchasefrom">
  <el-form ref="form" :model="form" :rules="rules">
    
    <el-row>
      <el-col :span="span">
        <el-form-item label="专业" :label-width="formLabelWidth" prop="major" >
          <el-input v-model="form.major" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name" >
          <el-input v-model="form.name" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex" >
          <el-select v-model="form.sex" :placeholder="isReadOnly('')" style="width:100%"></el-input>
            <el-option v-for="data in selectData.sex" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="出生年月" :label-width="formLabelWidth" prop="date" >
          <el-date-picker v-model="form.date" align="right" type="date" placeholder="选择日期" style="width: 100%" :format="yyyy-MM-dd" :value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="最高学历" :label-width="formLabelWidth" prop="education" >
          <el-select v-model="form.education" :placeholder="isReadOnly('')" style="width:100%"></el-input>
            <el-option v-for="data in selectData.education" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="毕业时间" :label-width="formLabelWidth" prop="graduate_date" >
          <el-date-picker v-model="form.graduate_date" align="right" type="date" placeholder="选择日期" style="width: 100%" :format="yyyy-MM-dd" :value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="毕业学校" :label-width="formLabelWidth" prop="last_school" >
          <el-input v-model="form.last_school" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="座机电话" :label-width="formLabelWidth" prop="telephone" >
          <el-input v-model="form.telephone" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="电子邮箱" :label-width="formLabelWidth" prop="email" >
          <el-input v-model="form.email" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile_phone" >
          <el-input v-model="form.mobile_phone" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="职称" :label-width="formLabelWidth" prop="tech_title" >
          <el-select v-model="form.tech_title" :placeholder="isReadOnly('')" style="width:100%"></el-input>
            <el-option v-for="data in selectData.tech_title" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="登录账户" :label-width="formLabelWidth" prop="user_name" >
          <el-input v-model="form.user_name" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password" >
          <el-input v-model="form.password" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="职务" :label-width="formLabelWidth" prop="duty" >
          <el-select v-model="form.duty" :placeholder="isReadOnly('')" style="width:100%"></el-input>
            <el-option v-for="data in selectData.duty" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="从业时间" :label-width="formLabelWidth" prop="start_date" >
          <el-date-picker v-model="form.start_date" align="right" type="date" placeholder="选择日期" style="width: 100%" :format="yyyy-MM-dd" :value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="身份证号" :label-width="formLabelWidth" prop="id_card" >
          <el-input v-model="form.id_card" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="是否是管理员" :label-width="formLabelWidth" prop="is_admin" >
          <el-select v-model="form.is_admin" :placeholder="isReadOnly('')" style="width:100%"></el-input>
            <el-option v-for="data in selectData.is_admin" :key="data.item_id" :label="data.item_name" :value="data.item_id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="归属" :label-width="formLabelWidth" prop="ownership" >
          <el-select v-model="form.ownership" :placeholder="isReadOnly('')" style="width:100%"></el-input>
            <el-option v-for="data in selectData.ownership" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="头像" :label-width="formLabelWidth" prop="head_pic" >
          <el-input v-model="form.head_pic" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="人员状态" :label-width="formLabelWidth" prop="state" >
          <el-select v-model="form.state" :placeholder="isReadOnly('')" style="width:100%"></el-input>
            <el-option v-for="data in selectData.state" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option>
          </el-select>
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
    name: 'personnelLedgerForm',
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
        selectData: { org_type: [], parent_id: [], out_org_status: [],},
        form: {
          major: '',
          name: '',
          sex: '',
          birthday: '',
          education: '',
          graduate_date: '',
          last_school: '',
          telephone: '',
          email: '',
          mobile_phone: '',
          org_id: '',
          tech_title: '',
          user_name: '',
          password: '',
          duty: '',
          start_date: '',
          id_card: '',
          is_admin: '',
          ownership: '',
          head_pic: '',
          state: '',
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
        this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
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
          {	data: 'sex', group_id: 1000 },
          {	data: 'education', group_id: 1001 },
          {	data: 'tech_title', group_id: 1002 },
          {	data: 'duty', group_id: 1003 },
          {	data: 'is_admin', group_id: 1000 },
          {	data: 'ownership', group_id: 1004 },
          {	data: 'state', group_id: 1005 }
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
            { field: 'major', type: 3, level: 1},
            { field: 'name', type: 3, level: 2},
            { field: 'sex', type: 3, level: 3},
            { field: 'birthday', type: 3, level: 4},
            { field: 'education', type: 3, level: 5},
            { field: 'graduate_date', type: 3, level: 6},
            { field: 'last_school', type: 3, level: 7},
            { field: 'telephone', type: 3, level: 8},
            { field: 'email', type: 3, level: 9},
            { field: 'mobile_phone', type: 3, level: 10},
            { field: 'org_id', type: 3, level: 11},
            { field: 'tech_title', type: 3, level: 13},
            { field: 'user_name', type: 3, level: 15},
            { field: 'password', type: 3, level: 16},
            { field: 'duty', type: 3, level: 17},
            { field: 'start_date', type: 3, level: 18},
            { field: 'id_card', type: 3, level: 19},
            { field: 'is_admin', type: 3, level: 20},
            { field: 'ownership', type: 3, level: 24},
            { field: 'head_pic', type: 3, level: 27},
            { field: 'state', type: 3, level: 28},
          ]
          let fob = '';
          let sqlcode = -1;
          let msg = ''
          if (form.exId && form.exId > 0) {
            sqlcode = 660
            fob = that.QueryExec_fob_custom;
            msg = '更新'
          } else {
            msg = '添加'
            sqlcode = 660
            fob = that.QueryExec_fob_custom;
          }
          that.form.org_id = that.current_org_id
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
      }
    }

  }
</script>
