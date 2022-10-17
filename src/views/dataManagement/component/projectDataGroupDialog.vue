<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" :width="width" top="5vh">
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<el-form :model="form" ref="form" :rules="rules">
				<el-row>
					<el-col :span="row.col.all">
						<el-form-item label="试验名称" :label-width="formLabelWidth" prop="object_name">
							<el-input v-model="form.object_name" style="width: 100%;" maxlength="16"
								:placeholder="isReadOnly('请选择试验名称...')" :readonly="readonly"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="row.col.all">
						<el-form-item label="试验分组" :label-width="formLabelWidth" prop="group_id">
							<el-select v-model="form.group_id" style="width: 100%;"
								:placeholder="isReadOnly('请选择试验分组...')" :disabled="readonly">
								<el-option v-for="data in selectData.group_id" :key="data.key" :label="data.value"
									:value="data.key">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="row.col.all">
						<el-form-item label="批单位" :label-width="formLabelWidth" prop="batch_unit">
							<el-autocomplete class="inline-input" v-model="form.batch_unit"
								:fetch-suggestions="querySearchbatch_unit" :placeholder="isReadOnly('请输入批单位...')"
								:maxlength='8' style="width: 100%;" :readonly="readonly">
							</el-autocomplete>
						</el-form-item>
					</el-col>
					<el-col :span="row.col.half">
						<el-form-item label="平行率(%)" :label-width="formLabelWidth" prop="repeat_rate">
							<el-input-number v-model="form.repeat_rate" :precision="2" :min="0" :max="100"
								label="平行率(%)" style="width: 100%;" :disabled="readonly"></el-input-number>
							<!-- <el-input v-model="form.repeat_rate" style="width: 100%;"></el-input> -->
						</el-form-item>
					</el-col>
					<el-col :span="row.col.half">
						<el-form-item label="见证率(%)" :label-width="formLabelWidth" prop="witness_rate">
							<el-input-number v-model="form.witness_rate" :precision="2" :min="0" :max="100"
								label="平行率(%)" style="width: 100%;" :disabled="readonly"></el-input-number>
							<!-- <el-input v-model="form.number3" style="width: 100%;"></el-input> -->
						</el-form-item>
					</el-col>
					<el-col :span="row.col.half">
						<el-form-item label="标准频率(%)" :label-width="formLabelWidth" prop="batch_freq">
							<el-input-number v-model="form.batch_freq" :precision="2" :min="0" :max="100"
								label="标准频率(%)" style="width: 100%;" :disabled="readonly"></el-input-number>
							<!-- <el-input v-model="form.number3" style="width: 100%;"></el-input> -->
						</el-form-item>
					</el-col>
					<el-col :span="row.col.half">
						<el-form-item label="版本号" :label-width="formLabelWidth" prop="version">
							<el-input-number v-model="form.version" :precision="2" :step='0.1' :min="0" label="版本号"
								style="width: 100%;" :disabled="readonly"></el-input-number>
							<!-- <el-input v-model="form.number3" style="width: 100%;"></el-input> -->
						</el-form-item>
					</el-col>


					<el-col :span="row.col.half" v-if="false">
						<el-form-item label="行业" :label-width="formLabelWidth" prop="tpl_id">
							<el-select v-model="form.tpl_id" style="width: 100%;" :placeholder="isReadOnly('请选择行业...')"
								:disabled="readonly">
								<el-option v-for="data in selectData.tpl_id" :key="data.key" :label="data.value"
									:value="data.key">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="row.col.all">
						<el-form-item label="操作流程" :label-width="formLabelWidth">
							<el-select v-model="form.workflow" multiple style="width: 100%;"
								:placeholder="isReadOnly('请选择操作流程...')" :disabled="readonly">
								<el-option v-for="data in selectData.workflow" :key="data.item_name" :label="data.value"
									:value="data.custom">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="row.col.half">
						<el-form-item label="自动判定" :label-width="formLabelWidth">
							<el-switch v-model="form.auto_judge" active-color="#13ce66" inactive-color="#ff4949"
								active-text="自动" inactive-text="不自动" :disabled="readonly">
							</el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="row.col.all">
						<el-form-item label="所属项目" :label-width="formLabelWidth" prop="belong">
							<el-select v-model="form.belong" style="width: 100%;"
								:placeholder="isReadOnly('请选择所属项目...')" :disabled="readonly">
								<el-option v-for="data in selectData.belong" :key="data.item_name" :label="data.value"
									:value="data.custom">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="row.col.all">
						<el-form-item label="试验类型" :label-width="formLabelWidth" prop="has_entry">
							<el-select v-model="form.has_entry" style="width: 100%;"
								:placeholder="isReadOnly('请选择试验类型...')" :disabled="readonly">
								<el-option v-for="data in selectData.has_entry" :key="data.item_name"
									:label="data.value" :value="data.custom">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="row.col.all">
						<el-form-item label="所属检测室" :label-width="formLabelWidth">
							<el-select v-model="form.room_id" style="width: 100%;"
								:placeholder="isReadOnly('请选择所属检测室...')" :disabled="readonly">
								<el-option v-for="data in selectData.room" :key="data.key" :label="data.value"
									:value="data.key">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="row.col.all">
						<el-form-item label="描述格式" :label-width="formLabelWidth">
							<el-input v-model="form.spec_formula" style="width: 100%;" maxlength="40"
								:placeholder="isReadOnly('请输入描述格式...')" :readonly="readonly"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="row.col.all">
						<el-form-item label="编码前缀" :label-width="formLabelWidth">
							<el-input v-model="form.code" style="width: 100%;" maxlength="8"
								:placeholder="isReadOnly('请输入编码前缀...')" :readonly="readonly"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="row.col.all">
						<el-form-item label="外部上传编码" :label-width="formLabelWidth">
							<el-input v-model="form.outer_objectid" style="width: 100%;" maxlength="32"
								:placeholder="isReadOnly('请输入外部上传编码...')" :readonly="readonly"></el-input>
						</el-form-item>
					</el-col>

				</el-row>
			</el-form>
		</div>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<el-button type="primary" @click="submit">确 定</el-button>
			<el-button @click="close">取 消</el-button>

		</div>
	</el-dialog>
