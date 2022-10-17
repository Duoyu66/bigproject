<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="650px" @close="close" top="2vh" center
		:destroy-on-close="false">
		<div style="max-height: calc(100vh - 210px); overflow-y: auto">
			<branchInstitutionsForm ref="branchInstitutionsForm" :formData.sync="form" :table_type="option.table_type"
				:type="type" :outOrgStatus="option.outOrgStatus">
			</branchInstitutionsForm>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import branchInstitutionsForm from '../form/branchInstitutionsForm'
	export default {
		name: 'branchInstitutionsDialog',
		inject: ['reload'],
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
			type: {
				type: Number,
				default: 0 //0 正常表单 1 详情表单
			},
		},
		watch: {

		},
		components: {
			branchInstitutionsForm
		},
		data() {
			let that = this
			return {
				form: {

				},
				info: {

				},
				option: {
					table_type: "0",
					outOrgStatus: false,
				},
				title: '',
				dialogFormVisible: false,
				formLabelWidth: '120px',
			}

		},
		created() {},
		methods: {
			showEdit(row, formInfo, option) {
				let form = {}
				this.form = {}
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
				}
				if (formInfo) {
					form = Object.assign(form, formInfo)
				}
				if (option) {
					this.option = Object.assign(this.option, option)
				}
				this.form = Object.assign(this.form, form)
				this.info = Object.assign(this.info, this.form)
				this.title += '分支机构'
				this.dialogFormVisible = true
			},
			async close(event, status) {
				if (status) {
					await this.reload_table()
					//this.$emit('update:isUpData', !this.isUpData);
					//this.$emit('on-change', !this.isUpData);
				}
				this.$refs['branchInstitutionsForm'].close()
				this.dialogFormVisible = false
			},
			async reload_table() {
				console.log('reload_table',{
					org_id: this.form.parent_id,
					double_parent_id: this.form.double_parent_id,
					info: this.info,
					type: '重载'
				})
				this.reload({
						org_id: this.form.parent_id,
						double_parent_id: this.form.double_parent_id,
						info: this.info,
						type: '重载'
					},
					undefined,
					undefined
				)
				await this.$store.dispatch('org/GetOrgFromDataBase')
			},
			save() {
				let that = this
				this.$refs['branchInstitutionsForm'].save(async (valid) => {
					if (valid) {
						await that.close(undefined, true)
					}
				})
			},
		},


	}
</script>
