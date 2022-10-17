<template>
	<span class="purchasefrom">
		<el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
			<div style="width: 70%;border: 1px solid #dcdfe6;box-sizing: border-box;border-right:none;">
				<el-col :span="24">
					<el-form-item style="padding:3px 0 0 30px;" prop="judge_condition" label="判定条件定义"><br>
						<el-input v-model="form.judge_condition"
							style="width:680px;position: relative;left:-100px;margin-top: 10px;" type="textarea"
							:rows="5"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="约束项">
						<el-select v-model="form.condition_item" style="width: 100%;" filterable placeholder="请选择"
							@change="itemchange" clearable>
							<el-option v-for="item in condition_options" :key="item.meta" :label="item.meta_name"
								:value="item.meta">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="最小值">
						<el-select v-model="form.condition_min_value" style="width: 100%;" filterable allow-create
							placeholder="请选择" clearable>
							<el-option v-for="item in value_options" :key="item.item_id" :label="item.item_name"
								:value="item.item_name">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="最大值">
						<el-select v-model="form.condition_max_value" style="width: 100%;" filterable allow-create
							placeholder="请选择" clearable>
							<el-option v-for="item in value_options" :key="item.item_id" :label="item.item_name"
								:value="item.item_name">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="比较符">
						<el-select v-model="form.compare_op" style="width: 100%;" filterable placeholder="请选择"
							clearable>
							<el-option v-for="item in compare_options" :key="item.item_id" :label="item.item_name"
								:value="item.item_name">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="逻辑操作符" :label-width="formLabelWidth">
						<el-select v-model="form.logic_op" style="width: 100%;" filterable placeholder="请选择" clearable>
							<el-option v-for="item in logic_op_options" :key="item.item_id" :label="item.item_name"
								:value="item.item_id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="4" style="position: relative;left:30px">
					<el-button type="warning" plain @click="dataclear" icon="el-icon-delete">清空</el-button>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" plain @click="datajudge" icon="el-icon-bottom-left">插入</el-button>
				</el-col>
			</div>
			<div style="width: 30%; border: 1px solid #dcdfe6;box-sizing: border-box;background:#f9f9f9;">
				<p style="border-bottom: 1px solid #dcdfe6;padding:0 0 15px 17px;">标准值定义</p>
				<el-col :span="24">
					<el-form-item label="标准最小值" prop="min_value">
						<el-input v-model="form.min_value" style="width: 100%;"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="标准最大值" prop="max_value">
						<el-input v-model="form.max_value" style="width: 100%;"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="标准判定式">
						<el-select v-model="form.compare_op_main" style="width: 100%;" filterable placeholder="请选择">
							<el-option v-for="item in compare_options" :key="item.item_id" :label="item.item_name"
								:value="item.item_name">
							</el-option>
						</el-select>
					</el-form-item>
					<el-col :span="24">
						<el-form-item label="标准值显示">
							<el-autocomplete class="inline-input" v-model="form.spec_hint"
								:fetch-suggestions="querySearch" placeholder="" @select="handleSelect">
							</el-autocomplete>
						</el-form-item>
					</el-col>
				</el-col>
			</div>


			<!-- <el-col :span="24">
          <el-form-item label="试验" :label-width="formLabelWidth">
            <el-input v-model="form.object_name" width="100%" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="指标" :label-width="formLabelWidth">
            <el-input v-model="form.meta_name" style="width: 100%;" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="最大值" :label-width="formLabelWidth">
            <el-input v-model="form.max_value" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="最小值或定值" :label-width="formLabelWidth">
            <el-input v-model="form.min_value" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="比较操作符" :label-width="formLabelWidth">
            <el-select v-model="form.compare_op_main" style="width: 100%;" filterable placeholder="请选择">
            	<el-option v-for="item in compare_options" :key="item.item_id" :label="item.item_name"
            		:value="item.item_name">
            	</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="标准值显示" :label-width="formLabelWidth">
            <el-input v-model="form.spec_hint" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-divider></el-divider>
        </el-col>
        <el-col :span="24">
          <el-form-item label="判定条件" :label-width="formLabelWidth">
            <el-input v-model="form.judge_condition" type="textarea" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="条件项" :label-width="formLabelWidth">
            <el-select v-model="form.condition_item" style="width: 100%;" filterable placeholder="请选择">
            	<el-option v-for="item in condition_options" :key="item.item_id" :label="item.item_name"
            		:value="item.item_name">
            	</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最小值或定值" :label-width="formLabelWidth">
            <el-input v-model="form.condition_min_value" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最大值" :label-width="formLabelWidth">
            <el-input v-model="form.condition_max_value" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="比较操作" :label-width="formLabelWidth">
            <el-select v-model="form.compare_op" style="width: 100%;" filterable placeholder="请选择">
            	<el-option v-for="item in compare_options" :key="item.item_id" :label="item.item_name"
            		:value="item.item_name">
            	</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="逻辑操作符" :label-width="formLabelWidth">
            <el-select v-model="form.logic_op" style="width: 100%;" filterable placeholder="请选择">
            	<el-option v-for="item in logic_op_options" :key="item.item_id" :label="item.item_name"
            		:value="item.item_id">
            	</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" :label-width="formLabelWidth">
            <el-button @click="datajudge" >生成判定条件</el-button>
          </el-form-item>
        </el-col> -->

		</el-form>

	</span>
