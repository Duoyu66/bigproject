<template>
  <el-dialog :title='title' :visible.sync="dialogFormVisible" >
    <DictionaryForm ref="DictionaryForm" @close_comp="close_comp" ></DictionaryForm>
    <div slot="footer" class="test-footer">
      <el-button type="primary" @click="editsave()">
        继续
      </el-button>
      <el-button type="primary" @click="editsave1()">
        确定
      </el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
  import DictionaryForm from '../form/reportDictionaryForm.vue'
  export default {
    name: 'Dictionary',
    components: {
      DictionaryForm,
    },
    data() {
      return {
        dialogFormVisible: false,
        form: {
          name: '',
          region: 'beijing',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number:'',
          symbol: ''
        },
        Dictonary: {},
        title: '',
        formLabelWidth: '120px',
      }
    },
   created() {},
    methods: {
      showEdit(row,symbol) {
        if (!row) {
          this.title = '添加主字典'
        }
        else if(symbol==='0'){
          this.title = '添加参数指标'
          this.Dictonary = Object.assign({}, row)
          console.log(this.Dictonary)
          this.symbol=symbol
          setTimeout(()=>{
            this.$refs['DictionaryForm'].displayadd(this.Dictonary)
          },10)
        }
        else if(symbol==='1'){
          this.title = '修改参数指标'
          this.Dictonary = Object.assign({}, row)
          this.symbol=symbol
          console.log(this.Dictonary)
          setTimeout(()=>{
            this.$refs['DictionaryForm'].display(this.Dictonary)
          },10)
        }
        this.dialogFormVisible = true
      },
      editsave(){
        if(this.symbol==='0')
        {
          this.$refs['DictionaryForm'].save()
        }
        else{
          this.$refs['DictionaryForm'].editsave()
        }
      },
      close_comp(){
        this.$emit('fetchData',this.Dictonary)
        this.$emit('fetchDataChild',this.Dictonary)
        this.dialogFormVisible = false
      },
      editsave1(){
        if(this.symbol==='0')
        {
          this.$refs['DictionaryForm'].save('0')
        }
        else{
          this.$refs['DictionaryForm'].editsave()
        }
      },
    },
  }
</script>

<style>
  .test-footer {
  	width: 100%;
  	text-align: center;
  	display: flex;
  	justify-content: space-around;
  	align-items: center
  }

  .test-footer button {
  	width: 150px;
    margin-left: 25%-300px;
  }
</style>
