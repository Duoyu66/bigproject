<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <!-- <el-form :model="form4" style="margin-right: 15px"> -->
      <el-col :span="8">
        <el-form-item label="指标标识" :label-width="formLabelWidth">
          <el-input v-model="form.number1" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="属记录单" :label-width="formLabelWidth">
          <el-switch v-model="form.delivery" style="width: 100%"></el-switch>
        </el-form-item>
        <el-form-item label="自动采集" :label-width="formLabelWidth">
          <el-switch v-model="form.delivery1" style="width: 100%"></el-switch>
        </el-form-item>
        <el-form-item label="数据类型" :label-width="formLabelWidth">
          <el-select v-model="form.name" style="width: 100%">
            <el-option label="无" value="a"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="度量单位" :label-width="formLabelWidth">
          <el-select v-model="form.name3" style="width: 100%">
            <el-option label="未选择" value="a"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属组" :label-width="formLabelWidth">
          <el-select v-model="form.norms" style="width: 100%">
            <el-option label="试验A组" value="rygz"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="指标名称" :label-width="formLabelWidth">
          <el-input v-model="form.number2" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="属报告" :label-width="formLabelWidth">
          <el-switch v-model="form.delivery2" style="width: 100%"></el-switch>
        </el-form-item>
        <el-form-item label="自动计算" :label-width="formLabelWidth">
          <el-switch v-model="form.delivery3" style="width: 100%"></el-switch>
        </el-form-item>
        <el-form-item label="源于数据组" :label-width="formLabelWidth">
          <el-select v-model="form.name1" style="width: 100%">
            <el-option label="请选择源于数据组" value="a"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最大平行数" :label-width="formLabelWidth">
          <el-select v-model="form.name4" style="width: 100%">
            <el-option label="请输入" value="a"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实际样本数" :label-width="formLabelWidth">
          <el-input v-model="form.number7" style="width: 100%"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="数据项描述" :label-width="formLabelWidth">
          <el-select v-model="form.name7" style="width: 100%">
            <el-option label="请选择" value="a"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自动采集" :label-width="formLabelWidth">
          <el-switch v-model="form.delivery4" style="width: 100%"></el-switch>
        </el-form-item>
        <el-form-item label="指标项" :label-width="formLabelWidth">
          <el-switch v-model="form.delivery5" style="width: 100%"></el-switch>
        </el-form-item>
        <el-form-item label="输入方式" :label-width="formLabelWidth">
          <el-select v-model="form.name2" style="width: 100%">
            <el-option label="未选择" value="a"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实际平行数" :label-width="formLabelWidth">
          <el-select v-model="form.name5" style="width: 100%">
            <el-option label="请选择" value="a"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最大样本数" :label-width="formLabelWidth">
          <el-input v-model="form.number8" style="width: 100%"></el-input>
        </el-form-item>
      </el-col>
      <el-form-item
        label="指标描述"
        :label-width="formLabelWidth"
        style="width: 100%"
      >
        <el-input
          v-model="form.number3"
          style="width: 100%"
          type="textarea"
          placeholder="指标描述"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="平行数插件"
        :label-width="formLabelWidth"
        style="width: 100%"
      >
        <el-input
          v-model="form.number4"
          style="width: 100%"
          type="textarea"
          placeholder="请输入平行数插件公式"
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

  // inject: ['reload'],
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
      this.title += '试验指标'
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
