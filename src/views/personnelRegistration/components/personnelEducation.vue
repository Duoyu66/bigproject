<template>
	<!-- 教育经历 -->
	<el-dialog width="500px" :title="title" :visible.sync="dialogFormVisible1">
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<educationalForm ref="educationalForm" :formData.sync="form" :type="0"></educationalForm>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save" style="width: 100px; margin-left: 100px">
				确 定
			</el-button>
			<el-button @click="close" style="width: 100px; margin-left: 100px">
				取 消
			</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import educationalForm from '../form/educationalExperienceForm'
	export default {
		name: 'personnelEducation',
		components: {
			educationalForm,
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
				form: {},
				title: '添加教育经历',
				dialogFormVisible1: false,
			}
		},
		created() {

		},
		methods: {
			showEdit(row, person_id) {
				let form = {}
				this.form = {}
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
				}
				if (person_id) {
					form = Object.assign(form, {
						person_id: person_id
					})
				}
				this.form = Object.assign(this.form, form)
				this.title += '教育经历'
				this.dialogFormVisible1 = true
			},
			close() {
				let that = this
				that.$refs['educationalForm'].resetForm()
				that.dialogFormVisible1 = false
				//that.$emit('fetch-data')
			},

			save() {
				let that = this
				that.$refs['educationalForm'].save(function(status) {
					if (status) {
						that.$emit('update:isUpData', !that.isUpData);
						that.$emit('on-change', !that.isUpData);
						that.close()
					}
				})

			},
		},
	}
</script>

<style>
</style>
