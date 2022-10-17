<template>
	<span>
		<el-form ref="standradForm" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="" :label-width="formLabelWidth" prop="" v-show="!disabled.room_no">
						<el-alert title="提示" description="加载设备的前50条数据,如没有需要的请在下拉框中输入关键词进行搜索" type="info"
							:closable="false" center show-icon> </el-alert>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="form.room_no">
					<el-form-item prop="room_no" label="检测室  " :label-width="formLabelWidth">
						<el-select v-model="form.room_no" style="width: 100%" :disabled="disabled.room_no" clearable
							filterable remote :remote-method="RoomRemoteMethod">
							<el-option v-for="data in selectData.room_no" :key="data.room_no" :value="data.room_no"
								:label=" data.name">
								<span style="float: left">{{ data.name }}</span>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="" :label-width="formLabelWidth" prop="" v-show="!disabled.device_id">
						<el-alert title="提示" description="加载设备的前10条和当前选中的数据,如没有需要的请在下拉框中输入关键词进行搜索,添加时已经存在与当前检测室中的不会出现" type="info"
							:closable="false" center show-icon> </el-alert>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="设备名称" :label-width="formLabelWidth" prop="device_id">
						<el-select v-model="form.device_id" style="width: 100%" :disabled="disabled.device_id"
							:multiple="select.device_id.multiple" clearable filterable remote
							:remote-method="deviceRemoteMethod">
							<el-option v-for="data in selectData.device_id" :key="data.device_id"
								:value="data.device_id" :label=" data.device_name">
								<span style="float: left">{{ data.device_name }}</span>
								<span style="margin-left: 10px; color: #8492a6; font-size: 13px"
									v-show="data.type&&data.type!='/'">类型：{{ data.type }}</span>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="alloc_name" label="分配人员" :label-width="formLabelWidth">
						<el-input v-model="form.alloc_name" :placeholder="isReadOnly('')" :readonly="true"
							style="width: 100%" :disabled="true">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="alloc_time" label="分配时间" :label-width="formLabelWidth">
						<el-date-picker v-model="form.alloc_time" align="left" type="date"
							:placeholder="isReadOnly('请选择分配时间')" :picker-options="pickerOptions.all" style="width: 100%"
							:format='dateFormat' :value-format="dateFormat" :readonly="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="备注内容" :label-width="formLabelWidth" prop="remarks">
						<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="100"
							:placeholder="isReadOnly('请输入备注内容...')" v-model="form.remarks" show-word-limit
							style="width: 100%" :readonly="readonly">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</span>
