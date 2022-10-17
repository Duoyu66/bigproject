<template>
	<el-dialog title="添加权限类型" :visible.sync="dialogFormVisible">
		<el-form :model="form" ref="form">
			<el-form-item label="权限名称" :label-width="formLabelWidth">
				<el-input v-model="form.number" style="width: 250px"></el-input>
			</el-form-item>
			<el-form-item label="权限描述" :label-width="formLabelWidth">
				<el-input v-model="form.number1" style="width: 250px" type="textarea"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="dialogFormVisible = false">
				确 定
			</el-button>
			<el-button @click="dialogFormVisible = false">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		doEdit
	} from '@/api/table'
	export default {
		name: 'TableEdit',
		data() {
			return {
				dialogFormVisible: false,
				form: {
					name: '',
					region: 'g',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: '',
				},
				formLabelWidth: '120px',
			}
		},
		created() {},
		methods: {
			showEdit(row) {
				this.dialogFormVisible = true
				if (!row) {
					this.title = '添加'
					this.$refs['form'].resetFields()
				} else {
					this.title = '编辑'
					this.form = Object.assign({}, row)
				}
			},
		},
	}
</script>
