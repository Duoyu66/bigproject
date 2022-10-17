<template>

	<el-form ref="form" :model="form" :rules="rules" style="max-height: calc(100vh - 200px); overflow-y: auto;">
		<el-row>
			<el-col :span="span">
				<el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldPassword">
					<el-input :key="oldPasswordType" ref="oldPasswordType" v-model.trim="form.oldPassword"
						:type="oldPasswordType" tabindex="2" :placeholder="isReadOnly('请输入旧密码')" :readonly="readonly"
						clearable style="width: 100%">
						<span v-if="oldPasswordType === 'password'" class="show-password" @click="handleOldPassword"
							slot="append">
							<vab-icon :icon="['fas', 'eye-slash']" />
						</span>
						<span v-else class="show-password" @click="handleOldPassword" slot="append">
							<vab-icon :icon="['fas', 'eye']" />
						</span>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
					<el-input :key="passwordType" ref="password" v-model.trim="form.newPassword" :type="passwordType"
						tabindex="2" :placeholder="isReadOnly('请输入新密码')" :readonly="readonly" clearable
						style="width: 100%">
						<span v-if="passwordType === 'password'" class="show-password" @click="handlePassword"
							slot="append">
							<vab-icon :icon="['fas', 'eye-slash']" />
						</span>
						<span v-else class="show-password" @click="handlePassword" slot="append">
							<vab-icon :icon="['fas', 'eye']" />
						</span>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="密码确认" :label-width="formLabelWidth" prop="confirmPassword">
					<el-input :key="confirmPasswordType" ref="confirmPasswordType" v-model.trim="form.confirmPassword"
						:type="confirmPasswordType" tabindex="2" :placeholder="isReadOnly('请再次输入新密码')"
						:readonly="readonly" clearable style="width: 100%">
						<span v-if="confirmPasswordType === 'password'" class="show-password"
							@click="handleComfirmPassword" slot="append">
							<vab-icon :icon="['fas', 'eye-slash']" />
						</span>
						<span v-else class="show-password" @click="handleComfirmPassword" slot="append">
							<vab-icon :icon="['fas', 'eye']" />
						</span>
					</el-input>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
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
		GetGroupDataEx
	} from '@/utils/htmlDataGroup'
	import {
		isNumEx,
		isTel,
		isPhone
	} from '@/utils/validate'
	export default {
		name: 'personelEditPasswordForm',
		model: {
			prop: 'formData',
			event: 'on-change'
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
				person_name: 'user/username',
				current_and_chrilren_org: 'org/current_and_chrilren_org',
				foldSideBar: 'settings/foldSideBar',
				foldOrgexist: 'settings/foldOrgexist',
				openOrgexist: 'settings/openOrgexist',
			}),
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
		watch: {
			formData(newVal, oldVal) {
				if (newVal) {
					this.form = JSON.parse(JSON.stringify(this.formDefault))
					this.form = Object.assign(this.form, newVal)
				}
			},
		},
		data() {
			let that = this
			return {
				passwordType: 'password',
				confirmPasswordType: 'password',
				oldPasswordType: 'password',
				span: 24,
				readonly: false,
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(),
				form: {
					oldPassword: '',
					newPassword: '',
					confirmPassword: '',
				},
				rules: {},
				rules_temp: {
					oldPassword: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请输入旧密码'
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							if (!value) {
								callback(new Error('请输入旧密码'))
								return
							}
							let sqlcode = 459
							let list = [{
								field: "person_id",
								type: 3,
								level: 1
							}, {
								field: "password",
								type: 3,
								level: 2
							}]
							let form = {
								person_id: that.person_id,
								password: value
							}
							const {
								code,
								influence,
								data
							} = await that.QueryExec_fob(459, list, form)
							if (code != 200) {
								callback(new Error('查询数据库异常，请刷新重试'))
								return false
							}
							if (!data || data.length == 0) {
								callback(new Error('查询数据库异常，请刷新重试'))
								return
							}
							let json = JSON.parse(data[0].info)
							if (json.success) {
								callback()
								return
							} else {
								switch (json.code) {
									case 1:
										callback()
										break
									case 2:
										callback(new Error(json.msg))
										break
									default:
										callback(new Error(json.msg))
										break
								}
							}
						}
					}],
					newPassword: [{
						required: true,
						trigger: 'blur',
						message: '请输入新密码'
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {

							if (!value) {
								callback(new Error('请输入新密码'))
								return
							}
							let reg = /^[-_a-zA-Z0-9]([-_a-zA-Z0-9]{4,16})$/;
							if (!reg.test(value)) {
								callback(new Error('密码格式错误。5-16位,只允许英文、数字、下划线和减号'))
								return
							}
							if (that.form.newPassword != value) {
								callback(new Error('两次输入的密码不一致'))
								return
							}
						}
					}],
					confirmPassword: [{
						required: true,
						trigger: 'blur',
						message: '请再次输入新密码'
					}, {
						trigger: 'blur',
						validator: async function(rule, value, callback) {
							let reg = /^[-_a-zA-Z0-9]([-_a-zA-Z0-9]{4,16})$/;
							if (!reg.test(value)) {
								callback(new Error('密码格式错误。5-16位,只允许英文、数字、下划线和减号'))
								return
							}
							if (!value) {
								callback(new Error('请再次输入新密码'))
								return
							}
							if (that.form.newPassword != value) {
								callback(new Error('两次输入的密码不一致'))
								return
							}
						}
					}],
				},
				formLabelWidth: '120px',
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
						this.rules = this.rules_temp
						break;
					case 1:
						this.readonly = true
						this.rules = {}
						break
				}
				this.formDefault = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
				}
			},
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},
			handlePassword() {
				this.passwordType === 'password' ?
					(this.passwordType = '') :
					(this.passwordType = 'password')
				this.$nextTick(() => {
					this.$refs.password.focus()
				})
			},
			handleComfirmPassword() {
				this.confirmPasswordType === 'password' ?
					(this.confirmPasswordType = '') :
					(this.confirmPasswordType = 'password')
				this.$nextTick(() => {
					this.$refs.confirmPasswordType.focus()
				})
			},
			handleOldPassword() {
				this.oldPasswordType === 'password' ?
					(this.oldPasswordType = '') :
					(this.oldPasswordType = 'password')
				this.$nextTick(() => {
					this.$refs.oldPasswordType.focus()
				})
			},
			close() {
				this.$refs['form'].resetFields()
				this.form = this.$options.data().form
				this.form = JSON.parse(JSON.stringify(this.formDefault))
				//this.$emit('fetch-data')
			},
			save(callback) {
				let that = this
				async function submit(callback) {
					let form = JSON.parse(JSON.stringify(that.form));
					let list = [{
							field: "person_id",
							type: 3,
							level: 1
						},
						{
							field: "oldPassword",
							type: 3,
							level: 2
						},
						{
							field: "newPassword",
							type: 3,
							level: 3
						},

					]
					let formSubmit = {
						person_id: that.person_id,
						oldPassword: form.oldPassword,
						newPassword: form.newPassword
					}
					const {
						code,
						influence,
						data
					} = await that.QueryExec_fob(460, list, formSubmit)
					console.log(code, influence, data);
					if (code != 200) {
						that.$baseMessage('修改失败，请刷新重试', 'error')
						return false
					}
					if (!data || data.length == 0) {
						that.$baseMessage('修改失败，请刷新重试', 'error')
						return
					}
					let json = JSON.parse(data[0].info)
					if (json.success) {
						that.$baseMessage('修改成功', 'success')
						callback()
						return
					} else {
						switch (json.code) {
							case 1:
								that.$baseMessage('修改成功', 'success')
								callback()
								break
							case 2:
								that.$baseMessage(json.msg, 'error')
								break
							default:
								that.$baseMessage(json.msg, 'error')
								break
						}
					}

				}
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							submit(function() {
								if (callback) {
									callback(true)
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

</style>
