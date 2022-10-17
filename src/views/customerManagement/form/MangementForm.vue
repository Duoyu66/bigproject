<template>
  <span class="purchasefrom">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="合同编号" :label-width="formLabelWidth">
        <el-input v-model="form.contract_no" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="合同名称" :label-width="formLabelWidth">
        <el-input v-model="form.title" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="客户名称" :label-width="formLabelWidth">
        <el-input v-model="form.customer_id" style="width: 100%"></el-input>
      </el-form-item>
      <!-- <el-form-item label="项目名称" :label-width="formLabelWidth">
        <el-input v-model="form.number3" style="width: 100%"></el-input>
      </el-form-item> -->
      <el-form-item label="签订日期" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.sign_date"
          style="width: 100%"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="模式" :label-width="formLabelWidth">
        <el-select v-model="form.name" style="width: 100%">
          <el-option label="计价" value="a"></el-option>
          <el-option label="固定" value="b"></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item label="选择合同类型" :label-width="formLabelWidth">
        <el-select v-model="form.type" style="width: 100%">
          <el-option label="服务合同" value="a"></el-option>
          <el-option label="委托合同" value="b"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同扫描复印件" :label-width="formLabelWidth">
        <el-input
          v-model="form.number8"
          style="width: calc(100% - 56px)"
        ></el-input>
        <el-button type="primary">上传</el-button>
      </el-form-item>
    </el-form>
  </span>
</template>

<script>
// import { doEdit } from '@/api/table'
export default {
  name: 'TableEdit3',

  // inject: ['reload'],
  data() {
    let that = this
    return {
      form: {
        contract_id: '',
        contract_no: '',
        title: '',
        customer_id: '',
        sign_date: '',
        type: '',

        org_id: '1',
        // date1: '',
        // date2: '',
        // delivery: false,
        // type: [],
        // resource: '',
        // desc: '',
        // number: '',
        // mill: '',
        // value1: ''
      },
      rules: {
        select: [{
          required: true,
          trigger: ["blur", "change"],
          message: '请选中'
        }

        ],
        name: [{
          required: true,
          trigger: 'blur',
          message: '请输入权限描述'
        }],


      },
      title: '',
      dialogFormVisible: false,
      formLabelWidth: '120px',
    }

  },

  created() { },
  methods: {

    close() {

      this.dialogFormVisible = false
      //this.$emit('fetch-data')
    },
    save() {
      let that = this
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          //console.log(that.form);
          let data = JSON.parse(JSON.stringify(that.form));
          // console.log(data);
          let list = [{
            field: "contract_no",
            level: 1
          },
          {
            field: "title",
            level: 2
          },
          {
            field: "customer_id",
            level: 3
          },
          {
            field: "sign_date",
            level: 4
          },
          {
            field: "type",
            level: 5
          },
          {
            field: "org_id",
            level: 6
          },
            // {
            //   field: "cheque_num",
            //   level: 6
            // },
            // {
            //   field: "operator",
            //   level: 7
            // },
            // {
            //   field: "time",
            //   level: 8
            // },
            // {
            //   field: "recharge_bank",
            //   level: 9
            // },
            // // {
            // //   field: "create_time",
            // //   level: 10
            // // },
            // {
            //   field: "recharge_account",
            //   level: 10
            // },

            // {
            //   field: "org_id",
            //   level: 12
            // },
          ]
          let fob = '';
          let sqlcode = -1;
          let msg = ''
          // if (data.recharge_id) { //更新
          //   sqlcode = 17
          //   fob = that.update_fob;
          //   msg = '更新'
          //   list.push({
          //     field: "recharge_id",
          //     level: 11
          //   })
          // } else { //添加
          msg = '添加'
          sqlcode = 40
          fob = that.insert_fob;

          // list.push({
          //   field: "create_time",
          //   level: 10
          // })
          // }
          const {
            code,
            influence
          } = await fob(list, that.form, sqlcode)
          // console.log(that.form);
          // console.log(influence);
          if (code != 200) {
            that.$baseMessage(msg + '失败', 'error')
            return false
          }
          if (influence > 0) {
            that.$baseMessage(msg + '成功', 'success')
            //that.$refs['form'].resetFields()
            that.dialogFormVisible = false
            //that.$emit('fetch-data')
            //that.form = that.$options.data().form
            //重载表格
            // that.reload()
          } else {
            that.$baseMessage(msg + '失败', 'error')
          }

        } else {
          return false
        }
      })
    },
  },


}
</script>