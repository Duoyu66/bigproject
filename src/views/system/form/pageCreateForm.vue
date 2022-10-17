<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span">
				<el-form-item label="查询语句" :label-width="formLabelWidth" prop="select_sql">
					<el-input v-model="form.select_sql" :placeholder="isReadOnly('请输入查询语句')" style="width:100%"
						:readonly="readonly" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="添加语句" :label-width="formLabelWidth" prop="insert_sql">
					<el-input v-model="form.insert_sql" :placeholder="isReadOnly('请输入添加语句')" style="width:100%"
						:readonly="readonly" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
      <el-col :span="span">
      	<el-form-item label="修改语句" :label-width="formLabelWidth" prop="update_sql">
      		<el-input v-model="form.update_sql" :placeholder="isReadOnly('请输入修改语句')" style="width:100%"
      			:readonly="readonly" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
      		</el-input>
      	</el-form-item>
      </el-col>
      <el-col :span="span">
      	<el-form-item label="删除语句" :label-width="formLabelWidth" prop="delete_sql">
      		<el-input v-model="form.delete_sql" :placeholder="isReadOnly('请输入删除语句')" style="width:100%"
      			:readonly="readonly" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
      		</el-input>
      	</el-form-item>
      </el-col>
      <el-col :span="span1">
        <el-form-item label="添加标题" :label-width="formLabelWidth" prop="addtitle">
        	<el-input v-model="form.addtitle" :placeholder="isReadOnly('请输入添加标题')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span1">
        <el-form-item label="修改标题" :label-width="formLabelWidth" prop="edittitle">
        	<el-input v-model="form.edittitle" :placeholder="isReadOnly('请输入修改标题')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span1">
        <el-form-item label="是否分页" :label-width="formLabelWidth" prop="isPage">
          <el-select v-model="form.isPage" :placeholder="isReadOnly('请选择是否分页')" style="width: 100%;" :readonly="readonly">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
<!--      <el-col :span="span1">
        <el-form-item label="传参方式" :label-width="formLabelWidth" prop="isPage">
        	<el-input v-model="form.addtitle" :placeholder="isReadOnly('请输入名称')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="span1">
        <el-form-item label="添加独立" :label-width="formLabelWidth" prop="isAddInPage">
        	<el-select v-model="form.isAddInPage" :placeholder="isReadOnly('请选择是否添加独立')" style="width: 100%;" :readonly="readonly">
        	  <el-option label="是" value="1"></el-option>
        	  <el-option label="否" value="0"></el-option>
        	</el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span1">
        <el-form-item label="添加页签标题" :label-width="formLabelWidth" prop="addTabTitle">
        	<el-input v-model="form.addTabTitle" :placeholder="isReadOnly('请输入名称')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span1">
        <el-form-item label="表格页签标题" :label-width="formLabelWidth" prop="tableTabTitle">
        	<el-input v-model="form.tableTabTitle" :placeholder="isReadOnly('请输入表格页签标题')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col>
<!--      <el-col :span="span">
        <el-form-item label="结果特殊处理" :label-width="formLabelWidth" prop="isPage">
        	<el-input v-model="form.addtitle" :placeholder="isReadOnly('请输入名称')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="span1">
        <el-form-item label="页面名词根" :label-width="formLabelWidth" prop="pageNameTitle">
        	<el-input v-model="form.pageNameTitle" :placeholder="isReadOnly('请输入页面名词根')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col>
