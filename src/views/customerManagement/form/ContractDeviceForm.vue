<template>
	<span class="purchasefrom">
      <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth" v-loading="selectloading">
        <el-row class="" style="margin-top: 5px">
        <el-col :span="span" >
          	<el-form-item :label="customer_label" prop="customer_name">
          		<el-select v-model="form.customer_name" v-if='displaycustomername' style="width: 100%" filterable placeholder="请选择委托单位">
          		  <el-option
          		    v-for="item in customer_name_options"
          		    :key="item.customer_id"
          		    :label="item.customer_name"
          		    :value="item.customer_id">
          		  </el-option>
          		</el-select>
          		<el-input v-model="form.customer_name" v-else-if='displaycontract' style="width: 100%" maxlength="20" disabled></el-input>
              <el-input v-model="form.parent_name" v-else style="width: 100%" maxlength="20" disabled></el-input>
          	</el-form-item>
          </el-col>
<!-- 		  <el-col :span="span">
		  	<el-form-item label="委托单位">
		  		<el-input v-model="form.org_entrust" style="width: 100%" maxlength="16"></el-input>
		  	</el-form-item>
		  </el-col> -->
<!-- 		  <el-col :span="span">
		  	<el-form-item label="工程名称" prop="project_name">
		  		<el-input v-model="form.project_name" style="width: 100%" maxlength="20"></el-input>
		  	</el-form-item>
		  </el-col>
		  <el-col :span="span">
		  	<el-form-item label="承揽单编号" prop="projectcontract_no">
		  		<el-input v-model="form.projectcontract_no" style="width: 100%" maxlength="20"></el-input>
		  	</el-form-item>
		  </el-col> -->


        	<el-col :span="span">
        		<el-form-item label="合同编号" prop="contract_no">
        			<el-input v-model="form.contract_no" style="width: 100%" maxlength="20"></el-input>
        		</el-form-item>
        	</el-col>
<!--       	<el-col :span="span">
        		<el-form-item label="合同编号年度" prop="contract_year">
        			<el-input v-model="form.contract_year" style="width: 100%" maxlength="20"></el-input>
        		</el-form-item>
        	</el-col> -->
        	<el-col :span="span">
        		<el-form-item label="合同名称" prop="contract_name">
        			<el-input v-model="form.contract_name" style="width: 100%" maxlength="20"></el-input>
        		</el-form-item>
        	</el-col>
          <el-col :span="span">
            <el-form-item label="采购总金额" prop="contract_money">
              <el-input v-model="form.contract_money" style="width: 100%" maxlength="16"></el-input>
            </el-form-item>
          </el-col>
<!--        	<el-col :span="span">
        		<el-form-item label="合同性质" prop="department">
        			<el-select v-model="form.contract_nature" style="width: 100%" filterable placeholder="请选择">
        			  <el-option
        			    v-for="item in contract_nature_options"
        			    :key="item.item_name"
        			    :label="item.item_name"
        			    :value="item.item_name">
        			  </el-option>
        			</el-select>
        		</el-form-item>
        	</el-col> -->
			<el-col :span="span">
				<el-form-item label="合同签订日期" prop="contract_signdate">
					<el-date-picker
					  v-model="form.contract_signdate"
					  style="width: 100%;"
					  type="date"
					  placeholder="选择日期"
					  format="yyyy 年 MM 月 dd 日"
					  value-format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="合同返回日期" prop="contract_return">
					<el-date-picker
					  v-model="form.contract_return"
					  style="width: 100%;"
					  type="date"
					  placeholder="选择日期"
					  format="yyyy 年 MM 月 dd 日"
					  value-format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
			</el-col>
<!-- 			<el-col :span="span">
				<el-form-item label="所属部门" prop="sponsor_org">
					<el-select v-model="form.sponsor_org" style="width: 100%" filterable placeholder="请选择">
					  <el-option
					    v-for="item in sponsor_org_options"
					    :key="item.item_name"
					    :label="item.item_name"
					    :value="item.item_name">
					  </el-option>
					</el-select>
				</el-form-item>
			</el-col> -->
			<el-col :span="span">
				<el-form-item label="交货截止日期" prop="contract_start">
					<el-date-picker
					  v-model="form.contract_start"
					  style="width: 100%;"
					  type="date"
					  placeholder="选择日期"
					  format="yyyy 年 MM 月 dd 日"
					  value-format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
			</el-col>
