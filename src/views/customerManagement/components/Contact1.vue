<template>
  <el-dialog title="修改联系记录" :visible.sync="dialogFormVisible">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="联系事由" :label-width="formLabelWidth">
        <el-input v-model="form.reason" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="结果" :label-width="formLabelWidth">
        <el-input v-model="form.result" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="联系人" :label-width="formLabelWidth">
        <el-input v-model="form.contact_id" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item label="日期" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.time"
          style="width: 100%"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="实施人" :label-width="formLabelWidth">
        <el-input v-model="form.user_id" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input
          v-model="form.remarks"
          style="width: 100%"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">
        确 定
      </el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { doEdit } from '@/api/table'
export default {
  name: 'TableEdit9',

  inject: ['reload'],
  data() {
    let that = this
    return {
      form: {
        reason: '',
        result: '',
        contact_id: '',
        time: '',
        user_id: '',
        remarks: '',
        contract_id: '',
        history_id: '',
        // time: '',
        // pay_org: '',
        // amount: '',
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
      formLabelWidth: '200px',
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
    showEdit(row, row1) {
      if (row == '0') {
        this.title = '添加'
        this.form.customer_id = row1.customer_id
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
        // console.log(11111111111);
        // console.log(this.form);
      }
      this.title += '联系记录'
      if (this.$refs['test']) {
        this.$refs['test'].GetData()
        // this.$refs['test'].sType = '1'
        // this.$refs['test'].sSqlCode = '8'
        // this.$refs['test'].oList = this.selectList('test')
      }
      this.dialogFormVisible = true
    },
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
            field: "reason",
            level: 1
          },
          {
            field: "result",
            level: 2
          },
          {
            field: "contact_id",
            level: 3
          },
          {
            field: "time",
            level: 4
          },
          {
            field: "user_id",
            level: 5
          },
          {
            field: "remarks",
            level: 6
          },
          {
            field: "contract_id",
            level: 7
          },
            // {
            //   field: "time",
            //   level: 8
            // },
            // {
            //   field: "pay_org",
            //   level: 9
            // },
            // {
            //   field: "amount",
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
          if (data.invoice_id) { //更新
            sqlcode = 42
            fob = that.update_fob;
            msg = '更新'
            list.push({
              field: "invoice_id",
              level: 7
            })
          } else { //添加
            msg = '添加'
            sqlcode = 23
            fob = that.insert_fob;

            // list.push({
            //   field: "create_time",
            //   level: 10
            // })
          }
          const {
            code,
            influence
          } = await fob(list, that.form, sqlcode)
          // console.log(that.form);
          if (code != 200) {
            that.$baseMessage(msg + '失败', 'error')
            return false
          }
          // console.log(influence);
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
