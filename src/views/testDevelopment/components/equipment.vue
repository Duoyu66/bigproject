<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <!-- <el-form :model="form4" style="margin-right: 15px"> -->
      <el-form-item
        label="管理编号"
        :label-width="formLabelWidth"
        style="margin-top: 10px"
      >
        <el-input
          v-model="form.input1"
          placeholder="请输入"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="设备名称"
        :label-width="formLabelWidth"
        style="margin-top: 10px"
      >
        <el-input
          v-model="form.input2"
          placeholder="请输入"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="设备类型"
        :label-width="formLabelWidth"
        style="margin-top: 10px"
      >
        <el-input
          v-model="form.input3"
          placeholder="请输入"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="测量范围"
        :label-width="formLabelWidth"
        style="margin-top: 10px"
      >
        <el-input
          v-model="form.input4"
          placeholder="请输入"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="精度"
        :label-width="formLabelWidth"
        style="margin-top: 10px"
      >
        <el-input
          v-model="form.input5"
          placeholder="请输入"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="设备类型描述"
        :label-width="formLabelWidth"
        style="margin-top: 10px"
      >
        <el-input
          v-model="form.input6"
          placeholder="请输入"
          style="width: 300px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button type="primary" @click="dialogFormVisible = false">确 认</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button> -->
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { doEdit } from '@/api/table'
export default {
  name: 'TableEdit',

  inject: ['reload'],
  data() {
    let that = this
    return {
      form: {
        customer_id: '',
        name: '',
        address: '',
        telphone: '',
        post_code: '',
        license_id: '',
        bank: '',
        account: '',
        status: '',
        sign_evel: '',
        license_image: '',
        create_time: this.addDate(),
        org_id: '',
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
    addDate() {
      const nowDate = new Date();
      const date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate(),
      }
      const newmonth = date.month > 10 ? date.month : '0' + date.month
      const day = date.date > 10 ? date.date : '0' + date.date
      const time1 = date.year + '-' + newmonth + '-' + day
      return time1

    },
    showEdit(row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
        // console.log(1111111111111);
        // console.log(this.form);
      }
      this.title += '设备使用'
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
            field: "name",
            level: 1
          },
          {
            field: "address",
            level: 2
          },
          {
            field: "telphone",
            level: 3
          },
          {
            field: "post_code",
            level: 4
          },
          {
            field: "license_id",
            level: 5
          },
          {
            field: "bank",
            level: 6
          },
          {
            field: "account",
            level: 7
          },
          {
            field: "status",
            level: 8
          },
          {
            field: "sign_evel",
            level: 9
          },
          // {
          //   field: "create_time",
          //   level: 10
          // },
          {
            field: "license_image",
            level: 11
          },

          {
            field: "org_id",
            level: 12
          },
          ]
          let fob = '';
          let sqlcode = -1;
          let msg = ''
          if (data.customer_id) { //更新
            sqlcode = 11
            fob = that.update_fob;
            msg = '更新'
            list.push({
              field: "customer_id",
              level: 13
            })
          } else { //添加
            msg = '添加'
            sqlcode = 10
            fob = that.insert_fob;

            list.push({
              field: "create_time",
              level: 10
            })
          }
          const {
            code,
            influence
          } = await fob(list, that.form, sqlcode)
          console.log(that.form);
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
          // const {
          // 	msg
          // } = await doEdit(this.form)
          // this.$baseMessage(msg, 'success')
          // this.$refs['form'].resetFields()
          // this.dialogFormVisible = false
          // this.$emit('fetch-data')
          // this.form = this.$options.data().form
        } else {
          return false
        }
      })
    },
  },

}
</script>
