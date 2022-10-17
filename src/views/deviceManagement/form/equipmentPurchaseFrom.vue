<template>
	<span class="purchasefrom">
      <el-form :model="form" :rules="rules" ref="form" v-loading="selectloading">
        <el-form-item label="管理编号" prop="manage_id" :label-width="formLabelWidth">
        	<el-autocomplete :maxlength = '16'
        	  class="inline-input"
        	  v-model="form.manage_id"
        	  :fetch-suggestions="querySearch"
        	  placeholder="请输入管理编号"
        	  @select="handleSelect1"
            style="width: 100%;"
        	></el-autocomplete>
        </el-form-item>
      	<el-form-item label="设备名称" prop="devicename" :label-width="formLabelWidth">
      		<el-autocomplete
            :maxlength= '16'
      		  class="inline-input"
      		  v-model="form.devicename"
      		  :fetch-suggestions="querySearchName"
      		  placeholder="请输入设备名称"
      		  @select="handleSelect"
      		  style="width: 100%;"
      		></el-autocomplete>
      	</el-form-item>
      	<el-form-item label="规格型号" :label-width="formLabelWidth">
      		<el-input v-model="form.device_span" maxlength= '64' style="width: 100%;"></el-input>
      	</el-form-item>
        <el-form-item label="测量范围" :label-width="formLabelWidth">
        	<el-input v-model="form.range" maxlength= '64' style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="精度" :label-width="formLabelWidth">
        	<el-input v-model="form.accuracy" maxlength= '64' style="width: 100%;"></el-input>
        </el-form-item>
      	<el-form-item label="生产厂家"  prop="factory" :label-width="formLabelWidth">
      		<el-input v-model="form.factory" autocomplete maxlength= '32' style="width: 100%;"></el-input>
      	</el-form-item>
        <el-form-item label="出厂编号"  prop="serial_no" :label-width="formLabelWidth">
        	<el-input v-model="form.serial_no" maxlength= '32' style="width: 100%;"></el-input>
        </el-form-item>
      	<el-form-item label="生产日期" prop="product_date" :label-width="formLabelWidth">
      		<el-date-picker
      		      v-model="form.product_date"
                style="width: 100%;"
      		      type="date"
      		      placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
      		    </el-date-picker>
      	</el-form-item>
      	<el-form-item label="校检周期(月)" prop="verify_cycle" :label-width="formLabelWidth">
      		<el-input v-model.number="form.verify_cycle" maxlength="9" style="width: 100%;"></el-input>
      	</el-form-item>
        <el-form-item label="核查周期(月)" prop="check_cycle" :label-width="formLabelWidth">
        	<el-input v-model.number="form.check_cycle"  maxlength="9" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="购置日期" prop="purchase_date" :label-width="formLabelWidth">
        	<el-date-picker
        	      v-model="form.purchase_date"
                style="width: 100%;"
        	      type="date"
        	      placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
        	    </el-date-picker>
        </el-form-item>
      	<el-form-item label="购置费用(元)"  prop="purchase_cost" :label-width="formLabelWidth">
      		<el-input v-model="form.purchase_cost" maxlength= '16' style="width: 100%;"></el-input>
      	</el-form-item>
        <el-form-item label="合同编号" prop="contract_id" :label-width="formLabelWidth">
          <el-input v-model="form.contract_no" style="width: 100%;" v-if="displaymanage" disabled></el-input>
          <el-select v-model="form.contract_id" style="width: 100%" @change="contractchange" v-else filterable placeholder="请选择合同编号">
            <el-option
              v-for="item in contract_name_options"
              :key="item.contract_id"
              :label="item.contract_no"
              :value="item.contract_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票代码" prop="invoice_id" :label-width="formLabelWidth">
          <el-select v-model="form.invoice_id" style="width: 100%" @change="receiptchange" filterable placeholder="请选择发票代码">
            <el-option
              v-for="item in invoice_name_options"
              :key="item.invoice_id"
              :label="item.invoice_no"
              :value="item.invoice_id">
            </el-option>
          </el-select>
        </el-form-item>


      <el-form-item label="是否验收" prop="isAccept" :label-width="formLabelWidth">
        	<el-select v-model="form.isAccept" style="width: 100%;margin-bottom: 20px;" :disabled="displayaccept" placeholder="请选择是否在购入登记后对此设备进行验收登记">
        		<el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
            <el-option label="无验收记录" value=""></el-option>
        	</el-select>
        </el-form-item>
      </el-form>
    </span>


