<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
		<el-form ref="form" :model="form" :rules="rules" label-width="80px">
			<el-form-item label="权限名称" prop="name">
				<el-input v-model.trim="form.name" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="权限描述" prop="desc">
				<el-input v-model.trim="form.desc" autocomplete="off" type="textarea"></el-input>
				<!--        <el-input v-model="ruleForm.desc" type="textarea"></el-input>-->
			</el-form-item>
			<!-- <el-form-item label="下拉测试" prop="select">
				<Select ref="test" sType="1" :oList="selectList('test')" sSqlCode="8">
				</Select>
			</el-form-item> -->
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>

		</div>
	</el-dialog>
</template>

<script>
	// import Select from '@/components/Select'
	//import TableEdit from './'//./../../../components/sel/defaultEdit
	export default {
		name: 'TableEdit',
		//通过inject调用父组件中的的reload
		components: {
			// Select
		},
		inject: ['reload'],
		data() {
			let that = this
			return {
				formDefault: {},
				form: {
					type_id: '',
					name: '',
					desc: '',
				},
				rules: {
					select: [{
						required: true,
						trigger: ['blur', 'change'],
						message: '请选中',
					}, ],
					name: [{
							required: true,
							trigger: 'blur',
							message: '请输入权限名称',
						},
						{
							trigger: 'blur',
							validator: async function(rule, value, callback) {
								let form = JSON.parse(JSON.stringify(that.form))
								let list = [{
										field: 'name',
										type: 3,
										level: 1,
									},
									{
										field: 'type_id',
										type: 3,
										level: 2,
									},
								]
								form.name = value
								const {
									code,
									data
								} = await that.QueryExec_fob(3, list, form)
								if (code == 200) {
									if (data && data.length > 0) {
										callback(new Error('已存在该权限类型名称'))
									} else {
										callback()
									}
								} else {
									callback(new Error('查询数据库异常'))
								}
							},
						},
					], //pattern
					desc: [{
						required: false,
						trigger: 'blur',
						message: '请输入权限描述',
					}, ],
				},
				title: '',
				dialogFormVisible: false,
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				this.formDefault = JSON.parse(JSON.stringify(this.form))
				console.log('init', this.formDefault)
			},
			selectList(id) {
				const json = {
					test: [{
						field: 'name',
						type: 2,
						level: 1,
					}, ],
				}
				if (json[id]) {
					return json[id]
				} else {
					return []
				}
			},
			showEdit(row) {
				if (!row) {
					this.title = '添加'
					//console.log(this.$refs['form'])
					if (this.$refs['form']) {
						//console.log(this.$refs['form'])
						// this.$nextTick(() => {
						// 	this.$refs['form'].resetFields()
						// })

					}
				} else {
					this.title = '编辑'
					this.form = Object.assign({}, row)
				}
				this.title += '权限类型定义'
				if (this.$refs['test']) {
					this.$refs['test'].GetData()
				}
				this.dialogFormVisible = true
			},
			close() {
				this.form = this.$options.data().form
				//console.log(JSON.stringify(this.form))
				this.from = JSON.parse(JSON.stringify(this.formDefault))
				//console.log(JSON.stringify(this.form))
				//
				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},
			save() {
				let that = this
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						//console.log(that.form);
						let data = JSON.parse(JSON.stringify(that.form))
						let list = [{
								field: 'name',
								level: 1,
							},
							{
								field: 'desc',
								level: 2,
							},
						]
						let fob = ''
						let sqlcode = -1
						let msg = ''
						if (data.type_id) {
							//更新
							sqlcode = 4
							fob = that.update_fob
							msg = '更新'
							list.push({
								field: 'type_id',
								level: 3,
							})
						} else {
							//添加
							msg = '添加'
							sqlcode = 5
							fob = that.insert_fob
						}
						const {
							code,
							influence
						} = await fob(list, that.form, sqlcode)
						console.log(that.form)
						if (code != 200) {
							that.$baseMessage(msg + '失败', 'error')
							return false
						}
						if (influence > 0) {
							that.$baseMessage(msg + '成功', 'success')
							//that.$refs['form'].resetFields()
							that.dialogFormVisible = false
							//that.$emit('fetch-data')
							//that.form = that.$options.data().form
							//重载表格
							that.reload()
						} else {
							that.$baseMessage(msg + '失败', 'error')
						}
						// const {
						// 	msg
						// } = await doEdit(this.form)
						// this.$baseMessage(msg, 'success')
						// this.$refs['form'].resetFields()
						// this.dialogFormVisible = false
						// this.$emit('fetch-data')
						// this.form = this.$options.data().form
					} else {
						return false
					}
				})
			},
		},
	}
</script>
