<template>
	<el-dialog :title='title' :visible.sync="dialogFormVisible" :width="width" top="3vh">
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
		watch: {
			dialogFormVisible(newVal, oldVal) {
				if (!this.$refs['TemplateForm']) {
					return
				}
				if (newVal) {
					this.$refs['TemplateForm'].init()
				} else {
					this.$refs['TemplateForm'].closeChange()
				}
			}
		},
		mounted() {
			const that = this
			window.onresize = function() {
				that.resizeLuckSheet()
			}
		},
		computed: {
			width() {
				let width = this.screenWidth
				width = document.body.clientWidth;
				let result = '90%'
				if (width > 1440) {
					result = '1160px'
				} else if (width > 1024) {
					result = '80%'
				} else {
					result = '90%'
				}
				return result
			}
		},
		data() {
			return {
				screenWidth: document.body.clientWidth,
				timer: false,
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
			resizeLuckSheet() {
				if (this.timer) {
					return
				}
				let that = this

				this.timer = true
				setTimeout(() => {
					that.screenWidth = document.body.clientWidth
					that.timer = false
				}, 400)
			},
			showEdit(row, symbol) {

				if (!row) {
					this.title = '添加主字典'
				} else if (symbol === '0') {
					this.title = '添加参数模板文件'
					this.Dictonary = Object.assign({}, row)
					console.log('showEdit add', this.Dictonary)
					setTimeout(() => {
						this.$refs['TemplateForm'].displayadd(this.Dictonary)
					}, 10)
				} else if (symbol === '1') {
					this.title = '修改参数模板文件'
					this.Dictonary = Object.assign({}, row)
					console.log('showEdit edit', this.Dictonary)
					setTimeout(() => {
						this.$refs['TemplateForm'].display(this.Dictonary)
					}, 10)
				} else if (symbol === '2') {
					this.title = '映射存在模板'
					this.Dictonary = Object.assign({}, row)
					console.log(this.Dictonary)
					setTimeout(() => {
						this.$refs['TemplateForm'].displayold(this.Dictonary)
					}, 10)
				}
				this.symbol = symbol
				this.dialogFormVisible = true
			},
			editsave() {
				if (this.symbol === '0') {
					this.$refs['TemplateForm'].save()
				} else if (this.symbol === '1') {
					this.$refs['TemplateForm'].editsave()
        } else if (this.symbol === '2') {
        	this.$refs['TemplateForm'].save()
				} else {
					this.$refs['TemplateForm'].save()
				}
			},
			close_comp() {
				this.$emit('fetchDataChildFile')
				this.dialogFormVisible = false
			},
      addDictionary(template_id) {
      	this.$emit('addDictionary',template_id)
      	this.dialogFormVisible = false
      }
		},
	}
</script>

<style>
</style>