</template>
<style>
	.definition2 .purchasefrom .el-form-item {
		width: 95%;
	}

	.el-col-8 {
		position: relative;
		left: -15px;
	}

	.el-col-4 {
		position: relative;
		left: 24px;
	}
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
		parenMatch
	} from '@/utils/dataCache'
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
			let that = this;
			var validate_number = (rule, value, callback) => {
				var reg = /^(-?\d+)(\.\d+)?$/;
				if (that.form.compare_op_main == '') {

				}
				switch (that.form.compare_op_main) {
					case 'x==min':
						callback();
						break;
					default:
						if (value != '' && !reg.test(value)) {
							callback(new Error('请输入数字'));
						} else {
							callback();
						}
						break
				}

			};
			return {
				form: {
					manage_id: '',
					doc_name: '',
					standard_id: '',
					object_name: '水泥',
					meta_name: '',
					release_date: '',
					impl_date: '',
					prop_date: '',
					enable_date: '',
					business_type: '',
					version: '',
					pdf_file: '',
					release_org: '',
					std_id: '',
					compare_op: '',
					condition_max_value: '',
					condition_min_value: '',
					min_value: '',
					tpl_class: '',
					max_value: '',
					condition_item: '',
					logic_op: '',
					judge_condition: '',
					compare_op_main: '',
					spec_hint: '',
					criteria_id: ''
				},
				rules: {
					min_value: [{
						validator: validate_number,
						trigger: 'blur'
					}],
					max_value: [{
						validator: validate_number,
						trigger: 'blur'
					}],
				},
				formloading: true,
				condition_options: [],
				compare_options: [{
						"item_name": "x==min",
						"item_id": "x==min"
					},
					{
						"item_name": "x>=min",
						"item_id": "x>=min"
					},
					{
						"item_name": "x<=max",
						"item_id": "x<=max"
					},
					{
						"item_name": "x>min",
						"item_id": "x>min"
					},
					{
						"item_name": "x<max",
						"item_id": "x<max"
					},
					{
						"item_name": "x!=min",
						"item_id": "x!=min"
					},
					{
						"item_name": "min<x<max",
						"item_id": "min<x && x<max"
					},
					{
						"item_name": "min<=x<max",
						"item_id": "min<=x && x<max"
					},
					{
						"item_name": "min<x<=max",
						"item_id": "min<x && x<=max"
					},
					{
						"item_name": "min<=x<=max",
						"item_id": "min<=x && x<=max"
					},
					{
						"item_name": "xЭmin",
						"item_id": "xЭmin"
					}
				],
				value_options: [],
				formLabelWidth: '100px',
				title: '',
				judge: '',
				listjudge: [],
				logic_op_options: [{
						"item_name": "AND",
						"item_id": "&&"
					},
					{
						"item_name": "OR",
						"item_id": "||"
					}
				],
				restaurants: []
			}
		},
		created() {

		},
		mounted() {
			this.restaurants = this.loadAll();
		},
		methods: {

			display(item) {
				this.formloading = true
				this.displaycustomername = false
				console.log(item)
				this.form.object_name = item.object_name
				this.form.meta_name = item.meta_name
				this.form.object_id = item.object_id
				this.form.meta_id = item.meta_id
        this.form.tpl_class = item.tpl_class
				this.fetchData(item)
				setTimeout(() => {
					this.formloading = false
				}, 500)
			},
			displayEdit(item) {

				this.displaycustomername = false

				this.form.judge_condition = item.condition
				this.form.object_id = item.object_id
				this.form.meta_id = item.meta_id
				this.form.object_name = item.object_name
				this.form.meta_name = item.meta_name
				this.form.compare_op_main = item.compare_op
				this.form.max_value = item.max_value
				this.form.min_value = item.min_value
				this.form.spec_hint = item.spec_hint
				this.form.criteria_id = item.criteria_id
				this.form.compare_op = ''
				this.judge = item.condition
				console.log(this.form,this.judge)
				this.fetchData(item)
			},
			async itemchange(item) {
				this.formloading = true
				console.log(item)
				let sData
				if (item.split('^')[1] == '1') {
					sData = '[Q]741{' + this.form.object_id +'$`'+this.form.tpl_class+'$`1}|^SYS'
				} else if (item.split('^')[1] == '2') {
          sData = '[Q]740{' + this.form.object_id + '}|^SYS'
        } else {
					sData = '[Q]740{' + item.split('^')[1] + '}|^SYS'
				}
				const res = await QueryExec(sData)
				console.log(sData)
				this.value_options = res.data
				setTimeout(() => {
					this.formloading = false
				}, 500)
			},
			dataadd() {
				this.form.judge_condition = '(' + this.form.judge_condition + ')'
			},
			dataclear() {
				this.formloading = true
				this.form.judge_condition = ''
				this.form.condition_item = ''
				this.form.condition_max_value = ''
				this.form.condition_min_value = ''
				this.form.compare_op = ''
				this.form.logic_op = ''
				this.judge = ''
				setTimeout(() => {
					this.formloading = false
				}, 500)
			},
			datajudge() {
				this.formloading = true
				let sJudge = this.judge;
				let comp = this.form.compare_op;
				comp = comp.replace("min", "'" + this.form.condition_min_value + "'")
				console.log()
				comp = comp.replace('max', "'" + this.form.condition_max_value + "'")
				comp = comp.replace("x", '{' + this.form.condition_item.split('^')[0] + '}')
				this.listjudge.push({
					"comp": comp,
					"logic_op": this.form.logic_op
				})
				if (sJudge === '') {
					sJudge = '(' + comp + ') '
				} else {
					sJudge = sJudge + this.form.logic_op + ' (' + comp + ')'
				}
				this.judge = sJudge
				console.log(sJudge)
				this.form.judge_condition = sJudge
				console.log(this.form)
				setTimeout(() => {
					this.formloading = false
				}, 10)
			},
			save() {
				let that = this
				if (parenMatch(that.form.judge_condition)) {
					that.$refs['form'].validate(async (valid) => {
						if (valid) {
							let sData = '[Q]485{' + that.form.object_id + '$`' + that.form.meta_id + '$`' +
								that.form.min_value + '$`' + that.form.max_value + '$`' +
								that.form.compare_op_main + '$`' + that.form.spec_hint + '$`' + that.form.judge_condition +
								'$`1$`' +this.form.tpl_class+ '}|^2|^SYS'
							console.log(sData)
							const res = await ExecSql(sData)
							if (res > 0) {
								that.$baseMessage('规则添加成功', 'success')
								that.$refs['form'].clearValidate()
								that.$emit('close_comp')
							} else {
								that.$baseMessage('规则添加失败', 'error')
							}
						}
					})
				} else {
					that.$baseMessage('规则括号匹配失败，请详细查看判定规则', 'error')
				}
			},
			editsave() {
				let that = this
				that.$refs['form'].validate(async (valid) => {
					if (valid) {
						let sData = '[Q]549{' + that.form.object_id + '$`' + that.form.meta_id + '$`' + that
							.form.min_value + '$`' + that.form.max_value + '$`' +
							that.form.compare_op_main + '$`' + that.form.spec_hint + '$`' + that.form
							.judge_condition + '$`' + '1$`' + that.form.criteria_id + '}|^1|^SYS'
						console.log(sData)
						const res = await ExecSql(sData)
						if (res > 0) {
							that.$baseMessage('标准修改成功', 'success')
							that.$refs['form'].clearValidate()
							that.$emit('close_comp')
						} else {
							that.$baseMessage('标准修改失败', 'error')
						}

					}
				})
			},
			async fetchData(row) {
				let sData = '[Q]739{' + this.form.object_id +'$`'+this.form.tpl_class+ '}|^SYS'
				const res = await QueryExec(sData)
				console.log(res)
				this.condition_options = res.data

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
			loadAll() {
				return [{
						"value": "≥"
					},
					{
						"value": "≤"
					},
					{
						"value": "±"
					},
					{
						"value": ">"
					},
					{
						"value": "<"
					},
				];
			},
			handleSelect(item) {
				console.log(item);
			}
		},
	}
</script>