</template>
<script>
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
		name: 'roomDefintionForm',
		components: {

		},
		computed: {
			...mapGetters({
				username: 'user/username',
				org_id: 'user/org_id',
				person_id: 'user/person_id'
			}),
		},
		props: {
			formData: {
				type: Object,
				required: false,
			},
			option: {
				type: Object,
				required: false,
				default: function() {
					return {}
				}
			}
		},
		data() {
			let that = this
			return {
				model: 'edit',
				split: {
					device_id: ','
				},
				uploadDeault: {

				},
				formdefalut: {

				},
				date_is_valid: undefined,
				isAlloc: false,
				inEditMode: false,
				isEmptyList: true,
				disabled: {
					room_no: false,
					device_id: false,
				},
				readonly: false,
				chemical: {
					unit: '',
				},

				form_old: {
					nullify_quantity: 0,
				},
				form: {
					device_id: '',
					room_no: '',
					alloc_name: '',
					alloc_time: getToday(),
					remarks: '',
					org_id: '',

				},
				selectData: {
					device_id: [],
					room_no: [],
				},
				select: {
					device_id: {
						multiple: false
					}
				},
				formLabelWidth: '120px',
				pickerOptions: {
					before: pickerOptions({
						disabledDate: true,
						type_disable: 2
					}),
					after: pickerOptions({
						disabledDate: true,
						type_disable: 3,
						shortcuts_type: 'after'
					}),
				},
				dateFormat: dateFormat(),
				organization: {
					org_name: ''
				},
				title: '',
				rules: {

				},
				rules_temp: {
					device_id: [{
						required: true,
						message: '请选择设备',
						trigger: 'blur',
					}],
					room_no: [{
						required: true,
						message: '请选择检测室编号',
						trigger: 'blur',
					}],
					alloc_time: [{
						required: true,
						message: '请输入分配时间',
						trigger: 'blur',
					}],
				},
			}
		},
		watch: {
			formData: {
				handler: function(newVal, b) {
					if (newVal) {
						this.form = Object.assign(this.form, newVal)
						this.form_old = JSON.parse(JSON.stringify(newVal))
					}
				},
				deep: true,
			},
		},
		created() {
			this.init()
		},
		methods: {
			clearValidate(prop) {
				this.$refs['standradForm'].clearValidate(prop)
			},
			async init() {
				this.rules = this.rules_temp
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.form_old = JSON.parse(JSON.stringify(this.formData))
				}
				if (this.option) {
					if (this.option.readonly) {
						if (this.option.readonly.room_no) {
							this.disabled.room_no = true
						}
						if (this.option.readonly.device_id) {
							this.disabled.device_id = true
						}

					}
					if (this.option.model) {
						this.model = this.option.model
					}
				}
				if (!this.readonly) {
					if (!this.form.alloc_name) {
						this.form.alloc_name = this.username
					}
				}
				switch (this.model) {
					case 'add':
						if (!this.disabled.device_id) {
							this.select.device_id.multiple = true
						} else {
							this.select.device_id.multiple = false
						}
						break
					default:
						this.select.device_id.multiple = false
						break
				}
				if (!this.disabled.device_id) {

					if (this.select.device_id.multiple) {
						if (this.form.device_id && typeof this.form.device_id == 'string') {
							this.form.device_id = this.form.device_id.split(this.split.device_id)
						} else {
							this.form.device_id = []
						}
					}
				}
				await this.GetRoomNo();
				await this.GetDeviceId();
				this.clearValidate()
			},
			RoomRemoteMethod(searchKey) {
				this.GetRoomNo(searchKey)
			},
			async GetRoomNo(searchKey) {
				let room_no = this.form.room_no
				let org_id = this.form.org_id
				let list = [{
					field: "org_id",
					type: 3,
					level: 1
				}, {
					field: "searchKey",
					type: 2,
					level: 2
				}];
				let form = {
					org_id: org_id,
					searchKey: searchKey
				}
				let customList = [{
					data: 'room_no',
					sqlcode: 664,
					list: list,
					form: form
				}]
				await GetGroupDataCustomEx(this, customList);
				console.log(new Date(), this.selectData)
			},
			deviceRemoteMethod(searchKey) {
				this.GetDeviceId(searchKey)
			},
			async GetDeviceId(searchKey) {
				let device_id = this.form.device_id
				let room_no = this.form.room_no
				let org_id = this.form.org_id
				let device_id_typeof = (typeof device_id).toLowerCase()
				if (isNumEx(device_id)) {
					device_id = Number(device_id)
				}
				switch (device_id_typeof) {
					case 'object':
						try {
							device_id = device_id.join(',')
						} catch (e) {
							console.log(e)
						}
						break
					default:
						device_id = Number(device_id)
						break
				}
				if (!device_id) {
					device_id = -1
				}
				let list = [{
					field: "room_no",
					type: 3,
					level: 1
				}, {
					field: "searchKey",
					type: 2,
					level: 2
				}, {
					field: "org_id",
					type: 3,
					level: 3
				}, {
					field: "device_id",
					type: 3,
					level: 4
				}];
				let form = {
					room_no: room_no,
					device_id: device_id,
					org_id: org_id,
					searchKey: searchKey
				}
				let customList = [{
					data: 'device_id',
					sqlcode: 662,
					list: list,
					form: form
				}]
				await GetGroupDataCustomEx(this, customList);
				console.log(new Date(), this.selectData)
			},
			isReadOnly(txt) {
				if (this.readonly) {
					return ''
				}
				return txt
			},

			close() {
				let that = this
				that.$refs['standradForm'].resetFields()

				that.form = that.$options.data().form
			},
			resetForm() {
				this.$nextTick(() => {
					this.$refs['standradForm'].resetFields()

				})
			},
			async QueryExec_fob_custom(list, form, sqlcode) {
				return await this.QueryExec_fob(sqlcode, list, form)
			},
			save(callback) {
				let that = this
				async function submit() {
					that.loading = true
					that.loadingText = '提交表单中...'
					let form = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: 'device_id',
							type: 3,
							level: 1
						},
						{
							field: 'org_id',
							type: 3,
							level: 2
						},
						{
							field: 'room_no',
							type: 3,
							level: 3
						}, {
							field: 'alloc_name',
							type: 3,
							level: 4
						}, {
							field: 'remarks',
							type: 3,
							level: 5
						}, {
							field: 'alloc_time',
							type: 3,
							level: 6
						}, {
							field: 'alloc_id',
							type: 3,
							level: 7
						}
					]

					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.alloc_id && form.alloc_id > 0) {
						//更新
						sqlcode = 663
						fob = that.update_fob;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 663
						fob = that.update_fob;
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
					if (influence > 0) {
						that.$baseMessage(msg + '成功', 'success')
						that.close()
						return true
					} else {
						that.$baseMessage(msg + '失败', 'error')
						return false
					}

				}
				that.$refs['standradForm'].validate((valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {

							const flag = await submit()
							callback(flag)

						})

					} else {
						that.$baseMessage('表单校验失败，请更正后重新提交', 'error')
						return false
					}
				})
			},
		},
	}
</script>
<style scoped>

</style>
