<!--
 * @Author: Mortar
 * @Date: 2021-03-02 09:51:14
 * @LastEditors: Mortar
 * @LastEditTime: 2021-03-02 14:09:42
 * @Description: 
 * @FilePath: \母体实验室\src\views\substanceCategory\components\substanceCategory.vue
-->
<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="450px">
    <el-form :model="form">
      <el-form-item label="编码" :label-width="formLabelWidth">
        <el-input
          v-model="form.mat_id"
          autocomplete="off"
          style="width: 250px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name" label="名称" :label-width="formLabelWidth">
        <el-input
          v-model="form.name"
          autocomplete="off"
          style="width: 250px"
        ></el-input>
      </el-form-item>

      <el-form-item prop="model" label="规格" :label-width="formLabelWidth">
        <el-input
          v-model="form.model"
          autocomplete="off"
          style="width: 250px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="unit" label="单位" :label-width="formLabelWidth">
        <el-select v-model="form.unit" style="width: 250px">
          <el-option label="g" value="g"></el-option>
          <el-option label="kg" value="kg"></el-option>
          <el-option label="ml" value="ml"></el-option>
          <el-option label="L" value="L"></el-option>
          <el-option label="mg" value="mg"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/table'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
  components: {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
        title: '',
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        code: '',
        name: '',
        region: 'g',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number: '',
        criterion: '',
        batch: '',
        guarantee: '',
      },
      title: '',
      formLabelWidth: '60px',
    }
  },

  methods: {
    showEdit(row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
      }
      this.title += '标准物质'
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
          let data = JSON.parse(JSON.stringify(that.form))
          let list = [
            {
              field: 'mat_id',
              level: 1,
            },
            {
              field: 'name',
              level: 2,
            },
            {
              field: 'model',
              level: 3,
            },
            {
              field: 'unit',
              level: 4,
            },
          ]
          let fob = ''
          let sqlcode = -1
          let msg = ''
          if (data.mat_id) {
            //更新
            sqlcode = 50
            fob = that.update_fob
            msg = '更新'
            // list.push({
            //   field: 'mat_id',
            //   level: 3,
            // })
          } else {
            //添加
            msg = '添加'
            sqlcode = 46
            fob = that.insert_fob
          }
          const { code, influence } = await fob(list, that.form, sqlcode)
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
