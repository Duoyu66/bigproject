<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="700px" @close="close" top="5vh">
		<div style="max-height: calc(100vh - 250px); overflow-y: auto">
			<testObjectStandardForm ref="testObjectStandardForm" :formData.sync="form" :type="formType">
			</testObjectStandardForm>
		</div>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import testObjectStandardForm from '../form/testObjectStandardForm'
	export default {
		name: 'testObjectStandardDialog',
		model: {
			prop: 'isUpData',
			event: 'on-change'
		},
		props: {
			//.sync同步
			isUpData: {
				type: Boolean,
				default: false
				//required: true,
			},
		},
		components: {
			testObjectStandardForm
		},
		data() {
			let that = this
			return {
				formType: 0,
				form: {

				},
				title: '',
				dialogFormVisible: false,
				formLabelWidth: '120px',
			}

		},
		created() {},
		methods: {
			showEdit(row, info, info1) {
				let form = {}
				this.form = {}
				if (!row && !info1) {
					this.title = '添加试验判定标准'
					this.formType = 0;
				}
        else if (!row && info1==='1') {
					this.title = '添加试验依据'
					this.formType = 20;
				}
        else {
					this.title = '编辑试验判定标准'
					this.formType = 10;
					form = Object.assign(form, row)
				}
				if (info) {
					form = Object.assign(form, info)
				}
				this.form = Object.assign(this.form, form)
				this.dialogFormVisible = true
			},
			close(event, status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
					this.$emit('reloadChildren');
				}
				this.$refs['testObjectStandardForm'].close()
				this.dialogFormVisible = false
			},
			save() {
				let that = this
				this.$refs['testObjectStandardForm'].save(async (valid) => {
					console.log('save valid', valid)
					if (valid) {
						that.close(undefined, true)
					}
				})
			},
		},


	}
</script>
