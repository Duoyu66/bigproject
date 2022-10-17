<template>
	<span class="purchasefrom">
    <el-form :model="form" :rules="rules" ref="form" v-loading="formloading">
      <el-form-item label="扫描件名称" :label-width="formLabelWidth" prop="enclosure_name">
      	<el-input v-model="form.enclosure_name" style="width: 100%;" placeholder="请输入文件名称"></el-input>
      </el-form-item>
      <el-form-item label="扫描件类型" :label-width="formLabelWidth" prop="enclosure_type">
        <el-select v-model="form.enclosure_type" style="width: 100%" filterable placeholder="请选择文件类型">
          <el-option
            v-for="item in type_options"
            :key="item.item_name"
            :label="item.item_name"
            :value="item.item_name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="扫描件日期" :label-width="formLabelWidth" prop="enclosure_date">
      	<el-date-picker
      	  v-model="form.enclosure_date"
      	  style="width: 100%;"
      	  type="date"
      	  placeholder="选择日期"
      	  format="yyyy 年 MM 月 dd 日"
      	  value-format="yyyy-MM-dd">
      	</el-date-picker>
      </el-form-item>
      <el-form-item label="扫描件文件" prop="valuation_account" :label-width="formLabelWidth">
        <contractimageupload ref="contract_filename" :tip_show="upload.tip_show" :number_multiple="number_multiple"
          :upload_type="upload.upload_type.contract_filename" :number_limit="number_limit"
          :original_name="upload.original_name.contract_filename" :type_str="upload.type_str"
          :type_array="upload.type_array" :success_status.sync="upload.success.contract_filename"
          v-model="form.enclosure_file" :delte_service="upload.delte_service"
          :old_delete.sync="upload.old_delete.contract_filename">
        </contractimageupload>
      </el-form-item>
    </el-form>
  </span>


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

  //合同扫描件
  import contractimageupload from '@/components/Upload/upload'

	export default {
		name: 'TableEdit',
    components: {
      contractimageupload
    },
		props: { //props列表
			father: {
				type: Object,
				required: false
			}
		},
    computed: {
    	...mapGetters({
    		current_org: 'org/current_org',
    	}),
    },
		data() {
			return {
				form: {
					valuation_name:'',
          valuation_account: '',
					valuation_money: '',
          valuation_date: '',
          contract_id: '',
          enclosure_type: '',
          enclosure_name: '',
          enclosure_file: '',
          enclosure_date: ''
				},
        number_limit: 10,
        formloading: true,
        number_multiple: true,
        type_options: [],
        rules: {
        },
        span:12,
				formLabelWidth: '100px',
				title: '',
        upload: {
        	tip_show: false,
        	delte_service: false,
        	upload_type: {
        		contract_filename: 12,
        	},
        	type_str: 'jpg/pdf/png/bmp/jpeg/xlsx/doc/docx',
        	type_array: ['image/jpeg', 'image/png','image/bmp', 'application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword'],
        	file_size: '4',
        	size_unit: 'MB',
        	original_name: {
        		contract_filename: {},
        	},
        	success: {
        		contract_filename: false,
        	},
        	old_delete: {
        		contract_filename: false,
        	}
        },
			}
		},
		created() {

		},
		methods: {
      display(item) {
        this.formloading = true
        this.displaymanage = false
        this.form.customer_name=item.name
        this.form.contract_id=item.contract_id
        this.fetchData()
        setTimeout(() => {
          this.formloading = false
        }, 500)
      },

      displayEdit(item) {
        this.formloading = true
        this.displaymanage = false
        this.fetchData()
        this.$refs['form'].clearValidate()
        this.form = item
        this.form.contact_name = item.name
        console.log(this.form.contact_name)
        setTimeout(() => {
          this.formloading = false
        }, 500)
      },
      fileUploadRefs() {
      	return ["contract_filename"
      	]
      },
      async fetchData() {
        let sData = '[Q]748{合同扫描件类型}|^SYS'
        const res = await QueryExec(sData)
        this.type_options=res.data
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
      				if (!that.upload.success[check_list[length]] && !that.$refs[check_list[length]].error) {
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
      			}
      		}, 500)
      	} catch (e) {
      		console.log(e)
      	}
      },
      async submitInsert(sData) {
        const res = await ExecSql(sData)
        if(res>0)
        {
          return 1;
        }
        else
        {
          return 0;
        }
      },
      save() {
        let that=this
      	that.$refs['form'].validate(async (valid) => {

      		if (valid) {
            that.fileUpload(async function(status) {
              let filename=that.form.enclosure_file.split(',');
              let re=0;
              for(let i=0;i<filename.length;i++)
              {
                let sData = '[Q]310{'+that.current_org+'$`'+that.form.enclosure_type+'$`'+that.form.enclosure_name+'$`'
                +filename[i]+'$`'+that.form.contract_id+'$`'+that.form.enclosure_date+'}|^2|^SYS'
                console.log(sData)
                re= re+await that.submitInsert(sData)

              }
              if(re==filename.length)
              {
                that.$baseMessage('全部扫描件上传成功', 'success')
                that.$refs['form'].resetFields()
                that.$emit('close_comp')
              }
              else if(re>0)
              {
                that.$baseMessage('部分扫描件上传成功,请查看列表,寻找未成功的扫描件', 'error')
                that.$refs['form'].resetFields()
                that.$emit('close_comp')
              }
              else {
                that.$baseMessage('全部扫描件上传失败', 'error')
              }
            })

          }
        })
      },
      editsave() {

      }
		},
	}
</script>
