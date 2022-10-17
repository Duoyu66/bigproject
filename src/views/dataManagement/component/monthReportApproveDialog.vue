<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" :width="width" top="5vh">

		<div style="max-height: calc(100vh - 200px); overflow-y: auto; width:95%">
      <el-row :gutter="10">
<!--       <el-col :span="24">
          <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
          	<el-form-item>
          		<el-date-picker
          		  v-model="queryForm.report_date"
          		  type="month"
          		  format="yyyy 年 MM 月"
          		  value-format="yyyy-MM"
          		  placeholder="请选择月报月份">
          		</el-date-picker>
          	</el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                type="primary"
                native-type="submit"
                @click="handleQuery"
              >
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </el-col> -->
        <el-col :span="24">
          <el-row :gutter="10">
            <el-col :span="4">
              <el-card class="box-card" v-loading="cardloading">
                <div slot="header" class="clearfix">
                    <span>{{selectData.row_data.duty_month+'月报统计'}}</span>
                  </div>
                <div v-for="item in selectData.data_static" :key="item.object_name" class="box-text box-item">
                  {{item.object_name + ':  ' + item.amount }}
                </div>
              </el-card>
            </el-col>
            <el-col :span="20">
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-card class="box-card" v-loading="cardloading">
                    <div slot="header" class="clearfix">
                      <span>{{selectData.row_data.duty_month+'月度考勤'}}</span>
                    </div>
                    <el-table ref="branchInstitutions" v-loading="listLoading" :data="selectData.attendance_data" border
                    	:element-loading-text="elementLoadingText" highlight-current-row :height="height" show-summary
                    	:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
                    	@sort-change="tableSortChange" @row-click="rowClick">
                    	<el-table-column show-overflow-tooltip label="姓名" prop="person_name" width="150" align="left"></el-table-column>
                      <el-table-column show-overflow-tooltip label="出勤日期" prop="duty_month" min-width="300" align="left"></el-table-column>
                      <el-table-column show-overflow-tooltip label="本项目出差天数" prop="duty_day_number" min-width="160" align="left"></el-table-column>
                      <el-table-column show-overflow-tooltip label="请假天数" prop="allowancesum" min-width="160" align="left"></el-table-column>
                      <el-table-column show-overflow-tooltip label="差旅费" prop="allowance" min-width="160" align="left"></el-table-column>
                    </el-table>
                  </el-card>
                </el-col>
                <el-col :span="24">
                  <el-card class="box-card" v-loading="cardloading">
                    <div slot="header" class="clearfix">
                      <span>{{selectData.row_data.duty_month+'月度工作量'}}</span>
                    </div>
                    <el-table ref="branchInstitutions" v-loading="listLoading" :data="selectData.project_data" border
                    	:element-loading-text="elementLoadingText" highlight-current-row :height="height" show-summary
                    	:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
                    	@sort-change="tableSortChange" @row-click="rowClick">
                    	<el-table-column show-overflow-tooltip label="检测项目" prop="object_name" width="150" align="left"></el-table-column>
                      <el-table-column show-overflow-tooltip label="数量" prop="count" min-width="90" align="left"></el-table-column>
                      <el-table-column show-overflow-tooltip label="单价" prop="unitprice" min-width="160" align="left"></el-table-column>
                      <el-table-column show-overflow-tooltip label="本月金额" prop="amount" min-width="160" align="left"></el-table-column>
                    </el-table>
                  </el-card>
                </el-col>
                <el-col :span="24">
                  <el-card class="box-card" v-loading="cardloading">
                    <div slot="header" class="clearfix">
                      <span>{{selectData.row_data.duty_month+'月度花费'}}</span>
                    </div>
                    <el-table ref="branchInstitutions" v-loading="listLoading" :data="selectData.expense_data" border
                    	:element-loading-text="elementLoadingText" highlight-current-row :height="height" show-summary
                    	:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
                    	@sort-change="tableSortChange" @row-click="rowClick">
                    	<el-table-column show-overflow-tooltip label="花费项目" prop="sub_project" width="150" align="left"></el-table-column>
                      <el-table-column show-overflow-tooltip label="花费日期" prop="cost_date" min-width="150" align="left"></el-table-column>
                      <el-table-column show-overflow-tooltip label="金额" prop="amount" min-width="160" align="left"></el-table-column>
                      <el-table-column show-overflow-tooltip label="事由" prop="reason" min-width="160" align="left"></el-table-column>
                      <el-table-column show-overflow-tooltip label="是否请示" prop="isApply" min-width="160" align="left"></el-table-column>
                      <el-table-column show-overflow-tooltip label="有无发票" prop="hasReceipt" min-width="160" align="left"></el-table-column>
                    </el-table>
                  </el-card>
                </el-col>
