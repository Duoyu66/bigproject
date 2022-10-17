<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span">
				<el-form-item label="父级机构" :label-width="formLabelWidth" prop="parent_id">
					<tree-select :options="selectData.parent_id" :max-height="maxHeight" :multiple="false"
						:placeholder="isReadOnly('请选择父级机构...')" :disabled="readonlyParentSelect" :appendToBody="true"
						v-model="form.parent_id" />
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="机构名称" :label-width="formLabelWidth" prop="org_name">
					<el-input v-model="form.org_name" :placeholder="isReadOnly('请输入机构名称')" style="width:100%"
						:readonly="readonly" maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="机构类型" :label-width="formLabelWidth" prop="type_id">
					<el-select v-model="form.type_id" style="width: 100%">
						<el-option v-for="data in selectData.org_type" :key="data.type_id" :label="data.type_name"
							:value="data.type_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="" :label-width="'0px'">
					<Map ref="baiduMap" :value="Gps" :readonly="readonly"></Map>
				</el-form-item>
			</el-col>

			<el-col :span="span" v-show="outOrgStatus">
				<el-form-item label="机构状态" :label-width="formLabelWidth" prop="out_org_status">
					<el-select v-model="form.out_org_status" style="width: 100%">
						<el-option v-for="data in selectData.out_org_status" :key="data.custom" :label="data.item_name"
							:value="data.custom">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="extraIsShow">
				<el-form-item label="机构地址" :label-width="formLabelWidth" prop="org_addr">
					<el-input v-model="form.org_addr" :placeholder="isReadOnly('请输入机构地址')" style="width:100%"
						:readonly="readonly" maxlength="100" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="extraIsShow">
				<el-form-item label="邮编" :label-width="formLabelWidth" prop="postCode">
					<el-input v-model="form.postCode" :placeholder="isReadOnly('请输入邮编')" style="width:100%"
						:readonly="readonly" maxlength="10">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="extraIsShow">
				<el-form-item label="传真" :label-width="formLabelWidth" prop="fax">
					<el-input v-model="form.fax" :placeholder="isReadOnly('请输入传真')" style="width:100%"
						:readonly="readonly" maxlength="10">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="extraIsShow">
				<el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
					<el-input v-model="form.remarks" :placeholder="isReadOnly('请输入备注')" style="width:100%"
						:readonly="readonly" maxlength="100" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
	import TreeSelect from '@riophae/vue-treeselect'
	//import baiduMap from '../../Map/Baidu/coordinateShowAndGet'
	import Map from '../../Map/quote/coordinateShowAndGet'
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
		GetGroupDataEx,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'
	import {
		isNumEx,
		isTel,
		isPhone
	} from '@/utils/validate'
	export default {
		name: 'branchInstitutionsForm',
		components: {
			TreeSelect,
			Map
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
					this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
					this.form = Object.assign(this.form, newVal)
					this.file_default()
					this.init()
				}
			},
		},
		data() {
			let that = this
			return {
				span: 24,
				span22: 22,
				span20: 20,
				span19: 19,
				span4: 4,
				span2: 2,
				readonly: false,
				readonlyParentSelect: true,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(),
				formdefalut: {},
				extraIsShow: false,
				maxHeight: 200,
				selectData: {
					org_type: [],
					parent_id: [],
					out_org_status: [],
					gps_type: [{
						key: 1,
						value: 'WGS84',
						label: 'WGS84(GPS设备得到,例如手机的cellular-z等)',
					}, {
						key: 2,
						value: 'GCJ02',
						label: 'GCJ02(高德地图、搜狗地图、SOSO地图、谷歌地图、必应地图和雅虎地图等)',
					}, {
						key: 3,
						value: 'BD09',
						label: 'BD09(百度地图)',
					}]
				},
				form: {
					org_id: -1,
					org_name: '',
					parent_id: 0,
					type_id: '',
					remarks: '',
					org_addr: '',
					postCode: '',
					table_type: '0',
					fax: '',

				},
				Gps: {
					gps_type: '',
					WGS84longitude: '',
					WGS84latitude: '',
					GCJ02longitude: '',
					GCJ02latitude: '',
					BD09longitude: '',
					BD09latitude: '',
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
					org_name: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入机构名称'
					}],
					type_id: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择机构类型'
					}],
					addr: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入外委单位地址'
					}],
					parent_id: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择父级机构'
					}, {
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {

							if (value == that.form.org_id) {
								callback(new Error('自己不能为自己的父级节点'))
								return
							}
							callback()
							return
						}
					}],

				},
				rules: {

				},
				formLabelWidth: '120px',
			}

		},

		created() {
			this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
			this.formdefalut = JSON.parse(JSON.stringify(this.form))
			this.init()
		},
		methods: {
			async init() {
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
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData);
					this.Gps = {}
					this.Gps = Object.assign(this.Gps, this.formData);
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
			showInMap() {

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
					data: "org_type",
					group_id: 1010
				}, {
					data: "out_org_status",
					group_id: 1011
				}];
				await GetGroupDataEx(this, list)
				this.selectData.org_type = this.selectData.org_type.filter(function(s) {
					return s.custom == that.form.table_type
				})
				this.selectData.parent_id = await this.$store.dispatch('org/GetOrgTreeAllEx')
				this.selectData.parent_id = [{
					children: this.selectData.parent_id,
					id: 0,
					label: '根节点',
					name: '根节点'
				}]
				let customList = [{
					data: 'org_type',
					sqlcode: 1016,
					list: [{
						field: "org_id",
						type: 3,
						level: 1
					}],
					form: {

					}
				}]
				await GetGroupDataCustomEx(this, customList);
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
				that.upload.original_name.contract_file[form.contract_file] = '外委合同'
				that.upload.original_name.ext_file[form.ext_file] = '外委资质'
				that.upload.original_name.ext_file[form.ext_file] = '工商信息'
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
				that.$refs['form'].resetFields();
				that.Gps = {
					gps_type: '',
					WGS84longitude: '',
					WGS84latitude: '',
					GCJ02longitude: '',
					GCJ02latitude: '',
					BD09longitude: '',
					BD09latitude: '',
				};
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
				that.form = that.$options.data().form
				that.form = JSON.parse(JSON.stringify(that.formdefalut))
				console.log('close', that.form);
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
							field: "parent_id",
							level: 1
						},
						{
							field: "org_id",
							level: 2
						},
						{
							field: "org_name",
							level: 3
						},
						{
							field: "type_id",
							level: 4
						},
						{
							field: "org_addr",
							level: 5
						}, {
							field: "postCode",
							level: 6
						},
						{
							field: "fax",
							level: 7
						},
						{
							field: "remarks",
							level: 8
						},
						{
							field: "table_type",
							level: 9,
						}, {
							field: "out_org_status",
							level: 10,
						}, {
							field: "gps_type",
							level: 11,
						}, {
							field: "WGS84longitude",
							level: 12,
						}, {
							field: "WGS84latitude",
							level: 13,
						}, {
							field: "GCJ02longitude",
							level: 14,
						}, {
							field: "GCJ02latitude",
							level: 15,
						}, {
							field: "BD09longitude",
							level: 16,
						}, {
							field: "BD09latitude",
							level: 17,
						},
						{
							field: "id",
							level: 18
						}
					]
					let aPointJson = that.$refs['baiduMap'].GetMapRef().ConvertUCS();
					if (aPointJson) {
						// if (aPointJson.fromType) {
						// 	form.gps_type = aPointJson.fromType;
						// }
						form.gps_type = aPointJson.fromType;
						if (aPointJson.GCJ02) {
							form.GCJ02longitude = aPointJson.GCJ02[0];
							form.GCJ02latitude = aPointJson.GCJ02[1];
						}
						if (aPointJson.BD09) {
							form.BD09longitude = aPointJson.BD09[0];
							form.BD09latitude = aPointJson.BD09[1];
						}
						if (aPointJson.WGS84) {
							form.WGS84longitude = aPointJson.WGS84[0];
							form.WGS84latitude = aPointJson.WGS84[1];
						}
					}
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.exId && form.exId > 0) {
						//更新
						sqlcode = 321
						fob = that.QueryExec_fob_custom;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 321
						fob = that.QueryExec_fob_custom;
					}
					const {
						code,
						influence,
						data
					} = await fob(list, form, sqlcode)
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
