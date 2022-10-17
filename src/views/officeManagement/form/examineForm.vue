<template>
	<el-form ref='form' :model="form" :label-width="formLabelWidth" :rules="rules" v-loading="loading"
		:element-loading-text="loadingText">
		<el-form-item label="审核人">
			<el-input v-model="form.approver" :readonly="true" style="width: 100%" maxlength="8"></el-input>
		</el-form-item>
		<el-form-item label="是否通过" style="margin-top: 10px" prop="approve">
			<el-select v-model="form.approve" style="width: 100%" :disabled="readonly" :placeholder="readonly?'':'请选择'">
				<el-option v-for="data in selectData.approveData" :key="data.item_id" :label="data.item_name"
					:value="data.item_id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="审核时间" v-show="readonly">
			<el-input v-model="form.revieweDate" :readonly="true" style="width: 100%" maxlength="8"></el-input>
		</el-form-item>
		<el-form-item label="原因" style="margin-top: 10px" :required="ruleForm.reason" prop="reason">
			<el-input v-model="form.reason" type="textarea" :rows="6" :placeholder="readonly?'':'请输入原因'"
				:readonly="readonly" style="width: 100%" maxlength="100"></el-input>
		</el-form-item>
	</el-form>
</template>

<script>
	import store from '@/store/index'
	export default {
		name: 'examineForm',
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
		watch: {
			formData(newVal, oldVal) {
				if (this.formData) {
					this.form = Object.assign(this.form, newVal)
				}
			},
		},
		data() {
			let that = this
			return {
				formLabelWidth: '120px',
				selectData: {
					approveData: [{
						item_id: 1,
						item_name: '通过'
					}, {
						item_id: -1,
						item_name: '退回'
					}]
				},
				readonly: false,
				loading: false,
				loadingText: '提交表单中...',
				form: {
					approver: store.getters['user/username'],
					approver_id: store.getters['user/person_id'],
					approve: '',
					revieweDate: '',
					reason: '',
				},
				ruleForm: {
					reason: false
				},
				rules: {},
				rules_temp: {
					approve: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请选择审核状态'
					}, {
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							switch (value) {
								case 0:
									break;
								case 1:
									that.ruleForm.reason = false
									break
								case -1:
									that.ruleForm.reason = true
									break
								case -2:
									that.ruleForm.reason = true
									break
							}
							callback()
						}
					}],
					reason: [{
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							if (that.ruleForm.reason && !value) {
								callback(new Error('请填写退回原因'))
							} else {
								callback()
							}

						}
					}]
				}
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				switch (this.type) {
					case 2:
						this.selectData.approveData = [{
							item_id: 1,
							item_name: '通过'
						}, {
							item_id: -1,
							item_name: '退回'
						}, {
							item_id: -2,
							item_name: '作废'
						}]
					case 0:
						this.readonly = false
						this.rules = this.rules_temp
						break;
					case 3:
						this.selectData.approveData = [{
							item_id: 1,
							item_name: '通过'
						}, {
							item_id: -1,
							item_name: '退回'
						}, {
							item_id: -2,
							item_name: '作废'
						}]
					case 1:
						this.readonly = true
						this.rules = {}
						break
				}
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)

				}
			},
			close() {
				this.$refs['form'].resetFields()
				this.details = this.$options.data().details
				this.$emit('fetch-data')
			},
			async save(callback) {
				let that = this
				const valid = await that.$refs['form'].validate()
				if (valid) {
					that.$baseConfirm('确定提交？', null, async () => {
						callback(that.form)
						return true
					})
					return false
				}
				callback(false)
				return true
			},
		},
	}
</script>

<style>
</style>
