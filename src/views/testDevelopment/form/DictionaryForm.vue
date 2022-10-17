<template>
	<span class="purchasefrom">
		<el-row :gutter="10" style="width: 100%;">
			<el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth" v-loading="formloading" style="overflow: hidden;padding:40px 0px 0px!important ;box-sizing: border-box;position: relative;">
				<el-col :span="9">
					<el-form-item label="数据代码" prop="meta" :label-width="formLabelWidth">
						<el-select v-model="form.meta" filterable remote placeholder="请输入关键词"
							:remote-method="getPersonList" v-loadmore="getPersonListMore">
							<el-option v-for="item in selectData.supervisee" :key="item.item_id" :label="item.item_name"
								:value="item.item_name">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="9">
					<el-form-item label="数据分类" prop="item_category" :label-width="formLabelWidth">
						<el-select v-model="form.item_category" style="width: 100%;" filterable placeholder="请选择">
							<el-option v-for="item in item_class_options" :key="item.item_name" :label="item.item_name"
								:value="item.item_id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="6"  >
					<el-form-item label="数据类型" prop="data_type" :label-width="formLabelWidth">
						<el-select v-model="form.data_type" style="width: 100px;" filterable placeholder="请选择">
							<el-option v-for="item in data_type_options" :key="item.item_name" :label="item.item_name"
								:value="item.item_id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
        <el-col :span="9">
          <el-form-item label="输入方式" :label-width="formLabelWidth">
            <el-select v-model="form.input_type" style="width: 100%;" filterable placeholder="请选择">
              <el-option v-for="item in input_options" :key="item.item_id" :label="item.input_name"
                :value="item.item_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="最大平行" prop="max_samples" :label-width="formLabelWidth">
            <el-input v-model="form.max_samples" style="width: 100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6"  style="text-align: right;">
					<el-form-item label="属于委托" :label-width="formLabelWidth">
						<el-switch v-model="form.in_order" active-value="1" inactive-value="0" class="changeWidth" style="margin-right: 15px;"></el-switch>
					</el-form-item>
				</el-col>
        <el-col :span="9">
        	<el-form-item label="分组来源" :label-width="formLabelWidth">
        		<el-select v-model="form.group_id" style="width: 100%;" filterable placeholder="请选择">
        			<el-option v-for="item in item_group_options" :key="item.item_name" :label="item.item_name"
        				:value="item.item_id">
        			</el-option>
        		</el-select>
        	</el-form-item>
          <el-button style type="primary" plain @click="datagroupadd" circle style="position:absolute;top:126px;left:323px;width:28px;height:28px;font-size:18px;padding:0px;" >+</el-button>
        </el-col>
        <el-col :span="9" >
        	<el-form-item label="实际平行" prop="act_samples" :label-width="formLabelWidth">
        		<el-input v-model="form.act_samples" style="width: 100%"></el-input>
        	</el-form-item>
        </el-col>

				<el-col :span="6" style="text-align: right;">
					<el-form-item label="属于记录" :label-width="formLabelWidth">
						<el-switch v-model="form.in_record" active-value="1" inactive-value="0" class="changeWidth" style="margin-right: 15px;"></el-switch>
					</el-form-item>
				</el-col>
        <el-col :span="9">
        	<el-form-item label="修约方式" :label-width="formLabelWidth">
        		<el-select v-model="form.rounding" style="width: 100%;" filterable placeholder="请选择">
        			<el-option v-for="item in rounding_options" :key="item.rounding_name"
        				:label="item.rounding_name" :value="item.rounding_id">
        			</el-option>
        		</el-select>
        	</el-form-item>
        </el-col>
         <el-col :span="9">
         	<el-form-item label="度量单位" :label-width="formLabelWidth">
         		<el-select v-model="form.metric_unit" style="width: 100%;" filterable placeholder="请选择">
         			<el-option v-for="item in metric_unit_options" :key="item.metric_unit_id"
         				:label="item.metric_unit_name" :value="item.metric_unit_id">
         			</el-option>
         		</el-select>
         	</el-form-item>
         </el-col>
				<el-col :span="6" style="text-align: right;">
					<el-form-item label="属于报告" :label-width="formLabelWidth">
						<el-switch v-model="form.in_report" active-value="1" inactive-value="0" class="changeWidth" style="margin-right: 15px;"></el-switch>
					</el-form-item>
				</el-col>

        <el-col :span="9">
        	<el-form-item label="修约位数" prop="scale" :label-width="formLabelWidth">
        		<el-input v-model="form.scale" style="width: 100%"></el-input>
        	</el-form-item>
        </el-col>
        <el-col :span="9">
        	<el-form-item label="度量类型" :label-width="formLabelWidth">
        		<el-select v-model="form.metric" style="width: 100%;" filterable placeholder="请选择">
        			<el-option v-for="item in metric_options" :key="item.metric_name" :label="item.metric_name"
        				:value="item.metric_id">
        			</el-option>
        		</el-select>
        	</el-form-item>
        </el-col>
				<el-col :span="6" style="text-align: right;">
					<el-form-item label="自动采集" :label-width="formLabelWidth">
						<el-switch v-model="form.is_auto" active-value="1" inactive-value="0" class="changeWidth" style="margin-right: 15px;"></el-switch>
					</el-form-item>
				</el-col>
        <el-col :span="9">
          <el-form-item label="台账映射" :label-width="formLabelWidth">
          	<el-select v-model="form.meta_desc" style="width: 100%;" filterable placeholder="请选择">
          		<el-option v-for="item in book_map_options" :key="item.item_id"
          			:label="item.item_name" :value="item.item_id">
          		</el-option>
          	</el-select>
          </el-form-item>
        </el-col>

        <el-col :span="9" >
        	<el-form-item label="平行插件" :label-width="formLabelWidth">
        		<el-input v-model="form.samples_proc" style="width: 100%"></el-input>
        	</el-form-item>
        </el-col>
				<el-col :span="6"  style="text-align: right;">
					<el-form-item label="需要判定" :label-width="formLabelWidth">
						<el-switch v-model="form.need_judge" active-value="1" inactive-value="0" class="changeWidth" style="margin-right: 15px;"></el-switch>
					</el-form-item>
				</el-col>

        <el-col :span="9">
          <el-form-item label="是否共享" prop="share_meta" :label-width="formLabelWidth" style="position: relative; left:-331px;">
          	<el-select v-model="form.share_meta" style="width: 100%;" filterable placeholder="请选择">
          		<el-option v-for="item in share_meta_options" :key="item.item_id"
          			:label="item.item_name" :value="item.item_id">
          		</el-option>
          	</el-select>
          </el-form-item>
        </el-col>

        <el-col :span="18">
        	<el-form-item label="计算公式" :label-width="formLabelWidth"  style="width:710px;">
        		<el-input v-model="form.expression" :rows="8" type="textarea" >
            </el-input>
        	</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-dropdown style="margin:0 0px 11px 35px;width: 160px;" trigger="click">
            <el-button style type="primary" plain style="height: 32px;width: 160px;" icon="el-icon-bottom-left">插入指标</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(meta,index) in meta_name_options" :key="index" @click.native="insertName(meta.meta_name)">{{meta.meta_name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown><br>

           <el-button type="primary" plain icon="el-icon-bottom-left" style="margin:0 0px 11px 35px;width: 160px;">插入括号</el-button><br>
          <el-button style type="primary" plain  style="margin:0 0px 11px 35px;width: 160px;" icon="el-icon-bottom-left">插入逻辑</el-button><br>
          <el-button style type="primary" plain icon="el-icon-bottom-left" style="width: 160px;margin:0 0px 11px 35px;">插入运算</el-button>
				</el-col>

			</el-form>
		</el-row>
    <dataGroup ref="dataGroup" @fetchData="fetchData"></dataGroup>
	</span>

