<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <AcceptanceFrom ref="AcceptanceFrom" @close_comp="close_comp"></AcceptanceFrom>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="AcceptanceFromAdd">
        确 定
      </el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/table'
import AcceptanceFrom from '../form/equipmentAcceptance.vue'
export default {
  name: 'AcceptanceComponent',
  components: {
    AcceptanceFrom,
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: 'xst',
        norms: 'rygz',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number: ''
      },
      formLabelWidth: '120px',
      title: '',
      dialogFormVisible: false,
    }
  },
  created() { },
  methods: {
    showEdit(row) {
      if (!row) {
        this.title = '添加验收记录'
      } else {
        this.title = '编辑验收记录'
        setTimeout(()=>{
          this.$refs['AcceptanceFrom'].display(Object.assign({}, row))
        },10)
      }
      this.dialogFormVisible = true
    },
    AcceptanceFromAdd() {
      this.$refs['AcceptanceFrom'].save();
    },
    close_comp(){
      this.$emit('fetchDataChild')
      this.dialogFormVisible = false
    }
  },
}
</script>
