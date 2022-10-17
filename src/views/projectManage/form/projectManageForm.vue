<template>
	<el-form ref="form" :model="form" :rules="rules">
		<el-row>
			<el-col :span="span">
				<el-form-item label="交易中心工程编号" :label-width="formLabelWidth" prop="project_id">
					<el-input v-model="form.project_id" :placeholder="isReadOnly('请输入交易中心工程编号')" style="width:100%"
						:readonly="readonly" maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="交易中心工程名称" :label-width="formLabelWidth" prop="project_name">
					<el-input v-model="form.project_name" :placeholder="isReadOnly('请输入交易中心工程名称')" style="width:100%"
						:readonly="readonly" maxlength="32">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="交易中心单项工程主类别" :label-width="formLabelWidth" prop="main_kind">
					<el-select v-model="form.main_kind" :placeholder="isReadOnly('请选择交易中心单项工程主类别')" style="width: 100%">
						<el-option v-for="main_kind in selectData.main_kind" :key="main_kind.item_id"
							:label="main_kind.item_name" :value="main_kind.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="安全监督机构" :label-width="formLabelWidth" prop="sec_mgr_org">
					<el-input v-model="form.sec_mgr_org" :placeholder="isReadOnly('请输入安全监督机构')" style="width:100%"
						:readonly="readonly" maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="安全报监编号" :label-width="formLabelWidth" prop="sec_super_id">
					<el-input v-model="form.sec_super_id" :placeholder="isReadOnly('请输入安全报监编号')" style="width:100%"
						:readonly="readonly" maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="质量监督机构" :label-width="formLabelWidth" prop="qua_mgr_org">
					<el-input v-model="form.qua_mgr_org" :placeholder="isReadOnly('请输入质量监督机构')" style="width:100%"
						:readonly="readonly" maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="质量报监编号" :label-width="formLabelWidth" prop="qua_super_id">
					<el-input v-model="form.qua_super_id" :placeholder="isReadOnly('请输入质量报监编号')" style="width:100%"
						:readonly="readonly" maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="施工总承包单位交易中心单位编号" :label-width="formLabelWidth" prop="constructor_id">
					<el-input v-model="form.constructor_id" :placeholder="isReadOnly('请输入施工总承包单位交易中心单位编号')"
						style="width:100%" :readonly="readonly" maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="施工总承包单位" :label-width="formLabelWidth" prop="constructorid">
					<el-select v-model="form.constructorid" :placeholder="isReadOnly('请选择施工总承包单位')" style="width: 100%"
						filterable clearable>
						<el-option v-for="item in selectData.constructor" :key="item.org_id" :label="item.org_name"
							:value="item.org_id">
							<span style="float: left">{{ item.org_name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.org_id }}</span>
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="监理单位交易中心单位编号" :label-width="formLabelWidth" prop="supervisor_id">
					<el-input v-model="form.supervisor_id" :placeholder="isReadOnly('请输入监理单位交易中心单位编号')"
						style="width:100%" :readonly="readonly" maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="监理单位" :label-width="formLabelWidth" prop="supervisor">
					<el-select v-model="form.supervisor" :placeholder="isReadOnly('请选择监理单位')" style="width: 100%"
						filterable clearable>
						<el-option v-for="item in selectData.supervisor" :key="item.org_id" :label="item.org_name"
							:value="item.org_id">
							<span style="float: left">{{ item.org_name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.org_id }}</span>
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="所属机构" :label-width="formLabelWidth" prop="org_name">
					<el-input v-model="form.org_name" :placeholder="isReadOnly('')" style="width:100%" :readonly="true"
						maxlength="16">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="备注" :label-width="formLabelWidth" prop="memo">
					<el-input v-model="form.memo" :placeholder="isReadOnly('请输入备注')" style="width:100%"
						:readonly="readonly" maxlength="100" type="textarea" :autosize="{ minRows: 4}" show-word-limit>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="" :label-width="'0px'">
					<baiduMap ref="baiduMap" :value="Gps" :readonly="readonly"></baiduMap>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import extfileupload from '@/components/Upload/upload'
	import contractFileupload from '@/components/Upload/upload'
	//import baiduMap from '../../Map/Baidu/coordinateShowAndGet'
	import baiduMap from '../../Map/quote/coordinateShowAndGet'
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
		name: 'projectManageForm',
		components: {
			extfileupload,
			contractFileupload,
			baiduMap
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
				selectData: {
					main_kind: []
				},
				span: 24,
				readonly: false,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(),
				formdefalut: {},
				form: {
					id: -1,
					project_id: '',
					project_name: '',
					main_kind: '',
					sec_mgr_org: '',
					qua_mgr_org: '',
					sec_super_id: '',
					qua_super_id: '',
					constructor_id: '',
					constructorid: '',
					supervisor_id: '',
					supervisor: '',
					memo: ''
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
						ext_file: 11
					},
					type_str: 'jpg/pdf/png/jpeg',
					type_array: ['image/jpeg', 'image/png', 'application/pdf'],
					file_size: '15',
					size_unit: 'MB',
					original_name: {
						contract_file: {},
						ext_file: {},
					},
					success: {
						contract_file: false,
						ext_file: false,
					},
					old_delete: {
						contract_file: false,
						ext_file: false,
					}
				},
				rules_temp: {
					project_name: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入交易中心工程名称'
					}, {
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (!value) {
								callback(new Error('请输入交易中心工程名称'))
								return
							}
							if (value.length > 16) {
								callback(new Error('交易中心工程名称最长16位'))
								return
							}
							callback()
						}
					}],
					memo: [{
						trigger: ['blur', 'change'],
						validator: async function(rule, value, callback) {
							if (value && value.length > 100) {
								callback(new Error('备注最长100位'))
								return
							}
							callback()
						}
					}],

				},
				rules: {

				},
				formLabelWidth: '222px',
			}

		},

		created() {
			this.uploadDeault = JSON.parse(JSON.stringify(this.upload))
			this.formdefalut = JSON.parse(JSON.stringify(this.form))
			this.init()
		},
		methods: {
			init() {
				switch (this.type) {
					case 0:
						this.readonly = false
						this.rules = this.rules_temp
						break;
					case 1:
						this.readonly = true
						this.rules = {}
						break
				}
				this.DroupDownList();
				
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.Gps = {}
					this.Gps = Object.assign(this.Gps, this.formData);
					this.file_default()
				}
				this.getOrgNameByselect();
				this.DroupDownListOrgByOrgId();

			},
			async getOrgNameByselect() {
				//this.$nextTick(async () => {
				let index = setInterval(async () => {
					let org_id = this.form.org_id ? this.form.org_id : this.org_id;
					let org_name = await this.getOrgName(org_id);
					if (org_name.trim()) {
						this.$set(this.form, "org_name", org_name.trim());
						clearInterval(index);
						//this.$set(this.load.status.orgName, 'isShow', true)
					}
				}, 500);
			},
			async getOrgName(value) {
				let orgName = await this.$store.dispatch("org/GetOrgNameByOrgId", value);
				return orgName;
			},
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},
			async DroupDownList() {
				let list = [{
					data: 'main_kind',
					group_id: 1002
				}]
				await GetGroupDataEx(this, list);
			},
			async DroupDownListOrgByOrgId() {
				let sqlCode = 1010;
				let searchList = [{
					field: "type_name",
					type: 3,
					level: 1
				}, ]
				let list = [{
					data: 'supervisor',

					filed: {
						type_name: '监理'
					}
				}, {
					data: 'constructor',
					filed: {
						type_name: '施工单位'
					}
				}];
				for (let i = 0; i < list.length; i++) {
					let item = list[i];
					let {
						data
					} = await this.QueryExec_fob(sqlCode, searchList, item.filed);
					console.log(item.filed, data)
					this.selectData[item.data] = data;
				}
			},
			file_default() {
				// const form = JSON.parse(JSON.stringify(this.form))
				// let that = this
				// that.upload.original_name.contract_file[form.contract_file] = '外委合同'
				// that.upload.original_name.ext_file[form.ext_file] = '外委资质'
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
							field: "project_id",
							level: 1
						},
						{
							field: "org_id",
							level: 2
						},
						{
							field: "project_name",
							level: 3
						},
						{
							field: "main_kind",
							level: 4
						},
						{
							field: "sec_mgr_org",
							level: 5
						},
						{
							field: "qua_mgr_org",
							level: 6
						},
						{
							field: "sec_super_id",
							level: 7
						},
						{
							field: "qua_super_id",
							level: 8
						},
						{
							field: "constructor_id",
							level: 9
						},
						{
							field: "constructorid",
							level: 10
						},
						{
							field: "supervisor_id",
							level: 11
						},
						{
							field: "supervisor",
							level: 12
						},
						{
							field: "memo",
							level: 13
						}, {
							field: "gps_type",
							level: 14,
						}, {
							field: "WGS84longitude",
							level: 15,
						}, {
							field: "WGS84latitude",
							level: 16,
						}, {
							field: "GCJ02longitude",
							level: 17,
						}, {
							field: "GCJ02latitude",
							level: 18,
						}, {
							field: "BD09longitude",
							level: 19,
						}, {
							field: "BD09latitude",
							level: 20,
						},
					]
					let fob = '';
					let sqlcode = -1
					let msg = ''
					let aPointJson = that.$refs['baiduMap'].GetMapRef().ConvertUCS();
					if (aPointJson) {
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
					if (form.id && form.id > 0) {
						//更新
						sqlcode = 1012
						fob = that.update_fob;
						msg = '更新';
						list.push({
							field: "id",
							level: 21
						})
					} else {
						//添加
						msg = '添加'
						sqlcode = 1011
						fob = that.insert_fob;
						that.form.org_id = that.org_id;
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
					// if (!data || data.length == 0) {
					// 	that.$baseMessage(msg + '失败', 'error')
					// 	return false;
					// }
					if (influence > 0) {
						that.$baseMessage(msg + '成功', 'success');
						that.close();
						return true;
					} else {
						that.$baseMessage(msg + '失败', 'error');
						return false;
					}
				}
				that.$refs['form'].validate((valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							const flag = await submit()
							callback(flag)
							// that.fileUpload(async function(status) {
							// 	if (status) {
							// 		const flag = await submit()
							// 		callback(flag)
							// 	}
							// })
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
</style>
