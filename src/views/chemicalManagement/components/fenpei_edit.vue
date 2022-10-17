<template>
  <!--kucun-edit-dialog-->
  <el-dialog title="修改化学品库存" :visible.sync="dialogFormVisible">
    <StockForm ref="StockForm" :father.sync="form"></StockForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleUpdate">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { update_fob } from '@/global/form.helper'
import StockForm from '../form/StockForm.vue'
export default {
  name: 'FenpeiEdit',
  components: {
    StockForm,
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px',
    }
  },
  created() {},
  methods: {
    update(a) {
      this.form = a //Object.assign({}, a)
    },
    handleUpdate() {
      let _list = [
        { field: 'store_id', type: 2, level: 1 },
        { field: 'manage_id', type: 2, level: 2 },
        { field: 'keeper', type: 2, level: 3 },
        { field: 'usage', type: 2, level: 4 },
        { field: 'storage_place', type: 2, level: 5 },
      ]
      let _update_field = {
        store_id: this.form.store_id,
        manage_id: this.form.manage_id,
        keeper: this.form.keeper,
        usage: this.form.usage,
        storage_place: this.form.storage_place,
      }
      update_fob(_list, _update_field, 67)
        .then((resp) => {
          console.log('resp', resp)
          console.log('update_field', _update_field)
          this.$parent.fetchData()
        })
        .catch((e) => {
          console.log(e)
        })
      this.dialogFormVisible = false
    },
    show(row) {
      this.dialogFormVisible = true
      if (row != false) {
        Object.assign(this.form, row)
        try {
          let a = this.$refs['StockForm']
          if (a !== undefined && a != null) a.updateFather(this.form)
        } catch (e) {
          console.log(e)
        }
      }
    },
  },
}
</script>
