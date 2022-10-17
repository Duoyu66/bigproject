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
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="close">取 消</el-button>
			<el-button type="primary" @click="save">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		name: 'TableEdit',
		//通过inject调用父组件中的的reload
		inject: ['reload'],
		data() {
			let that = this
			let AjaxHelper = that.AjaxHelper
			let sql_helper = that.sql_helper
			return {
				form: {
					type_id: '',
					name: '',
					desc: '',
				},
				rules: {
					name: [{
						required: true,
						trigger: 'blur',
						message: '请输入权限名称'
					}, {
						trigger: 'blur',
						validator: function(rule, value, callback) {
							let form = JSON.parse(JSON.stringify(that.form))
							let list = [{
								field: "name",
								type: 3,
								level: 1
							}, {
								field: "type_id",
								type: 3,
								level: 2
							}];
							form.name = value
							let sData = sql_helper.splicing_fob(1, 3, list, form)
							AjaxHelper.QueryExec_fob(sData.sql, function(res) {
								if (res.hasOwnProperty('data') && res.data.length > 0) {
									callback(new Error('已存在该权限类型名称'));
								} else {
									callback();
								}
							}, function() {
								callback(new Error('查询数据库异常）'));
							})
						}
					}], //pattern
					desc: [{
						required: false,
						trigger: 'blur',
						message: '请输入权限描述'
					}],
				},
				title: '',
				dialogFormVisible: false,
			}
		},
		created() {},
		methods: {
			showEdit(row) {
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					this.form = Object.assign({}, row)
				}
				this.dialogFormVisible = true
			},
			close() {
				//this.$refs['form'].resetFields()
				//this.form = this.$options.data().form
				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},
			save() {
				let that = this
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						//console.log(that.form);
						let data = JSON.parse(JSON.stringify(that.form));
						let list = [{
								field: "name",
								level: 1
							},
							{
								field: "desc",
								level: 2
							}
						]
						let fob = '';
						let sqlcode = -1;
						let msg = ''
						if (data.type_id) { //更新
							sqlcode = 4
							fob = that.FormHelper.update_fob;
							msg = '更新'
							list.push({
								field: "type_id",
								level: 3
							})
						} else { //添加
							msg = '添加'
							sqlcode = 5
							
							fob = that.FormHelper.insert_fob;
						}
						fob(list, that.form, sqlcode, function(code) {

							if (code > 0) {
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
						})
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
