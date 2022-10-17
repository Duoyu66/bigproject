<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="900px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <!-- <el-form :model="form4" style="margin-right: 15px"> -->
      <el-col :span="8">
        <el-form-item label="指标标识" :label-width="formLabelWidth">
          <el-input v-model="form.number1" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="属记录单" :label-width="formLabelWidth">
          <el-switch v-model="form.delivery"></el-switch>
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
        create_time: '',
        org_id: '',
        delivery: true
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
      this.title += '参数指标'
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

    },
  },

}
</script>
