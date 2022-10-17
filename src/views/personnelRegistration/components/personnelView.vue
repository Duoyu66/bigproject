<template>
	<!-- -people-details- -->
	<el-dialog width="500px" title="人员详情" :visible.sync="dialogFormVisibledetails1">
		<el-form :model="details"  :label-width="formLabelWidth" style="margin-right:15px;">
			<el-form-item label="姓名">
				<el-input v-model="details.name" placeholder="请输入姓名" style="width:350px;" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="性别" style="margin-top:10px">
				<el-select v-model="details.number1" style="width: 350px;" :disabled="true">
					<el-option label="男" value="single"></el-option>
					<el-option label="女" value="single"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="出生日期" style="margin-top:10px">
				<el-date-picker style="width:350px" v-model="details.date1" type="date" placeholder="选择日期" :disabled="true"></el-date-picker>
			</el-form-item>
			<el-form-item label="最后专业">
				<el-input v-model="details.number2" placeholder="请输入" style="width:350px;" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="最后毕业学校">
				<el-input v-model="details.number3" placeholder="请输入" style="width:350px;" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="最后毕业日期" style="margin-top:10px">
				<el-date-picker style="width:350px" v-model="details.date2" type="date" placeholder="选择日期" :disabled="true"></el-date-picker>
			</el-form-item>
			<el-form-item label="职称">
				<el-input v-model="details.number4" placeholder="请输入" style="width:350px;" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="入职日期" style="margin-top:10px">
				<el-date-picker style="width:350px" v-model="details.date3" type="date" placeholder="选择日期" :disabled="true"></el-date-picker>
			</el-form-item>
			<el-form-item label="手机">
				<el-input v-model="details.number5" placeholder="请输入" style="width:350px;" :disabled="true"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="dialogFormVisibledetails1 = false" style="width:100px;margin-left:100px">确 定</el-button>
			<el-button @click="dialogFormVisibledetails1 = false" style="width:100px;margin-left:100px">取 消</el-button>
		</div>
	</el-dialog>

</template>

<script>
	export default {
		name: 'personnelView',
		data() {
			return {
				formLabelWidth: '120px',

				details: {
					name: '贺君天',
					number1: '男',
					number2: '软件工程',
					number3: '张北职业技术学院',
					number4: '实施工程师',
					number5: '17855555555',
					date1: '1998-05-06',
					date2: '2020-10-10',
					date3: '2020-11-11'
				},
				rules: {
					title: [{
						required: true,
						trigger: 'blur',
						message: '请输入标题'
					}],
					author: [{
						required: true,
						trigger: 'blur',
						message: '请输入作者'
					}],
				},
				title: '',
				dialogFormVisibledetails1: false,
			}
		},
		created() {},
		methods: {
			showEdit(row) {
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					this.details = Object.assign({}, row)
				}
				this.dialogFormVisibledetails1 = true
			},
			close() {
				this.$refs['form'].resetFields()
				this.details = this.$options.data().details
				this.dialogFormVisibledetails1 = false
				this.$emit('fetch-data')
			},
			save() {
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						const {
							msg
						} = await doEdit(this.form)
						this.$baseMessage(msg, 'success')
						this.$refs['form'].resetFields()
						this.dialogFormVisible = false
						this.$emit('fetch-data')
						this.form = this.$options.data().form
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
