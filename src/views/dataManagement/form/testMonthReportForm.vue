<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
<!-- 			<el-col :span="span">
				<el-form-item label="分组id" :label-width="formLabelWidth" prop="group_id" v-show="form.group_id">
					<el-input v-model="form.group_id" :placeholder="isReadOnly('')" style="width:100%" :readonly="true"
						maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="字典id" :label-width="formLabelWidth" prop="item_id"
					v-show="form.item_id&&form.item_id>0">
					<el-input v-model="form.item_id" :placeholder="isReadOnly('')" style="width:100%" :readonly="true"
						maxlength="16">
					</el-input>
				</el-form-item>
			</el-col> -->
      <el-col :span="span">
      	<el-form-item label="项目名称" :label-width="formLabelWidth" prop="project_id">
      		<el-select v-model="form.project_id" style="width: 100%;" filterable
      			:placeholder="isReadOnly('请选择项目...')" :disabled="readonly">
      			<el-option v-for="data in selectData.projectOrgData" :key="data.project_id" :label="data.project_name"
      				:value="data.project_id">
      			</el-option>
      		</el-select>
      	</el-form-item>
      </el-col>
			<el-col :span="span">
				<el-form-item :label="labelProjectTitle" :label-width="formLabelWidth" prop="object_id">
					<el-select v-model="form.object_id" style="width: 100%;" filterable
						:placeholder="isReadOnly(placeholderTitle)" :disabled="readonly">
						<el-option v-for="data in selectData.testObjectData" :key="data.object_id" :label="data.object_name"
							:value="data.object_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="日期" :label-width="formLabelWidth" prop="income_date">
          <el-date-picker v-model="form.income_date" type="month" :placeholder="isReadOnly('请选择月份')"
          format="yyyy 年 MM 月" value-format="yyyy-MM" style="width:100%">
          </el-date-picker>
				</el-form-item>
			</el-col>
      <el-col :span="span">
      	<el-form-item label="单价" :label-width="formLabelWidth" prop="unitprice">
          <el-input v-model="form.unitprice" :placeholder="isReadOnly('请输入检测单价')" style="width:100%"
          	:readonly="readonly" maxlength="25">
          </el-input>
      	</el-form-item>
      </el-col>
			<el-col :span="span">
				<el-form-item label="数量" :label-width="formLabelWidth" prop="count">
          <el-input v-model="form.count" :placeholder="isReadOnly('请输入检测数量')" style="width:100%"
          	:readonly="readonly" maxlength="25">
          </el-input>
				</el-form-item>
			</el-col>
      <el-col :span="span">
      	<el-form-item label="总金额" :label-width="formLabelWidth" prop="amount">
          <el-input v-model="form.amount" :placeholder="isReadOnly('请输入总金额')" style="width:100%"
          	:readonly="readonly" maxlength="25">
          </el-input>
      	</el-form-item>
      </el-col>
		</el-row>
	</el-form>
</template>

