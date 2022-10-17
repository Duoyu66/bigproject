<template>
  <el-dialog
    title="购入记录详情"
    :visible.sync="dialogFormVisible"
    width="480px"
  >
    <el-form :model="form">
      <el-form-item label="标准物质名称" :label-width="formLabelWidth">
        <el-select v-model="form.name" style="width: 250px">
          <el-option label="条目一" value="entry1"></el-option>
          <el-option label="条目二" value="entry2"></el-option>
          <el-option label="条目三" value="entry3"></el-option>
          <el-option label="条目四" value="entry4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标准物质规格" :label-width="formLabelWidth">
        <el-select v-model="form.name1" style="width: 250px">
          <el-option label="条目一" value="entry1"></el-option>
          <el-option label="条目二" value="entry2"></el-option>
          <el-option label="条目三" value="entry3"></el-option>
          <el-option label="条目四" value="entry4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标准物质数量" :label-width="formLabelWidth">
        <el-input v-model="form.name2" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="国家标准" :label-width="formLabelWidth">
        <el-input
          v-model="form.name3"
          style="width: 250px; margin-right: 5px"
        ></el-input>
      </el-form-item>
      <el-form-item label="批号" :label-width="formLabelWidth">
        <el-input
          v-model="form.name4"
          style="width: 250px; margin-right: 5px"
        ></el-input>
      </el-form-item>
      <el-form-item label="保证值" :label-width="formLabelWidth">
        <el-input v-model="form.name5" style="width: 120px"></el-input>
        <span>单位</span>
        <el-select v-model="form.name6" style="width: 100px">
          <el-option label="kg" value="xst"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采购日期" :label-width="formLabelWidth">
        <el-input
          v-model="form.name7"
          style="width: 250px; margin-right: 5px"
        ></el-input>
      </el-form-item>
      <el-form-item label="生产厂家" :label-width="formLabelWidth">
        <el-input
          v-model="form.name8"
          style="width: 250px; margin-right: 5px"
        ></el-input>
      </el-form-item>
      <el-form-item label="主要成分" :label-width="formLabelWidth">
        <el-input
          v-model="form.name9"
          style="width: 250px; margin-right: 5px"
        ></el-input>
      </el-form-item>
      <el-form-item label="采购价格" :label-width="formLabelWidth">
        <el-input
          v-model="form.name10"
          style="width: 250px; margin-right: 5px"
        ></el-input>
      </el-form-item>
      <el-form-item label="外观形状" :label-width="formLabelWidth">
        <el-input
          v-model="form.name11"
          style="width: 250px; margin-right: 5px"
        ></el-input>
      </el-form-item>
      <el-form-item label="购买人" :label-width="formLabelWidth">
        <el-input
          v-model="form.name12"
          style="width: 250px; margin-right: 5px"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="参数名称" :label-width="formLabelWidth">
        <el-select v-model="form.name1" style="width: 250px" :disabled="true">
          <el-option label="条目一" value="entry1"></el-option>
          <el-option label="条目二" value="entry2"></el-option>
          <el-option label="条目三" value="entry3"></el-option>
          <el-option label="条目四" value="entry4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="记录人" :label-width="formLabelWidth">
        <el-select v-model="form.norms1" style="width: 250px" :disabled="true">
          <el-option label="条目一" value="entry1"></el-option>
          <el-option label="条目二" value="entry2"></el-option>
          <el-option label="条目三" value="entry3"></el-option>
          <el-option label="条目四" value="entry4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="记录时间" :label-width="formLabelWidth">
        <el-input
          v-model="form.number2"
          style="width: 250px"
          :disabled="true"
        ></el-input>
      </el-form-item> -->
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
  import { doEdit } from '@/api/table'
  export default {
    name: 'ComprehensiveTable',
    components: {},
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger',
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        dialogFormVisible: false,
        form: {
          name: 'entry1',
          name1: 'entry2',
          name2: '12',
          name3: '测试标准',
          name4: '20210101',
          name5: '1000±10',
          name6: 'mg/L',
          name7: '2021-01-01',
          name8: '河北',
          name9: '铁',
          name10: '1000',
          name11: '形状',
          name12: '张三',
        },
        formLabelWidth: '120px',
      }
    },
    methods: {
      showEdit2(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
    },
  }
</script>
