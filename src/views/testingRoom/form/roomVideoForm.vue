<template>
	<span>
		<el-form ref="testBookForm" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="form.room_no">
					<el-form-item prop="room_no" label="检测室编码" :label-width="formLabelWidth">
						<el-input v-model="form.room_no" :placeholder="isReadOnly('')" :readonly="true"
							style="width: 100%" :disabled="true">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="form.room_name">
					<el-form-item prop="room_name" label="检测室名称" :label-width="formLabelWidth">
						<el-input v-model="form.room_name" :placeholder="isReadOnly('')" :readonly="true"
							style="width: 100%" :disabled="true">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="video_name" label="摄像头名称" :label-width="formLabelWidth">
						<el-input v-model="form.video_name" :placeholder="isReadOnly('请输入摄像头名称')" :readonly="readonly"
							style="width: 100%" maxlength="16" type="text">
						</el-input>
					</el-form-item>
				</el-col>

				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="channel_id" label="通道号" :label-width="formLabelWidth">
						<el-input v-model="form.channel_id" :placeholder="isReadOnly('请输入通道号')" :readonly="readonly"
							style="width: 100%" maxlength="16" type="number">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="ip" label="ip地址" :label-width="formLabelWidth">
						<el-input v-model="form.ip" :placeholder="isReadOnly('请输入ip地址')" :readonly="readonly"
							style="width: 100%" maxlength="16" type="text">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="user" label="用户名" :label-width="formLabelWidth">
						<el-input v-model="form.user" :placeholder="isReadOnly('请输入用户名')" :readonly="readonly"
							style="width: 100%" maxlength="25" type="text">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="password" label="密码" :label-width="formLabelWidth">
						<el-input v-model="form.password" :placeholder="isReadOnly('请输入密码')" :readonly="readonly"
							style="width: 100%" maxlength="50" type="text">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="RTSP" label="rtsp地址" :label-width="formLabelWidth">
						<el-input v-model="form.RTSP" :placeholder="isReadOnly('请输入rtsp地址')" :readonly="readonly"
							style="width: 100%" maxlength="100" type="text">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="vender" label="摄像头厂家" :label-width="formLabelWidth">
						<el-input v-model="form.vender" :placeholder="isReadOnly('请输入摄像头厂家')" :readonly="readonly"
							style="width: 100%" maxlength="24" type="text">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="type" label="摄像头型号" :label-width="formLabelWidth">
						<el-input v-model="form.type" :placeholder="isReadOnly('请输入摄像头型号')" :readonly="readonly"
							style="width: 100%" maxlength="25" type="text">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="parameter" label="摄像头参数" :label-width="formLabelWidth">
						<el-input v-model="form.parameter" :placeholder="isReadOnly('请输入摄像头参数')" :readonly="readonly"
							style="width: 100%" maxlength="100" type="textarea" show-word-limit>
						</el-input>
					</el-form-item>
				</el-col>

				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="remarks" label="备注" :label-width="formLabelWidth">
						<el-input v-model="form.remarks" :placeholder="isReadOnly('请输入备注')" :readonly="readonly"
							style="width: 100%" maxlength="100" show-word-limit type="textarea" :autosize='{ minRows: 4,
							maxRows: 10 }'>
						</el-input>
					</el-form-item>
				</el-col>


			</el-row>
		</el-form>
	</span>
