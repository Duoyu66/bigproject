<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="60%" @close="close" top="8vh">

		<div style="max-height: calc(100vh - 200px); overflow-y: auto">
			<divisionEditForm ref="divisionEditForm" :formData.sync="form"></divisionEditForm>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>

</template>

<script>
	import grantForm from '../form/grantForm'
	import divisionEditForm from '../form/DivisionEdit'
	export default {
		name: 'DivisionEdit',
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
			grantForm,
			divisionEditForm
		},
		data() {
			return {
				form: {

				},
				title: '',
				dialogFormVisible: false,
			}
		},
		created() {},
		methods: {
			showEdit(row, personel_info) {
				let form = {}
				this.form = {}
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
				}
				if (personel_info) {
					form = Object.assign(form, personel_info)
				}
				this.form = Object.assign(form, row)
				this.title += '分工记录'
				this.dialogFormVisible = true
			},
			close(stauts) {
				if (stauts) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}
				this.$refs['divisionEditForm'].close()
				this.dialogFormVisible = false
			},
			save() {
				let that = this
				that.$refs['divisionEditForm'].save(function(stauts) {
					if (stauts) {
						that.close(true)
					}
				})

			}
		},
	}
</script>

<style>
</style>
