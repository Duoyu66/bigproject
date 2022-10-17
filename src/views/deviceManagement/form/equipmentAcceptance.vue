<template>
	<span class="purchasefrom">
		<el-form :model="form" :rules="rules" ref="form" v-loading="selectloading">
      <el-form-item label="设备名称" prop="devicename" :label-width="formLabelWidth">
      	<el-autocomplete
          :maxlength='16'
      	  class="inline-input"
      	  v-model="form.devicename"
      	  :fetch-suggestions="querySearchName"
      	  placeholder="请输入设备名称"
      	  @select="handleSelect"
      	  style="width: 100%;"
      	></el-autocomplete>
      </el-form-item>
			<el-form-item label="管理编号"  prop="manage_id" :label-width="formLabelWidth">
				<el-input :disabled="false" maxlength='16' v-model="form.manage_id" style="width: 100%;"></el-input>
			</el-form-item>
			<el-form-item label="生产厂家"  :label-width="formLabelWidth">
				<el-input :disabled="true" maxlength='16' v-model="form.factory" style="width: 100%;"></el-input>
			</el-form-item>
      	<el-form-item label="规格型号"  :label-width="formLabelWidth">
      		<el-select v-model="form.model" style="width: 100%;" disabled>
      			<el-option label="无" value="a"></el-option>
      		</el-select>
      	</el-form-item>
        <el-form-item label="测量范围" :label-width="formLabelWidth">
        	<el-input v-model="form.range" style="width: 100%;" disabled></el-input>
        </el-form-item>
        <el-form-item label="精度" :label-width="formLabelWidth">
        	<el-input v-model="form.accuracy" style="width: 100%;" disabled></el-input>
        </el-form-item>
			<el-form-item :disabled="true" label="生产日期" :label-width="formLabelWidth">
				<el-input v-model="form.produce_date" style="width: 100%;" disabled></el-input>
			</el-form-item>
      <el-form-item label="验收单位"  prop="accept_org" :label-width="formLabelWidth">
      	<el-autocomplete
          :maxlength='16'
      	  class="inline-input"
      	  v-model="form.accept_org"
      	  :fetch-suggestions="querySearch"
      	  placeholder="请输入验收单位"
      	  @select="handleSelect1"
      	  style="width: 100%;"
      	></el-autocomplete>
      </el-form-item>
       <el-form-item label="外观情况" prop="appearance" :label-width="formLabelWidth">
        	<el-select v-model="form.appearance" style="width: 100%;" >
        		<el-option label="良好" value="良好"></el-option>
            <el-option label="破损" value="破损"></el-option>
        	</el-select>
        </el-form-item>
        <el-form-item label="随机附件" prop="attachment" :label-width="formLabelWidth">
         	<el-select v-model="form.attachment" style="width: 100%;" >
         		<el-option label="有" value="有"></el-option>
             <el-option label="无" value="无"></el-option>
         	</el-select>
         </el-form-item>
         <el-form-item label="说明书及合格证" prop="instruction_certificate" :label-width="formLabelWidth">
          	<el-select v-model="form.instruction_certificate" style="width: 100%;" >
          		<el-option label="有" value="有"></el-option>
              <el-option label="无" value="无"></el-option>
          	</el-select>
          </el-form-item>
          <el-form-item label="试运转情况" prop="trial_state" :label-width="formLabelWidth">
           	<el-select v-model="form.trial_state" style="width: 100%;" >
           		<el-option label="正常" value="正常"></el-option>
               <el-option label="异常" value="异常"></el-option>
           	</el-select>
           </el-form-item>
           <el-form-item label="检定校准结果" prop="calibration" :label-width="formLabelWidth">
            	<el-select v-model="form.calibration" style="width: 100%;" >
            		<el-option label="合格" value="合格"></el-option>
                <el-option label="不合格" value="不合格"></el-option>
            	</el-select>
            </el-form-item>
			<el-form-item label="其他情况"  prop="other_info" :label-width="formLabelWidth">
				<el-input type="textarea" maxlength='64' v-model="form.other_info" style="width: 100%;"></el-input>
			</el-form-item>
			<el-form-item label="验收结论"  prop="accept_conclusion" :label-width="formLabelWidth">
