<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row style="margin: 30px;">
      <el-col :span="span.full">
      	<el-form-item label="项目名称" :label-width="formLabelWidth" prop="project_id">
      		<el-select v-model="form.project_id" style="width: 100%" filterable placeholder="请选择项目名称">
      		  <el-option
      		    v-for="item in project_name_options"
      		    :key="item.project_id"
      		    :label="item.project_name"
      		    :value="item.project_id">
      		  </el-option>
      		</el-select>
      	</el-form-item>
      </el-col>
      <el-col :span="span.full">
      	<el-form-item label="出勤人" :label-width="formLabelWidth" prop="person_id">
      		<el-select v-model="form.person_id" style="width: 100%" filterable placeholder="请选择项目名称">
      		  <el-option
      		    v-for="item in person_name_options"
      		    :key="item.person_id"
      		    :label="item.person_name"
      		    :value="item.person_id">
      		  </el-option>
      		</el-select>
      	</el-form-item>
      </el-col>
      <el-col :span="span.full">
      	<el-form-item label="月份" :label-width="formLabelWidth" prop="ondutymonth">
      		<el-date-picker
      		  v-model="form.ondutymonth"
      		  type="month"
      		  format="yyyy-MM"
            value-format="yyyy-MM"
            style="width:100%"
      		  placeholder="选择月份">
      		</el-date-picker>
      	</el-form-item>
      </el-col>
			<el-col :span="span.full">
				<el-form-item label="日期" :label-width="formLabelWidth" prop="ondutydate">
					<el-date-picker
					  v-model="form.ondutydate"
					  type="dates"
					  format="dd"
            value-format="dd"
            style="width:100%"
					  placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
			</el-col>


<!-- 			<el-col :span="span.full">
				<el-form-item label="周报内容" :label-width="formLabelWidth" prop="week_content">
					<el-input
					  type="textarea"
					  :rows="15"
					  :placeholder="isReadOnly('请输入用途')"
            :readonly="readonly"
					  v-model="form.week_content">
					</el-input>
				</el-form-item>
			</el-col> -->


		</el-row>
	</el-form>
</template>

