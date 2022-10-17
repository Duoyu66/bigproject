<template>
  <el-dialog title="添加购入记录" :visible.sync="dialogFormVisible">
    <PurchaseForm ref="PurchaseForm" :father="ghost"></PurchaseForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
//import { doEdit } from '@/api/table'
import { search_fob } from '@/global/form.helper'
import { insert_fob, delete_fob } from '@/global/form.helper'
import setting from '@/config/setting.config'
function zcm_date(obj) {
  if (obj === undefined) return ''
  if (obj.getFullYear === undefined) {
    console.error('not a date')
    return ''
  }
  let mon = obj.getMonth() + 1
  let day = obj.getDate()
  if (mon <= 9) mon = '0' + mon
  if (day <= 9) day = '0' + day
  mon = String(mon)
  day = String(day)
  return String(obj.getFullYear()) + '-' + mon + '-' + day
}
function obj_value(obj, def) {
  return obj !== undefined ? obj : def
}
let g_this = false
let _ill_data = true
let g_org_id
import PurchaseForm from '../form/PurchaseForm.vue'
export default {
  name: 'ChemicalBuyAdd',
  components: {
    PurchaseForm,
  },
  data() {
    return {
      dialogFormVisible: false,
      ghost: {},
      ill_data: _ill_data,
    }
  },
  created() {
    g_this = this
    g_org_id = this.$store.getters['org/current_org']
    if (g_org_id == -1 || g_org_id == undefined)
      g_org_id = this.$store.getters['user/org_id']
  },
  methods: {
    submit() {
      const _this = this
      let form1 = this.ghost
      const { caller, method } = this.$refs['PurchaseForm'].validate()
      method.call(caller, (valid) => {
        if (valid === true) {
          /// TODO: save and submit
          let dateval = _this.$refs['PurchaseForm'].check_date_valid()
          if (!dateval.ck_1) {
            _this.$message({
              message: '有效日期不得早于购入日期',
              type: 'warning',
              showClose: true,
            })
            return
          }
          if (!dateval.ck_2) {
            _this.$message({
              message: '审批日期不得早于申请日期',
              type: 'warning',
              showClose: true,
            })
            return
          }
          let _list = [
            { field: 'org_id', type: 3, level: 1 },
            { field: 'store_id', type: 3, level: 2 },
            { field: 'buy_date', type: 3, level: 3 },
            { field: 'val_date', type: 3, level: 4 },
            { field: 'quantity', type: 3, level: 5 },
            { field: 'factory', type: 3, level: 6 },
            { field: 'price', type: 3, level: 7 },
            { field: 'element', type: 3, level: 8 },
            { field: 'shape', type: 3, level: 9 },
            { field: 'buyer', type: 3, level: 10 },
            { field: 'applicant', type: 3, level: 11 },
            { field: 'apply_date', type: 3, level: 12 },
            { field: 'approver', type: 3, level: 13 },
            { field: 'approve_date', type: 3, level: 14 },
            { field: 'conclusion', type: 3, level: 15 },
          ]
          let _field = {
            org_id: g_org_id,
            store_id: form1.store_id,
            buy_date: zcm_date(form1.buy_date),
            val_date: zcm_date(form1.val_date),
            quantity: form1.quantity !== undefined ? form1.quantity : 0,
            factory: form1.factory !== undefined ? form1.factory : '',
            price: form1.price !== undefined ? form1.price : 0,
            element: obj_value(form1.element, ''),
            shape: obj_value(form1.shape, ''),
            buyer: obj_value(form1.buyer, ''),
            applicicant: obj_value(form1.applicant, ''),
            apply_date: zcm_date(form1.apply_date),
            approver: obj_value(form1.approver, ''),
            approve_date: zcm_date(form1.approve_date),
            conclusion: obj_value(form1.conclusion, ''),
          }
          insert_fob(_list, _field, 104).then((res) => {
            if (res.code == 200) {
              _this.$message({
                message: '提交成功',
                type: 'success',
                showClose: true,
              })
              //_this.fetchData()
              _this.$parent.fetchBuyData(false)
            } else {
              _this.$message({
                message: '提交失败',
                type: 'error',
                showClose: true,
              })
            }
          })
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
    update(newghost) {
      this.ghost = newghost
      this.checkData()
      return 'success'
    },
    showBuy(row) {
      this.ghost = {
        name: row.name,
        store_id: row.store_id,
        inEditMode: true,
      }
      if (this.$refs['PurchaseForm']) {
        this.$refs['PurchaseForm'].setEditMode()
        this.$refs['PurchaseForm'].inEditMode = true
        this.$refs['PurchaseForm'].form = {}
        this.$refs['PurchaseForm'].form.name = row.name
        this.$refs['PurchaseForm'].form.store_id = row.store_id
      }
      this.dialogFormVisible = true
    },
    checkData() {
      if (g_this === false) return
      let ghost = g_this.ghost
      if (ghost.buy_date !== undefined && ghost.val_date !== undefined) {
        this.ill_data = ghost.buy_date > ghost.val_date
        console.log('购买日期<=有效期?:' + (ghost.buy_date <= ghost.val_date))
      }
      if (ghost.apply_date !== undefined && ghost.approve_date !== undefined) {
        this.ill_data = this.ill_data || ghost.apply_date > ghost.approve_date
        console.log(
          '申请日期<=审批日期?:' + (ghost.apply_date <= ghost.approve_date)
        )
      }
    },
  },
}
</script>
<style scoped></style>
