<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="50%" @close="close" :center="true" top="10vh">
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<trainForm ref="trainForm" :formData.sync="form" :type="0"></trainForm>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
			
		</div>
	</el-dialog>
</template>

<script>
	import trainForm from '../form/trainForm'
	export default {
		name: 'personnelTrain',
		components: {
			trainForm,
		},
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
		data() {
			let that = this
			return {
				loading: false,
				loadingText: '上传文件中',

				form: {},
				title: '',
				dialogFormVisible: false,
			}

		},

		created() {},
		methods: {
			showEdit(row, person_info) {
				let form = {}
				this.form = {}
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
				}
				if (person_info) {
					form = Object.assign(form, person_info)
				}
				this.form = Object.assign(this.form, form)
				this.title += '培训经历'
				this.dialogFormVisible = true
			},
			close(status) {
				let that = this
				if (status) {
					that.$emit('update:isUpData', !that.isUpData);
					that.$emit('on-change', !that.isUpData);
				}
				that.$refs["trainForm"].close()
				that.dialogFormVisible = false
				//that.$emit('fetch-data')
			},
			save() {
				let that = this
				that.$refs['trainForm'].save(function(status) {
					if (status) {
						that.close(true)
					}
				})
			},
		},


	}
</script>