</template>
<style lang="scss" scoped>
    // .changeWidth{ margin-left: 30px;}
    .changeWidth span.el-switch__core {width:60px!important;}
    .boxWidth{width:1000px!important;}
</style>
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
	import {
		TreeDataDeal,
		TreeDataDealEx
	} from '@/global/tree_deal'
  import {
    testProcessOption,
    bookmap
  } from '@/utils/testProcess.Helper'
  import {
  	parenMatch
  } from '@/utils/dataCache'
  import dataGroup from '../components/dataGroup.vue'
	export default {
		name: 'TableEdit',
    components: {
      dataGroup,
    },
		props: { //props列表
			father: {
				type: Object,
				required: false
			}
		},
		data() {
      var validate_number = (rule, value, callback) => {
        var reg = /^(-?\d+)(\.\d+)?$/;
        if (!reg.test(value)) {
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      };
			return {
				form: {
					item_category: '',
          id: '',
					meta_id: '',
					group_id: '',
					in_order: false,
					in_record: false,
					in_report: false,
					is_auto: false,
					need_judge: false,
					data_type: '',
					input_type: '',
					rounding: '',
					scale: '',
					metric: '',
					metric_unit: '',
					max_samples: '',
					act_samples: '',
					samples_proc: '',
					expression: '',
					param_id: '',
					meta: '',
					template_id: '',
          template_version: '',
          object_id: '',
          book_map: '0',
          meta_desc: '',
          share_meta: '0'
				},
				value: [],
				list: [],
				loading: false,
        meta_name_options: [{
						"meta_name": "普通项",
					}],
				rules: {
				  meta: [{ required: true, trigger: 'change', message: '请选择数据代码' }],
				  item_category: [{ required: true, trigger: 'change', message: '请选择数据项分类' }],
				  data_type: [{ required: true, trigger: 'change', message: '请选择数据类型' }],
          act_samples: [{ validator: validate_number, trigger: 'blur' }],
          max_samples: [{ validator: validate_number, trigger: 'blur' }],
          scale: [{ validator: validate_number, trigger: 'blur' }],
				},
				item_group_options: [],
				item_class_options: [{
						"item_name": "普通项",
						"item_id": "普通项",
					},
					{
						"item_name": "约束项",
						"item_id": "约束项"
					},
					{
						"item_name": "记录项",
						"item_id": "记录项"
					},
					{
						"item_name": "中间项",
						"item_id": "中间项"
					},
					{
						"item_name": "指标项",
						"item_id": "指标项"
					}
				],
				input_options: [{
						"input_name": "手动输入","item_id": ""
					},
          {
						"input_name": "单选","item_id": "单选"
					},
					{
						"input_name": "多选","item_id": "多选"
					}
				],
				data_type_options: [{
						"item_name": "文本",
						"item_id": "文本",
					},
					{
						"item_name": "数值",
						"item_id": "数值"
					},
					{
						"item_name": "日期",
						"item_id": "日期"
					},
					{
						"item_name": "时间",
						"item_id": "时间"
					},
					{
						"item_name": "时分",
						"item_id": "时分"
					},
					{
						"item_name": "分秒",
						"item_id": "分秒"
					},
					{
						"item_name": "图表",
						"item_id": "图表"
					},
					{
						"item_name": "图片",
						"item_id": "图片"
					},
					{
						"item_name": "附件",
						"item_id": "附件"
					}
				],
				metric_options: [{
						"metric_name": "0-无类型",
						"metric_id": "0",
					},
          {
						"metric_name": "1-重量",
						"metric_id": "1",
					},
					{
						"metric_name": "2-体积",
						"metric_id": "2"
					},
					{
						"metric_name": "3-湿度",
						"metric_id": "3"
					},
					{
						"metric_name": "4-温度",
						"metric_id": "4"
					}
				],
				rounding_options: [{
						"rounding_name": "0-无修约",
						"rounding_id": "0",
					},
					{
						"rounding_name": "1-四舍五入",
						"rounding_id": "1"
					},
					{
						"rounding_name": "2-0.2单位修约",
						"rounding_id": "2"
					},
					{
						"rounding_name": "3-0.5单位修约",
						"rounding_id": "3"
					},
				],
				metric_unit_options: [{
						"metric_unit_name": "空",
            "metric_unit_id": ""
					},
          {
						"metric_unit_name": "kg",
            "metric_unit_id": "kg"
					},
					{
						"metric_unit_name": "g",
            "metric_unit_id": "g"
					},
					{
						"metric_unit_name": "L",
            "metric_unit_id": "L"
					},
					{
						"metric_unit_name": "ml",
            "metric_unit_id": "ml"
					}
				],
        book_map_options: bookmap.meta_desc,
        share_meta_options: [{
						"item_name": "否",
            "item_id": "0"
					},
					{
						"item_name": "是",
					  "item_id": "1"
					}
				],
				selectData: {
					supervisee: [],
				},
				item_name_options: [],
				formLabelWidth: '100px',
				title: '',
				span1: 8,
				span2: 4,
				formloading: true,
				selectQuery: {
					supervisee: {
						query: '',
						page: 0,
						set: new Set(),
					},
				},
			}
		},
		created() {
			if (this.father) {
				this.form = Object.assign({}, this.father)
			}
			console.log(this.form)
			this.fetchData()
		},
		methods: {
			// async group_change(row) {
			//   this.formloading = true
			//   let sData;
			//   sData = '[Q]268{'+this.form.item_group+'}|^SYS'
			//   const res = await QueryExec(sData)
			//   console.log(res)
			//   this.item_name_options = res.data
			//   setTimeout(() => {
			//     this.formloading = false
			//   }, 500)
			// },
      insertName(val) {
        this.form.expression = this.form.expression+val
        console.log(val)
      },
			async displayadd(row) {
				this.formloading = true
				this.form.param_id = row.param_id
				this.form.template_id = row.template_id
        this.form.template_version = row.template_version
				console.log(row)

        let sData1 = '[Q]668{'+this.form.template_id+'}|^SYS'
        const res1 = await QueryExec(sData1)
        this.meta_name_options=res1.data

				setTimeout(() => {
					this.formloading = false
				}, 500)
			},
      datagroupadd() {
        this.$refs['dataGroup'].showEdit()
      },
			async display(row) {
				this.formloading = true
        this.form = row
        this.form.meta = row.meta_id + '-' + row.meta_name
        let sData = '[Q]745{' + this.form.template_id +'}|^SYS'
        const res = await QueryExec(sData)
        console.log(row)
        this.formulachangex(res)

        let sData1 = '[Q]668{'+this.form.template_id+'}|^SYS'
        const res1 = await QueryExec(sData1)
        this.meta_name_options=res1.data

        this.form.item_category = row.item_category
				setTimeout(() => {
					this.formloading = false
				}, 500)
			},
      formulachange(res) {
      	let that = this
      	let count = 0
        let k = 0
      	let ex = that.form.expression
        let str = ex.split('')
      	let temp = ''
      	for (let i = 0; i < str.length; i++) {
      		count = 0
          temp = ''
      		if (str[i] === '{') {
      			for (let j = i + 1; j < str.length; j++) {
      				if (str[j] === '}') {
      					i = j
      					break
      				}
      				temp = temp+str[j]
      			}
      			for (k = 0; k < res.total; k++) {

      				if (res.data[k].meta_name === temp) {
      					that.form.expression = that.form.expression.replace(temp, res.data[k].template_id +'-'+ res.data[k].meta_id)
                break
      				}
      			}

      			if (k === res.total) {
      				return false
      			}
      		}
      	}
      	return true
      },
      formulachangex(res) {
      	let that = this
      	let count = 0
        let k = 0
      	let ex = that.form.expression
        console.log(ex)
        let str = ex.split('')
      	let temp = ''
      	for (let i = 0; i < str.length; i++) {
      		count = 0
          temp = ''
      		if (str[i] === '{') {
      			for (let j = i + 1; j < str.length; j++) {
      				if (str[j] === '}') {
      					i = j
      					break
      				}
      				temp = temp+str[j]
      			}
      			for (k = 0; k < res.total; k++) {
      				if (res.data[k].meta_id === temp.split('-')[1]) {
      					that.form.expression = that.form.expression.replace(temp, res.data[k].meta_name)
                break
      				}
      			}
      			if (k === res.total) {
      				return false
      			}
      		}
      	}
      	return true
      },
			getPersonListMore() {
				this.getPersonList(
					this.selectQuery.supervisee.query,
					this.selectQuery.supervisee.page
				)
			},
			//被监督人数组 ，搜索和懒加载
			async getPersonList(query, page) {
				let that = this
				console.log(query, page)
				if (typeof query == 'undefined') {
					query = ''
				} else {
					that.selectQuery.supervisee.query = query
				}
				if (!page) {
					that.selectQuery.supervisee.page = 0
					page = 0
				}
				let sData
				sData = '[Q]282{%' + query + '%$`' + ((Number(page)) * 10).toString() + '$`10}|^SYS'
				const res = await QueryExec(sData)
				const data = res.data

				console.log(sData)
				//if (typeof query != 'undefined') {
				//	this.selectData.supervisee = data
				//} else {
				if (page === 0) {
					that.selectData.supervisee = []
					that.selectQuery.supervisee.set = new Set()
					// console.log(that.selectQuery.supervisee)
					for (let i = 0; i < data.length; i++) {
						if (!that.selectQuery.supervisee.set.has(data[i].item_id)) {
							that.selectData.supervisee.push(data[i])
							that.selectQuery.supervisee.set.add(data[i].item_id)
						}
					}
					// console.log(that.selectData.supervisee)
				} else {
					// console.log(data)
					for (let i = 0; i < data.length; i++) {

						if (!that.selectQuery.supervisee.set.has(data[i].item_id)) {
							that.selectData.supervisee.push(data[i])
							that.selectQuery.supervisee.set.add(data[i].item_id)
						}
					}
				}

				that.selectQuery.supervisee.page++
				//}
				console.log(that.selectQuery.supervisee)
			},
			async fetchData() {
				this.formloading = true
				this.selectData.supervisee = []
				try {
					let sData;
					sData = '[Q]283{0}|^SYS'
					const res = await QueryExec(sData)
					this.item_group_options = res.data
					this.selectQuery.supervisee.set = new Set()
					this.getPersonListMore()
					console.log(res)

				} catch (e) {
					console.log(e)
				}
				setTimeout(() => {
					this.formloading = false
				}, 500)
			},
			async save(symbol) {
				let that = this
				console.log(that.form)
        let count = 0
				let meta = this.form.meta.split("-")
				let sData = '[Q]476{' + that.form.template_id + '}|^SYS'
				const res1 = await QueryExec(sData)
        res1.data.push({'Total': (res1.total+1).toString(), 'meta_id': meta[0], 'meta_name': meta[1]})
        console.log(res1)
        if(parenMatch(that.form.expression))
        {
          const ju = that.formulachange(res1)
          that.form.expression=that.form.expression.replace(/（/g,'(')
          if(ju)
          {
            this.$refs['form'].validate(async (valid) => {
              if (valid) {
                if(that.form.item_category === '普通项' && Number(that.form.max_samples)>1) {
                  let sData1 = '[Q]284{' + that.form.param_id + '$`' + meta[0] + '$`' + meta[1] + '$`' +
                    that.form.group_id + '$`' + that.form.in_order + '$`' + that.form.in_record + '$`' + that.form.in_report + '$`' +
                    that.form.is_auto + '$`' + that.form.need_judge + '$`' + that.form.data_type + '$`' + that.form.input_type + '$`' + that.form.rounding + '$`' + that.form.scale +
                    '$`' + that.form.metric + '$`' + that.form.metric_unit + '$`' + that.form.max_samples + '$`' + that.form.act_samples + '$`'
                    + that.form.samples_proc + '$`' + that.form.expression + '$`' + that.form.template_id + '$`' + that.form.item_category +'$`' + that.form.meta_desc +
                    '$`0$`'+that.form.share_meta+'}|^2|^SYS'
                  console.log(sData1)
                  let re = await that.ExecMetaAdd1(sData1)
                  for(let i=1;i<=Number(that.form.max_samples);i++)
                  {
                    let maxsamples
                    maxsamples = i.toString()
                    let sData = '[Q]284{' + that.form.param_id + '$`' + (Number(meta[0])*1000 + i).toString() + '$`' + meta[1] + maxsamples + '$`' +
                      that.form.group_id + '$`' + that.form.in_order + '$`' + that.form.in_record + '$`' + that.form.in_report + '$`' +
                      that.form.is_auto + '$`' + that.form.need_judge + '$`' + that.form.data_type +
                      '$`' + that.form.input_type + '$`' + that.form.rounding + '$`' + that.form.scale +
                      '$`' + that.form.metric + '$`' + that.form.metric_unit + '$`' + that.form.max_samples + '$`' + that.form.act_samples + '$`'
                      + that.form.samples_proc + '$`' + that.form.expression + '$`' + that.form.template_id + '$`' + that.form.item_category +'$`' + that.form.meta_desc +
                      '$`' + re +'$`'+that.form.share_meta+ '}|^2|^SYS'
                    console.log(sData)
                    let re1 = await that.ExecMetaAdd1(sData)
                  }
                  that.close_dialog(symbol)
                }
                else if(that.form.item_category === '记录项' && Number(that.form.max_samples)>1) {
                  let sData1 = '[Q]284{' + that.form.param_id + '$`' + meta[0] + '$`' + meta[1] + '$`' +
                    that.form.group_id + '$`' + that.form.in_order + '$`' + that.form.in_record + '$`' + that.form.in_report + '$`' +
                    that.form.is_auto + '$`' + that.form.need_judge + '$`' + that.form.data_type + '$`' + that.form.input_type + '$`' + that.form.rounding + '$`' + that.form.scale +
                    '$`' + that.form.metric + '$`' + that.form.metric_unit + '$`' + that.form.max_samples + '$`' + that.form.act_samples + '$`'
                    + that.form.samples_proc + '$`' + that.form.expression + '$`' + that.form.template_id + '$`' + that.form.item_category +'$`' + that.form.meta_desc +
                    '$`0$`'+that.form.share_meta+'}|^2|^SYS'
                  console.log(sData1)
                  let re = await that.ExecMetaAdd1(sData1)
                  for(let i=1;i<=Number(that.form.max_samples);i++)
                  {
                    let maxsamples
                    maxsamples = i.toString()
                    let sData = '[Q]284{' + that.form.param_id + '$`' + (Number(meta[0])*1000 + i).toString() + '$`' + meta[1] +'试样'+ maxsamples + '$`' +
                      that.form.group_id + '$`' + that.form.in_order + '$`' + that.form.in_record + '$`' + that.form.in_report + '$`' +
                      that.form.is_auto + '$`' + that.form.need_judge + '$`' + that.form.data_type +
                      '$`' + that.form.input_type + '$`' + that.form.rounding + '$`' + that.form.scale +
                      '$`' + that.form.metric + '$`' + that.form.metric_unit + '$`' + that.form.max_samples + '$`' + that.form.act_samples + '$`'
                      + that.form.samples_proc + '$`' + that.form.expression + '$`' + that.form.template_id + '$`' + that.form.item_category +'$`' + that.form.meta_desc +
                      '$`' + re +'$`'+that.form.share_meta+ '}|^2|^SYS'
                    console.log(sData)
                    let re1 = await that.ExecMetaAdd1(sData)
                  }
                  that.close_dialog(symbol)
                }
                else if(that.form.item_category === '指标项')
                {
                  let i = 1
                  let sData1 = '[Q]284{' + that.form.param_id + '$`' + meta[0] + '$`' + meta[1] + '$`' +
                    that.form.group_id + '$`' + that.form.in_order + '$`' + that.form.in_record + '$`' + that.form.in_report + '$`' +
                    that.form.is_auto + '$`' + that.form.need_judge + '$`' + that.form.data_type + '$`' + that.form.input_type + '$`' + that.form.rounding + '$`' + that.form.scale +
                    '$`' + that.form.metric + '$`' + that.form.metric_unit + '$`' + that.form.max_samples + '$`' + that.form.act_samples + '$`'
                    + that.form.samples_proc + '$`' + that.form.expression + '$`' + that.form.template_id + '$`' + that.form.item_category +'$`' + that.form.meta_desc +
                    '$`0$`'+that.form.share_meta+'}|^2|^SYS'
                  console.log(sData1)
                  let re = await that.ExecMetaAdd1(sData1)
                  if(Number(that.form.max_samples)>1)
                  {
                    for(i=1;i<=Number(that.form.max_samples);i++)
                    {
                      let maxsamples
                      maxsamples = i.toString()
                      let sData = '[Q]284{' + that.form.param_id + '$`' + (Number(meta[0])*1000 + i).toString() + '$`' + meta[1] +'试样'+ maxsamples + '$`' +
                        that.form.group_id + '$`' + that.form.in_order + '$`' + that.form.in_record + '$`' + that.form.in_report + '$`' +
                        that.form.is_auto + '$`' + that.form.need_judge + '$`' + that.form.data_type + '$`' + that.form.input_type + '$`' + that.form.rounding + '$`' + that.form.scale +
                        '$`' + that.form.metric + '$`' + that.form.metric_unit + '$`1$`1$`'
                        + that.form.samples_proc + '$`' + that.form.expression + '$`' + that.form.template_id + '$`' + that.form.item_category +'$`' + that.form.meta_desc +
                        '$`' + re +'$`'+that.form.share_meta+'}|^2|^SYS'
                      console.log(sData)
                      let re1 = await that.ExecMetaAdd1(sData)
                    }
                  }

                  let sData2 = '[Q]284{' + that.form.param_id + '$`' + (Number(meta[0])*1000 + i) + '$`' + meta[1] +'标准值'+ '$`' +
                    that.form.group_id + '$`' + that.form.in_order + '$`0$`' + that.form.in_report + '$`' +
                    that.form.is_auto + '$`0$`' + that.form.data_type + '$`' + that.form.input_type + '$`' + that.form.rounding + '$`' + that.form.scale +
                    '$`' + that.form.metric + '$`' + that.form.metric_unit + '$`' + that.form.max_samples + '$`' + that.form.act_samples + '$`'
                    + that.form.samples_proc + '$`' + that.form.expression + '$`' + that.form.template_id + '$`' + that.form.item_category +'$`' + that.form.meta_desc +
                    '$`' + re +'$`'+that.form.share_meta+'}|^2|^SYS'
                  console.log(sData2)
                  await that.ExecMetaAdd1(sData2)
                  that.close_dialog(symbol)
                }
                else {
                  let sData = '[Q]284{' + that.form.param_id + '$`' + meta[0] + '$`' + meta[1] + '$`' +
                    that.form.group_id + '$`' + that.form.in_order + '$`' + that.form.in_record + '$`' + that.form.in_report + '$`'
                    + that.form.is_auto + '$`' + that.form.need_judge + '$`' + that.form.data_type +
                    '$`' + that.form.input_type + '$`' + that.form.rounding + '$`' + that.form.scale +
                    '$`' + that.form.metric + '$`' + that.form.metric_unit + '$`' + that.form.max_samples + '$`' + that.form.act_samples + '$`'
                    + that.form.samples_proc + '$`' + that.form.expression + '$`' + that.form.template_id + '$`' + that.form.item_category +'$`' + that.form.meta_desc +
                    '$`0$`'+that.form.share_meta+'}|^2|^SYS'
                  console.log(sData)
                  await that.ExecMetaAdd1(sData)
                  that.close_dialog(symbol)
                }
              } else {
                return false
              }
            })
          }
          else {
            that.$baseMessage('公式替换失败','error')
          }
        }
        else {
          that.$baseMessage('括号匹配失败','error')
        }
			},

      async ExecMetaAdd(sData) {
        let that = this
        const res = await ExecSql(sData)
        console.log(res)
        if (res > 0) {
          that.$baseMessage('指标添加成功', 'success')
          that.$refs['form'].resetFields()
          that.$emit('close_comp')
        } else {
        	that.$baseMessage('指标添加失败', 'error')
        }
        return res
      },
      async ExecMetaAdd1(sData) {
        let that = this
        const res = await ExecSql(sData)
        console.log(res)
        if (res > 0) {
          //that.$baseMessage('指标添加成功', 'success')
        } else {
        	that.$baseMessage('指标添加失败', 'error')
        }
        return res
      },
      async close_dialog(symbol) {
        let that = this

        that.$baseMessage('指标添加成功', 'success')
        that.$refs['form'].resetFields()
        if(symbol){
          that.$emit('close_comp')
        }

      },

      async editsave() {
      	let that = this
      	console.log(that.form)
      	let meta = this.form.meta.split("-")
      	let sData = '[Q]745{' + this.form.template_id + '}|^SYS'
      	const res1 = await QueryExec(sData)
        console.log(sData,res1)
        if(parenMatch(that.form.expression))
        {
          const ju = that.formulachange(res1)
          if(ju)
          {
            this.$refs['form'].validate(async (valid) => {
            	if (valid) {
            		let sData = '[Q]482{' + that.form.param_id + '$`' + meta[0] + '$`' + meta[1] +
            			'$`' +
            			that.form.group_id + '$`' + that.form.in_order +
            			'$`' + that.form.in_record + '$`' + that.form.in_report + '$`' + that.form
            			.is_auto + '$`' + that.form.need_judge + '$`' + that.form.data_type +
            			'$`' + that.form.input_type + '$`' + that.form.rounding + '$`' + that.form
            			.scale +
            			'$`' + that.form.metric + '$`' + that.form.metric_unit +
            			'$`' + that.form.max_samples + '$`' + that.form.act_samples + '$`' + that.form
            			.samples_proc + '$`' + that.form.expression + '$`' + that.form.template_id + '$`' + that.form.id +'$`' + that.form.item_category +'$`' + that.form.meta_desc +
            			'$`'+that.form.share_meta+'}|^1|^SYS'
            		console.log(sData)
                const res = await ExecSql(sData)
                if (res > 0) {
                  that.$baseMessage('指标修改成功', 'success')
                  that.$refs['form'].resetFields()
                  that.$emit('close_comp')
                } else {
                	that.$baseMessage('指标修改失败', 'error')
                }
            	} else {
            		return false
            	}
            })
          }
          else {
            that.$baseMessage('公式替换失败','error')
          }
        }
        else {
          that.$baseMessage('括号匹配失败','error')
        }
      },


		},
		mounted() {

		},
	}
</script>
