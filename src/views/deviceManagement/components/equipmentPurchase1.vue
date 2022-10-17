<template>
	<el-dialog title="添加购入记录" :visible.sync="dialogFormVisible">
		<PurchaseFrom :father='form' ref="PurchaseFrom"></PurchaseFrom>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
			<el-button @click="dialogFormVisible = false">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		doEdit
	} from '@/api/table'
	import PurchaseFrom from '../form/equipmentPurchaseFrom.vue'
	export default {
		name: 'TableEdit1',
		components: {
			PurchaseFrom,
		},
		data() {
			return {
				dialogFormVisible: false,
				form: {
					name: 'xst',
					norms: 'rygz',
					name1: 'a',
					name2: 'a',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: ''
				},
				formLabelWidth: '120px',
				title: '',
				dialogFormVisible: false,
			}
		},
		created() {},
		methods: {
			showEdit1(row) {
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					this.form = Object.assign({}, row)
					if (this.$refs['PurchaseFrom']) {
						this.$refs['PurchaseFrom'].form = Object.assign({}, row)
					}
				}
				this.dialogFormVisible = true
			},
		},
	}
</script>