<!--                <el-col :span="24">
                  <el-card class="box-card" v-loading="cardloading">
                    <div slot="header" class="clearfix">
                      <span>{{selectData.row_data.duty_month+'月报统计'}}</span>
                    </div>
                    <el-table ref="branchInstitutions" v-loading="listLoading" :data="selectData.attendance_data" border
                    	:element-loading-text="elementLoadingText" highlight-current-row :height="height" show-summary
                    	:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
                    	@sort-change="tableSortChange" @row-click="rowClick">
                    	<el-table-column show-overflow-tooltip label="姓名" prop="person_name" width="150"></el-table-column>
                      <el-table-column show-overflow-tooltip label="出勤日期" prop="duty_month" min-width="300"></el-table-column>
                      <el-table-column show-overflow-tooltip label="本项目出差天数" prop="duty_day_number" min-width="160"></el-table-column>
                      <el-table-column show-overflow-tooltip label="请假天数" prop="allowancesum" min-width="160"></el-table-column>
                      <el-table-column show-overflow-tooltip label="差旅费" prop="allowance" min-width="160"></el-table-column>
                    </el-table>
                  </el-card>
                </el-col>
                <el-col :span="24">
                  <el-card class="box-card" v-loading="cardloading">
                    <div slot="header" class="clearfix">
                      <span>{{selectData.row_data.duty_month+'月报统计'}}</span>
                    </div>
                    <el-table ref="branchInstitutions" v-loading="listLoading" :data="selectData.attendance_data" border
                    	:element-loading-text="elementLoadingText" highlight-current-row :height="height" show-summary
                    	:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
                    	@sort-change="tableSortChange" @row-click="rowClick">
                    	<el-table-column show-overflow-tooltip label="姓名" prop="person_name" width="150"></el-table-column>
                      <el-table-column show-overflow-tooltip label="出勤日期" prop="duty_month" min-width="300"></el-table-column>
                      <el-table-column show-overflow-tooltip label="本项目出差天数" prop="duty_day_number" min-width="160"></el-table-column>
                      <el-table-column show-overflow-tooltip label="请假天数" prop="allowancesum" min-width="160"></el-table-column>
                      <el-table-column show-overflow-tooltip label="差旅费" prop="allowance" min-width="160"></el-table-column>
                    </el-table>
                  </el-card>
                </el-col> -->
              </el-row>
            </el-col>
          </el-row>
<!--          <el-tabs
            type="border-card"
            class="box_center"
            style="height:calc(100vh - 350px)"
          >
            <el-tab-pane label="实体检测">
              <monthReportTestTable style="height: calc(80vh)" ref="monthReportCostTable" :type="0"
              	:primary_key.sync="primary_key" :permission="permission"></monthReportTestTable>
            </el-tab-pane>
            <el-tab-pane label="物探项目">
              <monthReportGeoTable style="height: calc(80vh)" ref="monthReportGeoTable" :type="0"
              	:primary_key.sync="primary_key" :permission="permission"></monthReportGeoTable>
            </el-tab-pane>
            <el-tab-pane label="试验建材">
              <monthReportBuildingTable style="height: calc(80vh)" ref="monthReportBuildingTable" :type="0"
              	:primary_key.sync="primary_key" :permission="permission"></monthReportBuildingTable>
            </el-tab-pane>
            <el-tab-pane label="土工试验">
              <monthReportDiggerTable style="height: calc(80vh)" ref="monthReportDiggerTable" :type="0"
              	:primary_key.sync="primary_key" :permission="permission"></monthReportDiggerTable>
            </el-tab-pane>
            <el-tab-pane label="工作量">

            </el-tab-pane>
            <el-tab-pane label="考勤">

            </el-tab-pane>
            <el-tab-pane label="花费">

            </el-tab-pane>
          </el-tabs> -->
        </el-col>
      </el-row>

		</div>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<el-button type="primary" @click="submit">确 定</el-button>
			<el-button @click="close">取 消</el-button>

		</div>
	</el-dialog>
