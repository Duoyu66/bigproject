<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="70%" :destroy-on-close="destroy" top="10vh"
		@close="close" append-to-body>
		<el-form ref="form" :model="form" :rules="rules" label-width="130px" :disabled="disabled"
			style="max-height: calc(100vh - 305px); overflow-y: auto">
			<el-row>
				<el-col :span="span_all">
					<el-form-item label="权限名称[获取权限使用]" prop="permission_name">
						<el-input v-model.trim="form.permission_name" autocomplete="on"
							:placeholder="disabled ? '' : '请输入权限名称'" maxlength="25"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="span_all">
					<el-form-item label="标题" prop="title">
						<el-input v-model.trim="form.title" maxlength="25" autocomplete="on"
							:placeholder="disabled ? '' : '请输入标题'"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="span_all">
					<el-form-item label="权限拥有者" prop="ower">
						<el-select v-model="form.ower" multiple :placeholder="disabled ? '' : '请选择'"
							style="width: 100%">
							<el-option v-for="ower in selectData.role" :key="ower.role_id" :label="ower.role_name"
								:value="ower.role_id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="span_all">
					<el-form-item label="机构映射" prop="org_type">
						<el-select v-model="form.org_type" multiple :placeholder="disabled ? '' : '请选择'"
							style="width: 100%">
							<el-option v-for="ower in selectData.org_type" :key="ower.type_id" :label="ower.type_name"
								:value="ower.type_id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="span_half">
					<el-form-item label="类型" prop="type_id">
						<el-select v-model="form.type_id" :placeholder="disabled ? '' : '请选择'" style="width: 100%">
							<el-option v-for="data in selectData.typeData" :key="data.type_id" :label="data.name"
								:value="data.type_id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="span_half">
					<el-form-item label="机构树状态" prop="org_status">
						<el-select v-model="form.org_status" :placeholder="disabled ? '' : '请选择机构树状态,true为显示,false为隐藏'"
							style="width: 100%">
							<el-option v-for="ower in selectData.org_status" :key="ower.key" :label="ower.value"
								:value="ower.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="span_half">
					<el-form-item label="优先级" prop="level">
						<el-input v-model.number="form.level" autocomplete="on" maxlength="10"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="span_half">
					<el-form-item label="是否隐藏" prop="Ishide">
						<el-radio v-model="form.Ishide" :label="'1'">是</el-radio>
						<el-radio v-model="form.Ishide" :label="'0'">否</el-radio>
					</el-form-item>
				</el-col>
				<el-col :span="span_all">
					<el-form-item label="权限描述" prop="desc">
						<el-input v-model.trim="form.desc" autocomplete="on" type="textarea" autosize
							:placeholder="disabled ? '' : '请输入权限描述'" :autosize="{ minRows: 2, maxRows: 10 }"
							maxlength="100">
							>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="span_all">
					<el-form-item label="路由(name)" prop="name" :required="routeIsRequire">
						<el-input v-model.trim="form.name" autocomplete="on"
							:placeholder="disabled ? '' : '请输入路由(name)'" maxlength="25"></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="span_all">
					<el-form-item label="路由(path)" prop="path" :required="routeIsRequire">
						<el-input v-model.trim="form.path" autocomplete="on"
							:placeholder="disabled ? '' : '请输入路由(path)'" maxlength="25"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="span_all">
					<el-form-item label="路径(component)" prop="component" :required="routeIsRequire">
						<el-input v-model.trim="form.component" autocomplete="on"
							:placeholder="disabled ? '' : '请输入路径(component)'" maxlength="512"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="span_all">
					<el-form-item label="重定向" prop="redirect">
						<el-input v-model.trim="form.redirect" autocomplete="on"
							:placeholder="disabled ? '' : '请输入重定向地址'" maxlength="25"></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="span_all">
					<el-form-item label="图标" prop="icon">
						<el-tag>上面为图标选择器，找不到图标可在下面输入框输入</el-tag>
						<e-icon-picker v-model="form.icon" :options="options" :disabled="disabled"
							:placeholder="disabled ? '' : '请选择图标'" maxlength="20" :highLightColor="'true'" />
					</el-form-item>
				</el-col>
				<el-col :span="span_all">
					<el-form-item label="" prop="icon">
						<el-input v-model.trim="form.icon" autocomplete="on" :placeholder="disabled ? '' : '请输入图标'"
							maxlength="20"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="span_all">
					<el-form-item label="是否固定" prop="affix">
						<el-select v-model="form.affix" :placeholder="disabled ? '' : '请选择是否是否固定'" style="width: 100%">
							<el-option v-for="ower in selectData.org_status" :key="ower.key" :label="ower.value"
								:value="ower.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="span_all">
					<el-form-item label="是否有缓存" prop="noKeepAlive">
						<el-select v-model="form.noKeepAlive" :placeholder="disabled ? '' : '请选择是否有缓存'"
							style="width: 100%">
							<el-option v-for="ower in selectData.org_status" :key="ower.key" :label="ower.value"
								:value="ower.value">
							</el-option>
						</el-select>

					</el-form-item>
				</el-col>
			</el-row>

		</el-form>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>

		</div>
	</el-dialog>
