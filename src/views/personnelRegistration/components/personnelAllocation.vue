<template>
	<el-dialog width="500px" :title="title" :visible.sync="dialogFormVisible" :before-close="destroy">
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<AllocationForm ref="AllocationForm" :formData.sync="form" :type="0"></AllocationForm>
		</div>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<el-button type="primary" @click="save">确 定
			</el-button>
			<el-button @click="close ">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import AllocationForm from '../form/AllocationForm'
	export default {
		name: 'personnelAllocation',
		components: {
			AllocationForm
		},
		data() {
			return {
				title: '',
				dialogFormVisible: false,
				form: {

				},
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
				this.form = Object.assign(this.form, form)
				this.title += '调动记录'
				this.dialogFormVisible = true
			},
			close(status) {
				let that = this
				that.$refs['AllocationForm'].close()
				if (status) {
					that.$emit('update:isUpData', !that.isUpData);
					that.$emit('on-change', !that.isUpData);
				}
				that.dialogFormVisible = false
			},
			destroy(done) {
				let that = this
				that.$refs['AllocationForm'].close()
				done(true)
			},
			save() {
				let that = this
				that.$refs['AllocationForm'].save(function(status) {
					if(status){
						that.close(true)
					}
				})
			}
		},
	}
</script>
