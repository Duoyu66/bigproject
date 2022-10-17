<template>
	<span class="purchasefrom">
    <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth" v-loading="formloading">
      <el-form-item label="规范名称" prop="doc_name" :label-width="formLabelWidth">
        <el-input v-model="form.doc_name" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="规范编号" prop="standard_id" :label-width="formLabelWidth">
        <el-input v-model="form.standard_id" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="发布单位" :label-width="formLabelWidth">
        <el-select v-model="form.release_org" style="width: 100%" filterable placeholder="请选择">
          <el-option
            v-for="item in release_org_options"
            :key="item.item_name"
            :label="item.item_name"
            :value="item.item_name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布日期" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.release_date"
          style="width: 100%;"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="实施日期" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.impl_date"
          style="width: 100%;"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="宣贯日期" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.prop_date"
          style="width: 100%;"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="启用日期" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.enable_date"
          style="width: 100%;"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="行业类型" :label-width="formLabelWidth">
        <el-select v-model="form.business_type" style="width: 100%;">
          <el-option label="国家标准" value="国家标准"></el-option>
          <el-option label="铁路" value="铁路"></el-option>
          <el-option label="公路" value="公路"></el-option>
          <el-option label="水运" value="水运"></el-option>
          <el-option label="建筑" value="建筑"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本号" :label-width="formLabelWidth">
        <el-input v-model="form.version" maxlength="16" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="规范文件" :label-width="formLabelWidth">
        <contractimageupload ref="pdf_file" :tip_show="upload.tip_show"
          :upload_type="upload.upload_type.pdf_file"
          :original_name="upload.original_name.pdf_file" :type_str="upload.type_str"
          :type_array="upload.type_array" :success_status.sync="upload.success.pdf_file"
          v-model="form.pdf_file" :delte_service="upload.delte_service"
          :old_delete.sync="upload.old_delete.pdf_file">
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
  import {
  	ViewfileUrl,
  	UploadFileNameUrl
  } from '@/utils/servicefile'
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
		data() {
			return {
				form: {
					manage_id:'',
          doc_name:'',
          standard_id:'',
          release_date:'',
          impl_date:'',
          prop_date:'',
          enable_date:'',
          business_type:'',
          version:'',
          pdf_file:'',
          release_org: '',
          std_id: '',
				},
        rules: {

        },
        formloading: true,
        release_org_options: [],
        upload: {
        	tip_show: false,
        	delte_service: false,
        	upload_type: {
        		pdf_file: 12,
        	},
        	type_str: 'jpg/pdf/png/jpeg',
        	type_array: ['image/jpeg', 'image/png', 'application/pdf'],
        	file_size: '4',
        	size_unit: 'MB',
        	original_name: {
        		pdf_file: {},
        	},
        	success: {
        		pdf_file: false,
        	},
        	old_delete: {
        		pdf_file: false,
        	}
        },
				formLabelWidth: '85px',
				title: '',
			}
		},
		created() {
			if (this.father) {
				this.form = Object.assign({}, this.father)
			}
      this.fetchData()
		},
		methods: {
      display(item) {
        this.selectloading = true
        this.displaycustomername = false
        this.form.customer_name=item.name
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      displayEdit(item) {
        this.selectloading = true
        this.displaycustomername = false
        this.form=item
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      fileUploadRefs() {
      	return ["pdf_file"
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
              let sData = '[Q]255{'+that.form.doc_name+'$`'+that.form.standard_id+'$`'+that.form.release_org+'$`'
              +that.form.release_date+'$`'+that.form.impl_date+'$`'+that.form.prop_date+'$`'+that.form.enable_date+'$`'
              +that.form.business_type+'$`'+that.form.version+'$`'+that.form.pdf_file+'}|^2|^SYS'
              console.log(sData)
              const res = await ExecSql(sData)
              if(res>0)
              {
                that.$baseMessage('标准添加成功', 'success')
                that.$refs['form'].resetFields()
                that.$emit('close_comp')
              }
              else
              {
                that.$baseMessage('标准添加失败', 'error')
              }
            })
          }
        })
      },
      editsave() {
        let that=this
      	that.$refs['form'].validate(async (valid) => {
      		if (valid) {
            that.fileUpload(async function(status) {
              let sData = '[Q]258{'+that.form.doc_name+'$`'+that.form.standard_id+'$`'+that.form.release_org+'$`'
              +that.form.release_date+'$`'+that.form.impl_date+'$`'+that.form.prop_date+'$`'+that.form.enable_date+'$`'
              +that.form.business_type+'$`'+that.form.version+'$`'+that.form.pdf_file+'$`'+that.form.std_id+'}|^1|^SYS'
              console.log(sData)
              const res = await ExecSql(sData)
              if(res>0)
              {
                that.$baseMessage('标准修改成功', 'success')
                that.$refs['form'].resetFields()
                that.$emit('close_comp')
              }
              else
              {
                that.$baseMessage('标准修改失败', 'error')
              }
            })
          }
        })
      },
      async fetchData() {
        this.formloading=true
        let sData = '[Q]550{发布单位}|^SYS'
        const res = await QueryExec(sData)
        console.log(res)
        this.release_org_options=res.data

        setTimeout(() => {
          this.formloading = false
        }, 500)
      }
		},
	}
</script>
