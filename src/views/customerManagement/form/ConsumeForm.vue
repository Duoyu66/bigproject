<template>
  <span class="purchasefrom">
    <el-form ref="form" :model="form" :rules="rules" style="margin-left: -50px">
      <el-form-item
        label="消费单位"
        prop="pay_org"
        :label-width="formLabelWidth"
      >
        <el-select v-model="form.pay_org" style="width: 100%">
          <el-option label="中铁十一局集团" value="中铁十一局集团"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="消费时间"
        prop="recharge_date"
        :label-width="formLabelWidth"
      >
        <el-date-picker
          style="width: 100%"
          v-model="form.recharge_date"
          type="datetime"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="委托试验"
        prop="test_name"
        :label-width="formLabelWidth"
      >
        <el-select v-model="form.test_name" style="width: 100%">
          <el-option label="水泥试验" value="水泥试验"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额" prop="amount" :label-width="formLabelWidth">
        <el-input v-model="form.amount" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item
        label="经手人"
        prop="operator"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.operator" style="width: 100%"></el-input>
      </el-form-item>
    </el-form>
  </span>
</template>
<script>
// import { doEdit } from '@/api/table'
export default {
  name: 'TableEdit4',

  inject: ['reload'],
  data() {
    let that = this
    return {
      form: {
        recharge_id: '',
        org_id: '',
        customer_id: '',
        contract_id: '',
        recharge_date: '',
        entrust_id: '',
        test_name: '',
        operator: '',
        time: '',
        pay_org: '',
        amount: '',
        // create_time: this.addDate(),
        // org_id: '',
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
    // addDate() {
    //   const nowDate = new Date();
    //   const date = {
    //     year: nowDate.getFullYear(),
    //     month: nowDate.getMonth() + 1,
    //     date: nowDate.getDate(),
    //   }
    //   const newmonth = date.month > 10 ? date.month : '0' + date.month
    //   const day = date.date > 10 ? date.date : '0' + date.date
    //   const time1 = date.year + '-' + newmonth + '-' + day
    //   return time1

    // },

    close() {
      //this.$refs['form'].resetFields()
      //this.form = this.$options.data().form
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
            field: "org_id",
            level: 1
          },
          {
            field: "customer_id",
            level: 2
          },
          {
            field: "contract_id",
            level: 3
          },
          {
            field: "recharge_date",
            level: 4
          },
          {
            field: "entrust_id",
            level: 5
          },
          {
            field: "test_name",
            level: 6
          },
          {
            field: "operator",
            level: 7
          },
          {
            field: "time",
            level: 8
          },
          {
            field: "pay_org",
            level: 9
          },
          {
            field: "amount",
            level: 10
          },

            // {
            //   field: "org_id",
            //   level: 12
            // },
          ]
          let fob = '';
          let sqlcode = -1;
          let msg = ''

          msg = '添加'
          sqlcode = 23
          fob = that.insert_fob;


          const {
            code,
            influence
          } = await fob(list, that.form, sqlcode)
          // console.log(that.form);
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
            that.reload()
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
