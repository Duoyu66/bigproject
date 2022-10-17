<template>
  <span class="purchasefrom">
  <el-form ref="form" :model="form" :rules="rules">
    <el-row>
      <el-col :span="span">
        <el-form-item label="任务单号" :label-width="formLabelWidth" prop="task_no" >
          <el-input v-model="form.task_no" :placeholder="isReadOnly('')" style="width:100%" maxlength="64"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="项目名称" :label-width="formLabelWidth" prop="project_name" >
          <el-input v-model="form.project_name" :placeholder="isReadOnly('')" style="width:100%" maxlength="128"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="里程" :label-width="formLabelWidth" prop="mileage" >
          <el-input v-model="form.mileage" :placeholder="isReadOnly('')" style="width:100%" maxlength="255"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="桩号" :label-width="formLabelWidth" prop="stake_id" >
          <el-input v-model="form.stake_id" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="强度" :label-width="formLabelWidth" prop="strength" >
          <el-select v-model="form.strength" :placeholder="isReadOnly('')" style="width:100%"></el-input>
            <el-option v-for="data in selectData.strength" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="方量" :label-width="formLabelWidth" prop="volume" >
          <el-input v-model="form.volume" :placeholder="isReadOnly('')" style="width:100%" maxlength="18"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="拌合站名称" :label-width="formLabelWidth" prop="station_name" >
          <el-input v-model="form.station_name" :placeholder="isReadOnly('')" style="width:100%" maxlength="32"></el-input>
        </el-form-item>
      </el-col>
<!--      <el-col :span="span">
        <el-form-item label="开始时间" :label-width="formLabelWidth" prop="datetime" >
          <el-date-picker v-model="form.begin_time" align="right" type="date" placeholder="选择日期" style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-col> -->
      <el-col :span="span">
        <el-form-item label="申请人" :label-width="formLabelWidth" prop="applicant" >
          <el-input v-model="form.applicant" :placeholder="isReadOnly('')" style="width:100%" maxlength="4"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="申请时间" :label-width="formLabelWidth" prop="apply_time" >
          <el-date-picker v-model="form.apply_time" align="right" type="date" placeholder="选择日期" style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="塌落度" :label-width="formLabelWidth" prop="slump" >
          <el-input v-model="form.slump" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="目的地" :label-width="formLabelWidth" prop="destination" >
          <el-input v-model="form.destination" :placeholder="isReadOnly('')" style="width:100%" maxlength="64"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="操作员" :label-width="formLabelWidth" prop="operator" >
          <el-input v-model="form.operator" :placeholder="isReadOnly('')" style="width:100%" maxlength="8"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="操作时间" :label-width="formLabelWidth" prop="operate_time" >
          <el-date-picker v-model="form.operate_time" align="right" type="date" placeholder="选择日期" style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="计划方量" :label-width="formLabelWidth" prop="plan_volume" >
          <el-input v-model="form.plan_volume" :placeholder="isReadOnly('')" style="width:100%" maxlength="16"></el-input>
        </el-form-item>
      </el-col>
<!--      <el-col :span="span">
        <el-form-item label="强度" :label-width="formLabelWidth" prop="strength_memo" >
          <el-input v-model="form.strength_memo" :placeholder="isReadOnly('')" style="width:100%" maxlength="64"></el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="span">
        <el-form-item label="浇筑部位" :label-width="formLabelWidth" prop="pour_place" >
          <el-input v-model="form.pour_place" :placeholder="isReadOnly('')" style="width:100%" maxlength="64"></el-input>
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
    name: 'taskLedgerForm',
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
        selectData: { strength: [], parent_id: [], out_org_status: [],},
        form: {
          org_id: '',
          task_no: '',
          project_name: '',
          mileage: '',
          stake_id: '',
          strength: '',
          volume: '',
          station_name: '',
          begin_time: '',
          applicant: '',
          apply_time: '',
          slump: '',
          destination: '',
          operator: '',
          operate_time: '',
          action_id: '',
          plan_volume: '',
          strength_memo: '',
          pour_place: '',
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
           {	data: 'strength', group_id: 1005 },
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
        // this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
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
            { field: 'task_no', type: 3, level: 2},
            { field: 'project_name', type: 3, level: 3},
            { field: 'mileage', type: 3, level: 4},
            { field: 'stake_id', type: 3, level: 5},
            { field: 'strength', type: 3, level: 6},
            { field: 'volume', type: 3, level: 7},
            { field: 'station_name', type: 3, level: 8},
            { field: 'begin_time', type: 3, level: 9},
            { field: 'applicant', type: 3, level: 10},
            { field: 'apply_time', type: 3, level: 11},
            { field: 'slump', type: 3, level: 12},
            { field: 'destination', type: 3, level: 13},
            { field: 'operator', type: 3, level: 14},
            { field: 'operate_time', type: 3, level: 15},
            { field: 'action_id', type: 3, level: 16},
            { field: 'plan_volume', type: 3, level: 17},
            { field: 'strength_memo', type: 3, level: 18},
            { field: 'pour_place', type: 3, level: 19},
          ]
          let fob = '';
          let sqlcode = -1;
          let msg = ''
          if (form.task_id && form.task_id > 0) {
            sqlcode = 980
            fob = that.update_fob;
            list.push({ field: 'task_id', type: 3, level: 20})
            msg = '更新'
          } else {
            msg = '添加'
            sqlcode = 979
            list.push({ field: 'state', type: 3, level: 20})
            that.form.state='0'
            fob = that.QueryExec_fob_custom;
          }
          that.form.org_id=that.current_org_id
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
          if (valid) {
            that.$baseConfirm('确定提交？', null, async () => {
              // that.fileUpload(async function(status) {
              //   if (status) {
                  const flag = await submit()
                  callback(flag)
              //   }
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
