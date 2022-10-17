<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="物品名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" style="width: 100%"></el-input>
      </el-form-item>
      <!-- <el-form-item label="类型" :label-width="formLabelWidth">
        <el-select v-model="form.type" style="width: 100%">
          <el-option label="文件" value="a"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="快递单号" :label-width="formLabelWidth">
        <el-input v-model="form.track_id" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="发件人" :label-width="formLabelWidth">
        <el-input v-model="form.sender" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="收件人" :label-width="formLabelWidth">
        <el-input v-model="form.receiver" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="收件电话" :label-width="formLabelWidth">
        <el-input v-model="form.telephone" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="收件地址" :label-width="formLabelWidth">
        <el-input v-model="form.address" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="客户名称" :label-width="formLabelWidth">
        <el-input v-model="form.customer_id" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="金额" :label-width="formLabelWidth">
        <el-input v-model="form.money" style="width: 100%"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { doEdit } from '@/api/table'
export default {
  name: 'TableEdit7',

  inject: ['reload'],
  data() {
    let that = this
    return {
      form: {
        express_id: '',
        track_id: '',
        sender: '',
        receiver: '',
        telephone: '',
        address: '',
        customer_id: '',
        money: '',
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
      this.title += '快递'
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
            field: "track_id",
            level: 1
          },
          {
            field: "sender",
            level: 2
          },
          {
            field: "receiver",
            level: 3
          },
          {
            field: "telephone",
            level: 4
          },
          {
            field: "address",
            level: 5
          },
          {
            field: "customer_id",
            level: 6
          },
          {
            field: "money",
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
          if (data.express_id) { //更新
            sqlcode = 37
            fob = that.update_fob;
            msg = '更新'
            list.push({
              field: "express_id",
              level: 8
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