</template>
<script>
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
	} from '@/utils/dateHelp'
	import {
		GetPersonList
	} from '../commonjs/common.testingRoom'
	import {
		isRTSP,
		isIP
	} from '@/utils/validate'
	export default {
		name: 'roomVideoForm',
		components: {

		},
		props: {
			formData: {
				type: Object,
				required: false,
			},
		},
		data() {
			let that = this
			return {
				uploadDeault: {

				},
				formdefalut: {

				},
				date_is_valid: undefined,
				isAlloc: false,
				inEditMode: false,
				isEmptyList: true,
				readonly: false,
				chemical: {
					unit: '',
				},

				form_old: {
					nullify_quantity: 0,
				},
				form: {
					video_id: '',
					org_id: '',
					video_name: '',
					vender: '',
					channel_id: '',
					room_no: '',
					RTSP: '',
					type: '',
					user: '',
					password: '',
					parameter: '',
					remarks: '',
					ip: '',
				},
				selectData: {
					chemical_id: '',
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
					video_name: [{
						required: true,
						message: '请输入摄像头名称',
						pattern: '[^ \x22]+',
						trigger: 'blur',
					}],
					vender: [{
						required: true,
						message: '请输入生产厂家',
						pattern: '[^ \x22]+',
						trigger: 'blur',
					}],
					channel_id: [{
						required: true,
						message: '请输入通道号',
						pattern: '[^ \x22]+',
						trigger: 'blur',
					}],
					RTSP: [{
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							if (typeof value == 'undefined' || value.trim() == '') {
								callback()
								return
							}
							if (isRTSP(value)) {
								callback()
								return
							}
							callback(new Error('请输入一个正确的rtsp地址'))
							return
						}
					}],
					ip: [{
						required: true,
						message: '请输入Ip地址',
						pattern: '[^ \x22]+',
						trigger: 'blur',
					}, {
						trigger: ['blur'],
						validator: function(rule, value, callback) {
							if (typeof value == 'undefined' || value.trim() == '') {
								callback()
								return
							}
							if (isIP(value)) {
								callback()
								return
							}
							callback('请输入一个正确的ip地址')
							return
						}
					}],
					user: [{
						required: true,
						message: '请输入用户名',
						pattern: '[^ \x22]+',
						trigger: 'blur',
					}],
					password: [{
						required: true,
						message: '请输入密码',
						pattern: '[^ \x22]+',
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
			handleSelect(item, e) {
				if (!item || !item.value) {
					return
				}
				this.form.charger = item.value
				this.clearValidate('charger')
			},
			clearValidate(prop) {
				if (this.$refs['purchase_from']) {
					this.$refs['purchase_from'].clearValidate(prop)
				}

			},
			clearValidate(prop) {
				this.$refs['testBookForm'].clearValidate(prop)
			},
			async querySearchPerson(queryString, cb) {
				let data = await GetPersonList(undefined, queryString)
				if (data) {
					let length = data.length
					for (let i = 0; i < length; i++) {
						data[i]['value'] = data[i].name
					}
				}
				cb(data)
			},
			async init() {
				this.rules = this.rules_temp
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.form_old = JSON.parse(JSON.stringify(this.formData))
				}
				this.$nextTick(() => {
					this.clearValidate()
				})
			},

			isReadOnly(txt) {
				if (this.readonly) {
					return ''
				}
				return txt
			},

			close() {
				let that = this
				that.$refs['testBookForm'].resetFields()

				that.form = that.$options.data().form
			},
			resetForm() {
				this.$nextTick(() => {
					this.$refs['testBookForm'].resetFields()

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
							field: 'org_id',
							type: 3,
							level: 1
						}, {
							field: 'video_name',
							type: 3,
							level: 2
						}, {
							field: 'vender',
							type: 3,
							level: 3
						},
						{
							field: 'channel_id',
							type: 3,
							level: 4
						}, {
							field: 'room_no',
							type: 3,
							level: 5
						}, {
							field: 'RTSP',
							type: 3,
							level: 6
						}, {
							field: 'type',
							type: 3,
							level: 7
						}, {
							field: 'user',
							type: 3,
							level: 8
						}, {
							field: 'password',
							type: 3,
							level: 9
						}, {
							field: 'parameter',
							type: 3,
							level: 10
						}, {
							field: 'remarks',
							type: 3,
							level: 11
						}, {
							field: 'ip',
							type: 3,
							level: 12
						}
					]

					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.video_id && form.video_id > 0) {
						//更新
						sqlcode = 647
						fob = that.update_fob;
						msg = '更新';
						list.push({
							field: 'video_id',
							type: 3,
							level: list.length
						})
					} else {
						//添加
						msg = '添加'
						sqlcode = 646
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
				that.$refs['testBookForm'].validate((valid) => {
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
