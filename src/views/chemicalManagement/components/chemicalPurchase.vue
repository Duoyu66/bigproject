<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" top="3vh">
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<PurchaseForm ref="PurchaseForm" :formData="form"></PurchaseForm>
		</div>
		<div slot="footer" class="dialog-footer">
			<!-- <div style="width: 100%">{{ ghost }}</div> -->
			<el-button type="primary" @click="handleUpdate">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import zcm_date from '@/api/date'
	import {
		update_fob
	} from '@/global/form.helper'
	import {
		doEdit
	} from '@/api/table'
	import PurchaseForm from '../form/PurchaseForm.vue'

	export default {
		name: 'ChemicalBuyEdit',
		components: {
			PurchaseForm,
		},
		data() {
			return {
				ghost: {
					inEditMode: true,
				},
				dialogFormVisible: false,
				form: {},
				formLabelWidth: '120px',
				title: '',
			}
		},
		created() {},
		methods: {
			showEdit(row, info) {
				let form = {}
				this.form = {}
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
				}
				if (info) {
					form = Object.assign(form, info)
				}
				this.form = Object.assign(this.form, form)
				console.log('showEdit', this.form)
				this.title += '购入记录'
				this.dialogFormVisible = true
			},
			update_ghost(a) {
				this.ghost = a
				return 'success'
			},
			close(event, stauts) {
				if (stauts) {
					this.$emit('reloadChildren');
					this.$emit('reload');
				}
				this.dialogFormVisible = false
			},
			handleUpdate() {
				let that = this
				this.$refs['PurchaseForm'].save(function(status) {
					console.log('handleCllickOk', status)
					if (status) {
						that.close(undefined, true)
					}
				})
			},
		},
	}
</script>