</template>
<script>
  //发票
  import receiptupload from '@/components/Upload/uploadName'
  import contractupload from '@/components/Upload/uploadName'

  import {
  	mapActions,
  	mapGetters
  } from 'vuex'
	import {
		doEdit,
    ExecSql,
    QueryExec
	} from '@/api/table'
	export default {
		name: 'TableEdit',
		props: { //props列表
			father: {
				type: Object,
				required: false
			}
		},
    components: {
    	receiptupload,
      contractupload
    },
		data() {
      var validate_purchase_cost = (rule, value, callback) => {
        let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,2})))$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的金额'));
        } else {
          callback();
        }
      };
      var validate_manage_id = async (rule, value, callback) => {
        let sData = '[Q]288{'+this.current_org+'$`'+this.form.manage_id+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(res)
        if (res.data.length>0 && this.form.manage_id !== this.form.manage_uid) {
          if(res.data[0].total>0)
          {
            callback(new Error('管理编号重复，请输入其他的管理编号'));
          }
          else
          {
            callback();
          }
        } else {
          callback();
        }
      };
      let validate_cycle = (rule, value, callback) => {
        let reg = /^[1-9]\d*$/
        if (!reg.test(value)) {
          callback(new Error('请输入正数'));
        } else {
          callback();
        }
      };
      var validate_date = (rule, value, callback) => {
        let startdate = new Date(this.form.product_date)
        let enddate = new Date(value)
        if (startdate>enddate) {
          callback(new Error('生产日期应小于购置日期'));
        } else {
          callback();
        }
      };
			return {
				form: {
					isAccept: '',
					device_span:'',
					purchase_cost: '',
					quantity: '',
					factory:'',
					product_date:'',
					manage_id:'',
					range:'',
					accuracy:'',
					devicename:'',
					id:'',
					serial_no:'',
          receipt:'',
          contract:'',
          purchase_date: '',
          verify_cycle: '',
          check_cycle: '',
          contract_filename: '',
          invoice_file: '',
          contract_id:'',
          invoice_id: '',
          customer_id: '',
          invoice_no: '',
          contract_no: '',
          manage_uid: ''
				},
        addoredit: true,
        invoice_name_options: [],
        contract_name_options: [],
        rules: {
          factory: [{ required: true, trigger: 'blur', message: '请输入生产厂家' }],
          isAccept: [{ required: true, trigger: 'blur', message: '请选择是否之后输入验收' }],
          purchase_cost: [{ required: true, trigger: 'blur', message: '请输入购入费用' },
          {
            validator: validate_purchase_cost ,trigger: 'blur'
          }],
          product_date: [{ required: true, trigger: 'change', message: '请选择生产日期' }],
          manage_id: [{ required: true, trigger: 'change', message: '请输入管理编号' },
          {
            validator: validate_manage_id ,trigger: 'blur'
          }],
          devicename: [{ required: true, trigger: 'change', message: '请输入设备名称' }],
          serial_no: [{ required: true, trigger: 'blur', message: '请输入出场编号' }],
          // contract_id: [{ required: true, trigger: 'change', message: '请选择合同' }],
          // invoice_id: [{ required: true, trigger: 'change', message: '请选择发票' }],
          purchase_date: [{ required: true, trigger: 'change', message: '请选择购入日期' },{ validator: validate_date ,trigger: 'change'}],
          verify_cycle: [{ required: true, trigger: 'blur', message: '请输入校检周期' },{ validator: validate_cycle ,trigger: 'blur'}],
          check_cycle: [{ required: true, trigger: 'blur', message: '请输入核查周期' },{ validator: validate_cycle ,trigger: 'blur'}],
        },
        selectloading:[],
				restaurants: [],
				restaurantsname: [],
        displaymanage: false,
        displayaccept: false,
				formLabelWidth: '110px',
				title: '',
			}
		},
		created() {
			if (this.father) {
				this.form = Object.assign({}, this.father)
			}
      this.selectloading=true;
      this.fetchData()
      // let sData =
      // this.upload.fill_data.contract = [{"value":"123"}];
      setTimeout(() => {
        this.selectloading = false
      }, 500)
		},
    computed: {
    	...mapGetters({
    		current_org: 'org/current_org',
    	}),
    },
		methods: {
      fileUploadRefs() {
      	return ["contract", "receipt",
      	]
      },
      contractchange(val) {
        console.log(val)
        this.selectloading = true
        this.receiptoptions(this.form.contract_id)
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      async receiptoptions(val) {

        console.log(this.form.invoice_no)
        let sDataReceipt = '[Q]388{'+this.current_org+'$`'+val+'}|^SYS'
        const resReceipt = await QueryExec(sDataReceipt)
        console.log(sDataReceipt)
        this.invoice_name_options = resReceipt.data
      },
      receiptchange(val) {

      },
      display(item) {
        this.selectloading = true
        this.displaymanage = false
        console.log(item)

        this.form=item
        this.form.isAccept=item.is_accept
        this.form.manage_uid=item.manage_id
        this.form.contract_id=item.purchasecontract
        this.receiptoptions(this.form.contract_id)
        this.form.verify_cycle=Number(item.verify_cycle)
        this.form.check_cycle=Number(item.check_cycle)
        this.rules.isAccept=[]
        this.displayaccept=true
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      displaycontract(item) {
        this.selectloading = true
        this.displaymanage = true
        console.log(item)

        this.form.contract_id=item.purchasecontract
        this.form.contract_no=item.contract_no
        // this.form.verify_cycle=0
        // this.form.check_cycle=0
        this.receiptoptions(item.contract_id)
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      async fetchData() {
        this.selectloading = true
        let sDataContract = '[Q]386{'+this.current_org+'}|^SYS'
        const resContract = await QueryExec(sDataContract)
        console.log(sDataContract)
        this.contract_name_options = resContract.data


        setTimeout(() => {
          this.selectloading = false
        }, 500)
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
      save() {
      	let that = this
      	this.$refs['form'].validate(async (valid) => {
      		if (valid) {
            let sData = '[Q]93{'+that.current_org+'$`'+that.form.manage_id+'$`'+that.form.id+'$`'+that.form.factory+'$`'
            +that.form.product_date+'$`'+that.form.devicename+'$`'+that.form.purchase_cost+'$`0$`'+that.form.purchase_date
            +'$`'+that.form.invoice_id+'$`'+that.form.contract_id+'}|^2|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if (res > 0) {
              let sData1='[Q]94{'+that.current_org+'$`'+that.form.id+'$`0}|^2|^SYS'
              const res1 = await ExecSql(sData1)
              if(res1>0)
              {
                let sData2 = '[Q]95{'+that.current_org+'$`'+that.form.manage_id+'$`'+that.form.devicename+'$`'+that.current_org+'$`'
                +that.form.device_span+'$`'+that.form.range+'$`'+that.form.accuracy+'$`'+that.form.factory+'$`'+that.form.serial_no+'$`'
                +that.form.purchase_date+'$`'+that.form.quantity+'$`'+that.form.purchase_cost+'$`'+that.form.product_date
                +'$`4$`'+that.form.id+'$`'+res1+'$`'+res+'$`'+that.form.verify_cycle+'$`'+that.form.check_cycle+'}|^2|^SYS'
                console.log(sData2)
                const res2 = await ExecSql(sData2)
                if(res2>0)
                {
                  let sData3='[Q]141{'+res2+'$`'+res1+'}|^1|^SYS'
                  const res3 = await ExecSql(sData3)
                  if(res3>0)
                  {

                    if(that.form.isAccept=="1")
                    {
                      that.$router.push('/device/equipmentAcceptance?tabs=0')
                      that.$emit('fetchData')
                      that.$baseMessage('添加成功，请输入验收数据', 'success')
                    }
                    else{
                      that.$router.push('/device/equipmentPurchase?tabs=1')
                      that.$emit('fetchData')
                      that.$baseMessage('添加成功', 'success')
                    }
                  }
                  else{
                    that.$baseMessage('添加失败', 'error')
                  }
                }
                else {
                  that.$baseMessage('添加失败', 'error')
                }
              }
              else {
                that.$baseMessage('添加失败', 'error')
              }
            }
            else {
              that.$baseMessage('添加失败', 'error')
            }

      		} else {
      			return false
      		}
      	})

      },
      editsave()
      {
        let that=this;
        this.$refs['form'].validate(async (valid) => {
          if(valid)
          {
            let sData = '[Q]186{'+that.form.factory+'$`'+that.form.serial_no+'$`'+that.form.product_date+'$`'
            +that.form.verify_cycle+'$`'+that.form.check_cycle+'$`'+that.form.purchase_date+'$`'
            +that.form.purchase_cost+'$`'+that.form.invoice_no+'$`'+that.form.contract_no+'$`'
            +that.form.detail_id+'$`'+that.form.manage_id+'$`'+that.form.device_name+'$`'
            +that.form.devicename+'$`'+that.form.deviceid+'$`'+that.form.invoice_id+'$`'
            +that.form.contract_id+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('修改购入记录添加成功', 'success')
              that.$refs['form'].resetFields()
              this.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('修改购入记录添加失败', 'error')
            }
          }
          else {
            return false;
          }
        })
      },

      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      querySearchName(queryString, cb) {
        var restaurantsname = this.restaurantsname;
        var results = queryString ? restaurantsname.filter(this.createFilterName(queryString)) : restaurantsname;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilterName(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [
          { "value": "1-01-"},
          { "value": "1-02-"},
        ];
      },
      async loadname() {
        let sData = '[Q]393{}|^SYS'
        const res = await QueryExec(sData)
        let resname = []
        for(let i=0;i<res.data.length;i++)
        {
          resname.push({"value": res.data[i].device_name+'(量程'+res.data[i].range+')',"device_name":res.data[i].device_name,"id":res.data[i].device_id,"range":res.data[i].range,"accuracy":res.data[i].accuracy,"device_span":res.data[i].device_span})
        }
        this.restaurantsname = resname
      },
      handleSelect(item) {
        this.form.range=item.range;
        this.form.accuracy=item.accuracy;
        this.form.device_span=item.device_span;
        this.form.id=item.id;
        this.form.devicename=item.device_name;
      },
      handleSelect1(item) {

      }
		},
    mounted() {
      this.restaurants = this.loadAll();
      this.loadname();

    }


	}
</script>
