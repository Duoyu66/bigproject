<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="99%" center top="5vh">
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<personnelFrom ref="personnelFrom" :formData.sync="form"></personnelFrom>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import personnelFrom from '../form/personnelFrom'
	export default {
		name: 'TableEdit',
		components: {
			personnelFrom
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
		watch: {

		},
		data() {
			return {
				dialogFormVisible: false,
				form: undefined,
				title: '',
			}
		},
		created() {},
		methods: {
			showEdit(row) {
				let that = this
				if (!row) {
					that.title = '添加'
				} else {
					that.title = '编辑'
					that.form = Object.assign({}, row)
					console.log(that.$refs['personnelFrom'])
					//that.$refs['personnelFrom'].init()
				}
				that.title += '人员'
				that.dialogFormVisible = true
			},
			close(status) {
				let that = this
				if (status) {
					that.$emit('update:isUpData', !that.isUpData);
					that.$emit('on-change', !that.isUpData);
				}
				that.dialogFormVisible = false
			},
			save() {
				let that = this
				that.$refs["personnelFrom"].save(function(status) {
					if (status) {
						that.$emit('update:isUpData', !that.isUpData);
						that.$emit('on-change', !that.isUpData);
						that.dialogFormVisible = false
					}
				})
			}
		},
	}
</script>
