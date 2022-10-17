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
      <div  class="devides_btn">
        <el-button type="primary" @click="verify_confirm">确 定</el-button>
      <el-button @click="close">取 消</el-button>
      </div>

    </div>
  </el-dialog>
</template>

<script>
	import {
		doEdit,
    ExecSql,
    QueryExec
	} from '@/api/table'
  import {
  	mapActions,
  	mapGetters
  } from 'vuex'
  import certupload from '@/components/Upload/upload'
  import CalibrationFrom from '../form/CalibrationForm.vue'
  export default {
    name: 'TableEdit2',
    components: {
    	CalibrationFrom,
      certupload
    },
    data() {
      return {
        dialogFormVisible: false,
        form: {
          manage_pid: '',
          device_name: '',
          model: '',
          scope: '',
          precision: '',
          verify_date:'',
          verify_result:'',
          cert_situation: '',
          sender: '',
          verify_org: '',
          cert_id: '',
          certificate_image: '',
          device_id: '',
          metering_no: '',
          plan_id: '',
        },
        formLabelWidth: '120px',
        title: '',
        dialogFormVisible: false,
        upload: {
        	tip_show: false,
        	delte_service: false,
        	upload_type: {
            certificate_image: 11,
        	},
        	type_str: 'jpg/pdf/png/jpeg',
        	type_array: ['image/jpeg', 'image/png', 'application/pdf'],
        	file_size: '4',
        	size_unit: 'MB',
        	original_name: {
            certificate_image: {},
        	},
        	success: {
            certificate_image: false,
        	},
        	old_delete: {
            certificate_image: false,
        	},
          fill_data:{
            certificate_image:[],
          }
        },
      }
    },
    created() {},
    computed: {
    	...mapGetters({
    		current_org: 'org/current_org',
    	}),
    },
    methods: {
      fileUploadRefs() {
      	return ["certificate_image"
      	]
      },
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      fileUpload(callback) {
      	try {
      		let that = this
      		const refs = that.fileUploadRefs()
      		let check_list = []
      		const length = refs.length
      		that.loading = true
      		that.loadingText = '上传文件中'
      		for (let i = 0; i < length; i++) {
      			try {
      				if (that.$refs[refs[i]].submitUpload() === 1) {
      					check_list.push(refs[i]);
      				}
      			} catch (e) {
      				console.log(e)
      			}
      		}
      		let index = setInterval(function() {
      			let flag = true
      			let length = check_list.length
      			while (--length > -1) {
      				if (!that.upload.success[check_list[length]] && !that.$refs[check_list[length]]
      					.error) {
      					flag = false
      					break
      				}

      			}
      			if (flag) {
      				flag = true
      				length = check_list.length
      				while (--length > -1) {
      					if (that.$refs[check_list[length]].error) {
      						flag = false
      					}
      				}

      				clearInterval(index)
      				callback(flag)
      			} else {
      				that.$baseMessage('文件上传失败', 'error')
      			}
      		}, 500)
      	} catch (e) {
      		console.log(e)
      	}
      },
      close() {
      	const refs = this.fileUploadRefs()
      	const length = refs.length
      	let that = this
      	for (let i = 0; i < length; i++) {
      		try {
      			that.$refs[refs[i]].clear()
      		} catch (e) {
      			console.log(e)
      		}
      	}
      	that.$refs['form'].resetFields()
      	that.details = that.$options.data().details
        that.dialogFormVisible=false
      	//this.$emit('fetch-data')
      },
      verify_confirm() {
        let that=this;
        this.$refs['form'].validate(async (valid) => {
          that.fileUpload(async function(status) {

            if (valid) {
              let sData = '[Q]160{'+that.form.verify_date+'$`'+that.form.verify_org+'$`'
              +that.form.verify_result+'$`'+that.form.sender+'$`'+that.form.cert_id+'$`'+that.form.certificate_image+'$`'+that.form.cert_situation
              +'$`'+that.form.metering_no+'$`'+that.form.adjust_id+'}|^1|^SYS'
              const res = await ExecSql(sData)
              console.log(res)
              if(res>0)
              {
                that.$baseMessage('校检记录修改成功', 'success')
                that.$emit('CaliChoose',that.form)
                that.$emit('fetchDataChild')
                that.dialogFormVisible=false
              }
              else
              {
                that.$baseMessage('校检记录修改失败', 'error')
              }

            }
          })
        })
      }
    },
  }
</script>
