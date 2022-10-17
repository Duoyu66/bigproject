<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="1000px"
    @close="close"
  >
    <el-row :gutter="5">
      <el-col :span="16">
        <h1 style="margin: 0px;height: 40px; line-height: 40px;width:100%;background-color: #e8f0ff;">含水率参数</h1>
        <div
          id="luckysheet"
          style="margin:0px;padding:0px;height: 600px;"
        ></div>
      </el-col>
      <el-col :span="8">
        <el-table :data="data" border style="width: 100%;height: 320px;">
          <el-table-column property="address" label="试验项目"></el-table-column>
          <el-table-column property="address" label="价格"></el-table-column>
        </el-table>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="检测室" prop="title">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="试验员" prop="author">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="意见" prop="author">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="原因" prop="author">
            <el-input   type="textarea" :rows="6" placeholder="请输入内容" v-model="textarea2"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <div v-show="isMaskShow" style="position: absolute;z-index: 10000000000;left: 0px;top: 0px;bottom: 0px;right: 0px; background: rgba(255, 255, 255, 0.8); text-align: center;font-size: 40px;align-items:center;justify-content: center;display:flex;">Downloading</div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import LuckyExcel from 'luckyexcel'
//导入库export.js 这个文件是es6的，不能在普通的HTML文件直接引入js文件（虽然都是js文件，但是有区别，具体请百度es6与es5）！需要把es6转es5才可以直接引入使用！
import {exportExcel} from '@/components/export/export.js'
import { getExcel } from '@/api/table'

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
        label: '通过'
      }, {
        value: '选项2',
        label: '否决'
      }],
      value: ''
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
        this.title = '受理并分派任务'
        this.form = Object.assign({}, row)
      }
      const { data } = await getExcel(this.title)
      console.log(data)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        $(function () {
          luckysheet.create({
            container: "luckysheet",
            showinfobar: false,
            showtoolbar: false,
            sheetFormulaBar: false,
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



</style>
