<template id="roomAllocDeviceDialog">
	<el-dialog :title="title" :visible.sync="dialogFormVisible" top="3vh" destroy-on-close center>
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<roomAllocDevice ref="roomAllocDevice" :formData="form" :option="option"></roomAllocDevice>
		</div>
		<div slot="footer" class="el-custuom-button dialog-footer-center-custom">
			<!-- <div style="width: 100%">{{ ghost }}</div> -->
			<el-button type="primary" @click="handleUpdate">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import roomAllocDevice from '../form/roomAllocDevice.vue'

	export default {
		name: 'roomAllocDeviceDialog',
		components: {
			roomAllocDevice,
		},
		data() {
			return {
				dialogFormVisible: false,
				form: {},
				formLabelWidth: '120px',
				title: '',
				option: {

				}
			}
		},
		created() {},
		methods: {
			showEdit(row, info, option) {

				let form = {}
				if (!option) {
					option = {}
				}
				//this.form = {}
				if (!row) {
					this.title = '添加'
					option.model = 'add'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
					option.model = 'edit'
				}
				if (info) {
					form = Object.assign(form, info)
				}
				if (option) {
					this.option = option
				}
				console.log(row, info, option)
				this.form = Object.assign({}, this.form, form)
				this.title += '检测室设备分配'
				if (this.$refs['roomAllocDevice']) {
					this.$refs['roomAllocDevice'].init()
				}
				this.dialogFormVisible = true
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
				this.$refs['roomAllocDevice'].save(function(status) {
					if (status) {
						that.close(undefined, true)
					}
				})
			},
		},
	}
</script>
<style>
	.el-custuom-button {
		width: 100%;
		text-align: center;
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
	}
</style>