<script>
	import TreeSelect from '@riophae/vue-treeselect'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	import {
		mapGetters
	} from 'vuex'
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
	} from '@/utils/dateHelp'
	import {
		GetGroupData,
		GetGroupDataEx
	} from '@/utils/htmlDataGroup'
	import {
		isNumEx,
		isTel,
		isPhone
	} from '@/utils/validate'
  import {
    QueryExec
  } from '@/api/table'
	export default {
		name: 'branchInstitutionsForm',
		components: {
			TreeSelect
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
				default: 0 //0 正常表单 1 详情表单
			},
			//显示的类型
			table_type: {
				type: String,
				default: '0',
			},
			outOrgStatus: {
				type: Boolean,
				default: false,
			},
      project_type: {
        type: Number,
        default: 0 //0 试验， 1检测 3物探 4建材 5土工
      }
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id'
			}),
		},
		watch: {
			formData(newVal, oldVal) {
				if (newVal) {
          console.log('formData watch',newVal, oldVal);
					//this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
					this.form = Object.assign({}, this.formdefalut)
					//this.file_default()
					this.init()
				}
			},
		},
		data() {
			let that = this
			return {
				span: 24,
				readonly: false,
				readonlyParentSelect: true,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(),
				formdefalut: {},
				extraIsShow: false,
        labelProjectTitle: '检测项目',
        placeholderTitle: '请选择检测项目...',
				maxHeight: 200,
				selectData: {
					org_type: [],
					parent_id: [],
					out_org_status: [],
          testObjectData: [],
          projectOrgData: [],

				},
				form: {
					item_id: -1,
					item_name: '',
					group_id: 0,
					custom: '',
					remarks: '',
					nDeep: '',
          object_id: '',
          unitprice: '',
          amount: '',
          count: '',
          project_id: '',
          income_date: (new Date().getFullYear())+'-'+(new Date().getMonth() + 1)
				},
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						contract_file: 12,
						ext_file: 11,
						businessFile: 11,
					},
					type_str: 'jpg/pdf/png/jpeg',
					type_array: ['image/jpeg', 'image/png', 'application/pdf'],
					file_size: '15',
					size_unit: 'MB',
					original_name: {
						contract_file: {},
						ext_file: {},
						businessFile: {}
					},
					success: {
						contract_file: false,
						ext_file: false,
						businessFile: false
					},
					old_delete: {
						contract_file: false,
						ext_file: false,
						businessFile: false
					}
				},
				rules_temp: {
          project_id: [{
          	required: true,
          	trigger: ["blur", "change"],
          	message: '请选择项目名称'
          }],
					object_id: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择项目'
					}],
          income_date: [{
          	required: true,
          	trigger: ["blur", "change"],
          	message: '请选择汇报月份'
          }],
          unitprice: [{
          	required: true,
          	trigger: ["blur", "change"],
          	message: '请输入单价'
          }],
          count: [{
          	required: true,
          	trigger: ["blur", "change"],
          	message: '请输入数量'
          }],
          amount: [{
          	required: true,
          	trigger: ["blur", "change"],
          	message: '请输入总金额'
          }],
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
			async init(formDataS) {
        console.log(formDataS);
				switch (this.type) {
					case 0:
						this.readonly = false
						this.rules = this.rules_temp
						break;
					case 2:
						this.readonly = false
						this.rules = this.rules_temp
						break;
					case 1:
						this.readonly = true
						this.rules = {}
						break
				}
				this.form.table_type = this.table_type
        switch (this.project_type) {
        	case 0:
        		this.labelProjectTitle = '试验项目'
        		this.placeholderTitle = '请选择试验项目...'
        		break;
        	case 1:
        		this.labelProjectTitle = '检测项目'
        		this.placeholderTitle = '请选择检测项目...'
        		break;
        	case 2:
        		this.labelProjectTitle = '检测项目'
        		this.placeholderTitle = '请选择检测项目...'
        		break
          case 3:
          	this.labelProjectTitle = '物探项目'
          	this.placeholderTitle = '请选择物探项目...'
          	break
          case 4:
          	this.labelProjectTitle = '建材项目'
          	this.placeholderTitle = '请选择建材项目...'
          	break
          case 5:
          	this.labelProjectTitle = '土工项目'
          	this.placeholderTitle = '请选择土工项目...'
          	break
        }
				this.GetGroup()
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.file_default()
				}
				// if (!(this.form.org_id && this.form.org_id > 0)) {
				// 	console.log(this.form.org_id)
				// 	this.form.parent_id = this.org_id
				// }
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				if (this.role_max == 'super_admin') {
					this.readonlyParentSelect = false
					if (this.type == 2 && !(this.form.parent_id && this.form.parent_id > 0)) {
						this.form.parent_id = this.current_org_id
					}
				} else {
					await this.GetParentOrg()
					//this.form.parent_id = this.org_id
				}


			},
			async GetParentOrg() {
				let select_list = [{
					field: 'org_id',
					type: 3,
					level: 1,
				}, ]
				let form = {
					org_id: this.org_id
				}
				let {
					data
				} = await this.QueryExec_fob(327, select_list, form)
				if (!data) {
					return -1
				}
				if (data.length == 0) {
					return -1
				}
				this.form.parent_id = data[0].parent_id
			},
			async GetGroup() {
				let that = this
        let sData = '[Q]881{'+that.project_type+'}|^SYS'
        let res = await QueryExec(sData)
        console.log(sData,res)
        this.selectData.testObjectData = res.data
        sData = '[Q]882{'+that.current_org_id+'%}|^SYS'
        res = await QueryExec(sData)
        console.log(sData,res)
        this.selectData.projectOrgData = res.data
			},
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},
			file_default() {
				const form = JSON.parse(JSON.stringify(this.form))
				let that = this
			},
			fileUploadRefs() {
				return []
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
							if (flag) {
								that.upload.delte_service = true
							}
							clearInterval(index)
							exec()
						}
					}, 500)

					function exec() {
						let flag = true
						let length = check_list.length
						while (--length > -1) {
							if (that.$refs[check_list[length]].error) {
								flag = false
							}
						}
						if (flag) {
							that.upload.delte_service = true
						}
						that.loading = false
						callback(flag)
					}
				} catch (e) {
					console.log(e)
				}
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
				this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
				this.form = this.$options.data().form
				this.form = JSON.parse(JSON.stringify(this.formdefalut));
			},
			async QueryExec_fob_custom(list, form, sqlcode) {
				return await this.QueryExec_fob(sqlcode, list, form)
			},
			async save(callback) {
				let that = this
        that.form.org_id=that.current_org_id;
        that.form.income_type=that.project_type;
        that.form.income_date=that.form.income_date+'-01'
        that.form.person_id=that.person_id
				async function submit() {
					that.loading = true
					that.loadingText = '提交表单中...'
					let form = JSON.parse(JSON.stringify(that.form));

					let list = [{
							field: "org_id",
              type: 3,
							level: 1
						},
            {
							field: "project_id",
              type: 3,
							level: 2
						},
						{
							field: "object_id",
              type: 3,
							level: 3
						},
						{
							field: "income_date",
              type: 3,
							level: 4
						},
						{
							field: "unitprice",
              type: 3,
							level: 5
						},
						{
							field: "count",
              type: 3,
							level: 6
						},
						{
							field: "amount",
              type: 3,
							level: 7
						},
						{
							field: "income_type",
              type: 3,
							level: 8
						},
						{
							field: "report_state",
              type: 3,
							level: 9
						},
            {
            	field: "person_id",
              type: 3,
            	level: 10
            },
						{
							field: "income_id",
              type: 3,
							level: 11
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.income_id && form.income_id > 0) {
						//更新
						sqlcode = 892
						// fob = that.QueryExec_fob_custom;

						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 884
            tat.form.report_state='0'
						// fob = that.QueryExec_fob_custom;
					}
					const {
						data
					} = await that.QueryExec_fob(sqlcode, list, form)
					console.log(data);
					if (!data || data.length == 0) {
						that.$baseMessage('提交失败', 'error')
						return
					}
					try {
						const json = data[0]
						if (Number(json.Column1) > 0) {
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
          console.log(that.form)
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {

							submit();
						})
					} else {
						that.$baseMessage('表单验证失败', 'error')
					}
				})
			},
		},
	}
</script>

<style>
	.vue-treeselect--append-to-body {
		z-index: 999999 !important;
	}
</style>