<script>
	//头像
	import procabstract from '@/components/Upload/upload'
  import { QueryExec,ExecSql } from '@/api/table'
	import TreeSelect from '@riophae/vue-treeselect'
	import {
		docRegisterProcess,
		upLoadDocReceiptHistory,
		upLoadDocDispatchHistory,
		GetProcessData
	} from '../js/common'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	import {
		mapGetters
	} from 'vuex'
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
		getdayEx
	} from '@/utils/dateHelp'
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'
	import {
		isNumEx,
		isTel,
		isPhone
	} from '@/utils/validate'
	export default {
		name: 'sealProcForm',
		components: {
			TreeSelect,
			procabstract
		},
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
				default: 0 //0 正常表单 1 详情表单 3 审核 4 发文添加用印申请
			},
			//显示的类型
			table_type: {
				type: String,
				default: '0',
			},
			outOrgStatus: {
				type: Boolean,
				default: false,
			}
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
				username: 'user/username'
			}),
		},
		mounted() {
			const that = this
			window.onresize = () => {
				return (() => {
					window.screenWidth = document.body.clientWidth
					that.screenWidth = window.screenWidth
				})()
			}
		},
		watch: {
			screenWidth(newVal, oldVal) {
				// 为了避免频繁触发resize函数导致页面卡顿，使用定时器
				if (!this.timer) {
					// 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
					let that = this
					that.timer = true
					setTimeout(function() {
						// 打印screenWidth变化的值

						that.timer = false
					}, 500)
				}
			},
		},
		data() {
			let that = this
			return {
				spanDefalut: {
					full: 24,
					half: 12,
					quarter: 6,
					oneThird: 8,
					span23: 23,
					span22: 22,
					span21: 21,
					span20: 20,
					span19: 19,
					span18: 18,
					span17: 17,
					span16: 16,
					span15: 15,
					span14: 14,
					span13: 13,
					span12: 12,
					span11: 11,
					span10: 10,
					span9: 9,
					span8: 8,
					span7: 7,
					span6: 6,
					span5: 5,
					span4: 4,
					span3: 3,
					span2: 2,
					span1: 1
				},
				span: {
					full: 24,
					half: 12,
					quarter: 6,
					oneThird: 8,
					span23: 23,
					span22: 22,
					span21: 21,
					span20: 20,
					span19: 19,
					span18: 18,
					span17: 17,
					span16: 16,
					span15: 15,
					span14: 14,
					span13: 13,
					span12: 12,
					span11: 11,
					span10: 10,
					span9: 9,
					span8: 8,
					span7: 7,
					span6: 6,
					span5: 5,
					span4: 4,
					span3: 3,
					span2: 2,
					span1: 1
				},
				process: {

				},
				sealIs: {
					tips: '添加后找不到印章，请查看印章是否启用'
				},
				readonly: false,
				sealIsReadonly: true,
				readonlyOrgId: true,
        project_name_options: [],
        person_name_options: [],
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(1),
				screenWidth: document.body.clientWidth,
				formdefalut: {},
				extraIsShow: false,
				maxHeight: 200,
				selectData: {
					seal_id: [],
					org_id: [],
					person: [],
				},
				form: {
					use_id: -1,
					apply_id: -1,
					use_date: getdayEx(undefined, undefined, dateFormat(1)),
					act_usage: '',
					sealer: '',
					sealerid: '',
					proc_memo: '',
					//审批时间
					apply_date: '',
          week_content: '',
          week_title: '',
          week_number: '',
          project_id: '',
          ondutymonth: '',
          ondutydate: ''
				},
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						seal_image: 12,
					},
					type_str: 'jpg/pdf/png/jpeg',
					type_array: ['image/jpeg', 'image/png', 'application/pdf'],
					file_size: '15',
					size_unit: 'MB',
					original_name: {
						seal_image: {},
					},
					success: {
						seal_image: false,
					},
					old_delete: {
						seal_image: false,
					}
				},
				rulesSign: {


				},
				rules_temp: {
				},
				rules: {

				},
				formLabelWidth: '120px',
			}

		},

		created() {
			this.init()
		},
		methods: {
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					case 0:
						this.readonly = false
						this.sealIsReadonly = true
						this.rules = this.rules_temp
						break;
					case 0:
						this.readonly = false
						this.sealIsReadonly = false
						this.rules = this.rules_temp
						break;
					case 2:
						this.readonly = false
						this.sealIsReadonly = true
						this.rules = this.rules_temp
						break;
						//详情
					case 1:
						this.readonly = true
						this.sealIsReadonly = true
						this.rules = {}
						//审核
					case 3:
						this.readonly = true
						this.sealIsReadonly = true
						this.rules = {}
						break
				}
				this.fetchData()

				// await this.GetGroup()
			},
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},
      async fetchData() {
        let sData = '[Q]867{'+this.current_org_id+'}|^SYS'
        const res = await QueryExec(sData)
        console.log("project_name",sData,res)
        this.project_name_options=res.data
        let sData1 = '[Q]873{'+this.current_org_id+'}|^SYS'
        const res1 = await QueryExec(sData1)
        console.log("project_name",sData1,res1)
        this.person_name_options=res1.data
      },
			close() {
				let that = this
				that.$refs['form'].resetFields()
				const refs = this.fileUploadRefs()
				const length = refs.length
				for (let i = 0; i < length; i++) {
					try {
						that.$refs[refs[i]].clear()
					} catch (e) {
						console.log(e)
					}
				}
				// this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
				// that.form = that.$options.data().form
				// that.form = JSON.parse(JSON.stringify(that.formdefalut))
			},
      getYearWeek(dateString){
          var da =dateString;//日期格式2015-12-30
          //当前日期
          var date1 = new Date(da.substring(0,4), parseInt(da.substring(5,7)) - 1, da.substring(8,10));
          //1月1号
          var date2 = new Date(da.substring(0,4), 0, 1);
          //获取1月1号星期（以周一为第一天，0周一~6周日）
          var dateWeekNum=date2.getDay()-1;
          if(dateWeekNum<0){dateWeekNum=6;}
          if(dateWeekNum<4){
              //前移日期
              date2.setDate(date2.getDate()-dateWeekNum);
          }else{
              //后移日期
              date2.setDate(date2.getDate()+7-dateWeekNum);
          }
          var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
          if(d<0){
              var date3 = (date1.getFullYear()-1)+"-12-31";
              return getYearWeek(date3);
          }else{
              //得到年数周数
              var year=date1.getFullYear();
              var week=Math.ceil((d+1 )/ 7);
              return year+"-"+week;
          }
      },
			async save() {
				let that = this
        console.log(that.form)
				let sData = '[Q]874{'+that.current_org_id+'$`'+that.form.project_id+'$`'+that.form.person_id+'$`'+that.form.ondutymonth+
        '$`'+that.form.ondutydate+'$`'+that.form.ondutydate.length+'}|^2|^SYS'
				const res = await ExecSql(sData)
        console.log(sData,res)
        if(res>0)
        {
          that.$baseMessage('考勤添加成功', 'success')
        }
        else {
          that.$baseMessage('考勤添加失败', 'error')
        }
        console.log(that.form)
			},
		},
	}
</script>

<style>
	.vue-treeselect--append-to-body {
		z-index: 999999 !important;
	}
</style>
