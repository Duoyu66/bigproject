<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
		<el-upload class="upload-demo" ref="upload" :action="action" :on-preview="handlePreview" :on-remove="handleRemove"
		 :file-list="fileList" :auto-upload="false" :headers="headers">
			<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
			<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
			<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
		</el-upload>
	</el-dialog>

</template>

<script>
	export default {
		name: 'updateEdit',
		data() {
			return {
				title: '',
				headers: {
					"Authorization": this.getAccess()
				},
				dialogFormVisible: false,
				fileList: [],
				action: this.static_var.gtConfig_fob.UploadFileUrl + '?fileType=1'
			};
		},

		methods: {
			showEditEx(row) {
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					this.form = Object.assign({}, row)
				}
				this.dialogFormVisible = true
			},
			close() {
				// this.$refs['form'].resetFields()
				// this.form = this.$options.data().form
				this.dialogFormVisible = false
				this.$emit('fetch-data')
			},
			submitUpload() {
				this.$refs.upload.submit();
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			}
		}
	}
</script>

<style>
</style>
