<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="客户名称" prop="name" :label-width="formLabelWidth">
        <el-input v-model="form.name" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item
        label="客户住址"
        prop="address"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.address" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item
        label="客户邮编"
        prop="post_code"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.post_code" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="开户银行" prop="bank" :label-width="formLabelWidth">
        <el-select v-model="form.bank" style="width: 100%">
          <el-option label="中国建设银行" value="中国建设银行"></el-option>
          <el-option label="中国农业银行" value="中国农业银行"></el-option>
          <el-option label="中国工商银行" value="中国工商银行"></el-option>
          <el-option label="中国银行" value="中国银行"></el-option>
          <el-option label="招商银行" value="招商银行"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="银行账号"
        prop="account"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.account" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item
        label="信用代号"
        prop="license_id"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.license_id" style="width: 100%"></el-input>
      </el-form-item>
      <!-- <el-form-item label="联系人" prop="number6" :label-width="formLabelWidth">
        <el-input v-model="form.number6" style="width: 100%"></el-input>
      </el-form-item> -->
      <el-form-item
        label="联系电话"
        prop="telphone"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.telphone" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item
        label="客户状态"
        prop="status"
        :label-width="formLabelWidth"
      >
        <el-select v-model="form.status" style="width: 100%">
          <el-option label="在线" value="0"></el-option>
          <el-option label="不在线" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="客户级别"
        prop="sign_evel"
        :label-width="formLabelWidth"
      >
        <el-select v-model="form.sign_evel" style="width: 100%">
          <el-option label="签约" value="签约"></el-option>
          <el-option label="临时" value="临时"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="营业执照复印件"
        prop="license_image"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.license_image"
          style="width: calc(100% - 56px)"
        ></el-input>
        <el-button type="primary">上传</el-button>
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

        // name: [{
        // 	required: true,
        // 	trigger: 'blur',
        // 	message: '请输入客户名称'
        // },
        //  {
        // 	trigger: 'blur',
        // 	validator: async function(rule, value, callback) {
        // 		let form = JSON.parse(JSON.stringify(that.form))
        // 		let list = [{
        // 			field: "name",
        // 			type: 3,
        // 			level: 1
        // 		}, {
        // 			field: "type_id",
        // 			type: 3,
        // 			level: 2
        // 		}];
        // 		form.name = value
        // 		const {
        // 			code,
        // 			data
        // 		} = await that.QueryExec_fob(3, list, form);
        // 		if (code == 200) {
        // 			if (data && data.length > 0) {
        // 				callback(new Error('已存在该权限类型名称'));
        // 			} else {
        // 				callback();
        // 			}
        // 		} else {
        // 			callback(new Error('查询数据库异常'));
        // 		}
        // 	}
        // }], //pattern
        // desc: [{
        // 	required: false,
        // 	trigger: 'blur',
        // 	message: '请输入权限描述'
        // }],
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
      this.title += '客户'
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

  //   data() {
  //     return {
  //       dialogFormVisible: false,
  //      form: {
  //        name: '',
  //        region: '',
  //        date1: '',
  //        date2: '',
  //        delivery: false,
  //        type: [],
  //        resource: '',
  //        desc: '',
  //        number:'',
  //        degree:'a',
  //        degree1:'a',
  //        type1:'b',
  //        organization:"a",
  //        organization1:"a",
  //        organization2:"a"
  //      },
  //      formLabelWidth: '120px',
  //       title: '',
  //       dialogFormVisible: false,
  //     }
  //   },
  //  created() {},
  //    methods: {
  //      showEdit(row) {
  //        if (!row) {
  //          this.title = '添加'
  //        } else {
  //          this.title = '编辑'
  //          this.form = Object.assign({}, row)
  //        }
  //        this.dialogFormVisible = true
  //      },
  //    },
}
</script>
