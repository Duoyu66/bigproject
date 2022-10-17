<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="1300px"
    @close="close"
    style="margin-top: -100px;"
  >
   <!-- <el-row>
      <el-col :span="24">

      </el-col>

    </el-row> -->
    <el-row>
      <el-col :span="16">
        <h1 style="margin: 0px;height: 40px; line-height: 40px;width:100%;background-color: #e8f0ff;">试验批准-水泥试验（任务编号-5501）</h1>
        <div
          id="reportsheet"
          style="margin:0px;padding:0px;height: 800px;"
        ></div>
      </el-col>
      <el-col :span="8">
        <el-form ref="form" :model="form" label-width="80px" style="margin-top: 20px;">
          <el-form-item label="委托时间" prop="author" style="margin-bottom: 5px;">
            <el-input v-model="input" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="受理时间" prop="author" style="margin-bottom: 5px;">
            <el-input v-model="input" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="试验时间" prop="author" style="margin-bottom: 5px;">
            <el-input v-model="input" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="复核时间" prop="author" style="margin-bottom: 5px;">
            <el-input v-model="input" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="批准人" prop="author" style="margin-bottom: 5px;">
            <el-select v-model="value" placeholder="请选择批准人" >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="批准意见" prop="author" style="margin-bottom: 5px;">
            <el-input
              type="textarea"
              :rows="25"
              placeholder="请输入内容"
              v-model="textarea">
            </el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="close" style="width: 100%; margin: 32px 0 0 0;">批 准</el-button>
        <el-button type="primary" @click="" style="width: 100%; margin: 5px 0 0 0;" >不批准</el-button>
        <el-button @click="close" style="width: 100%; margin: 5px 0 0 0;">取 消</el-button>
      </el-col>
    </el-row>


    <div v-show="isMaskShow" style="position: absolute;z-index: 10000000000;left: 0px;top: 0px;bottom: 0px;right: 0px; background: rgba(255, 255, 255, 0.8); text-align: center;font-size: 40px;align-items:center;justify-content: center;display:flex;">Downloading</div>
    <!-- <div slot="footer" class="dialog-footer">

    </div> -->
  </el-dialog>
</template>

<script>
import LuckyExcel from 'luckyexcel'
//导入库export.js 这个文件是es6的，不能在普通的HTML文件直接引入js文件（虽然都是js文件，但是有区别，具体请百度es6与es5）！需要把es6转es5才可以直接引入使用！
import {exportExcel} from '@/components/export/export.js'
import { getReport } from '@/api/table'

export default {
  name: 'excelEdit',
  props: {
    msg: String
  },
  data(){
    return {
      form: {
        title: '',
      },
      selected:"",
      isMaskShow: false,
      title: '',
      dialogFormVisible: false,
      data: [{"address":"11"}],
      options: [{
        value: '选项1',
        label: '张三'
      }, {
        value: '选项2',
        label: '李四'
      }],
      options1: [{
        value: '选项1',
        label: '含水率'
      }, {
        value: '选项2',
        label: '密度'
      }],
      value: '',
      value1: '',
      input: '2021-01-22 13:40:12',
      textarea:''
    }

  },
  mounted() {
    // In some cases, you need to use $nextTick

  },
  methods:{
    async showEdit(row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '试验批准'
        this.form = Object.assign({}, row)
      }
      const { data } = await getReport(this.title)
      console.log(data)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        $(function () {
          luckysheet.create({
            container: "reportsheet",
            showinfobar: false,
            showtoolbar: false,
            sheetFormulaBar: false,
            showstatisticBarConfig:{
              count: false, // 计数栏
              view: false, // 打印视图
              zoom: false, // 缩放
            },
            rowHeaderWidth: 0,
            columnHeaderHeight: 0,
            data: data,
          });
        });
      });
    },
    close() {
      this.dialogFormVisible = false
    },
    uploadExcel(evt){
        const files = evt.target.files;
        if(files==null || files.length==0){
            alert("No files wait for import");
            return;
        }

        let name = files[0].name;
        let suffixArr = name.split("."), suffix = suffixArr[suffixArr.length-1];
        if(suffix!="xlsx"){
            alert("Currently only supports the import of xlsx files");
            return;
        }
        LuckyExcel.transformExcelToLucky(files[0], function(exportJson, luckysheetfile){

            if(exportJson.sheets==null || exportJson.sheets.length==0){
                alert("Failed to read the content of the excel file, currently does not support xls files!");
                return;
            }
            luckysheet.destroy();

            luckysheet.create({
                container: 'luckysheet', //luckysheet is the container id
                showinfobar:false,
                data:exportJson.sheets,
                title:exportJson.info.name,
                userInfo:exportJson.info.name.creator
            });
        });
    },
    selectExcel(evt){
      const value = this.selected;
      const name = evt.target.options[evt.target.selectedIndex].innerText;

      if(value==""){
          return;
      }
      this.isMaskShow = true;

      LuckyExcel.transformExcelToLuckyByUrl(value, name, (exportJson, luckysheetfile) => {

        if(exportJson.sheets==null || exportJson.sheets.length==0){
          alert("Failed to read the content of the excel file, currently does not support xls files!");
          return;
        }

        this.isMaskShow = false;
        luckysheet.destroy();

        luckysheet.create({
          container: 'luckysheet', //luckysheet is the container id
          showinfobar:false,
          data:exportJson.sheets,
          title:exportJson.info.name,
          userInfo:exportJson.info.name.creator
        });
      });
    },
    downloadExcel(){
      // const value = this.selected;;
      //
      // if(value.length==0){
      //     alert("Please select a demo file");
      //     return;
      // }
      //
      // var elemIF = document.getElementById("Lucky-download-frame");
      // if(elemIF==null){
      //     elemIF = document.createElement("iframe");
      //     elemIF.style.display = "none";
      //     elemIF.id = "Lucky-download-frame";
      //     document.body.appendChild(elemIF);
      // }
      // elemIF.src = value;
      exportExcel(luckysheet.getAllSheets(),"下载")
      // testaaa();

    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.el-row {
    width: 100%;
}

</style>
