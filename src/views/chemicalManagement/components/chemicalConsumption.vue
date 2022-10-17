<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-form ref="xiaohao_form" :model="form" :rules="rules">
      <div style="width: 100%">{{ inEditMode + JSON.stringify(form) }}</div>
      <el-form-item
        prop="person_id"
        label="使用人"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.person_id"
          maxlength="32"
          style="width: 250px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="volume" label="用量" :label-width="formLabelWidth">
        <el-input
          v-model="form.volume"
          type="number"
          step="0.001"
          min="0"
          style="width: 250px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="usage" label="消耗原因" :label-width="formLabelWidth">
        <el-input
          v-model="form.usage"
          maxlength="128"
          style="width: 250px"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="use_date"
        label="消耗日期"
        :label-width="formLabelWidth"
      >
        <el-date-picker
          v-model="form.use_date"
          style="width: 250px"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="记录人" :label-width="formLabelWidth">
        <el-input v-model="form.recorder" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item
        label="记录日期"
        prop="record_date"
        :label-width="formLabelWidth"
      >
        <el-date-picker
          v-model="form.record_date"
          style="width: 250px"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { insert_fob, update_fob } from '@/global/form.helper'
import { getToday } from '@/utils/dateHelp'
let g_this = null
let g_org_id
g_org_id = window.vue_vm.$store.getters['org/current_org']
if (g_org_id === undefined || g_org_id == -1) {
  g_org_id = window.vue_vm.$store.getters['user/org_id']
}
function yfdc(val) {
  if (val === undefined || val == null) return ''
  return val
}
let g_srows = false
export default {
  name: 'TableEdit',
  data() {
    const _this = this
    g_this = this
    return {
      g_srows,
      store_id: undefined,
      inEditMode: false,
      dialogFormVisible: false,
      form: {
        use_date: getToday(),
        record_date: getToday(),
        person_id: '',
        volume: 0,
        usage: '',
        recorder: '',
        store_id: undefined,
      },
      formLabelWidth: '120px',
      title: '',
      rules: {
        person_id: {
          required: true,
          message: '请输入使用人',
          trigger: ['blur', 'change'],
        },
        volume: {
          required: true,
          message: '请输入消耗数量',
          trigger: ['blur', 'change'],
        },
        use_date: {
          required: true,
          message: '请输入消耗时间',
          trigger: ['blur', 'change'],
        },
        record_date: {
          trigger: ['blur', 'change'],
          required: false,
          validator: (rule, value, callback) => {
            let ls = _this.form.use_date
            if (ls === undefined || ls == '' || ls === null) {
              callback()
              return rule
            }
            if (value === undefined || value === null || value == '') {
              callback()
              return rule
            }
            let a = new Date(ls)
            let b = new Date(value)
            if (a > b) {
              callback(new Error('记录日期不得早于消耗日期'))
            } else {
              callback()
            }
            return rule
          },
        },
      },
    }
  },
  watch: {
    dialogFormVisible() {
      const form = this.form
      const _this = this
      if (form.hasOwnProperty('consume_id')) {
        while (!this.inEditMode) this.inEditMode = true
      } else {
        while (this.inEditMode) this.inEditMode = false
      }
      if (!form.hasOwnProperty('use_date')) _this.form.use_date = getToday()
      if (!form.hasOwnProperty('record_date'))
        _this.form.record_date = getToday()
    },
  },
  created() {
    if (g_this !== this && this !== undefined) g_this = this
    const form = this.form
    if (form.hasOwnProperty('consume_id')) {
      while (!this.inEditMode) this.inEditMode = true
    } else {
      while (this.inEditMode) this.inEditMode = false
    }
  },
  methods: {
    save_add(store_id) {
      const _this = this
      const form = this.form
      let _list = [
        { field: 'org_id', level: 1 },
        { field: 'store_id', level: 2 },
        { field: 'person_id', level: 3 },
        { field: 'volume', level: 4 },
        { field: 'usage', level: 5 },
        { field: 'use_date', level: 6 },
        { field: 'recorder', level: 7 },
        { field: 'record_date', level: 8 },
      ]
      let _field = {
        org_id: g_org_id,
        store_id: store_id,
        person_id: yfdc(form.person_id),
        volume: yfdc(form.volume),
        usage: yfdc(form.usage),
        use_date: form.use_date,
        recorder: yfdc(form.recorder),
        record_date: form.record_date,
      }
      if (!store_id) {
        _this.$message({
          message: '请在左侧选择化学品',
          type: 'warning',
          showClose: true,
        })
      } else {
        insert_fob(_list, _field, 121)
          .then((res) => {
            console.log(res)
            if (res.code == 200) {
              _this.$message({
                message: '添加成功',
                type: 'success',
                showClose: true,
              })
            } else {
              _this.$message({
                message: '添加失败',
                type: 'error',
                showClose: true,
              })
            }
          })
          .catch(function () {})
      }
    },
    save_edit() {
      const _this = this
      const form = this.form
      let _list = [
        { field: 'consume_id', level: 1 },
        { field: 'person_id', level: 2 },
        { field: 'volume', level: 3 },
        { field: 'usage', level: 4 },
        { field: 'use_date', level: 5 },
        { field: 'recorder', level: 6 },
        { field: 'record_date', level: 7 },
      ]
      let _field = {
        consume_id: form.consume_id,
        person_id: yfdc(form.person_id),
        volume: yfdc(form.volume),
        usage: yfdc(form.usage),
        use_date: form.use_date,
        recorder: yfdc(form.recorder),
        record_date: form.record_date,
      }
      update_fob(_list, _field, 123)
        .then((res) => {
          if (res.code == 200) {
            _this.$message({
              message: '更新成功',
              type: 'success',
              showClose: true,
            })
          } else {
            _this.$message({
              message: res.error,
              type: 'error',
              showClose: true,
            })
          }
        })
        .catch(function () {})
    },
    validate(func /* (boolean)=>void|undefined */) {
      let g = this.$refs['xiaohao_form']
      if (g !== undefined && g.validate !== undefined) {
        if (func !== undefined && typeof func != 'undefined') {
          g.validate(func)
        }
        return { _call: g, _method: g.validate }
      } else {
        return null
      }
    },
    saveOrUpdate() {
      const _this = this
      const _form = this.form
      this.validate((valid) => {
        if (valid) {
          _this.$message({
            message: 'success',
            type: 'success',
            showClose: true,
          })
          if (!_this.inEditMode && _this.store_id !== undefined) {
            _this.save_add(_this.store_id)
          } else {
            _this.save_edit()
          }
          if (_this.g_srows) _this.$parent.fetchConsumeData(_this.g_srows)
          else alert(_this.g_srows)
          _this.dialogFormVisible = false
        } else {
          _this.$message({
            message: '请检查数据完整性',
            type: 'warning',
            showClose: true,
          })
        }
      })
    },
    showEdit(row, obj) {
      const _this = this
      const form = this.form
      this.form = {}
      if (row === false || row === undefined) {
        this.form = {
          use_date: getToday(),
          record_date: getToday(),
          person_id: '',
          volume: 0,
          usage: '',
          recorder: '',
        }
        this.title = '添加'
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
      }
      if (form.hasOwnProperty('consume_id')) {
        while (!this.inEditMode) this.inEditMode = true
      } else {
        while (this.inEditMode) this.inEditMode = false
      }
      if (!form.hasOwnProperty('use_date')) _this.form.use_date = getToday()
      if (!form.hasOwnProperty('record_date'))
        _this.form.record_date = getToday()
      if (obj !== undefined) {
        console.log(obj.store_id)
        this.store_id = obj.store_id
        this.g_srows = Object.assign({}, obj)
      }
      console.log(obj)
      this.title += '消耗溶液'
      this.dialogFormVisible = true
    },
  },
}
</script>
