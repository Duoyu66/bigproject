<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    height="400px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" height="400px">
      <el-form-item label="标准物质名称" :label-width="formLabelWidth">
        <el-select v-model="form.name" style="width: 250px">
          <el-option label="123" value="xst"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标准物质规格" :label-width="formLabelWidth">
        <el-select v-model="form.norms" style="width: 250px">
          <el-option label="123" value="rygz"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标准物质数量" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="国家标准" :label-width="formLabelWidth">
        <el-input v-model="form.criterion" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="批号" :label-width="formLabelWidth">
        <el-input v-model="form.batch" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="保证值" :label-width="formLabelWidth">
        <el-input v-model="form.guarantee" style="width: 120px"></el-input>
        <span>单位</span>
        <el-select v-model="form.name" style="width: 100px">
          <el-option label="kg" value="xst"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采购日期" :label-width="formLabelWidth">
        <el-input v-model="form.number1" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="生产厂家" :label-width="formLabelWidth">
        <el-input v-model="form.number2" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="主要成分" :label-width="formLabelWidth">
        <el-input v-model="form.number3" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="采购价格" :label-width="formLabelWidth">
        <el-input v-model="form.number4" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="外观形状" :label-width="formLabelWidth">
        <el-input v-model="form.number5" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="购买人" :label-width="formLabelWidth">
        <el-select v-model="form.number6" style="width: 250px">
          <el-option label="123" value="xst"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合格证图片" :label-width="formLabelWidth">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
          :limit="1"
          :file-list="fileList1"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="材质单扫描" :label-width="formLabelWidth">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
          :limit="1"
          :file-list="fileList2"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
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
      fileList1: [],
      fileList2: [],
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
      this.title += '采购'
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

        } else {
          return false
        }
      })
    },
  },

}
</script>