</template>

<script>
	import {
		doEdit,
    QueryExec
	} from '@/api/table'
  import {
  	mapGetters
  } from 'vuex'
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataEx2,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'
  import monthReportStatisticsTable from '../table/monthReportStatisticsTable'
	export default {
		name: 'TableEdit',
		// inject: ['objectReload'],
		props: {
			//.sync同步
			type: {
				type: Number,
				default: 0 //0 正常表单 1 详情表单
			},
      project_type: {
				type: Number,
				default: 0 //0 正常表单 1 详情表单
			},
		},
		watch: {
			screenWidth(newVal, oldVal) {
				// 为了避免频繁触发resize函数导致页面卡顿，使用定时器
				if (!this.timer) {
					// 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
					let that = this
					that.screenWidth = newVal
					that.timer = true
					setTimeout(function() {
						// 打印screenWidth变化的值
						that.setSpanAndWidth()
						that.timer = false
					}, 400)
				}
			}
		},
		data() {
			let that = this;
			return {
				screenWidth: document.body.clientWidth,
				width: '95%',
        height: '150',
				title: '',
        cardloading: false,
				dialogFormVisible: false,
        elementLoadingText: '数据加载中....',
				readonly: false,
        listLoading: false,
				row: {
					col: {
						all: 24,
						half: 12
					}
				},
        tablelist: [],
				selectData: {
					batch_unit: [],
					workflow: [],
					room: [],
					belong: [],
					has_entry: [],
					group_id: [],
					tpl_id: [],
          data_static: [],
          row_data: [],
          attendance_data: [],
          expense_data: []
				},
				info: {},
        queryForm: {
          report_date: (new Date().getFullYear())+'-'+(new Date().getMonth() + 1)
        },
				form: {
					tpl_id: '',
					object_name: '',
					group_id: '0',
					batch_unit: '',
					batch_freq: 0,
					repeat_rate: 0,
					witness_rate: 0,
					workflow: [],
					room_id: '',
					spec_formula: '',
					belong: '',
					has_entry: '',
					code: '',
					outer_objectid: '',
					auto_judge: false,
					version: 0,
					test_id: -1,
					object_id: -1,
				},
				rules: {

				},
				rules_temp: {
					object_name: [{
						required: true,
						trigger: 'blur',
						message: '请输入名称'
					}],
					group_id: [{
						required: true,
						trigger: 'blur',
						message: '请选择试验分组'
					}, {
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							if (that.form.object_id == value) {
								callback(new Error('父级节点不能为自己'));
								return;
							}
							callback()
						}

					}],
					batch_freq: [{
						required: true,
						trigger: 'blur',
						message: '请输入标准频率'
					}],
					repeat_rate: [{
						required: true,
						trigger: 'blur',
						message: '请输入平行率'
					}],
					witness_rate: [{
						required: true,
						trigger: 'blur',
						message: '请输入见证率'
					}],
					tpl_id: [{
						required: false,
						trigger: 'blur',
						message: '请选择行业'
					}],
					tpl_class: [{
						required: true,
						trigger: 'blur',
						message: '请选择版本号'
					}],
					has_entry: [{
						required: true,
						trigger: 'blur',
						message: '请选择试验类型'
					}]
				},
				formLabelWidth: '120px',
			}
		},
		created() {
			this.init();
		},
    computed: {
    	...mapGetters({
    		org_pid: 'user/org_pid',
    		org_id: 'user/org_id',
    		current_org_id: 'org/current_org',
    		person_id: 'user/person_id',
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
		methods: {
			init() {
				switch (this.type) {
					case 0:
						this.readonly = false
						this.rules = Object.assign(this.rules, this.rules_temp)
						break;
					case 1:
						this.readonly = true
						this.rules = {}
						break
				}
				this.GetGroup();
				this.GetGroupEx();
				this.setSpanAndWidth()
			},
      handleQuery() {

      },
      rowClick() {

      },
      tableSortChange() {

      },
      setSelectRows() {

      },
			setSpanAndWidth() {
				let width = this.screenWidth
				let col = this.row.col
				if (width >= 1920) {
					this.width = '75%';
					col.half = 12
					col.all = 12
				} else if (width > 1600) {
					this.width = '80%';
					col.half = 12
					col.all = 12
				} else if (width >= 1600) {
					this.width = '80%';
					col.half = 12
					col.all = 24
				} else if (width >= 1440) {
					this.width = '85%';
					col.half = 12
					col.all = 24
				} else if (width > 1366) {
					this.width = '90%';
					col.half = 24
					col.all = 24
				} else if (width > 1240) {
					this.width = '95%';
					col.half = 24
					col.all = 24
				} else if (width > 1000) {
					this.width = '95%';
					col.half = 24
					col.all = 24
				} else {
					this.width = '1000';
					col.half = 24
					col.all = 24
				}
			},
			isReadOnly(txt) {
				if (this.readonly) {
					return ''
				}
				return txt
			},
			async showEdit(row, info) {
				this.setSpanAndWidth()
				let form = {};
				let that = this;
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '审核'
          // this.selectData.data_static = row
					form = Object.assign(form, row)
				}
				this.title = this.title + '月报'
				if (this.type == 1) {
					this.title = '月报详情'
				}

        await that.GetMonthReportData(row)
        await that.GetAttendanceData(row)
        this.selectData.row_data = row
        console.log(this.selectData.data_static)
				if (info) {
					that.form.group_id = info.group_id
					that.info = Object.assign(that.info, info)
				} else {
					that.info = {};
				}
				that.form = Object.assign(that.form, form)
				that.form = that.editDeal(that.form)
				if (!that.form.group_id) {
					that.form.group_id = 0
				}
				this.dialogFormVisible = true
			},
			editDeal(form) {
				form.workflow = this.workflowSplit(form.workflow)
				if (form.auto_judge == '1') {
					form.auto_judge = true
				} else {
					form.auto_judge = false
				}
				return form;
			},
			async GetGroup() {
				let list = [{
					data: "batch_unit",
					group_id: 1004
				}, {
					data: "workflow",
					group_id: 1005
				}, {
					data: "belong",
					group_id: 1006
				}, {
					data: "has_entry",
					group_id: 1007
				}];
				await GetGroupDataEx2(this, list)

			},
      async GetMonthReportData(row) {
        let that = this
        this.cardloading = true
        let sData = '[Q]887{'+row.duty_month+'$`'+row.project_id+'}|^SYS'
        let res = await QueryExec(sData);
        console.log(sData,res)
        this.selectData.data_static=res.data

        sData = '[Q]888{'+row.duty_month+'$`'+row.project_id+'}|^SYS'
        res = await QueryExec(sData);
        console.log(sData,res)
        res.data.forEach((item,index)=>{
          // this.selectData.data_static.push({'object_name':'工资','amount':item.allowance})
          this.selectData.data_static.push({'object_name':'差旅','amount':item.travelexpensessum})
          this.selectData.data_static.push({'object_name':'委外成本','amount':item.consignexpense})
          this.selectData.data_static.push({'object_name':'设备折旧','amount':item.oldexpense})
          this.selectData.data_static.push({'object_name':'其他','amount':item.expenseaccount})
          console.log(this.selectData.data_static)
        })
        // this.selectData.data_static=res.data
        // this.selectData.data_static.push({object_name:row.duty_day_number})
        setTimeout(() => {
        	this.cardloading = false
        }, 10)
        // console.log(that.tablelist)
      },
      async GetAttendanceData(row) {
        let that = this
        let sData = '[Q]889{'+row.duty_month+'$`'+row.project_id+'}|^SYS'
        let res = await QueryExec(sData);
        console.log(sData,res)
        this.selectData.attendance_data=res.data

        sData = '[Q]890{'+row.duty_month+'$`'+row.project_id+'}|^SYS'
        res = await QueryExec(sData);
        console.log(sData,res)
        this.selectData.project_data=res.data

        sData = '[Q]891{'+row.duty_month+'$`'+row.project_id+'}|^SYS'
        res = await QueryExec(sData);
        console.log(sData,res)
        this.selectData.expense_data=res.data

      },
			async GetGroupEx() {

				let list = [{
					data: "room",
					sqlcode: 239
				}, {
					data: "group_id",
					sqlcode: 240
				}, {
					data: "tpl_id",
					sqlcode: 241
				}];
				await GetGroupDataCustomEx(this, list)
			},
			querySearchbatch_unit(queryString, cb) {
				if (this.type == 1) {
					cb([])
					return
				}
				let restaurants = this.selectData.batch_unit;
				let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			createFilter(queryString) {
				return (restaurant) => {
					return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			workflowJoin(list) {
				let str = ''
				let json = {}
				let array = []
				for (let i = 0; i < 7; i++) {
					json['num_' + i] = {
						num: i,
						is_have: false
					}
				}
				for (let i = 0; i < list.length; i++) {
					if (json['num_' + list[i]]) {
						json['num_' + list[i]].is_have = true;
					} else {
						json['num_' + i] = {
							num: i,
							is_have: true
						}
					}

				}
				for (let key in json) {
					let temp = json[key]
					if (temp.is_have) {
						array[temp.num] = 1;
					} else {
						array[temp.num] = 0;
					}

				}
				str = array.join('')
				return str
			},
			workflowSplit(str) {
				let array = [];
				for (let i = 0; i < str.length; i++) {
					if (str[i] == '1') {
						array.push(i + '')
					}
				}
				return array;
			},
			close(event, status) {
				// if (status) {
				// 	this.objectReload({
				// 			object_id: this.form.group_id,
				// 			info: this.info,
				// 			type: '重载'
				// 		},
				// 		undefined,
				// 		undefined
				// 	)
				// }
				this.$refs['form'].resetFields()
				this.form.test_id = -1
				this.form.object_id = 0
				this.form = this.$options.data().form
				this.dialogFormVisible = false
				console.log(this.form)
			},
      // async close(event, status) {
      // 	if (status) {
      // 		await this.reload_table()
      // 		//this.$emit('update:isUpData', !this.isUpData);
      // 		//this.$emit('on-change', !this.isUpData);
      // 	}
      // 	this.dialogFormVisible = false
      // },
			submitDeal() {
				let that = this;
				let form = that.form
				form.workflow_str = that.workflowJoin(form.workflow)
				if (form.auto_judge) {
					form.auto_judge_str = 1
				} else {
					form.auto_judge_str = 0
				}
				return form;
			},
			submit() {
				let that = this;
				if (that.type == 1) {
					that.close()
					return false
				}
				async function submit() {
					let form = that.submitDeal();
					let list = [{
							field: 'object_name',
							type: 3,
							level: 1,
						},
						{
							field: 'group_id',
							type: 3,
							level: 2,
						}, {
							field: 'batch_unit',
							type: 3,
							level: 3,
						},
						{
							field: 'batch_freq',
							type: 3,
							level: 4,
						},
						{
							field: 'repeat_rate',
							type: 3,
							level: 5,
						},
						{
							field: 'witness_rate',
							type: 3,
							level: 6,
						},
						{
							field: 'auto_judge_str',
							type: 3,
							level: 7,
						},
						{
							field: 'workflow_str',
							type: 3,
							level: 8,
						},
						{
							field: 'spec_formula',
							type: 3,
							level: 9,
						},
						{
							field: 'outer_objectid',
							type: 3,
							level: 10,
						},
						{
							field: 'code',
							type: 3,
							level: 11,
						},
						{
							field: 'room_id',
							type: 3,
							level: 12,
						},
						{
							field: 'belong',
							type: 3,
							level: 13,
						},
						{
							field: 'has_entry',
							type: 3,
							level: 14,
						},
						{
							field: 'tpl_id',
							type: 3,
							level: 15,
						},
						{
							field: 'version',
							type: 3,
							level: 16,
						},
						{
							field: 'object_id',
							type: 3,
							level: 17,
						}, {
							field: 'test_id',
							type: 3,
							level: 18,
						}
					]
					const {
						data
					} = await that.QueryExec_fob(242, list, form)
					console.log(data)
					if (!data || data.length == 0) {
						that.$baseMessage('提交失败', 'error')
						return
					}
					try {
						const json = JSON.parse(data[0].info)
						if (Number(json.code) > 0) {
							that.$baseMessage('提交成功', 'success')
							that.close(undefined, true);
						} else {
							that.$baseMessage('提交失败' + json.msg, 'error')
						}
					} catch (e) {
						console.error(e)
						that.$baseMessage('提交失败', 'error')
					}
				}

				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							submit();
						})
					} else {
						that.$baseMessage('表单验证失败', 'error')
					}
				})
			}
		},
	}
</script>

<style>
  .box-text {
    font-size: 14px;
  }

  .box-item {
    padding: 18px 0;
  }

/*  .box-card {
    width: 480px;
  } */
</style>
