<template>
	<span>
		<el-form ref="purchase_from" :model="form" :rules="rules">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="store_name" label="标准物质名称" :label-width="formLabelWidth">
						<el-input v-model="form.store_name" type="text" style="width: 100%" readonly="readonly" disabled
							:maxlength='50'>
						</el-input>
					</el-form-item>
				</el-col>

				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="mat_name" label="类别" :label-width="formLabelWidth">
						<el-input v-model="form.mat_name" type="text" style="width: 100%" readonly="readonly" disabled
							:maxlength='50'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="check_method" label="核查方式" :label-width="formLabelWidth">
						<el-input v-model="form.check_method" type="textarea" style="width: 100%" :readonly="readonly"
							:maxlength='50' :placeholder="isReadOnly('核查方式...')">
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
		GetRmAlloc,
		GetOrgId,
		GetPersonRoleMax,
		getOrgNameByselect,
		GetPersonList,
		file_about,
		GetRmStore,
		GetRmBuyMinDate,
		GetRmBaseInfoByStoreId
	} from '../commonJs/common.substanceCategory.js'

	export default {
		name: 'materiaExamineAndVerifyCheckForm',
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
				form: {
					store_name: '',
					mat_name: '',
					check_method: '',
					check_id: -1,
				},
				formdefalut: {

				},
				readonly: false,
				form_old: {
					volume: 0,
				},
				selectData: {
					store_id: [],
				},
				formLabelWidth: '120px',
				pickerOptions: {
					all: pickerOptions({

					}),
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
				rules: {

				},
				rules_temp: {
					check_method: [{
						required: true,
						message: '请输入核查方式',
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
						console.log('watch', this.form_old)
					}
				},
				deep: true,
			},

		},
		created() {
			this.init()
		},
		methods: {
			isReadOnly(txt) {
				if (this.readonly) {
					return ''
				}
				return txt
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
			clearValidate(prop) {
				this.$refs['purchase_from'].clearValidate(prop)
			},
			async init() {
				this.rules = this.rules_temp

				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					this.form_old = JSON.parse(JSON.stringify(this.formData))
				}

			},
			close() {
				let that = this
				that.$refs['purchase_from'].resetFields()

				that.form = that.$options.data().form
				that.form = JSON.parse(JSON.stringify(that.formdefalut))
			},
			resetForm() {
				this.$nextTick(() => {
					this.$refs['purchase_from'].resetFields()

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
							field: 'check_method',
							type: 3,
							level: 1
						},
						{
							field: 'org_id',
							type: 3,
							level: 2
						},
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.check_id && form.check_id > 0) {
						//更新
						sqlcode = 589
						fob = that.update_fob;
						msg = '更新'
						list.push({
							field: 'check_id',
							type: 3,
							level: list.length
						})
					} else {
						//添加
						msg = '添加'
						sqlcode = 589
						fob = that.insert_fob;
						that.form.org_id = await GetOrgId()
					}
					const {
						code,
						influence,
						data
					} = await fob(list, that.form, sqlcode)
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
				that.$refs['purchase_from'].validate((valid) => {
					if (valid) {
						let tips = '确定提交？'
						that.$baseConfirm(tips, null, async () => {
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
