<template>
	<span>
		<el-form ref="purchase_from" :model="form" :rules="rules" style="padding: 0px 0px;">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="plan_name" label="计划名称" :label-width="formLabelWidth">
						<el-input v-model="form.plan_name" :placeholder="isReadOnly('计划名称...')" type="text"
							style="width: 100%" :readonly="readonly" :maxlength='50'>
						</el-input>
					</el-form-item>
				</el-col>

				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="check_date" label="计划实施时间" :label-width="formLabelWidth">
						<el-date-picker v-model="form.check_date" align="left" type="date"
							:placeholder="isReadOnly('请选择计划实施时间')" :picker-options="pickerOptions.all"
							style="width: 100%" :format='dateFormat' :value-format="dateFormat" :readonly="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="planner" label="计划人" :label-width="formLabelWidth">
						<el-autocomplete class="inline-input" v-model="form.planner"
							:fetch-suggestions="querySearchPerson" :placeholder="isReadOnly('请输入计划人...')" :maxlength='8'
							style="width: 100%;" :readonly="readonly" @select="handleSelect">
							<template slot-scope="{ item }">
								<div class="name">{{ item.name }}</div>
							</template>
						</el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="plan_content" label="计划内容" :label-width="formLabelWidth">
						<el-input v-model="form.plan_content" :placeholder="isReadOnly('计划内容...')" type="textarea"
							style="width: 86%" :readonly="readonly" :maxlength='100' show-word-limit>
						</el-input>
						<el-button type="primary" @click="showDialog" style="margin-left: 10px">
							添加标准物质
						</el-button>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item prop="" label="" label-width="50px">
						<el-table ref="check_show" v-loading="table.check_show.listLoading" highlight-current-row
							:data="table.check_show.tableArray" border
							:element-loading-text="table.check_show.elementLoadingText"
							:height="table.check_show.tableHeight">
							<el-table-column show-overflow-tooltip prop="manage_id" label="管理编号"></el-table-column>
							<el-table-column show-overflow-tooltip prop="store_name" label="名称"></el-table-column>
							<el-table-column show-overflow-tooltip prop="mat_name" label="类型">
							</el-table-column>
							<el-table-column show-overflow-tooltip prop="implementation_date" label="上次核查日期"
								width="130px">
							</el-table-column>
							<el-table-column show-overflow-tooltip label="核查方式">
								<template #default="{ row }">
									<el-input v-model="row.check_method" :placeholder="isReadOnly('核查方式...')"
										type="text" style="width: 100%" :readonly="readonly" :maxlength='50'
										size="mini">
									</el-input>
								</template>
							</el-table-column>
							<el-table-column show-overflow-tooltip label="操作" width="120px" fixed="right">
								<template #default="{ row }">
									<el-button class="danger" @click="handleDelete(row)">
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination :background="table.check_show.background"
							:current-page="table.check_show.queryForm.pageNo" :layout="table.check_show.layout"
							:page-size="table.check_show.queryForm.pageSize" :total="table.check_show.total"
							@current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-dialog title="选择标准物质" :visible.sync="dialog.dialogFormVisible" top="3vh" width="80%" append-to-body
			ref="eldialog">
			<div style="max-height: calc(100vh - 220px); overflow-y: auto">
				<materiaExamineAndVerifySelectTable ref="SelectTable" v-model="form.select_store"
					@UpdateSelect='UpdateSelect'>
				</materiaExamineAndVerifySelectTable>
			</div>
			<div slot="footer" class="dialog-footer">
				<!-- <div style="width: 100%">{{ ghost }}</div> -->
				<el-button type="primary" @click="dialogSave">确 定</el-button>
				<el-button @click="dialog.dialogFormVisible =false">取 消</el-button>
			</div>
		</el-dialog>
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
	import materiaExamineAndVerifySelectTable from '../table/materiaExamineAndVerifySelectTable'
	export default {
		name: 'materiaExamineAndVerify',
		components: {
			materiaExamineAndVerifySelectTable,
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
				table: {
					check_show: {
						listLoading: false,
						elementLoadingText: '加载中...',
						tablelist: [],
						tableArray: [],
						total: 0,
						tableHeight: '300px',
						background: false,
						layout: 'total, sizes, prev, pager, next, jumper',
						queryForm: {
							pageNo: 1,
							pageSize: 10,

						}
					}
				},
				dialog: {
					dialogFormVisible: false,
				},
				form: {
					select_store: [],
					plan_name: '',
					check_date: getToday(),
					planner: '',
					plan_content: '',
					org_id: '',
					plan_id: '',


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
				title: '',
				rules: {

				},
				rules_temp: {
					plan_name: [{
						required: true,
						message: '请输入计划名称',
						trigger: 'blur',
					}],
					check_date: [{
						required: true,
						message: '请选择计划实施时间',
						trigger: 'blur',
					}],
					planner: [{
						required: true,
						message: '请输入计划人',
						trigger: 'blur',
					}],
					plan_content: [{
						required: true,
						message: '请输入计划内容',
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
			'form.plan_id': function(newVal, b) {
				if (newVal && newVal > 0) {
					this.queryStore()
				}
			}
		},
		created() {
			this.init()
		},
		methods: {
			async showDialog() {
				this.dialog.dialogFormVisible = true
				if (this.$refs['SelectTable']) {
					this.$refs['SelectTable'].init()
				}


			},
			handleCurrentChange(val) {
				this.table.check_show.queryForm.pageNo = val
				this.checkShowQuery()
			},
			handleSizeChange(val) {
				this.table.check_show.queryForm.pageSize = val
				this.checkShowQuery()
			},
			checkShowQuery() {
				let queryForm = JSON.parse(JSON.stringify(this.table.check_show.queryForm));
				let data = this.table.check_show.tablelist

				let item = ''
				let val = ''
				let length = data.length
				let array = []
				queryForm = this.pageDeal(queryForm, 2);
				if (length == 0) {
					this.table.check_show.tableArray = array
					this.table.check_show.total = array.length
					return array
				}
				let searchFlag = false
				for (let key in queryForm) {
					val = queryForm[key]
					switch (key) {
						case 'pageNo':
						case 'pageSize':
							break;
						default:
							if (typeof val == 'undefined') {
								continue
							}
							if (val == '') {
								continue
							}
							break;
					}
					for (let i = 0; i < length; i++) {
						item = data[i]
						if (typeof item[key] == 'undefined') {
							continue
						}
						if (item[key] == '') {
							continue
						}
						searchFlag = true
						if (item[key] == val) {
							array.push(item)
						}
					}
				}
				if (!searchFlag) {
					array = data
				}
				let temp = array.slice(queryForm.pageNo, queryForm.pageSize)
				this.table.check_show.total = array.length
				this.table.check_show.tableArray = temp

			},
			async queryStore() {
				let sqlcode = 587
				let list = [{
					field: 'plan_id',
					type: 3,
					level: 1
				}]
				let field = {
					plan_id: this.form.plan_id,
				}
				const {
					code,
					data
				} = await this.QueryExec_fob(sqlcode, list, field)
				if (!data) {
					return
				}
				let length = data.length
				let item = {}
				let array = []
				for (let i = 0; i < length; i++) {
					item = data[i]
					array.push(item.store_id)
				}
				this.table.check_show.tablelist = data
				this.form.select_store = array
				this.checkShowQuery()
			},
			handleDelete(row) {
				//console.log(row, this.table.check_show.tablelist, this.table.check_show.tableArray)
				let data = this.table.check_show.tablelist
				let index = data.indexOf(row)
				//let index = -1
				//let length = data.length
				// for (let i = 0; i < length; i++) {
				// 	if (row.store_id == data[i].store_id) {
				// 		index = i;
				// 		break
				// 	}
				// }
				if (index < 0) {
					console.log('index<0')
					return
				}
				//删除form表单元素
				let store_id = row.store_id
				let index2 = this.form.select_store.indexOf(store_id)
				if (index2 < 0) {
					index2 = this.form.select_store.indexOf(parseInt(store_id))
				}
				try {
					this.form.select_store.splice(index2, 1);
					data.splice(index, 1);
				} catch (e) {
					console.log(e)
				}
				this.checkShowQuery()
			},
			dialogSave() {
				this.$refs['SelectTable'].UpdataValue()
				this.checkShowQuery()
				this.dialog.dialogFormVisible = false
			},
			UpdateSelect(selectRows) {
				let length = selectRows.length
				let item = {}
				let tablelist = this.table.check_show.tablelist
				for (let i = 0; i < length; i++) {
					item = selectRows[i]
					if (!item.isReadOnly) {
						let store_id = item.store_id
						let find = tablelist.filter((val) => {
							if (val.store_id == store_id) {
								return val
							}
						})
						if (find.length > 0) {
							find[0] = item
						} else {
							tablelist.push(item)
						}
					}
				}
			},
			handleSelect(item, e) {
				if (!item || !item.value) {
					return
				}
				//this.form.check_person = item.value
				this.clearValidate('planner')
			},
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
			GetStore_Text(data) {
				if (!data) {
					data = this.table.check_show.tablelist
				}
				let length = data.length
				let item = {}
				let sResult = ''
				let row_split = '^,'
				let col_split = '^;'
				let col_array = ['check_method', 'store_id']
				for (let i = 0; i < length; i++) {
					item = data[i]
					for (let j = 0; j < col_array.length; j++) {
						let temp = item[col_array[j]]
						if (typeof temp == 'undefined') {
							temp = ''
						}
						sResult = sResult + temp + col_split
					}
					sResult = sResult.substring(sResult.length - col_split.length, 0) + row_split
				}
				sResult = sResult.substring(sResult.length - row_split.length, 0)
				return sResult
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
						},
						{
							field: 'check_date',
							type: 3,
							level: 2
						},
						{
							field: 'planner',
							type: 3,
							level: 3
						},
						{
							field: 'plan_name',
							type: 3,
							level: 4
						},
						{
							field: 'plan_content',
							type: 3,
							level: 5
						},
						{
							field: 'select_store_str',
							type: 3,
							level: 6
						},
						{
							field: 'plan_id',
							type: 3,
							level: 7
						},
					]
					let fob = '';
					let sqlcode = -1;
					let msg = ''
					if (form.plan_id && form.plan_id > 0) {
						//更新
						sqlcode = 585
						fob = that.update_fob;
						msg = '更新'
					} else {
						//添加
						msg = '添加'
						sqlcode = 585
						fob = that.insert_fob;
						that.form.org_id = await GetOrgId()

					}
					that.form.select_store_str = that.GetStore_Text()
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