<!-- 			<el-col :span="span">
				<el-form-item label="执行期限(终)" prop="contract_end">
					<el-date-picker
					  v-model="form.contract_end"
					  style="width: 100%;"
					  type="date"
					  placeholder="选择日期"
					  format="yyyy 年 MM 月 dd 日"
					  value-format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
			</el-col> -->
<!--        	<el-col :span="span">
        		<el-form-item label="执行期限" prop="contract_period">
        			<el-input v-model="form.contract_period" style="width: 100%" maxlength="16"></el-input>
        		</el-form-item>
        	</el-col> -->
<!--          <el-col :span="span">
          	<el-form-item label="行政区划" prop="administrative">
          		<el-input v-model="form.administrative" style="width: 100%" maxlength="16"></el-input>
          	</el-form-item>
          </el-col> -->
          <el-col :span="span">
            <el-form-item label="经办人" prop="operator_people">
              <el-input v-model="form.operator_people" style="width: 100%" maxlength="8"></el-input>
            </el-form-item>
          </el-col>
<!--        	<el-col :span="span">
        		<el-form-item label="合同来源" prop="contract_from">
        			<el-input v-model="form.contract_from" style="width: 100%" maxlength="8"></el-input>
        		</el-form-item>
        	</el-col> -->
<!--      <el-col :span="span">
      	<el-form-item label="合同类别" prop="contract_type">
      		<el-select v-model="form.contract_type" style="width: 100%" filterable placeholder="请选择">
      		  <el-option
      		    v-for="item in contract_type_options"
      		    :key="item.item_id"
      		    :label="item.item_name"
      		    :value="item.item_id">
      		  </el-option>
      		</el-select>
      	</el-form-item>
      </el-col> -->
<!--        	<el-col :span="span">
        		<el-form-item label="集团领导负责人" prop="org_director">
        			<el-input v-model="form.org_director" style="width: 100%" maxlength="8"></el-input>
        		</el-form-item>
        	</el-col> -->
			<el-col :span="24">
				<el-form-item label="售后条款" prop="project_simple">
					<el-input v-model="form.project_simple" type="textarea" :rows="3" style="width: 100%" maxlength="255"></el-input>
				</el-form-item>
			</el-col>