</template>

<script>
	//图标选择器
	import {
		EIconPicker
	} from 'e-icon-picker'
	import 'e-icon-picker/lib/symbol.js' //基本彩色图标库
	import 'e-icon-picker/lib/index.css' // 基本样式，包含基本图标
	//import 'element-ui/lib/theme-chalk/icon.css' //element-ui 图标库
	import 'font-awesome/css/font-awesome.min.css'; //font-awesome 图标库
	import 'element-ui/lib/theme-chalk/icon.css'; //element-ui 图标库
	//import svgIcons from 'e-icon-picker/lib/getSvg';
	export default {
		name: 'PermissionForm',
		//通过inject调用父组件中的的reload
		components: {
			// Select
			EIconPicker,
		},
		inject: ['reload'],
		data() {

			let that = this
			return {
				span_all: 24,
				span_half: 12,
				selectData: {
					typeData: [],
					role: [],
					org_type: [],
					org_status: [{
						key: 'true',
						value: "true"
					}, {
						key: 'false',
						value: "false"
					}],
				},

				routeIsRequire: false,
				disabled: false,
				destroy: true,
				person_info: {},
				form: {
					org_status: 'true',
					permission_name: '',
					title: '',
					name: '',
					path: '',
					component: '',
					redirect: '',
					icon: '',
					affix: '',
					noKeepAlive: '',
					parent_id: 0,
					level: 0,
					desc: '',
					type_id: '',
					ower: [],
					org_type: [],
					permission_id: '',
					Ishide: '0',
				},
				rules: {
					title: [{
						required: true,
						trigger: 'blur',
						message: '请输入标题'
					}],
					permission_name: [{
						required: true,
						trigger: 'blur',
						message: '请输入权限名称',
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							let reg = /^[a-zA-Z]([-_a-zA-Z0-9]{0,25})$/;
							if (!reg.test(value)) {
								callback(new Error('字母开头，最长25位,只允许英文、数字、下划线和减号'))
								return
							}
							let form = {}
							let list = [{
								field: 'permission_name',
								type: 3,
								level: 1,
							}]
							form.permission_name = value
							const {
								code,
								data
							} = await that.QueryExec_fob(183, list, form)
							if (code == 200) {
								let length = data.length
								if (!that.form.permission_id && length > 0) {
									callback(new Error('已存在该权限名称'))
									return
								}
								let flag = false
								while (--length > -1) {
									if (data[length].permission_id != that.form.permission_id) {
										flag = true
										break
									}
								}
								if (flag) {
									callback(new Error('已存在该权限名称'))
								} else {
									callback()
								}
							} else {
								callback(new Error('查询数据库异常'))
							}
						},
					}, ],
					type_id: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请选择类型',
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							that.typeIdValidator(rule, value, callback)
						},
					}, ],
					level: [{
							required: true,
							trigger: ['blur', 'change'],
							message: '请输入优先级',
						},
						{
							type: 'number',
							message: '只能输入整数',
						},
					],
					name: [{
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {
							if (that.routeIsRequire && !value) {
								callback(new Error('请输入name'))
							} else {
								callback()
							}
						}
					}],
					path: [{
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {
							if (that.routeIsRequire && !value) {
								callback(new Error('请输入path'))
							} else {
								callback()
							}
						}
					}],
					component: [{
						trigger: ["blur", "change"],
						validator: async function(rule, value, callback) {
							if (that.routeIsRequire && !value) {
								callback(new Error('请输入component'))
							} else {
								callback()
							}
						}
					}],
				},
				title: '',
				dialogFormVisible: false,
				options: {
					addIconList: [],
					FontAwesome: true,
					ElementUI: true,
					eIcon: false, //自带的图标，来自阿里妈妈
					eIconSymbol: false, //是否开启彩色图标
				},
			}
		},
		created() {},
		methods: {
			async init() {
				let form = this.form
				form.org_status = 'true',
					form.permission_name = '',
					form.title = '',
					form.name = '',
					form.path = '',
					form.component = '',
					form.redirect = '',
					form.icon = '',
					form.affix = '',
					form.noKeepAlive = '',
					form.parent_id = 0,
					form.level = 0,
					form.desc = '',
					form.type_id = '',
					form.ower = [],
					form.permission_id = '',
					form.Ishide = '0',
					form.org_type = [];
				await this.GetSelectData()
			},
			async showEdit(row, disabled, person_info, option) {
				let that = this
				await that.init()
				if (!option) {
					option = {}
				}
				if (disabled) {
					that.title = '查看'
					that.disabled = true
				} else {
					that.disabled = false
					if (!row) {
						that.title = '添加'
					} else {
						that.title = '编辑'

					}
				}
				if (option.title) {
					that.title = option.title
				}
				if (row) {
					that.form = Object.assign(that.form, row)
					if (that.form.ower) {
						try {
							that.form.ower = that.form.ower.split(',')

							that.form.ower = that.form.ower.filter(function(s) {
								return s && s.trim() // 注：IE9(不包含IE9)以下的版本没有trim()方法
							})
						} catch (e) {
							console.log(e)
						}
					}
					if (that.form.org_type) {
						try {
							that.form.org_type = that.form.org_type.split(',')
					
							that.form.org_type = that.form.org_type.filter(function(s) {
								return s && s.trim() // 注：IE9(不包含IE9)以下的版本没有trim()方法
							})
						} catch (e) {
							console.log(e)
						}
					}
					try {
						that.form.level = Number(that.form.level)
					} catch (e) {
						console.log(e)
					}
					console.log(row.type_id)
					that.typeIdValidator(undefined, row.type_id, undefined)
				}
				if (person_info) {
					that.form.parent_id = person_info.parent_id
					that.person_info = Object.assign(that.person_info, person_info)
				}

				if (!that.form.parent_id) {
					that.form.parent_id = 0
				}
				that.title += '权限'
				that.dialogFormVisible = true
			},
			typeIdValidator(rule, value, callback) {
				let that = this
				let temp = JSON.parse(JSON.stringify(that.selectData.typeData))
				console.log('rule type_id validator', that.selectData.typeData)
				let tempList = []
				for (let key in temp) {
					tempList.push(temp[key])
				}
				console.log('rule type_id validator', tempList)
				let newArr = tempList.filter(function(p) {
					return p.type_id == value;
				});
				if (newArr.length > 0 && newArr[0].name == '菜单') {
					that.routeIsRequire = true
				} else {
					if (that.$refs['form']) {
						that.$refs['form'].clearValidate(['name', 'path', 'component'])
					}
					that.routeIsRequire = false
				}
				if (callback) {
					callback()
				}

			},
			close() {
				this.$refs['form'].resetFields()
				this.form = this.$options.data().form
				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},
			//获取下拉框数据
			async GetSelectData() {
				//角色
				let select_list = []
				const {
					data
				} = await this.QueryExec_fob(27, select_list, {})

				this.selectData.role = Object.assign({}, data)
				//类型
				let typeData_list = []
				const typeData = await this.QueryExec_fob(28, typeData_list, {})
				this.selectData.typeData = Object.assign({}, typeData.data)
				const org_type = await this.QueryExec_fob(947, typeData_list, {})
				this.selectData.org_type = Object.assign({}, org_type.data)
			},
			save() {
				let that = this
				if (that.disabled) {
					that.dialogFormVisible = false
					return
				}
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						//console.log(that.form);
						let data = JSON.parse(JSON.stringify(that.form))
						let list = [{
								field: 'parent_id',
								level: 1,
							},
							{
								field: 'name',
								level: 2,
							},
							{
								field: 'path',
								level: 3,
							},
							{
								field: 'component',
								level: 4,
							},
							{
								field: 'redirect',
								level: 5,
							},
							{
								field: 'title',
								level: 6,
							},
							{
								field: 'icon',
								level: 7,
							},
							{
								field: 'affix',
								level: 8,
							},
							{
								field: 'noKeepAlive',
								level: 9,
							},
							{
								field: 'ower',
								level: 10,
							},
							{
								field: 'org_type',
								level: 11,
							},
							{
								field: 'type_id',
								level: 12,
							},
							{
								field: 'desc',
								level: 13,
							},
							{
								field: 'level',
								level: 14,
							},
							{
								field: 'Ishide',
								level: 15,
							},
							{
								field: 'permission_name',
								level: 16,
							},
							{
								field: 'org_status',
								level: 17,
							},
						]
						let fob = ''
						let sqlcode = -1
						let msg = ''
						//data.ower = "'" + data.ower + "'"
						//console.log(data)
						if (data.permission_id) {
							//更新
							sqlcode = 29
							fob = that.update_fob
							msg = '更新'
							list.push({
								field: 'permission_id',
								level: 18,
							})
						} else {
							//添加
							msg = '添加'
							sqlcode = 26
							fob = that.insert_fob
						}
						const {
							code,
							influence
						} = await fob(list, data, sqlcode)
						if (code != 200) {
							that.$baseMessage(msg + '失败', 'error')
							return false
						}
						if (influence > 0) {
							that.$baseMessage(msg + '成功', 'success')
							that.$refs['form'].resetFields()
							that.dialogFormVisible = false
							//that.$emit('fetch-data')
							that.form = that.$options.data().form
							//重载表格
							that.reload({
									permission_id: data.parent_id,
									person_info: that.person_info,
									type: '重载'
								},
								undefined,
								undefined
							)
						} else {
							that.$baseMessage(msg + '失败', 'error')
						}
					} else {
						that.$baseMessage('表单校验未通过', 'error')
						return false
					}
				})
			},
		},
	}
</script>

<style></style>
