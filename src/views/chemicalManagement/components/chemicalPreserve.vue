<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible">
		<el-form ref="yfdc" :model="form" :rules="rules">
			<el-form-item prop="name" label="化学品名称" :label-width="formLabelWidth">
				<el-input v-model="form.name" autocomplete="off" maxlength="32" style="width: 250px"></el-input>
			</el-form-item>
			<el-form-item label="化学品规格" prop="model" :label-width="formLabelWidth">
				<el-input v-model="form.model" autocomplete="off" maxlength="32" style="width: 250px"></el-input>
			</el-form-item>
			<el-form-item label="计量单位" prop="unit" :label-width="formLabelWidth">
				<el-select v-model="form.unit" filterable allow-create style="width: 250px">
					<el-option label="g" value="g"></el-option>
					<el-option label="kg" value="kg"></el-option>
					<el-option label="ml" value="ml"></el-option>
					<el-option label="L" value="L"></el-option>
					<el-option label="mg" value="mg"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="危险品" :label-width="formLabelWidth">
				<el-checkbox v-model="form._danger" @change="change_dan(form._danger)">
					这个是危险品
				</el-checkbox>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save_or_update">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	let globe = {}
	globe.obj = false
	import {
		update_fob,
		insert_fob
	} from '@/global/form.helper'
	export default {
		name: 'TableEdit',
		watch: {
			_danger(newVal, oldVal) {

			},
			'form.danger'(newVal, oldVal) {
				let flag = false

				if (newVal == '1') {
					flag = true
				}

				if (this.form._danger == flag) {
					return
				}
				this.$set(this.form, '_danger', flag)
				//this.form._danger = flag
			}
		},
		data() {
			return {
				dialogFormVisible: false,
				form: {
					name: '',
					model: '',
					unit: '',
					danger: '',
					_danger: '0',
				},
				formLabelWidth: '120px',
				title: '',
				isInAddMode: false,
				rules: {
					name: {
						required: true,
						message: '请输入化学品名称',
						trigger: 'blur',
					},
					chemical_id: {
						required: true,
						message: '请输入化学品id',
						trigger: 'blur',
					},
					model: {
						required: true,
						message: '请输入化学品规格',
						trigger: 'blur',
					},
					unit: {
						required: true,
						message: '请输入化学品单位',
						trigger: 'blur',
					},
				},
			}
		},
		created() {},
		methods: {
			add() {},
			change_dan(e) {
				this.form.danger = String(Number(e))
			},
			save_or_update() {
				let abc = 'success'
				this.$refs['yfdc'].validate(async (valid) => {
					if (!valid) {
						return
					}
					let list = [{
							field: 'name',
							type: 2,
							level: 2
						},
						{
							field: 'model',
							type: 2,
							level: 3
						},
						{
							field: 'unit',
							type: 2,
							level: 4
						},
						{
							field: 'danger',
							type: 2,
							level: 5
						},
					]
					let _field = {
						chemical_id: this.form.chemical_id,
						name: this.form.name,
						model: this.form.model,
						unit: this.form.unit,
						danger: this.form.danger,
					}
					let res = undefined
					if (!this.isInAddMode && this.form.chemical_id) {
						//update
						list.unshift({
							field: 'chemical_id',
							type: 2,
							level: 1
						})
						res = await update_fob(list, _field, 59)
					} else {

						res = await insert_fob(list, _field, 60)
					}
					if (res.code == 200 && res.influence > 0) {
						this.$message({
							message: '操作成功',
							type: 'success'
						})
						this.dialogFormVisible = false
						this.$emit('reloadChildren');
						this.$emit('reload');
					} else {
						this.$message({
							message: '操作失败',
							type: 'erroe'
						})
					}

				})
			},
			showEdit(row) {
				this.form = {
					danger: '0'
				}
				if (row === false) {
					this.isInAddMode = true
					this.title = '添加化学品'
					this.add()
				} else {
					this.isInAddMode = false
					this.title = '编辑/更新化学品'
					this.form = Object.assign({}, this.form, row)
				}
				if (this.form.danger == '1') {
					this.$set(this.form, '_danger', true)
				} else {
					this.$set(this.form, '_danger', false)
				}
				this.dialogFormVisible = true
			},
			close(event) {
				this.$refs['yfdc'].resetFields()
				this.dialogFormVisible = false
			}
		},
	}
</script>
