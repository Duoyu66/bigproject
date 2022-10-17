<template>
	<span class="purchasefrom">
		<el-form :model="form" :rules="rules" ref="form" v-loading="selectloading">
      <el-form-item label="管理编号" prop="manage_pid" :label-width="formLabelWidth" >
      	<el-select v-model="form.manage_pid" filterable placeholder="请输入或选择" v-if="displaymanage" @change="setoption" style="width: 100%;">
           <el-option
             v-for="item in form.manage_pid_array"
             :key="item.device_id"
             :label="item.manage_pid"
             :value="item.alldata">
           </el-option>
      	</el-select>
       	<el-input v-model="form.manage_pid" style="width: 100%;" v-else disabled></el-input>
      </el-form-item>
      <el-form-item label="设备名称" :label-width="formLabelWidth">
      	<el-input v-model="form.device_name" style="width: 100%;" disabled></el-input>
      </el-form-item>
      <el-form-item label="规格型号" :label-width="formLabelWidth">
      	<el-input v-model="form.model" style="width: 100%;" disabled></el-input>
      </el-form-item>
      <el-form-item label="测量范围" :label-width="formLabelWidth">
      	<el-input v-model="form.scope" style="width: 100%;" disabled></el-input>
      </el-form-item>
      <el-form-item label="精度" :label-width="formLabelWidth">
      	<el-input v-model="form.precision" style="width: 100%;" disabled></el-input>
      </el-form-item>
			<el-form-item label="起始机构" :label-width="formLabelWidth">
      	<el-input v-model="form.from_org" style="width: 100%;" disabled></el-input>
			</el-form-item>
			<el-form-item label="目标机构" prop='to_org' :label-width="formLabelWidth">
				<tree-select :options="select.org" :max-height="maxHeight" :multiple="false"
					:placeholder="isReadOnly('请选择调入机构...')" :disabled="readonly" v-model="form.to_org" />
			</el-form-item>
			<el-form-item label="经手人" prop='apply_people' :label-width="formLabelWidth">
				<el-input v-model="form.apply_people" style="width: 100%;"></el-input>
			</el-form-item>
      <el-form-item label="调拨开始时间" prop="send_time" :label-width="formLabelWidth" >
      	<el-date-picker
      	  v-model="form.send_time"
      	  style="width: 100%;"
      	  type="date"
      	  placeholder="选择日期"
      	  format="yyyy 年 MM 月 dd 日"
      	  value-format="yyyy-MM-dd">
      	</el-date-picker>
      </el-form-item>
      <el-form-item label="调拨结束时间" prop="achieve_time" :label-width="formLabelWidth" >
      	<el-date-picker
      	  v-model="form.achieve_time"
      	  style="width: 100%;"
      	  type="date"
      	  placeholder="选择日期"
      	  format="yyyy 年 MM 月 dd 日"
      	  value-format="yyyy-MM-dd">
      	</el-date-picker>
      </el-form-item>
			<el-form-item label="调拨原因" :label-width="formLabelWidth">
				<el-input v-model="form.reason" style="width: 100%;" type="textarea" maxlength="50" :autosize="{ minRows: 4, maxRows: 8}" show-word-limit></el-input>
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

  import TreeSelect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

	export default {
		name: 'TableEdit',
		model: {
			prop: 'formData',
			event: 'on-change'
		},
		props: {
			//.sync同步
			formData: {
				type: Object,
				default: function() {
					return {}
				}
			},
			type: {
				type: Number,
				default: 0 //0 正常表单 1 详情表单
			}
		},
		watch: {
			formData(newVal, oldVal) {
				if (newVal) {
					this.uploadForm(newVal)
				}
			},
		},
		computed: {
			...mapGetters({
				username: 'user/username',
				org_id: 'user/org_id',
				person_id: 'user/person_id',
        current_org: 'org/current_org'
			}),
		},
    components: {
    	TreeSelect
    },
		data() {
      var achieve_time = (rule, value, callback) => {
        let startdate = new Date(this.form.send_time)
        let enddate = new Date(value)
        if (startdate>enddate  && this.form.send_time!=='') {
          callback(new Error('开始日期应小于结束日期'));
        } else {
          callback();
        }
      };
			return {
				form: {
					manage_pid_array: [],
          manage_pid:'',
					device_name: '',
          device_id: '',
          model:'',
          scope:'',
					precision: '',
          apply_people:'',
					reason: '',
          org_id: '',
          to_org: '',
          from_org: '',
          allot_id: '',
          send_time: '',
          achieve_time: ''
				},
        select: {
        	org: []
        },
        maxHeight: 200,
        readonly: false,
        rules: {},
        rules_temp: {
          manage_pid: [{ required: true, trigger: 'change', message: '请选择管理编号' }],
          to_org: [{ required: true, trigger: 'change', message: '请选择目标机构' }],
          send_time: [{ required: true, trigger: 'change', message: '请选择开始时间' }],
          achieve_time: [{ required: true, trigger: 'change', message: '请选择结束时间' },{ validator: achieve_time, trigger: 'change'}],
          apply_people: [{ required: true, trigger: 'blur', message: '请输入经手人' }],
        },
        selectloading: [],
				formLabelWidth: '110px',
				title: '',
        displaymanage: true,

			}
		},
		created() {
			if (this.father) {
				this.form = Object.assign({}, this.father)
			}
      this.fetchData()
		},
		methods: {
      setoption(item)
      {
        console.log(item)
        this.form.device_name=item.split('^')[0] ;
        this.form.model=item.split('^')[1];
        this.form.scope=item.split('^')[2];
        this.form.precision=item.split('^')[3];
        this.form.device_id=item.split('^')[4];
      },
      isReadOnly(text) {
      	if (this.readonly) {
      		return ''
      	}
      	return text
      },
      async fetchData() {
        this.selectloading = true
				switch (this.type) {
					case 0:
						this.readonly = false
						this.rules = this.rules_temp
						break;
					case 1:
						this.readonly = true
						this.rules = {}
						break
				}
        let sData = '[Q]162{'+this.current_org+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData)
        if(res.data.length!==0)
        {
          res.data.forEach((item, index) => {
            item.alldata = item.device_name+'^'+item.model+'^'+item.scope+'^'+item.precision+'^'+item.device_id;
          })
        }
        this.form.manage_pid_array = res.data

        let sData1 = '[Q]366{'+this.current_org+'}|^SYS'
        const res1 = await QueryExec(sData1)
        this.form.from_org = res1.data[0].org_name

				if (this.formData) {
					this.uploadForm(this.formData)
				}
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      async uploadForm(newVal) {
      	// this.form = JSON.parse(JSON.stringify(this.formdefalut))
      	this.form = Object.assign(this.form, newVal)
      	console.log(this.form)
      	// this.form.change_date_old = this.form.change_date
      	this.select.org = await this.$store.dispatch('org/GetOrgTreeAllEx')
        console.log(this.select.org)
      },
      display(item) {
        this.selectloading = true
        this.displaymanage = false
        this.readonly = true
        this.form=item
        this.form.manage_pid = item.manage_uid
        this.form.stop_days=Number(item.stop_days)
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      displayadd(item) {
        this.selectloading = true
        this.displaymanage = false
        this.form.device_id=item.device_id
        this.form.manage_pid = item.manage_uid
        this.form.device_name = item.device_name
        this.form.model = item.model
        this.form.scope = item.scope
        this.form.precision = item.precision

        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      save()
      {
        let that=this;
        this.$refs['form'].validate(async (valid) => {
          if(valid)
          {
            let sData = '[Q]367{'+that.form.device_id+'$`'+that.current_org+'$`'+that.form.to_org+'$`'
            +that.form.reason+'$`'+that.form.apply_people+'$`'+that.form.send_time+'$`'+that.form.achieve_time+'}|^2|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              let sData1 =
                '[Q]368{' + that.form.to_org + '$`' + that.form.device_id + '}|^1|^SYS'
              const res = await ExecSql(sData1)
              if(res>0)
              {
                that.$baseMessage('设备调拨添加成功', 'success')
                that.$refs['form'].resetFields()
                that.$emit('close_comp')
                this.$emit('transferTable')
              }
              else
              {
                that.$baseMessage('设备调拨添加失败', 'error')
              }
            }
            else
            {
              that.$baseMessage('设备调拨添加失败', 'error')
            }
          }
          else {
            return false;
          }
        })
      },
      editsave()
      {
        let that=this;
        this.$refs['form'].validate(async (valid) => {
          if(valid)
          {
            let sData = '[Q]371{'+that.form.to_org+'$`'
            +that.form.reason+'$`'+that.form.apply_people+'$`'+that.form.send_time+'$`'+that.form.achieve_time+'$`'+that.form.allot_id+'}|^1|^SYS'
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('设备调拨编辑成功', 'success')
              that.$refs['form'].resetFields()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('设备调拨编辑失败', 'error')
            }
          }
          else {
            return false
          }
        })
      }
		},
	}
</script>
