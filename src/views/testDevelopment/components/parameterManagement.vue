<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" append-to-body>
		<el-form :model="form" ref="form" :rules="rules">
			<el-row>
				<el-col :span="col.all">
					<el-form-item label="参数名称" :label-width="formLabelWidth" prop="param">
						<el-input v-model="form.param" style="width: 100%" maxlength="16"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="col.all">
					<el-form-item label="报告页显示名称" :label-width="formLabelWidth" prop="param_proc">
						<el-input v-model="form.param_proc" style="width: 100%" maxlength="100"></el-input>
					</el-form-item>
				</el-col>
				<!-- <el-col :span="col.all">
					<el-form-item label="父级参数" :label-width="formLabelWidth">
						<tree-select :options="selectData.parent_id" :max-height="maxHeight" :multiple="false"
							:placeholder="isReadOnly('请选择父级参数...')" :disabled="readonly" v-model="form.parent_id" />
					</el-form-item>
				</el-col> -->
				<el-col :span="col.half">
					<el-form-item label="行业" :label-width="formLabelWidth" prop="tpl_id" :required="required.tpl_id">
						<el-select v-model="form.tpl_id" style="width: 100%;" :multiple="true">
							<el-option v-for="data in selectData.tpl_id" :key="data.key" :label="data.value"
								:value="data.key">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="col.half">
					<el-form-item label="参数版本" :label-width="formLabelWidth" prop="param_version">
						<el-input-number v-model.number="form.param_version" :min="0" label="参数版本" style="width: 100%">
						</el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="col.half">
					<el-form-item label="参数类型" :label-width="formLabelWidth" prop="param_type">
						<el-select v-model="form.param_type" placeholder="请选择" style="width: 100%">
							<el-option v-for="data in selectData.param_type" :key="data.value" :label="data.value"
								:value="data.custom">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="col.half">
					<el-form-item label="启用时间" :label-width="formLabelWidth" prop="enable_time">
						<el-date-picker v-model="form.enable_time" align="right" type="date"
							:placeholder="isReadOnly('选择日期')" :picker-options="date.pickerOptions" style="width: 100%"
							:format='date.dateFormat' :value-format="date.dateFormat" :readonly="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="col.half">
					<el-form-item label="龄期" :label-width="formLabelWidth" prop="age_input">
						<el-input placeholder="请输入内容" v-model.number="form.age_input" class="input-with-select"
							maxlength="3">
							<el-select v-model="form.age_append" slot="append" placeholder="请选择" style="width: 80px;">
								<el-option v-for="data in selectData.age_append" :key="data.value" :label="data.value"
									:value="data.value">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>

				</el-col>
				<el-col :span="col.half">
					<el-form-item label="参数分类" :label-width="formLabelWidth" prop="class_name">
						<el-input v-model="form.class_name" style="width: 100%" maxlength="50"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="col.half">
					<el-form-item label="单位" :label-width="formLabelWidth" prop="unit">
						<el-input v-model="form.unit" style="width: 100%" maxlength="25"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="col.half">
					<el-form-item label="" :label-width="formLabelWidth">
						<el-switch v-model="form.enabled" active-color="#13ce66" inactive-color="#ff4949"
							active-text="启用" inactive-text="禁用">
						</el-switch>
					</el-form-item>
				</el-col>
				<el-col :span="col.all">
					<el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
						<el-input v-model="form.remarks" style="width: 100%" maxlength="100" type="textarea"
							:autosize="{ minRows: 5}" show-word-limit></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<el-button type="primary" @click="save">
				确 定
			</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		format_fob,
		pickerOptions,
		getdayEx,
		getday,
		dateFormat,
	} from '@/utils/dateHelp'
	import TreeSelect from '@riophae/vue-treeselect'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataEx2,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'

	import {
		doEdit
	} from '@/api/table'
	export default {
		name: 'ParamEdit',
		components: {
			TreeSelect
		},
		inject: ['paramReload'],
		props: {
			type: {
				type: Number,
				default: 0 //0 正常表单 1 详情表单
			}
		},
		data() {
			let that = this;
			var validateAge = (rule, value, callback) => {
				if (that.form.age_input < 0) {
					callback(new Error('龄期不可输入负数'));
					return
				}
				if (!that.form.age_append && that.form.age_input) {
					callback(new Error('请选择龄期单位'));
					return
				}
				let age = that.form.age_input + that.form.age_append
				if (age.length > 4) {
					callback(new Error('长度超过限制,长度应小于5位（包括单位）'));
				} else {
					callback();
				}
			};
			return {
				readonly: false,
				maxHeight: 200,
				col: {
					all: 24,
					half: 12,
					one_third: 7,
				},
				selectData: {
					age_append: [],
					parent_id: [],
					tpl_id: [],
				},
				date: {
					pickerOptions: pickerOptions(),
					dateFormat: dateFormat(),
				},
				required: {
					tpl_id: false,
				},
				rules: {

				},
				rules_: {
					param: [{
						required: true,
						trigger: 'blur',
						message: '请输入名称',

					}],
					param_proc: [{
						required: false,
						trigger: 'blur',
						message: '请输入报告页名称',
					}],
					tpl_id: [{
						//required: true,
						trigger: 'blur',
						//message: '请选择行业',
						validator: function(rule, value, callback) {
							if (that.required.tpl_id && !value) {
								callback(new Error('请选择行业'))
							} else {
								callback()
							}
							return
						}
					}],
					param_version: [{
						required: true,
						trigger: 'blur',
						message: '请输入版本'
					}],
					enable_time: [{
						required: true,
						trigger: 'blur',
						message: '请选择启用时间'
					}],
					param_type: [{
						required: true,
						trigger: 'blur',
						message: '请选择参数类型'
					}, {
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							let list = that.selectData.param_type

							if (!list || list.length == 0) {
								callback()
								return
							}
							let item = list.filter((e) => {
								if (e.custom == value) {
									return e
								}
							})
							if (!item || item.length == 0) {
								callback()
								return
							}
							if (item[0].value == '试验') {
								that.required.tpl_id = true
							} else {
								that.required.tpl_id = false
							}
							callback()
						}
					}],
					age_input: [{
						type: 'number',
						required: false,
						message: '龄期必须为数字值',
						transform(value) {
							return _.toNumber(value)
						}
					}, {
						validator: validateAge,
						trigger: 'blur'
					}],
					remarks: [],
				},
				dialogFormVisible: false,
				info: {

				},
				form: {
					age_input: '',
					age: '',
					age_append: '',
					enabled: false,
					param_version: 0,
					class_name: '',
					enable_time: getdayEx(),
					param: '',
					remarks: '',
					tpl_id: '',
					id: -1,
					param_type: '试验',
					param_id: -1,
					parent_id: 0,
					param_proc: '',
				},
				title: '',
				formLabelWidth: '120px',
			}
		},
		watch: {
			age_append(newVal, oldVal) {
				console.log('watch age_append', newVal, oldVal)
				if (newVal) {
					this.age = this.form.age_input + newVal
				}
			},
			age_input(newVal, oldVal) {
				console.log('watch age_input', newVal, oldVal)
				if (newVal) {
					this.age = newVal + this.form.age_append
				}
			}
		},
		created() {
			this.init()
		},
		methods: {

			init() {
				switch (this.type) {
					case 0:
						this.readonly = false
						this.rules = Object.assign(this.rules, this.rules_)
						break;
					case 1:
						this.readonly = true
						this.rules = {}
						break
				}
				this.GetGroup()
				this.GetGroupEx()
				this.$nextTick(() => {
					this.clearValidate()
				})
			},
			clearValidate(prop) {
				if (this.$refs['form']) {
					this.$refs['form'].clearValidate(prop)
				}
			},
			isReadOnly(txt) {
				if (this.readonly) {
					return ''
				}
				return txt
			},
			showEdit(row, info) {
				let form = {}
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
				}
				if (info) {
					form = Object.assign(form, info)
					this.info = Object.assign(this.info, info)
				} else {
					this.info = {};
				}
				if (form.tpl_id) {
					let temp = form.tpl_id.split(',').filter((e) => {
						return e
					})
					form.tpl_id = temp
				}
				this.title += '参数'
				this.form = Object.assign(this.form, form)
				console.log(this.form)

				this.form = this.editEdit(form)
				this.dialogFormVisible = true
			},
			editEdit(form) {
				try {
					if (form.enabled == '1') {
						form.enabled = true
					} else {
						form.enabled = false
					}
					if (form.age) {
						form.age_input = form.age.replace(/[^0-9]/ig, "")
						form.age_append = form.age.replace(/[0-9]/ig, "")
					} else {
						form.age_input = '';
						form.age_append = '';
					}
					if (!form.param_version) {
						form.param_version = 1;
					}
					if (!form.enable_time) {
						form.enable_time = getdayEx();
					}
				} catch (e) {
					console.log(e)
				}
				return form

			},
			async GetGroup() {
				let list = [{
					data: "age_append",
					group_id: 1008
				}, {
					data: "param_type",
					group_id: 1009
				}];
				await GetGroupDataEx2(this, list)
			},
			async GetGroupEx() {
				let list = [{
					data: "tpl_id",
					sqlcode: 241
				}];
				await GetGroupDataCustomEx(this, list)
			},
			close(status) {
				if (status) {
					this.reload_table()
				}
				this.dialogFormVisible = false
				this.resetFields()

			},
			reload_table() {
				console.log({
					param_id: this.form.parent_id,
					info: this.info,
					type: '重载'
				})
				this.paramReload({
						param_id: this.form.parent_id,
						info: this.info,
						type: '重载'
					},
					undefined,
					undefined
				)
			},
			resetFields() {
				this.$refs['form'].resetFields()
				this.form = this.$options.data().form

			},
			submitDeal(form) {
				if (form.age_input) {
					form.age = form.age_input + form.age_append
				}
				if (form.enabled) {
					form.enabled = 1;
				} else {
					form.enabled = 0;
				}
				return form
			},
			save() {
				let that = this;
				console.log(this.form)
				async function submit() {
					let form = Object.assign({}, that.form)
					form = that.submitDeal(form);
					let list = [{
							field: 'param',
							type: 3,
							level: 1,
						},
						{
							field: 'age',
							type: 3,
							level: 2,
						}, {
							field: 'enabled',
							type: 3,
							level: 3,
						},
						{
							field: 'enable_time',
							type: 3,
							level: 4,
						},
						{
							field: 'tpl_id',
							type: 3,
							level: 5,
						},
						{
							field: 'param_version',
							type: 3,
							level: 6,
						},
						{
							field: 'remarks',
							type: 3,
							level: 8,
						},
						{
							field: 'parent_id',
							type: 3,
							level: 9,
						},
						{
							field: 'param_id',
							type: 3,
							level: 10,
						}, {
							field: 'class_name',
							type: 3,
							level: 11,
						}, {
							field: 'param_type',
							type: 3,
							level: 12,
						}, {
							field: 'param_proc',
							type: 3,
							level: 13,
						}, {
							field: 'unit',
							type: 3,
							level: 14,
						},
						{
							field: 'id',
							type: 3,
							level: 15,
						}
					]
					const {
						data
					} = await that.QueryExec_fob(249, list, form)
					console.log(data)
					if (!data || data.length == 0) {
						that.$baseMessage('提交失败', 'error')
						return
					}
					try {
						const json = JSON.parse(data[0].info)
						if (Number(json.code) > 0) {
							that.$baseMessage('提交成功', 'success')
							return true;
						} else {
							that.$baseMessage('提交失败' + json.msg, 'error')
							return false
						}
					} catch (e) {
						console.error(e)
						that.$baseMessage('提交失败', 'error')
					}
					return false
				}

				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							let status = await submit();
							if (status) {
								that.close(true)
							}
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

</style>