<!-- 				<el-input type="textarea" maxlength='64' v-model="form.accept_conclusion" style="width: 100%;"></el-input> -->
        <el-autocomplete
          :maxlength='64'
          class="inline-input"
          v-model="form.accept_conclusion"
          :fetch-suggestions="querySearchConclusion"
          placeholder="验收结论"
          @select="handleSelect3"
          style="width: 100%;"
        ></el-autocomplete>
			</el-form-item>
      <el-form-item label="验收日期" prop="check_date" :label-width="formLabelWidth">
      	<el-date-picker
      	  v-model="form.check_date"
          style="width: 100%;"
      	  type="date"
      	  placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
      	</el-date-picker>
      </el-form-item>
			<el-form-item label="验收人员"  prop="acceptance_member" :label-width="formLabelWidth">
				<!-- <el-input v-model="form.acceptance_member" :maxlength='8' style="width: 100%;"></el-input> -->
        <el-autocomplete
          :maxlength='8'
          class="inline-input"
          v-model="form.acceptance_member"
          :fetch-suggestions="querySearchMember"
          placeholder="请输入验收人员"
          @select="handleSelect2"
          style="width: 100%;"
        ></el-autocomplete>
			</el-form-item>
		</el-form>
	</span>
</template>

<script>
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
		data() {
			return {
				dialogFormVisible: false,
				form: {
					isAccept: '',
          model:'',
					purchase_cost: '',
					quantity: '',
					factory:'',
          produce_date:'',
          manage_id:'',
          range:'',
          accuracy:'',
          devicename:'',
          accept_id:'',
          serial_no:'',
          accept_org:'',
          accept_conclusion: '',
          deviceid:'',
          check_date:'',
          other_info: '无'
				},
        rules: {
          manage_id: [{ required: true, trigger: 'change', message: '请输入管理编号' }],
          accept_org: [{ required: true, trigger: 'change', message: '请输入验收单位' }],
          appearance: [{ required: true, trigger: 'blur', message: '请输入外观情况' }],
          attachment: [{ required: true, trigger: 'blur', message: '请输入随机附件情况' }],
          instruction_certificate: [{ required: true, trigger: 'blur', message: '请输入说明书及合格证情况' }],
          trial_state: [{ required: true, trigger: 'blur', message: '请输入试运转情况' }],
          calibration: [{ required: true, trigger: 'blur', message: '请输入检定校准结果' }],
          other_info: [{ required: true, trigger: 'blur', message: '请输入其他情况' }],
          accept_conclusion: [{ required: true, trigger: 'change', message: '请输入验收结论' }],
          check_date: [{ required: true, trigger: 'change', message: '请选择验收日期' }],
          acceptance_member: [{ required: true, trigger: 'change', message: '请输入验收人员' }],

        },
        restaurants: [],
        restaurantsname: [],
        restaurantsmember: [],
        restaurantsconclusion: [],
				formLabelWidth: '120px',
        selectloading:[],
				title: '',
				dialogFormVisible: false,
			}
		},
    computed: {
    	...mapGetters({
    		current_org: 'org/current_org',
    	}),
    },
		created() {
			if (this.father) {
				this.form = Object.assign({}, this.father)
			}
		},
		methods: {
      display(item) {
        this.selectloading = true
        this.displaymanage = false
        console.log(item)
        this.form=item
        console.log(this.form)
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      save() {
      	let that = this
      	this.$refs['form'].validate(async (valid) => {
      		if (valid) {

      			let sData = '[Q]98{'+that.form.accept_org+'$`'+that.form.appearance+'$`'+that.form.attachment+'$`'+that.form.instruction_certificate+'$`'
            +that.form.trial_state+'$`'+that.form.calibration+'$`'+that.form.other_info+'$`'+that.form.accept_conclusion+'$`'+that.form.acceptance_member
            +'$`'+that.form.accept_id+'$`'+that.form.check_date+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
      			if (res > 0) {
              let sData1 = '[Q]140{'+that.form.manage_id+'$`'+that.current_org+'$`'+that.form.deviceid+'}|^1|^SYS'
              console.log(sData1)
              const res1 = await ExecSql(sData1)
              if(res1>0)
              {
                that.$baseMessage('验收成功', 'success')
                that.$refs['form'].resetFields()
                this.$emit('close_comp')
                this.$emit('transferTable')
              } else {
              	that.$baseMessage('验收失败', 'error')
              }


      			} else {
      				that.$baseMessage('验收失败', 'error')
      			}
      		} else {
      			return false
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
      querySearchMember(queryString, cb) {
        var restaurantsmember = this.restaurantsmember;
        var results = queryString ? restaurantsmember.filter(this.createFilterName(queryString)) : restaurantsmember;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      querySearchConclusion(queryString, cb) {
        var restaurantsmember = this.restaurantsconclusion;
        var results = queryString ? restaurantsmember.filter(this.createFilterName(queryString)) : restaurantsmember;
        // 调用 callback 返回建议列表的数据
        cb(results);
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
          {"value":"中铁咨询集团北京工程检测有限公司"}
        ]
      },
      loadmember() {
        return [
          {"value":"姚彦虎"}
        ]
      },
      loadconclusion() {
        return [
          {"value":"合格"},
          {"value":"不合格"}
        ]
      },
      async loadname() {
        let sData = '[Q]97{'+this.current_org+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(res)
        let resname = []
        for(let i=0;i<res.data.length;i++)
        {
          resname.push({"value": res.data[i].device_name+'(量程'+res.data[i].range+'  管理编号'+res.data[i].manage_uid+')',"factory":res.data[i].factory,
          "device_name":res.data[i].device_name,"accept_id":res.data[i].accept_id,"range":res.data[i].range,"produce_date":res.data[i].produce_date,
          "accuracy":res.data[i].accuracy,"model":res.data[i].model,"manage_id":res.data[i].manage_uid,"deviceid":res.data[i].device_id})
        }
        this.restaurantsname = resname
      },
      handleSelect(item) {
        this.selectloading = true
        this.form.range=item.range;
        this.form.accuracy=item.accuracy;
        this.form.model=item.model;
        this.form.accept_id=item.accept_id;
        this.form.devicename=item.device_name;
        this.form.factory=item.factory;
        this.form.produce_date=item.produce_date;
        this.form.manage_id=item.manage_id;
        this.form.deviceid=item.deviceid;
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      handleSelect1(item) {
        this.form.accept_org=item.value;
      },
      handleSelect2(item) {
        this.form.acceptance_member =item.value;
      },
      handleSelect3(item) {
        this.form.accept_conclusion =item.value;
      },
      editsave()
      {
        let that=this;
        this.$refs['form'].validate(async (valid) => {
          if(valid)
          {
      			let sData = '[Q]98{'+that.form.accept_org+'$`'+that.form.appearance+'$`'+that.form.attachment+'$`'+that.form.instruction_certificate+'$`'
            +that.form.trial_state+'$`'+that.form.calibration+'$`'+that.form.other_info+'$`'+that.form.accept_conclusion+'$`'+that.form.acceptance_member
            +'$`'+that.form.accept_id+'$`'+that.form.check_date+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
      			if (res > 0) {
              let sData1 = '[Q]140{'+that.form.manage_id+'$`'+that.current_org+'$`'+that.form.deviceid+'}|^1|^SYS'
              console.log(sData1)
              const res1 = await ExecSql(sData1)
              if(res1>0)
              {
                that.$baseMessage('验收成功', 'success')
                that.$refs['form'].resetFields()
                this.$emit('close_comp')
              } else {
              	that.$baseMessage('验收失败', 'error')
              }


      			} else {
      				that.$baseMessage('验收失败', 'error')
      			}
          }
        })
      },
		},

    mounted() {
      this.selectloading = true
      this.restaurants = this.loadAll();
      this.restaurantsmember = this.loadmember();
      this.restaurantsconclusion = this.loadconclusion();
      this.loadname();
      setTimeout(() => {
        this.selectloading = false
      }, 500)
    }
	}
</script>
