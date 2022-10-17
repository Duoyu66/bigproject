<template>
	<span class="purchasefrom">
    <el-form :model="form" :rules="rules" ref="form" v-loading="formloading">
      <el-form-item label="文件名称" prop="enclosure_name" :label-width="formLabelWidth">
      	<el-input v-model="form.enclosure_name" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="文件扫描件" prop="enclosure_file" :label-width="formLabelWidth">
        <contractimageupload ref="contract_filename" :tip_show="upload.tip_show"
          :upload_type="upload.upload_type.contract_filename"
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
          enclosure_type: '1',
          enclosure_name: '',
          enclosure_file: '',
          enclosure_date: ''
				},
        formloading: true,

        rules: {
          enclosure_name: [{ required: true, trigger: 'blur', message: '请输入文件名称' }],
        },
        span:12,
				formLabelWidth: '100px',
				title: '',
        upload: {
        	tip_show: false,
        	delte_service: false,
        	upload_type: {
        		contract_filename: 20,
        	},
        	type_str: 'jpg/pdf/png/jpeg',
        	type_array: ['image/jpeg', 'image/png', 'application/pdf'],
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
        this.form.contract_id=item.customer_id
        console.log(item)
        setTimeout(() => {
          this.formloading = false
        }, 500)
      },
      displayEdit(item) {
        this.formloading = true
        this.displaymanage = false
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
      save() {
        let that=this
      	that.$refs['form'].validate(async (valid) => {
      		if (valid) {
            that.fileUpload(async function(status) {
              let sData = '[Q]310{'+that.current_org+'$`'+that.form.enclosure_type+'$`'+that.form.enclosure_name+'$`'
              +that.form.enclosure_file+'$`'+that.form.contract_id+'$`'+that.form.enclosure_date+'}|^2|^SYS'
              console.log(sData)
              const res = await ExecSql(sData)
              if(res>0)
              {
                that.$baseMessage('文件扫描件上传成功', 'success')
                that.$refs['form'].resetFields()
                that.$emit('close_comp')
              }
              else
              {
                that.$baseMessage('文件扫描件上传失败', 'error')
              }
            })

          }
        })
      },
      // editsave() {
      //   let that=this
      // 	that.$refs['form'].validate(async (valid) => {
      // 		if (valid) {
      //       let sData = '[Q]217{'+that.form.contact_name+'$`'+that.form.duty+'$`'
      //       +that.form.mobile+'$`'+that.form.email+'$`'+that.form.QQ+'$`'+that.form.WeChat+'$`'
      //       +that.form.Responsible+'$`'+that.form.contact_id+'}|^1|^SYS'
      //       console.log(sData)
      //       const res = await ExecSql(sData)
      //       if(res>0)
      //       {
      //         that.$baseMessage('联系人修改成功', 'success')
      //         that.$refs['form'].clearValidate()
      //         that.$emit('close_comp')
      //       }
      //       else
      //       {
      //         that.$baseMessage('联系人修改失败', 'error')
      //       }
      //     }
      //   })
      // }
		},
	}
</script>