</template>

<script>
	import {
		doEdit
	} from '@/api/table'
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataEx2,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'
	export default {
		name: 'TableEdit',
		inject: ['objectReload'],
		props: {
			//.sync同步
			type: {
				type: Number,
				default: 0 //0 正常表单 1 详情表单
			}
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
				width: '75%',
				title: '',
				dialogFormVisible: false,
				readonly: false,
				row: {
					col: {
						all: 24,
						half: 12
					}
				},
				selectData: {
					batch_unit: [],
					workflow: [],
					room: [],
					belong: [],
					has_entry: [],
					group_id: [],
					tpl_id: [],
				},
				info: {},
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
			setSpanAndWidth() {
				let width = this.screenWidth
				let col = this.row.col
				if (width >= 1920) {
					this.width = '65%';
					col.half = 12
					col.all = 12
				} else if (width > 1600) {
					this.width = '65%';
					col.half = 12
					col.all = 12
				} else if (width >= 1600) {
					this.width = '75%';
					col.half = 12
					col.all = 24
				} else if (width >= 1440) {
					this.width = '75%';
					col.half = 12
					col.all = 24
				} else if (width > 1366) {
					this.width = '85%';
					col.half = 24
					col.all = 24
				} else if (width > 1240) {
					this.width = '90%';
					col.half = 24
					col.all = 24
				} else if (width > 600) {
					this.width = '95%';
					col.half = 24
					col.all = 24
				} else {
					this.width = '95%';
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
			showEdit(row, info) {
				this.setSpanAndWidth()
				let form = {};
				let that = this;
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
				}
				this.title = this.title + '试验项目'
				if (this.type == 1) {
					this.title = '试验项目详情'
				}

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
				if (status) {
					this.objectReload({
							object_id: this.form.group_id,
							info: this.info,
							type: '重载'
						},
						undefined,
						undefined
					)
				}
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
</style>