<!--     <el-col :span="span1">
        <el-form-item label="页面权限选择" :label-width="formLabelWidth" prop="pagePermission">
        	<el-select v-model="form.pagePermission" placeholder="请选择" style="width: 100%;">
        	  <el-option
        	    v-for="item in permissionData"
        	    :key="item.permission_id"
        	    :label="item.name"
        	    :value="item.permission_id">
        	  </el-option>
        	</el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span1">
        <el-form-item label="添加权限选择" :label-width="formLabelWidth" prop="isPage">
        	<el-input v-model="form.addtitle" :placeholder="isReadOnly('请输入名称')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span1">
        <el-form-item label="修改权限选择" :label-width="formLabelWidth" prop="isPage">
        	<el-input v-model="form.addtitle" :placeholder="isReadOnly('请输入名称')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span1">
        <el-form-item label="删除权限选择" :label-width="formLabelWidth" prop="isPage">
        	<el-input v-model="form.addtitle" :placeholder="isReadOnly('请输入名称')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="span1">
        <el-form-item label="查询语句编号" :label-width="formLabelWidth" prop="selectcode">
        	<el-input v-model="form.selectcode" :placeholder="isReadOnly('请输入查询语句编号')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span1">
        <el-form-item label="添加语句编号" :label-width="formLabelWidth" prop="addcode">
        	<el-input v-model="form.addcode" :placeholder="isReadOnly('请输入添加语句编号')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span1">
        <el-form-item label="修改语句编号" :label-width="formLabelWidth" prop="updatecode">
        	<el-input v-model="form.updatecode" :placeholder="isReadOnly('请输入修改语句编号')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span1">
        <el-form-item label="删除语句编号" :label-width="formLabelWidth" prop="deletecode">
        	<el-input v-model="form.deletecode" :placeholder="isReadOnly('请输入删除语句编号')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span1">
        <el-form-item label="加载的本地存储" :label-width="formLabelWidth" prop="isPage">
        	<el-input v-model="form.addtitle" :placeholder="isReadOnly('请输入名称')" style="width:100%"
        		:readonly="readonly" maxlength="25">
        	</el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span1">
        <el-form-item label="操作人" :label-width="formLabelWidth" prop="person_name">
        	<el-select v-model="form.person_name" :placeholder="isReadOnly('')" style="width:100%"></el-input>
        	  <el-option v-for="data in selectData.person_name" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option>
        	</el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span1" v-show="table_type==='1'">
        <el-form-item label="主表关联id" :label-width="formLabelWidth" prop="maintable_id">
          <el-select v-model="form.maintable_id" :placeholder="isReadOnly('')" multiple style="width:100%"></el-input>
            <el-option
              v-for="item in tablefielddata"
              :key="item.qid"
              :label="item.qname"
              :value="item.qid">
            </el-option>
          </el-select>
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
    QueryExec
  } from '@/api/table'
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
      tablename: {
				type: String,
				default: '',
			},
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
        span1: 12,
				readonly: false,
				readonlyParentSelect: true,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(),
				formdefalut: {},
				extraIsShow: false,
				maxHeight: 200,
        tablefielddata: [],
				selectData: {
					person_name: [],
					parent_id: [],
					out_org_status: [],
				},
				form: {
					select_sql: '',
					insert_sql: '',
					update_sql: '',
					delete_sql: ''
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
					item_name: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入名称'
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
      getFormData() {
        return this.form
      },
      setFormData(item) {
        this.form.select_sql=item.sqlquery
        if(item.sqladd) {
          this.form.insert_sql=item.sqladd
        }
        if(item.sqledit) {
          this.form.update_sql=item.sqledit
        }
        if(item.sqldel) {
          this.form.delete_sql=item.sqldel
        }
        console.log(this.form)
      },
      setFormSqlCode(item) {
        this.form.selectcode=item.selectcode
        if(item.addcode) {
          this.form.addcode=item.addcode
        }
        if(item.updatecode) {
          this.form.updatecode=item.updatecode
        }
        if(item.deletecode) {
          this.form.deletecode=item.deletecode
        }
        console.log(this.form)
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
				let list = [{
					data: "person_name",
					group_id: 1000
				}];
				await GetGroupDataEx(this, list)

				// this.selectData.org_type = this.selectData.org_type.filter(function(s) {
				// 	return s.custom == that.form.table_type
				// })
				// this.selectData.parent_id = await this.$store.dispatch('org/GetOrgTreeAllEx')
				// this.selectData.parent_id = [{
				// 	children: this.selectData.parent_id,
				// 	id: 0,
				// 	label: '根节点',
				// 	name: '根节点'
				// }]
			},
      async GetTableDataForMain(tablename) {
        let sData = '[Q]894{'+tablename+'}|^SYS'
        let res = await QueryExec(sData)
        console.log(sData,res)
        this.tablefielddata = res.data
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
				async function submit() {
					that.loading = true
					that.loadingText = '提交表单中...'
					let form = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: "item_name",
							level: 1
						},
						{
							field: "group_id",
							level: 2
						},
						{
							field: "custom",
							level: 3
						},
						{
							field: "remarks",
							level: 4
						},
						{
							field: "item_id",
							level: 5
						}
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.exId && form.exId > 0) {
						//更新
						sqlcode = 660
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 660
						fob = that.QueryExec_fob_custom;
					}
					const {
						code,
						influence,
						data
					} = await fob(list, that.form, sqlcode)
					console.log(code, influence, data);
					if (code != 200) {
						that.$baseMessage(msg + '失败', 'error')
						return false
					}
					if (!data || data.length == 0) {
						that.$baseMessage(msg + '失败', 'error')
						return
					}
					let json = JSON.parse(data[0].info)

					if (json.code > 0) {
						switch (json.code) {
							case 1:
								that.$baseMessage(json.msg, 'success')
								that.close()
								return true
								break
							case 2:
								that.$baseMessage(json.msg, 'error')
								break
							default:
								that.$baseMessage(json.msg, 'error')
								break
						}
						return false
					} else {
						that.$baseMessage(json.msg, 'error')
						return false
					}
				}
				that.$refs['form'].validate((valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							that.fileUpload(async function(status) {
								if (status) {
									const flag = await submit()
									callback(flag)
								}
							})
						})

					} else {
						return false
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
