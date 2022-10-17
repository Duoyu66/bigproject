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
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="form.name">
					<el-form-item prop="name" label="检测室名称" :label-width="formLabelWidth">
						<el-input v-model="form.name" :placeholder="isReadOnly('')" :readonly="true"
							style="width: 100%" :disabled="true">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="charger" label="负责人" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.charger"
							:fetch-suggestions="querySearchPerson" :placeholder="isReadOnly('请输入负责人...')"
							:maxlength='10' style="width: 100%;" :readonly="readonly" @select="handleSelect">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="area" label="面积" :label-width="formLabelWidth">
						<el-input v-model="form.area" :placeholder="isReadOnly('请输入检测室面积')" :readonly="readonly"
							style="width: 100%" maxlength="16" type="text">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="explain" label="检测室说明" :label-width="formLabelWidth">
						<el-input v-model="form.explain" :placeholder="isReadOnly('请输入检测室说明')" :readonly="readonly"
							style="width: 100%" maxlength="100" show-word-limit type="textarea" :autosize='{ minRows: 4,
							maxRows: 10 }'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="remarks" label="备注" :label-width="formLabelWidth">
						<el-input v-model="form.remarks" :placeholder="isReadOnly('请输入备注')" :readonly="readonly"
							style="width: 100%" maxlength="250" show-word-limit type="textarea" :autosize='{ minRows: 4,
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
	export default {
		name: 'testBookForm',
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
					charger: '',
					name: '',
					remarks: '',
					explain: '',
					room_no: '',
					area: '',
					room_id: '',
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
					charger: [{
						required: true,
						message: '请输入负责人',
						pattern: '[^\x22]+',
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
				if (this.$refs['testBookForm']) {
					this.$refs['testBookForm'].clearValidate(prop)
				}
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
							field: 'charger',
							type: 3,
							level: 1
						}, {
							field: 'explain',
							type: 3,
							level: 2
						}, {
							field: 'area',
							type: 3,
							level: 3
						},
						{
							field: 'remarks',
							type: 3,
							level: 4
						}, {
							field: 'room_no',
							type: 3,
							level: 5
						}, {
							field: 'org_id',
							type: 3,
							level: 6
						}, {
							field: 'room_id',
							type: 3,
							level: 7
						}
					]

					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.room_id && form.room_id > 0) {
						//更新
						sqlcode = 643
						fob = that.update_fob;
						msg = '更新'
					} else {
						//添加
						msg = '更新'
						sqlcode = 643
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
