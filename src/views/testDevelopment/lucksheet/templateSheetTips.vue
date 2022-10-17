<template>
	<el-dialog :title="title" :visible.sync="dialogVisible" width="50%" append-to-body>
		<el-form :model="form">
			<el-form-item label="" label-width="0px">
				<el-checkbox v-model="form.checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选
				</el-checkbox>
				<div style="margin: 15px 0;"></div>
				<el-checkbox-group v-model="form.sheet_id" @change="handleCheckedCitiesChange">
					<el-checkbox v-for="sheet in check.sheet_id" :label="sheet.order" :key="sheet.order">
						{{sheet.name}}
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="save">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	export default {
		name: 'templateSheetTips',
		components: {

		},
		model: {
			prop: 'formData',
			event: 'on-change'
		},
		props: {
			//.sync同步
			formData: {
				type: Object,
				default: function() {
					return {}
				}
			},
			type: {
				type: Number,
				default: 0 //0 正常表单 1 详情表单 3 审核 4 发文添加用印申请
			},
			sheet_info: {
				type: Array,
				default: function() {
					return []
				}
			},
			save_callback: {
				type: Function,
				default: function() {

				}
			}
		},
		computed: {

		},
		mounted() {

		},
		watch: {
			formData(newVal, oldVal) {
				if (newVal) {
					// if (newVal.doc_name && typeof newVal.doc_name == 'string') {
					// 	newVal.doc_name = [newVal.doc_name]
					// }
					//console.log('formData', newVal)
					//this.upload = JSON.parse(JSON.stringify(this.uploadDeault))
					//this.form = Object.assign(this.form, newVal)
					//this.file_default()
					this.init()
				}
			},

		},
		data() {
			let that = this
			return {
				dialogVisible: false,
				title: '提示',
				width: '30%',
				isIndeterminate: true,
				check: {
					sheet_id: []
				},
				form: {
					checkAll: true,
					sheet_id: []
				}
			}

		},
		created() {
			this.init()
		},
		methods: {
			async init() {
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
					console.log('init form Object.assign', this.form)
				}
				if (this.sheet_info) {
					this.check.sheet_id = JSON.parse(JSON.stringify(this.sheet_info))
				}
			},
			show(sheet_info) {
				if (sheet_info) {
					this.check.sheet_id = JSON.parse(JSON.stringify(sheet_info))
				}
				this.handleCheckAllChange(true)
				this.dialogVisible = true
			},
			handleCheckAllChange(val) {
				let select_sheet = []
				if (val) {
					let sheet_id = 0
					let sheet_list = this.check.sheet_id
					let length = sheet_list.length

					for (let i = 0; i < length; i++) {
						select_sheet.push(sheet_list[i].order)
					}
				}
				this.form.sheet_id = select_sheet
				this.isIndeterminate = false;
			},
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.form.checkAll = checkedCount === this.check.sheet_id.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.check.sheet_id
					.length;
			},
			close() {

			},
			save() {
				this.save_callback(true, form.sheet_id)
				this.dialogVisible = false
			}
		},
	}
</script>

<style>
	.vue-treeselect--append-to-body {
		z-index: 999999 !important;
	}
</style>
