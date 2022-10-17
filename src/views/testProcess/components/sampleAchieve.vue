<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="60%">
    <sampleForm ref="sampleForm" @close_comp="close_comp"></sampleForm>
    <div slot="footer" class="dialog-footer dialog-footer-center-custom">
      <el-button type="primary" @click="editsave()">
        确 定
      </el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import sampleForm from '../searchForm/sampleForm.vue'

  export default {
    name: 'excelEdit',
    components: {
    	sampleForm,
    },
    props: {
      msg: String
    },
    data() {
      return {
        form: {
          title: '',
          textarea2: '',
        },
        selected: "",
        isMaskShow: false,
        title: '',
        dialogFormVisible: false,
        value: '',
        value1: '',
        sample: [],
        symbol : ''
      }

    },
    mounted() {
      // In some cases, you need to use $nextTick

    },
    methods: {
      showEdit(row,symbol) {
        if (!row) {
          this.title = '收样'
        } else if(symbol === '1') {
          this.title = '编辑样品'
          this.symbol = symbol 
          this.form = Object.assign({}, row)
        }
        else if(symbol === '2') {
          this.title = '收样'
          this.sample = Object.assign({}, row)
          this.symbol = symbol 
          setTimeout(()=>{
            this.$refs['sampleForm'].display(this.sample)
          },10)
        }
        this.dialogFormVisible=true
      },
      close_comp() {
        this.dialogFormVisible = false
      },
      editsave(val) {
        if(this.symbol === '2')
        {
          this.$refs['sampleForm'].save()
        }

      },

    }
  }
</script>

<style scoped>

</style>
