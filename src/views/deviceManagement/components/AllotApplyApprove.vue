<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <span class="purchasefrom">
       <el-form :model="form" ref="form">
         <el-form-item label="管理编号" :label-width="formLabelWidth">
           <el-input v-model="form.manage_pid" style="width: 100%" maxlength="16" disabled></el-input>
         </el-form-item>
         <el-form-item label="设备名称" :label-width="formLabelWidth">
          	<el-input v-model="form.device_name" style="width: 100%" maxlength="16" disabled></el-input>
         </el-form-item>
         <el-form-item label="规格型号" :label-width="formLabelWidth">
          	<el-input v-model="form.model" style="width: 100%" maxlength="16" disabled></el-input>
         </el-form-item>
         <el-form-item label="测量范围" :label-width="formLabelWidth">
          	<el-input v-model="form.scope" style="width: 100%;" maxlength="16" disabled></el-input>
         </el-form-item>
         <el-form-item label="精度" :label-width="formLabelWidth">
          	<el-input v-model="form.precision" style="width: 100%" maxlength="16" disabled></el-input>
         </el-form-item>
         <el-form-item label="计量号" :label-width="formLabelWidth">
          	<el-input v-model="form.metering_no" style="width: 100%;"></el-input>
         </el-form-item>
         <el-form-item label="校检日期" :label-width="formLabelWidth">
         	<el-date-picker
         	  v-model="form.verify_date"
             style="width: 100%;"
         	  type="date"
         	  placeholder="选择日期"
             format="yyyy 年 MM 月 dd 日"
             value-format="yyyy-MM-dd">
         	</el-date-picker>
         </el-form-item>
         <el-form-item label="校检结果" :label-width="formLabelWidth">
         	<el-select v-model="form.verify_result" style="width: 100%;">
         		<el-option label="合格" value="合格"></el-option>
             <el-option label="不合格" value="不合格"></el-option>
         	</el-select>
         </el-form-item>
         <el-form-item label="证书确认情况" :label-width="formLabelWidth">
         	<el-select v-model="form.cert_situation" style="width: 100%">
         		<el-option label="符合要求" value="符合要求"></el-option>
             <el-option label="不符合要求" value="不符合要求"></el-option>
         	</el-select>
         </el-form-item>
         <el-form-item label="送检人" :label-width="formLabelWidth">
          	<el-input v-model="form.sender" style="width: 100%;"></el-input>
         </el-form-item>
         <el-form-item label="执行单位" :label-width="formLabelWidth">
          	<el-input v-model="form.verify_org" style="width: 100%;"></el-input>
         </el-form-item>
         <el-form-item label="证书编号" :label-width="formLabelWidth">
          	<el-input v-model="form.cert_id" style="width: 100%;"></el-input>
         </el-form-item>
         <el-form-item label="证书扫描件" :label-width="formLabelWidth">
          	<certupload ref="certificate_image" :tip_show="upload.tip_show"
          		:upload_type="upload.upload_type.certificate_image" :original_name_json="upload.original_name.certificate_image"
          		:type_str="upload.type_str" :type_array="upload.type_array"
          		:success_status.sync="upload.success.certificate_image" v-model="form.certificate_image"
          		:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.certificate_image">
          	</certupload>
         </el-form-item>
    
        </el-form>
       </span>
    

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="AcceptanceFromAdd">
        确 定
      </el-button>
      <el-button @click="close_comp">拒 绝</el-button>
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
      this.dialogFormVisible = false
    }
  },
}
</script>
