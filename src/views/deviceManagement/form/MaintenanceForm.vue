<template>
	<span class="purchasefrom">
		<el-form :model="form" :rules="rules" ref="form" v-loading="selectloading">
			<el-form-item label="管理编号" prop="manage_pid" :label-width="formLabelWidth">
				<el-select v-model="form.manage_pid" filterable placeholder="请输入或选择" v-if="displaymanage"
					@change="setoption" style="width: 100%;">
					<el-option v-for="item in manage_pid_array" :key="item.device_id" :label="item.manage_pid"
						:value="item.alldata">
					</el-option>
				</el-select>
				<el-input v-model="form.manage_pid" style="width: 100%;" disabled v-else></el-input>
			</el-form-item>
			<el-form-item label="设备名称" :label-width="formLabelWidth">
				<el-input v-model="form.device_name" style="width: 100%;" disabled></el-input>
			</el-form-item>
			<el-form-item label="规格型号" :label-width="formLabelWidth">
				<el-input v-model="form.model" style="width: 100%;" disabled></el-input>
			</el-form-item>
			<el-form-item label="测量范围" :label-width="formLabelWidth">
				<el-input v-model="form.scope" style="width: 100%;" disabled></el-input>
			</el-form-item>
			<el-form-item label="精度" :label-width="formLabelWidth">
				<el-input v-model="form.precision" style="width: 100%;" disabled></el-input>
			</el-form-item>
			<el-form-item label="维护日期" prop="maintain_date" :label-width="formLabelWidth">
				<el-date-picker v-model="form.maintain_date" style="width: 100%;" type="date" placeholder="选择日期"
					format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="维护措施" prop="maintain_content" maxlength="50" :label-width="formLabelWidth">
				<el-input v-model="form.maintain_content" style="width: 100%;"></el-input>
			</el-form-item>
			<el-form-item label="维护效果" prop="result" :label-width="formLabelWidth">
				<el-select v-model="form.result" style="width: 100%;">
					<el-option label="状态良好" value="状态良好"></el-option>
					<el-option label="状态异常" value="状态异常"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="维护人" prop="charge_person" maxlength="8" :label-width="formLabelWidth">
				<el-input v-model="form.charge_person" style="width: 100%;"></el-input>
			</el-form-item>
			<el-form-item label="备注" maxlength="50" :label-width="formLabelWidth">
				<el-input v-model="form.remark" style="width: 100%;"></el-input>
			</el-form-item>
		</el-form>
	</span>


</template>
<script>
	import {
		doEdit,
		ExecSql,
		QueryExec
	} from '@/api/table'
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	export default {
		name: 'TableEdit',
		props: { //props列表
			father: {
				type: Object,
				required: false
			}
		},
		computed: {
			...mapGetters({
				current_org: 'org/current_org',
			}),
		},
		data() {
			return {
				form: {
					manage_pid: '',
					manage_pid1: '',
					device_name: '',
					device_id: '',
					model: '',
					scope: '',
					precision: '',
					maintain_date: '',
					maintain_content: '',
					result: '',
					charge_person: '',
					remark: '',
					id: ''
				},
				manage_pid_array: [],
				rules: {
					manage_pid: [{
						required: true,
						trigger: 'change',
						message: '请选择管理编号'
					}],
					maintain_date: [{
						required: true,
						trigger: 'change',
						message: '请选择日期'
					}],
					maintain_content: [{
						required: true,
						trigger: 'blur',
						message: '请输入维护内容'
					}],
					result: [{
						required: true,
						trigger: 'change',
						message: '请选择维护结果'
					}],
					charge_person: [{
						required: true,
						trigger: 'blur',
						message: '请输入维护人'
					}],
				},
				selectloading: [],
				formLabelWidth: '100px',
				title: '',
				displaymanage: true
			}
		},
		created() {
			this.fetchData()
		},

		methods: {
			setoption(item) {
				console.log(item)
				this.form.device_name = item.split('^')[0];
				this.form.model = item.split('^')[1];
				this.form.scope = item.split('^')[2];
				this.form.precision = item.split('^')[3];
				this.form.device_id = item.split('^')[4];
			},
			async fetchData() {
				this.selectloading = true
				let sData = '[Q]162{' + this.current_org + '}|^SYS'
				const res = await QueryExec(sData)
				if (res.data.length !== 0) {
					res.data.forEach((item, index) => {
						item.alldata = item.device_name + '^' + item.model + '^' + item.scope + '^' + item
							.precision + '^' + item.device_id;
					})
				}
				console.log(res)
				this.manage_pid_array = res.data
				console.log(this.manage_pid_array)
				setTimeout(() => {
					this.selectloading = false
				}, 500)
			},
			// close() {
			//   this.$refs['form'].resetFields()
			// },
			displayadd(item) {
				this.selectloading = true
				this.displaymanage = false
				console.log(item)
				this.form.device_name = item.device_name;
				this.form.model = item.model;
				this.form.scope = item.scope;
				this.form.scope = item.scope;
				this.form.precision = item.precision;
				this.form.device_id = item.device_id;
				this.form.manage_pid = item.manage_pid;
				setTimeout(() => {
					this.selectloading = false
				}, 500)
			},
			display(item) {
				this.selectloading = true
				this.displaymanage = false
				this.form.device_name = item.device_name;
				this.form.model = item.model;
				this.form.scope = item.scope;
				this.form.precision = item.precision;
				this.form.device_id = item.device_id;
				this.form.maintain_date = item.maintain_date.toString();
				this.form.maintain_content = item.maintain_content;
				this.form.result = item.result;
				this.form.charge_person = item.charge_person;
				this.form.remark = item.remark;
				this.form.manage_pid = item.manage_pid;
				this.form.id = item.id;
				setTimeout(() => {
					this.selectloading = false
				}, 500)
			},
			save() {
				let that = this;
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						let sData = '[Q]164{' + that.current_org + '$`' + that.form.device_id + '$`' + that
							.form.maintain_date + '$`' + that.form.maintain_content + '$`' +
							that.form.result + '$`' + that.form.charge_person + '$`' + that.form.remark +
							'}|^2|^SYS'
						const res = await ExecSql(sData)
						if (res > 0) {
							that.$baseMessage('维护保养添加成功', 'success');
							that.$refs.form.resetFields();
							this.$emit('close_comp');
							this.$emit('transferTable');
						} else {
							that.$baseMessage('维护保养添加失败', 'error')
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			editsave() {
				let that = this;

				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						let sData = '[Q]166{' + that.form.maintain_date + '$`' + that.form.maintain_content +
							'$`' +
							that.form.result + '$`' + that.form.charge_person + '$`' + that.form.remark +
							'$`' + that.form.id + '}|^1|^SYS'
						console.log(sData)
						const res = await ExecSql(sData)
						if (res > 0) {
							that.$baseMessage('维护保养修改成功', 'success')
							that.$refs['form'].resetFields()
							this.$emit('close_comp')
						} else {
							that.$baseMessage('维护保养修改失败', 'error')
						}
					} else {
						return false;
					}
				})
			}
		},
	}
</script>
