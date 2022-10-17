<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="80%" @close="close" top="5vh" append-to-body>
		<div style="max-height: calc(100vh - 250px); overflow-y: auto">
			<dispatchRegisterForm ref="dispatchRegisterForm" :formData.sync="form" :type="1"></dispatchRegisterForm>
		</div>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		docRegisterProcess,
		upLoadDocReceiptHistory
	} from '../js/common'
	import dispatchRegisterForm from '../form/dispatchRegisterForm'
	export default {
		name: 'dispatchRegisterExamineDialog',
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
			dispatchRegisterForm
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
				username: 'user/username'
			}),
		},
		data() {
			let that = this
			return {
				form: {

				},
				title: '',
				dialogFormVisible: false,
				formLabelWidth: '120px',
			}

		},
		created() {},
		methods: {
			showEdit(row, person_info) {
				let form = {}
				this.form = {}
				if (!row) {
					this.title = '查看'
				} else {
					this.title = '查看'
					form = Object.assign(form, row)
				}
				if (person_info) {
					form = Object.assign(form, person_info)
				}
				this.form = Object.assign(this.form, form)
				this.title += '收文记录'
				this.dialogFormVisible = true
				let historyForm = {
					receive_id: this.form.receive_id,
					action: '查看-' + this.form.doc_id,
					person_name: this.username
				}
				upLoadDocReceiptHistory(this, historyForm)
			},
			close(status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);
				}
				this.$refs['dispatchRegisterForm'].close()
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