<!-- 			<el-col :span="24">
				<el-form-item label="工作内容" prop="work_content">
					<el-input v-model="form.work_content" type="textarea" :rows="3" style="width: 100%" maxlength="255"></el-input>
				</el-form-item>
			</el-col> -->
			<el-col :span="24">
				<el-form-item label="备注" prop="regard">
					<el-input v-model="form.regard" type="textarea" :rows="3" style="width: 100%" maxlength="255"></el-input>
				</el-form-item>
			</el-col>
 <!--         <el-col :span="span">
          	<el-form-item label="预计完成时间" prop="contract_plandate">
          		<el-date-picker
          		  v-model="form.contract_plandate"
          		  style="width: 100%;"
          		  type="date"
          		  placeholder="选择日期"
          		  format="yyyy 年 MM 月 dd 日"
          		  value-format="yyyy-MM-dd">
          		</el-date-picker>
          	</el-form-item>
          </el-col>
        	<el-col :span="span">
        		<el-form-item label="一级分类" prop="duty">
        			<el-select v-model="form.classification_primary" style="width: 100%" filterable placeholder="请选择">
        			  <el-option
        			    v-for="item in classification_primary_options"
        			    :key="item.value"
        			    :label="item.label"
        			    :value="item.value">
        			  </el-option>
        			</el-select>
        		</el-form-item>
        	</el-col>
        	<el-col :span="span">
        		<el-form-item label="二级分类" prop="title">
        			<el-select v-model="form.classification_secondary" style="width: 100%" filterable placeholder="请选择">
        			  <el-option
        			    v-for="item in classification_secondary_options"
        			    :key="item.item_name"
        			    :label="item.item_name"
        			    :value="item.item_name">
        			  </el-option>
        			</el-select>
        		</el-form-item>
        	</el-col>
        	<el-col :span="span">
        		<el-form-item label="三级分类">
        			<el-input v-model="form.classification_three" style="width: 100%" maxlength="16"></el-input>
        		</el-form-item>
        	</el-col>
        	<el-col :span="span">
        		<el-form-item label="咨询分类">
              <el-input v-model="form.classification_consult" style="width: 100%" maxlength="16"></el-input>
        		</el-form-item>
        	</el-col>
        	<el-col :span="span">
        		<el-form-item label="工程分类" prop="classification_project">
              <el-select v-model="form.classification_project" style="width: 100%" filterable placeholder="请选择">
                <el-option
                  v-for="item in classification_project_options"
                  :key="item.item_name"
                  :label="item.item_name"
                  :value="item.item_name">
                </el-option>
              </el-select>
        		</el-form-item>
        	</el-col>
          <el-col :span="span">
          	<el-form-item label="法律分类" prop="classification_law">
              <el-select v-model="form.classification_law" style="width: 100%" filterable placeholder="请选择">
                <el-option
                  v-for="item in classification_law_options"
                  :key="item.item_name"
                  :label="item.item_name"
                  :value="item.item_name">
                </el-option>
              </el-select>
          	</el-form-item>
          </el-col>

          <el-col :span="span">
          	<el-form-item label="勘察费" prop="surveyors_cost">
          		<el-input v-model="form.surveyors_cost" style="width: 100%" maxlength="25"></el-input>
          	</el-form-item>
          </el-col>
          <el-col :span="span">
          	<el-form-item label="设计费" prop="design_cost">
          		<el-input v-model="form.design_cost" style="width: 100%" maxlength="8"></el-input>
          	</el-form-item>
          </el-col>
          <el-col :span="span">
          	<el-form-item label="合同状态" prop="contract_state">
          		<el-input v-model="form.contract_state" style="width: 100%" maxlength="16"></el-input>
          	</el-form-item>
          </el-col>
          <el-col :span="span">
          	<el-form-item label="项目预计完成时间" prop="project_plandate">
              <el-date-picker
                v-model="form.project_plandate"
                style="width: 100%;"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>
          	</el-form-item>
          </el-col>

          <el-col :span="span">
          	<el-form-item label="合同终止日期" prop="contract_enddate">
          		<el-date-picker
          		  v-model="form.contract_enddate"
          		  style="width: 100%;"
          		  type="date"
          		  placeholder="选择日期"
          		  format="yyyy 年 MM 月 dd 日"
          		  value-format="yyyy-MM-dd">
          		</el-date-picker>
          	</el-form-item>
          </el-col>
          <el-col :span="span">
          	<el-form-item label="合同范围" prop="contract_range">
          		<el-input v-model="form.contract_range" style="width: 100%" maxlength="25"></el-input>
          	</el-form-item>
          </el-col>
          <el-col :span="span">
          	<el-form-item label="工程规模" prop="project_scale">
          		<el-input v-model="form.project_scale" style="width: 100%" maxlength="8"></el-input>
          	</el-form-item>
          </el-col>
          <el-col :span="span">
          	<el-form-item label="工程投资额" prop="project_investment">
          		<el-input v-model="form.project_investment" style="width: 100%" maxlength="16"></el-input>
          	</el-form-item>
          </el-col>
          <el-col :span="span">
          	<el-form-item label="项目主持人" prop="project_director">
              <el-input v-model="form.project_director" style="width: 100%" maxlength="16"></el-input>
          	</el-form-item>
          </el-col>
          <el-col :span="span">
          	<el-form-item label="预计完成时间" prop="contract_plandate">
          		<el-date-picker
          		  v-model="form.contract_plandate"
          		  style="width: 100%;"
          		  type="date"
          		  placeholder="选择日期"
          		  format="yyyy 年 MM 月 dd 日"
          		  value-format="yyyy-MM-dd">
          		</el-date-picker>
          	</el-form-item>
          </el-col>
          <el-col :span="span">
          	<el-form-item label="是否未合作过项目" prop="iscooperation">
          		<el-input v-model="form.iscooperation" style="width: 100%" maxlength="16"></el-input>
          	</el-form-item>
          </el-col>
          <el-col :span="span">
          	<el-form-item label="行政区划" prop="start_date">
          		<el-input v-model="form.administrative" style="width: 100%" maxlength="16"></el-input>
          	</el-form-item>
          </el-col>
          <el-col :span="span">
          	<el-form-item label="负责区域" prop="territory">
          		<el-input v-model="form.territory" style="width: 100%" maxlength="16"></el-input>
          	</el-form-item>
          </el-col>
          <el-col :span="span">
          	<el-form-item label="阶段" prop="period">
          		<el-select v-model="form.period" style="width: 100%" filterable placeholder="请选择">
          		  <el-option
          		    v-for="item in period_options"
          		    :key="item.item_name"
          		    :label="item.item_name"
          		    :value="item.item_name">
          		  </el-option>
          		</el-select>
          	</el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="合同扫描件">
              <contractimageupload ref="contract_filename" :tip_show="upload.tip_show"
                :upload_type="upload.upload_type.contract_filename"
                :original_name="upload.original_name.contract_filename" :type_str="upload.type_str"
                :type_array="upload.type_array" :success_status.sync="upload.success.contract_filename"
                v-model="form.contract_filename" :delte_service="upload.delte_service"
                :old_delete.sync="upload.old_delete.contract_filename">
              </contractimageupload>
            </el-form-item>
          </el-col>
        </el-row>

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
      var validate_contract_money = (rule, value, callback) => {
        let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的金额'));
        } else {
          callback();
        }
      };
      var validate_contract_signdate = (rule, value, callback) => {
        let signdate = new Date(this.form.contract_signdate)
        let returndate = new Date(value)
        console.log(returndate,signdate)
        if (signdate>returndate) {
          callback(new Error('签订日期应小于返回日期'));
        } else {
          callback();
        }
      };
      var validate_contract_start = (rule, value, callback) => {
        let startdate = new Date(this.form.contract_return)
        let enddate = new Date(value)
        if (startdate>enddate) {
          callback(new Error('返回日期应小于截止日期'));
        } else {
          callback();
        }
      };
			return {
        sponsor_org_options: [],
        classification_primary_options: [{value: '国内',label: '国内'}, {value: '国外',label: '国外'}],
        classification_secondary_options: [],
        classification_project_options: [],
        classification_law_options: [],
        contract_nature_options: [],
        customer_name_options: [],
        period_options: [],
        contract_type_options: [
          {item_name: '承揽合同',item_id: '1'},
          {item_name: '委外合同',item_id: '2'},
          {item_name: '设备采购合同',item_id: '0'},
          {item_name: '校检合同',item_id: '3'},
          {item_name: '消耗品合同',item_id: '4'}
        ],
        displaycustomername: true,
				form: {
					contract_id:'',
          customer_name: '',
					customer_id:'',
					projectcontract_no:'',
					contract_no:'',
					contract_year:'',
					contract_name:'',
					contract_period:'',
					contract_from:'',
					org_director:'',
					org_entrust:'',
					contract_nature:'',
					contract_type:'0',
					classification_primary:'',
					classification_secondary:'',
					classification_three:'',
					classification_consult:'',
					classification_project:'',
					contract_money:'',
					surveyors_cost:'',
					design_cost:'',
					contract_state:'',
					project_plandate:'',
					contract_enddate:'',
					contract_signdate:'',
					contract_range:'',
					project_scale:'',
					project_investment:'',
					project_director:'',
					contract_plandate:'',
					iscooperation:'',
					contract_filename:'',
					sponsor_org:'',
					classification_law:'',
					period:'',
          administrative:'',
          territory:'',
          regard: '',
          work_content: '',
          project_simple: '',
          operator_people: '',
          contract_start: '',
          contract_end: '',
          contract_return: '',
          parent_name: '',
          parent_id: '0',
          project_name: ''
				},
        selectloading: true,
        customer_label: '供货单位',
        upload: {
        	tip_show: false,
        	delte_service: false,
        	upload_type: {
        		contract_filename: 12,
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
        rules: {
          contract_no: [{ required: true, trigger: 'blur', message: '请输入合同编号' }],
          contract_name: [{ required: true, trigger: 'blur', message: '请输入合同名称' }],
          // contract_type: [{ required: true, trigger: 'change', message: '请选择合同性质' }],
          contract_money: [{ required: true, trigger: 'blur', message: '请输入合同金额' },{ validator: validate_contract_money, trigger: 'blur'}],
          contract_return: [{ validator: validate_contract_signdate, trigger: 'blur'}],
          contract_start: [{ validator: validate_contract_start, trigger: 'blur'}],
        },
        displaycontract: true,
        span:12,
				formLabelWidth: '130px',
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
        this.form.customer_id=item.customer_id
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      displayadd(item) {
        this.selectloading = true
        this.displaycustomername = false
        this.displaycontract = false
        this.form.customer_name=item.customer_id
        this.form.parent_id=item.contract_id
        this.form.parent_name=item.contract_name
        this.form.contract_type='2'
        this.customer_label='所属合同'
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      displayoutedit(item) {
        this.selectloading = true
        this.displaycustomername = false
        this.displaycontract = false
        this.form=item
        this.customer_label='所属合同'
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
              console.log(that.form)

              let sData = '[Q]210{'+that.current_org+'$`'+that.form.customer_name+'$`'+that.form.org_entrust+'$`'
              +that.form.project_name+'$`'+that.form.projectcontract_no+'$`'+that.form.contract_no+'$`'+that.form.contract_name+'$`'
              +that.form.contract_money+'$`'+that.form.contract_nature+'$`'+that.form.contract_signdate+'$`'+that.form.contract_return+'$`'
              +that.form.sponsor_org+'$`'+that.form.contract_start+'$`'+that.form.contract_end+'$`'
              +that.form.administrative+'$`'+that.form.operator_people+'$`'+that.form.contract_from+'$`'
              +that.form.project_simple+'$`'+that.form.work_content+'$`'+that.form.regard+'$`'+that.form.contract_filename+'$`'+that.form.contract_type+'$`'+that.form.parent_id+'}|^2|^SYS'
              console.log(sData)
              const res = await ExecSql(sData)
              if(res>0)
              {
                that.$baseMessage('合同添加成功', 'success')
                that.$refs['form'].resetFields()
                that.$emit('close_comp')
                that.$emit('transferTable')
              }
              else
              {
                that.$baseMessage('合同添加失败', 'error')
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
              let sData = '[Q]219{'+that.form.org_entrust+'$`'
              +that.form.project_name+'$`'+that.form.projectcontract_no+'$`'+that.form.contract_no+'$`'+that.form.contract_name+'$`'
              +that.form.contract_money+'$`'+that.form.contract_nature+'$`'+that.form.contract_signdate+'$`'+that.form.contract_return+'$`'
              +that.form.sponsor_org+'$`'+that.form.contract_start+'$`'+that.form.contract_end+'$`'
              +that.form.administrative+'$`'+that.form.operator_people+'$`'+that.form.contract_from+'$`'
              +that.form.project_simple+'$`'+that.form.work_content+'$`'+that.form.regard+'$`'+that.form.contract_filename+'$`'+that.form.contract_id+'}|^1|^SYS'
              console.log(sData)
              const res = await ExecSql(sData)
              if(res>0)
              {
                that.$baseMessage('合同修改成功', 'success')
                that.$refs['form'].resetFields()
                that.$emit('close_comp')
              }
              else
              {
                that.$baseMessage('合同修改失败', 'error')
              }
            })
          }
        })
      },
      async fetchData() {
        this.selectloading=true

        let sData7 = '[Q]211{'+this.current_org+'$`2}|^SYS'
        const res7 = await QueryExec(sData7)
        this.customer_name_options=res7.data

        setTimeout(() => {
          this.selectloading = false
        }, 500)
      }
		},
	}
</script>
