<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="80%" @close="close" top="5vh" append-to-body>
		<div style="max-height: calc(70vh); overflow-y: auto">
			<docPostReplyManual ref="docPostReplyManual" :formData.sync="form" :type="4"></docPostReplyManual>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import docPostReplyManual from '../form/docPostReplyManual'
	export default {
		name: 'docPostReplyManualDialog',
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
			docPostReplyManual
		},
		data() {
			let that = this
			return {
				form: {

				},
				title: '',
				dialogFormVisible: false,
				formLabelWidth: '120px',
				searchData: undefined,
				primary_key: -1,
				permission: {

					person_role: false,
					// person_role: {
					// 	person_role_manage: false,
					// },
					self: false,
				},
			}

		},
		created() {},
		methods: {
			showEdit(row, otrher_info) {
				let form = {}
				this.form = {}
				if (!row) {
					this.title = '登记'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
				}
				if (otrher_info) {
					form = Object.assign(form, otrher_info)
				}
				this.form = Object.assign(this.form, form)
				this.title = '手动绑定收文记录'
				this.dialogFormVisible = true
			},
			close(status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}
				//this.$refs['dispatchRegisterForm'].close()
				this.dialogFormVisible = false
			},
			save() {
				let that = this
				this.$refs['dispatchRegisterForm'].save(async (valid) => {
					if (valid) {
						that.close(true)
					}
				})
			},
		},


	}
</script>
