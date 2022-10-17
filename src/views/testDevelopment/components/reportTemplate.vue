<template>
	<el-dialog :title='title' :visible.sync="dialogFormVisible" width="90%" top="3vh">
		<div style="max-height: calc(100vh - 100px); overflow-y: auto;width:100%">
			<TemplateForm ref="TemplateForm" @close_comp="close_comp" :father="Dictonary" @addDictionary="addDictionary"></TemplateForm>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="editsave()">
				确 定
			</el-button>
			<el-button @click="close_comp">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		doEdit
	} from '@/api/table'
	import TemplateForm from '../form/TemplateForm.vue'
	export default {
		name: 'TableEdit',
		components: {
			TemplateForm,
		},

		data() {
			return {
				dialogFormVisible: false,
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: '',
					symbol: ''
				},
        Dictonary: {},
				title: '',
				formLabelWidth: '120px',
			}
		},
		created() {},
		methods: {
			showEdit(row, symbol) {
				if (!row) {
					this.title = '添加主字典'
				} else if (symbol === '0') {
					this.title = '添加报告模板文件'
					this.Dictonary = Object.assign({}, row)
					console.log(this.Dictonary)
					this.symbol = symbol
					setTimeout(() => {
						this.$refs['TemplateForm'].displayaddreport(this.Dictonary)
					}, 10)
				} else if (symbol === '1') {
					this.title = '修改报告模板文件'
					this.Dictonary = Object.assign({}, row)
          this.symbol = symbol
					console.log(this.Dictonary)
					setTimeout(() => {
						this.$refs['TemplateForm'].displayreport(this.Dictonary)
					}, 10)
				} else if (symbol === '2') {
					this.title = '映射存在模板'
					this.Dictonary = Object.assign({}, row)
          this.symbol = symbol
					console.log(this.Dictonary)
					setTimeout(() => {
						this.$refs['TemplateForm'].displayreportold(this.Dictonary)
					}, 10)
				}
				this.dialogFormVisible = true
			},
			editsave() {
				if (this.symbol === '0') {
					this.$refs['TemplateForm'].save()
				} else if (this.symbol === '1'){
					this.$refs['TemplateForm'].editsave()
				}
        else {
          this.$refs['TemplateForm'].save()
        }
			},
			close_comp() {
				this.$emit('fetchData', this.Contact)
				this.dialogFormVisible = false
			},
      addDictionary(template_id) {
        console.log(template_id)
      	this.$emit('addDictionary',template_id)
      	this.dialogFormVisible = false
      }
		},
	}
</script>

<style>
</style>
